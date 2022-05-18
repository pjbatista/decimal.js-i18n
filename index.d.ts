/*
 * decimal.js-i18n v0.1.0
 * Full internationalization support for decimal.js.
 * MIT License
 * Copyright (c) 2022 Pedro José Batista <pedrobatista@myself.com>
 * https://github.com/pjbatista/decimal.js-i18n
 */
import Decimal from "decimal.js";

declare module "decimal.js" {
    /** @mergeTarget */
    export interface Decimal {
        /**
         * Returns a string with a language-sensitive representation of this decimal number.
         *
         * @param locales A string with a BCP 47 language tag, or an array of such strings. For the general form and
         *   interpretation of the locales argument, see the [Intl](https://mdn.io/Intl) page.
         * @param options Object used to configure the behavior of the string localization.
         * @returns Formatted localized string.
         */
        toLocaleString: (locales?: string | string[], options?: Decimal.FormatOptions) => string;
    }

    /** @mergeTarget */
    export namespace Decimal {
        /** The `Decimal.Format` object enables language-sensitive decimal number formatting. */
        export class Format {
            /**
             * Creates a new `Decimal.Format` object.
             *
             * @param locales A string with a BCP 47 language tag, or an array of such strings. For the general form and
             *   interpretation of the locales argument, see the [Intl](https://mdn.io/Intl) page.
             * @param options Object used to configure the behavior of the string localization.
             * @throws `RangeError` when an invalid option is given.
             */
            constructor(locales?: string | string[], options?: FormatOptions);

            /**
             * Returns an array containing those of the provided locales that are supported without having to fall back
             * to the runtime's default locale.
             *
             * @param locales A string with a BCP 47 language tag, or an array of such strings. For the general form and
             *   interpretation of the locales argument, see the [Intl](https://mdn.io/Intl) page.
             * @param options Object used to configure the behavior of the string localization.
             * @returns Array of strings with the available locales.
             */
            static supportedLocalesOf: (locales?: string | string[], options?: FormatOptions) => string[];

            /**
             * Formats a number according to the locale and formatting options of this {@link Decimal.Format} object.
             *
             * @param value A valid [Decimal.Value](https://mikemcl.github.io/decimal.js/#decimal) to format.
             * @returns Formatted localized string.
             */
            format(value: Decimal.Value): string;

            /**
             * Allows locale-aware formatting of strings produced by `Decimal.Format` formatters.
             *
             * @param value A valid [Decimal.Value](https://mikemcl.github.io/decimal.js/#decimal) to format.
             * @returns An array of objects containing the formatted number in parts.
             */
            formatToParts(value: Decimal.Value): FormatPart[];

            /**
             * Returns a new object with properties reflecting the locale and number formatting options computed during
             * initialization of this {@link Decimal.Format} object.
             *
             * @returns A new object with properties reflecting the locale and number formatting options computed during
             *   the initialization of this object.
             */
            resolvedOptions(): ResolvedFormatOptions;
        }

        /**
         * Object used to configure {@link Decimal.Format} formatters.
         *
         * The following properties fall into two groups: {@link minimumIntegerDigits}, {@link minimumFractionDigits}, and
         * {@link maximumFractionDigits} in one group, {@link minimumSignificantDigits} and
         * {@link maximumSignificantDigits} in the other. If at least one property from the second group is defined, then
         * the first group is ignored.
         */
        export interface FormatOptions extends Partial<FormatOptionsBase> {
            /**
             * The locale matching algorithm to use. Possible values are "`lookup`" and "`best fit`"; the default is
             * "`best fit`". For information about this option, see the [Intl](https://mdn.io/Intl) page.
             */
            localeMatcher?: "best fit" | "lookup" | undefined;
        }

        /** Base type of object used to configure {@link Decimal.Format} formatters. */
        export interface FormatOptionsBase {
            /** Only used when {@link notation} is "`compact`". Takes either "`short`" (default) or "`long`". */
            compactDisplay: "short" | "long";

            /**
             * The currency to use in currency formatting. Possible values are the ISO 4217 currency codes, such as
             * "`USD`" for the US dollar, "`EUR`" for the euro, or "`CNY`" for the Chinese RMB — see the [Current
             * currency & funds code list](https://iso.org/iso-4217-currency-codes.html). There is no default value; if
             * the `style` is "`currency`", the `currency` property must be provided.
             */
            currency: string;

            /**
             * How to display the currency in currency formatting. Possible values are:
             *
             * - "`symbol`" to use a localized currency symbol such as €, this is default value;
             * - "`narrowSymbol`" to use a narrow format symbol ("$100" rather than "US$100");
             * - "`code`" to use the ISO currency code;
             * - "`name`" to use a localized currency name such as "dollar".
             */
            currencyDisplay: "symbol" | "narrowSymbol" | "code" | "name";

            /**
             * In many locales, accounting format means to wrap the number with parentheses instead of appending a minus
             * sign. You can enable this formatting by setting the currencySign option to "`accounting`". The default
             * value is "`standard`".
             */
            currencySign: string;

            /**
             * The maximum number of fraction digits to use. Unlike `Intl.NumberFormat`, this allows any integer value
             * up to 999999999; the default for plain number formatting is the larger of {@link minimumFractionDigits}
             * and 3; the default for currency formatting is the larger of `minimumFractionDigits` and the number of
             * minor unit digits provided by the [ISO 4217 currency code
             * list](https://www.currency-iso.org/en/home/tables/table-a1.html) (2 if the list doesn't provide that
             * information); the default for percent formatting is the larger of `minimumFractionDigits` and 0.
             */
            maximumFractionDigits: number;

            /**
             * The maximum number of significant digits to use. Unlike `Intl.NumberFormat`, this allows any natural
             * value up to 1000000000, including; the default is 21.
             */
            maximumSignificantDigits: number;

            /**
             * The minimum number of fraction digits to use. Unlike `Intl.NumberFormat`, this allows any integer value
             * up to 999999999; the default for plain number and percent formatting is 0; the default for currency
             * formatting is the number of minor unit digits provided by the [ISO 4217 currency code
             * list](https://www.currency-iso.org/en/home/tables/table-a1.html) (2 if the list doesn't provide that information).
             */
            minimumFractionDigits: number;

            /**
             * The minimum number of integer digits to use. Unlike `Intl.NumberFormat`, this allows any natural value up
             * to 1000000000, including; the default is 1.
             */
            minimumIntegerDigits: number;

            /**
             * The minimum number of significant digits to use. Unlike `Intl.NumberFormat`, this allows any natural
             * value up to 1000000000, including; the default is 1.
             */
            minimumSignificantDigits: number;

            /**
             * The formatting that should be displayed for the number, the defaults is "`standard`".
             *
             * - "`standard`" plain number formatting;
             * - "`scientific`" return the order-of-magnitude for formatted number;
             * - "`engineering`" return the exponent of ten when divisible by three;
             * - "`compact`" string representing exponent; defaults to using the "short" form.
             */
            notation: "standard" | "scientific" | "engineering" | "compact";

            /**
             * A numeral system is a system for expressing numbers. The numberingSystem property helps to represent the
             * different numeral systems used by various countries, regions, and cultures around the world.
             *
             * See https://mdn.io/Intl.Locale.prototype.numberingSystem for more information.
             */
            numberingSystem: NumberingSystem;

            /**
             * Options for rounding modes reflecting the [ICU user guide][1]. Used in this plugin as in
             * [decimal.js](https://mikemcl.github.io/decimal.js/#modes).
             *
             * [1]: https://unicode-org.github.io/icu/userguide/format_parse/numbers/rounding-modes.html
             */
            rounding: Decimal.Rounding;

            /**
             * When to display the sign for the number; defaults to "`auto`":
             *
             * - "`always`" always display sign;
             * - "`auto`" sign display for negative numbers only;
             * - "`exceptZero`" sign display for positive and negative numbers, but not zero;
             * - "`negative`" sign display for negative numbers only, excluding negative zero;
             * - "`never`" never display sign.
             */
            signDisplay: "auto" | "never" | "always" | "exceptZero" | "negative";

            /**
             * The formatting style to use , the default is "`decimal`".
             *
             * - "`decimal`" for plain number formatting;
             * - "`currency`" for currency formatting;
             * - "`percent`" for percent formatting;
             * - "`unit`" for unit formatting.
             */
            style: "decimal" | "currency" | "percent" | "unit";

            /**
             * The unit to use in unit formatting, possible values are core unit identifiers. Only a
             * [subset](https://tc39.es/proposal-unified-intl-numberformat/section6/locales-currencies-tz_proposed_out.html#sec-issanctionedsimpleunitidentifier)
             * of units from the full list was selected for use in ECMAScript. Pairs of simple units can be concatenated
             * with "`-per-`" to make a compound unit. There is no default value; if the style is "`unit`", the `unit`
             * property must be provided.
             */
            unit: string;

            /**
             * The unit formatting style to use in {@link unit} formatting, the defaults is "`short`". Can be "`long`",
             * "`narrow`" or "`short`".
             */
            unitDisplay: "long" | "narrow" | "short";

            /**
             * Whether to use grouping separators, such as thousands separators or thousand/lakh/crore separators. The
             * default is "`auto`".
             *
             * - "`always`": display grouping separators even if the locale prefers otherwise;
             * - "`auto`": display grouping separators based on the locale preference, which may also be dependent on the
             *   {@link currency};
             * - "`false`": do not display grouping separators;
             * - "`min2`": display grouping separators when there are at least 2 digits in a group;
             * - "`true`": alias for always.
             */
            useGrouping: boolean | "always" | "auto" | "false" | "min2" | "true";

            /**
             * A string expressing the strategy for displaying trailing zeros on whole numbers. The default is "`auto`".
             *
             * - "`auto`": keep trailing zeros according to {@link minimumFractionDigits} and {@link minimumSignificantDigits};
             * - "`stripIfInteger`": the result with more precision wins a conflict;
             * - "`lessPrecision`": same as "auto", but remove the fraction digits if they are all zero.
             */
            trailingZeroDisplay: "auto" | "stripIfInteger" | "lessPrecision";
        }

        /** Object describing a {@link Decimal.Format.formatToParts formatting part}. */
        export interface FormatPart {
            type: FormatPartType;
            value: string;
        }

        /** Types of formatting parts available to formatters. */
        export type FormatPartType =
            | "literal"
            | "nan"
            | "infinity"
            | "percent"
            | "integer"
            | "group"
            | "decimal"
            | "fraction"
            | "plusSign"
            | "minusSign"
            | "percentSign"
            | "currency"
            | "code"
            | "symbol"
            | "name"
            | "unit"
            | "exponentInteger"
            | "exponentMinusSign"
            | "exponentSeparator"
            | "unknown";

        /** The standard Unicode numeral systems represented in a string type. */
        export type NumberingSystem =
            | "adlm"
            | "ahom"
            | "arab"
            | "arabext"
            | "armn"
            | "armnlow"
            | "bali"
            | "beng"
            | "bhks"
            | "brah"
            | "cakm"
            | "cham"
            | "cyrl"
            | "deva"
            | "ethi"
            | "finance"
            | "fullwide"
            | "geor"
            | "gong"
            | "gonm"
            | "grek"
            | "greklow"
            | "gujr"
            | "guru"
            | "hanidays"
            | "hanidec"
            | "hans"
            | "hansfin"
            | "hant"
            | "hantfin"
            | "hebr"
            | "hmng"
            | "hmnp"
            | "java"
            | "jpan"
            | "jpanfin"
            | "jpanyear"
            | "kali"
            | "khmr"
            | "knda"
            | "lana"
            | "lanatham"
            | "laoo"
            | "latn"
            | "lepc"
            | "limb"
            | "mathbold"
            | "mathdbl"
            | "mathmono"
            | "mathsanb"
            | "mathsans"
            | "mlym"
            | "modi"
            | "mong"
            | "mroo"
            | "mtei"
            | "mymr"
            | "mymrshan"
            | "mymrtlng"
            | "native"
            | "newa"
            | "nkoo"
            | "olck"
            | "orya"
            | "osma"
            | "rohg"
            | "roman"
            | "romanlow"
            | "saur"
            | "shrd"
            | "sind"
            | "sinh"
            | "sora"
            | "sund"
            | "takr"
            | "talu"
            | "taml"
            | "tamldec"
            | "telu"
            | "thai"
            | "tirh"
            | "tibt"
            | "traditio"
            | "vaii"
            | "wara"
            | "wcho";

        /** Object containing the resolved options of a {@link Decimal.Format} formatter. */
        export interface ResolvedFormatOptions extends Partial<FormatOptionsBase> {
            // Deterministic properties
            minimumIntegerDigits: number;
            notation: "standard" | "scientific" | "engineering" | "compact";
            numberingSystem: NumberingSystem;
            signDisplay: "auto" | "never" | "always" | "exceptZero";
            style: "decimal" | "currency" | "percent" | "unit";
            useGrouping: boolean | "always" | "auto" | "false" | "min2" | "true";

            // Configuration-dependent properties
            compactDisplay?: "short" | "long" | undefined;
            currency?: string | undefined;
            currencyDisplay?: "symbol" | "narrowSymbol" | "code" | "name" | undefined;
            currencySign?: string | undefined;
            maximumFractionDigits?: number | undefined;
            maximumSignificantDigits?: number | undefined;
            minimumFractionDigits?: number | undefined;
            minimumSignificantDigits?: number | undefined;
            rounding?: Decimal.Rounding | undefined;
            trailingZeroDisplay?: "auto" | "stripIfInteger" | "lessPrecision" | undefined;
            unit?: string | undefined;
            unitDisplay?: "long" | "narrow" | "short" | undefined;

            /**
             * A string with a BCP 47 language tag For the general form and interpretation of the `locale` property, see
             * the [Intl](https://mdn.io/Intl) page.
             */
            locale: string;
        }
    }
}

declare module "decimal.js-i18n" {
    export default Decimal;
    export { Decimal };
}

export default Decimal;
export { Decimal };
