/*
 * decimal.js-i18n v0.2.2
 * Full internationalization support for decimal.js.
 * MIT License
 * Copyright (c) 2022 Pedro José Batista <pedrobatista@myself.com>
 * https://github.com/pjbatista/decimal.js-i18n
 */
import type BaseFormatOptions from "./baseOptions";
import { DECIMAL_LIMIT, DEFAULT_OPTIONS, ECMA_LIMIT } from "./constants";
import type LocaleMatcher from "./localeMatcher";
import type ResolvedFormatOptions from "./resolvedFormatOptions";

type DigitsProperty =
    | "maximumFractionDigits"
    | "minimumFractionDigits"
    | "minimumIntegerDigits"
    | "maximumSignificantDigits"
    | "minimumSignificantDigits";
type DigitsPropertyCallback<T> = (property: DigitsProperty, factor: number) => T;

// A generator function to be used to access or modify all digits properties
//  -> factor is a simple index shifting value (fractions go from 0 to 1e9-1, other from 1 to 1e9)
function* forEachDigitsPropertyGenerator<T>(callback: DigitsPropertyCallback<T>) {
    yield callback("maximumFractionDigits", -1);
    yield callback("minimumFractionDigits", -1);
    yield callback("minimumIntegerDigits", 0);
    yield callback("maximumSignificantDigits", 0);
    yield callback("minimumSignificantDigits", 0);
}

// Spreads the generated values of `forEachDigitsPropertyGenerator` to an array
const forEachDigitsProperty = <T>(callback: DigitsPropertyCallback<T>) => [...forEachDigitsPropertyGenerator(callback)];

/**
 * Creates and returns a new object with the extension of an existing set of options with any number of modifiers.
 *
 * @param options Object to be extended.
 * @param modifiers Anu number of objects containing the modifiers to the `options`.
 * @returns An extended format options.
 */
export const extend = <T extends FormatOptions | Intl.NumberFormatOptions>(options: T, ...modifiers: T[]) =>
    Object.assign({ ...options }, ...modifiers) as T;

/**
 * Creates and returns an object based on a `Intl.ResolvedNumberFormatOptions`, however re-expanding it to
 * beyond the limits of the ECMA-specification.
 *
 * If the user wants 999999999 fraction digits, they can have it (though it would be larger than 2GBs and take
 * quite a while to calculate).
 *
 * @param options Decimal format options to be merged with the ECMA resolved options.
 * @param ecmaResolved Object resulting from `Intl.NumberFormat.resolvedOptions()`.
 * @returns A resolved decimal format options.
 */
export const resolve = (options: FormatOptions, ecmaResolved: Intl.ResolvedNumberFormatOptions) => {
    const result = { ...ecmaResolved } as ResolvedFormatOptions;

    forEachDigitsProperty(property => {
        if (!(property in result)) {
            return;
        }

        result[property] = Math.max(options[property] ?? 0, result[property] ?? 0);
    });

    if (typeof result.maximumFractionDigits === "number") {
        result.maximumFractionDigits = Math.max(result.minimumFractionDigits!, result.maximumFractionDigits);
    } else {
        result.maximumSignificantDigits = Math.max(result.minimumSignificantDigits!, result.maximumSignificantDigits!);
    }

    result.rounding ??= options.rounding ?? DEFAULT_OPTIONS.rounding;
    result.trailingZeroDisplay ??= options.trailingZeroDisplay ?? DEFAULT_OPTIONS.trailingZeroDisplay;

    return result;
};

/**
 * Creates and returns an `Intl.NumberFormatOptions` object, copying from a {@link FormatOptions} object with
 * its digits limited to ECMA-specification's range.
 *
 * @param options Decimal format options used as a baseline for the new object.
 * @param toSpecification Whether to remove non-standard properties or not. Defaults to `false`.
 * @returns A new `Intl.NumberFormatOptions` object.
 */
export const toEcma = (options: FormatOptions, toSpecification = false) => {
    const result = { ...options };

    forEachDigitsProperty((property, factor) => {
        if (property in result && Number(result[property]) >= ECMA_LIMIT) {
            result[property] = ECMA_LIMIT + factor;
        }
    });

    if (toSpecification) {
        delete result.rounding;
        delete result.trailingZeroDisplay;
    }

    return result as Intl.NumberFormatOptions;
};

/**
 * Validates whether the given {@link FormatOptions} contains acceptable values.
 *
 * It specially checks if the digits properties are within `decimal.js`' range, which is 1e9±1.
 *
 * @param options Decimal format options to be validated.
 * @returns `true` if all properties are valid. Otherwise, an array with the invalid properties names.
 */
export const validate = (options: FormatOptions) => {
    const result = forEachDigitsProperty((property, factor) => {
        if (property in options && Number(options[property]) > DECIMAL_LIMIT + factor) {
            return property;
        }
        return true;
    });

    if (result.every(entry => entry === true)) {
        return true;
    }

    return result.filter(entry => entry !== true) as DigitsProperty[];
};

/**
 * Object used to configure a `Decimal.Format` object; the following properties fall into two groups:
 *
 * - {@link minimumIntegerDigits}, {@link minimumFractionDigits}, and {@link maximumFractionDigits} in one group;
 * - {@link minimumSignificantDigits} and {@link maximumSignificantDigits} in the other.
 *
 * If at least one property from the second group is defined, then the first group is ignored.
 */
export interface FormatOptions extends Partial<BaseFormatOptions> {
    /**
     * The locale matching algorithm to use. Possible values are "`lookup`" and "`best fit`"; the default is
     * "`best fit`". For information about this option, see the
     * [Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) page.
     */
    localeMatcher?: LocaleMatcher | undefined;
}

export default FormatOptions;
