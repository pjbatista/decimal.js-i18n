/*!
 * Copyright (c) 2022 Pedro José Batista, licensed under the MIT License.
 * See the LICENSE.md file in the project root for more information.
 */
import Decimal from "decimal.js";
import type BaseFormatOptions from "./baseOptions";
import type CompactDisplay from "./compactDisplay";
import { BIGINT_MODIFIERS, ECMA_LIMIT, PLAIN_MODIFIERS, SUPPORTED_LOCALES } from "./constants";
import type Currency from "./currency";
import type CurrencyDisplay from "./currencyDisplay";
import type CurrencySign from "./currencySign";
import type Locale from "./locale";
import type LocaleMatcher from "./localeMatcher";
import type Notation from "./notation";
import type NumberingSystem from "./numberingSystem";
import type FormatOptions from "./options";
import { extend, resolve, toEcma, validate } from "./options";
import type FormatPart from "./part";
import { exponents, fractions, integerGroups, integers, PartValue } from "./part";
import type FormatPartTypes from "./partTypes";
import type ResolvedFormatOptions from "./resolvedOptions";
import type SignDisplay from "./signDisplay";
import type Style from "./style";
import type TrailingZeroDisplay from "./trailingZeroDisplay";
import type Unit from "./unit";
import type UnitDisplay from "./unitDisplay";
import type UseGrouping from "./useGrouping";

const concatenate = <T extends PartValue>(filter: T[] | ((p: T) => boolean), parts: T[] = []) => {
    if (typeof filter === "function") {
        parts = parts.filter(filter);
    } else {
        parts = filter;
    }

    return parts.map(p => p.value).join("");
};

const pow10 = (exponent: Decimal.Value) => Decimal.pow(10, exponent);

/**
 * The `Decimal.Format` object enables language-sensitive decimal number formatting. It is entirely based on
 * `Intl.NumberFormat`, with the options of the latter being 100% compatible with it.
 *
 * This class, however, extend the numeric digits constraints of `Intl.NumberFormat` from 21 to 1000000000 in
 * order to fully take advantage of the arbitrary-precision of `decimal.js`.
 *
 * @template N Numeric notation of formatting.
 * @template S Numeric style of formatting.
 */
export class DecimalFormat<N extends Notation, S extends Style> {
    static readonly [Symbol.toPrimitive] = DecimalFormat;
    readonly [Symbol.toStringTag] = "Decimal.Format";

    /**
     * Formats a number according to the locale and formatting options of this {@link DecimalFormat} object.
     *
     * @param value A valid [Decimal.Value](https://mikemcl.github.io/decimal.js/#decimal) to format.
     * @returns Formatted localized string.
     */
    readonly format: (value: Decimal.Value) => string;

    /**
     * Allows locale-aware formatting of strings produced by `Decimal.Format` formatters.
     *
     * @param value A valid [Decimal.Value](https://mikemcl.github.io/decimal.js/#decimal) to format.
     * @returns An array of objects containing the formatted number in parts.
     */
    readonly formatToParts: (value: Decimal.Value) => FormatPart[];

    /**
     * Returns a new object with properties reflecting the locale and number formatting options computed during
     * initialization of this {@link Decimal.Format} object.
     *
     * @returns A new object with properties reflecting the locale and number formatting options computed
     *   during the initialization of this object.
     */
    readonly resolvedOptions: () => ResolvedFormatOptions<N, S>;

    /**
     * Creates a new instance of the `Decimal.Format` object.
     *
     * @param locales A string with a [BCP 47](https://www.rfc-editor.org/info/bcp47) language tag, or an array
     *   of such strings.
     *
     *   For the general form and interpretation of this parameter, see the [Intl page on
     *   MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl).
     * @param options Object used to configure the behavior of the string localization.
     * @throws `RangeError` when an invalid option is given.
     */
    constructor(locales?: Locale | Locale[], options?: FormatOptions<N, S>) {
        options ??= {};

        // 1. Check if options do not extrapolate the limits of decimal.js
        const valid = validate(options);

        if (valid !== true) {
            // -> it will either be exactly true or contain an array with all faulty properties:
            throw new RangeError(`${valid.join()} value${valid.length === 1 ? " is" : "s are"} out of range."`);
        }

        // 2. Create a baseline native formatter native
        const ecmaOptions = toEcma(options);
        const ecmaFormat = new Intl.NumberFormat(locales, ecmaOptions);

        // 3. Resolve this object's options, using the native resolution as a baseline
        const resolved = resolve(options, ecmaFormat.resolvedOptions());
        const { minimumIntegerDigits: minID, notation, rounding, style } = resolved;

        // 4. Create two auxiliary formatters:
        // One for the integer part, which can have up to a billion minimum digits...
        const bigintOptions = extend(ecmaOptions, BIGINT_MODIFIERS);
        const bigintFormat = new Intl.NumberFormat(locales, bigintOptions);

        // ...and another for a plain, localized reference, used for decimals and constants
        const plainOptions = extend(bigintOptions, PLAIN_MODIFIERS);
        const plainFormat = new Intl.NumberFormat(locales, plainOptions);

        // 5. Localized numeric constants
        const numbers = Array(10)
            .fill(null)
            .map((_, index) => plainFormat.format(index));
        const numberMatch = new RegExp("[" + numbers.join("") + "]", "g");
        const minusSign = /−/gu;

        // 5.1. Localized zero and one used in substitutions
        const [zero, one] = numbers;

        // 5.2. Helper functions
        const indexOfValue = (value: string) => numbers.indexOf(value).toString();
        const convert = (text: string) => text.replaceAll(numberMatch, indexOfValue).replaceAll(minusSign, "-");
        const zeroFill = (size: number) => Array(size).fill(zero).join("");
        const zeroTrim = (text: string, mode: "both" | "left" | "right" = "left", max: number | boolean = false) => {
            let result = text;
            let count = 0;

            if (mode === "both" || mode === "left")
                while (result[0] === zero && result.length > 1 && (max === false || count < max)) {
                    result = result.slice(1);
                    count++;
                }

            if (mode === "both" || mode === "right")
                while (result[result.length - 1] === zero && result.length > 1 && (max === false || count < max)) {
                    result = result.slice(0, -1);
                    count++;
                }

            return result;
        };

        // #region Step 6. Main format method - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        const _formatToParts = (value: Decimal.Value) => {
            value = new Decimal(value);
            const sign = Decimal.sign(value);

            // 6.1. Create a baseline part array
            const ecmaParts = ecmaFormat.formatToParts(value.toNumber());

            // -> if the value is non-numeric or an infinity, the baseline is good enough
            if ((value.isFinite && !value.isFinite()) || (value.isNaN && value.isNaN())) {
                return ecmaParts;
            }

            // 6.2. Splitting the parts for easier assembly
            const ecmaExponentValue = concatenate(exponents, ecmaParts) || "0";
            const ecmaIntegerParts = ecmaParts.filter(integerGroups);
            const ecmaIntegerTrimmed = zeroTrim(concatenate(integers, ecmaIntegerParts));
            const ecmaIntegerDigits = concatenate(integers, ecmaIntegerParts).length;
            const ecmaIntegerTrimmedDigits = ecmaIntegerTrimmed.length;
            const ecmaFractionValue = concatenate(fractions, ecmaParts);
            const ecmaFractionDigits = ecmaFractionValue.length;

            // 6.3. Shifting exponents according to notation/style

            // 6.3.1. Compact notation: calculate the shift in integer digits, and therefore exponent
            if (notation === "compact" && !value.eq(0)) {
                const baseInteger = value.abs().trunc().toFixed();
                const baseIntegerDigits = baseInteger.length;
                const correctionDigits = baseIntegerDigits - ecmaIntegerTrimmedDigits;

                if (correctionDigits > 0) {
                    value = value.mul(pow10(-correctionDigits));
                }
            }

            // 6.3.2. Engr./Scientific notations: evaluate the exponent from the text
            if ((notation === "engineering" || notation === "scientific") && ecmaExponentValue !== zero) {
                const exponential = new Decimal(convert(ecmaExponentValue));
                value = value.mul(pow10(exponential.mul(-1))).abs().mul(sign); // prettier-ignore
            }

            // 6.3.3. Percent style: shift the value accordingly (non numeric parts will remain the same)
            if (style === "percent") value = value.mul(100);

            // 6.4. Parsing the information about the numeric parts
            const integer = value.abs().trunc().mul(sign);
            const fraction = value.sub(integer).abs();
            const integerDigits = !value.eq(0) && integer.eq(0) ? 0 : value.abs().trunc().toFixed().length;
            const fractionDigits = value.dp();
            const maxSD = resolved.maximumSignificantDigits ?? integerDigits + fractionDigits;
            const maxFD = resolved.maximumFractionDigits ?? fractionDigits;
            const minSD = resolved.minimumSignificantDigits ?? resolved.minimumFractionDigits! + minID;
            const minFD = resolved.minimumFractionDigits ?? minSD - minID;

            // 6.5. Check for the possibility of the native formatter to have accomplished the desired output
            const integerCheck = !ecmaIntegerParts.length || (minID <= ECMA_LIMIT && ecmaIntegerDigits >= minID);
            const fractionCheck =
                ecmaFractionDigits >= fractionDigits && minFD < ECMA_LIMIT && ecmaFractionDigits >= minFD;

            // -> if the native formatter is good enough for our decimal value, leave it as-is
            if (integerCheck && fractionCheck) {
                return ecmaParts as FormatPart[];
            }

            // 6.6. Create the integer value
            const integerParts = (() => {
                if (integerCheck) return ecmaIntegerParts;

                // Expanding the integer part
                const targetDigits = Math.max(integerDigits, minID);

                // Creates a base 10 power of the target digits
                const bigint = BigInt(pow10(targetDigits - 1).toFixed());

                // Format using the bigint formatter and cut it before joining with the ECMA parts
                const bigintIntegerParts = bigintFormat.formatToParts(bigint).filter(integerGroups);

                // We need to replace the first 'one' (from the base 10 power) with a 'zero'
                bigintIntegerParts[0].value = bigintIntegerParts[0].value.replace(new RegExp(one), zero);

                // Merge the first part with the bigint part
                ecmaIntegerParts[0].value =
                    bigintIntegerParts[ecmaIntegerParts.length - 1].value.slice(0, -ecmaIntegerParts[0].value.length) +
                    ecmaIntegerParts[0].value;

                return [...bigintIntegerParts.slice(0, -ecmaIntegerParts.length), ...ecmaIntegerParts];
            })();

            // 6.7. Create the fraction value
            const fractionValue = (() => {
                if (fractionCheck) return ecmaFractionValue;

                // Simpler formatting if there is actually no fraction
                if (fraction.eq(0)) {
                    return plainFormat.format(BigInt(pow10(minFD).toFixed())).slice(1);
                }

                // There are more digits in the number than in the formatting
                const value = fraction
                    .toFixed()
                    .slice(2)
                    .split("")
                    .map(v => numbers[Number(v)])
                    .join("");

                if (value.length > maxFD) {
                    return fraction
                        .toDP(maxFD, rounding)
                        .mul(pow10(maxFD))
                        .toFixed()
                        .split("")
                        .map(v => numbers[Number(v)])
                        .join("");
                }

                if (value.length < minFD) {
                    return value + zeroFill(minFD - value.length);
                }

                return value;
            })();

            // 6.8. Parsing the numeric fragments in a unified part array
            const result: FormatPart[] = [];
            let integerDone = false;
            let fractionDone = false;

            while (ecmaParts.length) {
                const { type, value } = ecmaParts.shift()!;

                if (type === "integer" || type === "group") {
                    if (!integerDone) {
                        integerDone = true;
                        result.push(...integerParts);
                    }
                    continue;
                }

                if (type === "fraction") {
                    if (!fractionDone) {
                        fractionDone = true;
                        result.push({ type, value: fractionValue });
                    }
                    continue;
                }

                result.push({ type, value });
            }
            return result;
        };
        //#endregion

        this.format = value => concatenate(_formatToParts(value));
        this.formatToParts = value => _formatToParts(value);
        this.resolvedOptions = () => ({ ...resolved });
    }

    /**
     * Returns an array containing the default locales available to the environment, based on a default
     * dictionary of locales and regions.
     *
     * This method is non-standard method that is not available on `Intl` formatters.
     *
     * @returns Array of strings with the available locales.
     */
    static supportedLocales() {
        return SUPPORTED_LOCALES;
    }

    /**
     * Returns an array containing those of the provided locales that are supported without having to fall back
     * to the runtime's default locale.
     *
     * @template TNotation Numeric notation of formatting.
     * @template TStyle Numeric style of formatting.
     * @param locales A string with a BCP 47 language tag, or an array of such strings. For the general form
     *   and interpretation of the locales argument, see the [Intl page on
     *   MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl).
     * @param options Object used to configure the behavior of the string localization.
     * @returns Array of strings with the available locales.
     */
    static supportedLocalesOf<TNotation extends Notation = "standard", TStyle extends Style = "decimal">(
        locales: string | string[],
        options?: FormatOptions<TNotation, TStyle>,
    ) {
        return Intl.NumberFormat.supportedLocalesOf(locales, options ? toEcma(options) : undefined) as Locale[];
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace DecimalFormat {
    export type {
        BaseFormatOptions,
        CompactDisplay,
        Currency,
        CurrencyDisplay,
        CurrencySign,
        Locale,
        LocaleMatcher,
        Notation,
        NumberingSystem,
        FormatOptions,
        FormatPart,
        FormatPartTypes,
        ResolvedFormatOptions,
        SignDisplay,
        Style,
        TrailingZeroDisplay,
        Unit,
        UnitDisplay,
        UseGrouping,
    };
}

export default DecimalFormat;
