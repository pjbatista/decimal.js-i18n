/// <reference path="./index.d.ts" />
/*
 * decimal.js-i18n v0.1.0
 * Full internationalization support for decimal.js.
 * MIT License
 * Copyright (c) 2022 Pedro José Batista <pedrobatista@myself.com>
 * https://github.com/pjbatista/decimal.js-i18n
 */
"use strict";
const Decimal = globalThis.__decimal_target__ ?? require("decimal.js");
module.exports = Decimal;

// This is the main source file of `decimal.js-i18n`. It is created via an agnostic `Decimal` constant which can be
// obtained from a specific module system or from the global scope.
//  -> All this is centralized here and built in `build.js`.

//#source-begin
//#region ----------------------------------------------- CONSTANTS ------------------------------------------------

/** Used in base₁₀ exponent calculations. */
const DECIMAL_TEN = new Decimal(10);

/**
 * Hard digit-count limit set by the ECMA internalization standard. Due to the arbitrary-precision of `decimal.js`, this
 * plugin chooses to ignore such limits, allowing values far larger.
 */
const ECMA_DIGITS_LIMIT = 21;

/** The hard exponent limit of `decimal.js` and the digit-count threshold of the plugin. */
const EXP_LIMIT = 1e9;

// Shortcuts for long property names:
const MAX_FD = "maximumFractionDigits";
const MIN_FD = "minimumFractionDigits";
const MIN_ID = "minimumIntegerDigits";
const MAX_SD = "maximumSignificantDigits";
const MIN_SD = "minimumSignificantDigits";

//#endregion

//#region ------------------------------------------------ HELPERS -------------------------------------------------

/** Concatenates all values of the given objects. */
const concatenate = (parts, filter) =>
    // prettier-ignore
    (typeof filter !== "function" ? parts : parts.filter(filter))
        .map(({ value }) => value)
        .join("");

/** To be used as callback of a filter `predicate` in order to remove types that don't match the parameters. */
// prettier-ignore
const includeTypes = (...types) => ({ type }) => types.length && types.includes(type);

/** To be used as callback of a filter `predicate` in order to remove types that are not integer-related. */
const includeIntegerTypes = () => includeTypes("group", "integer");

/** To be used as callback of a filter `predicate` in order to only select types that don't match the parameters. */
// prettier-ignore
const excludeTypes = (...types) => ({ type }) => !types.includes(type);

/** To be used as callback of a filter `predicate` in order to only select types that are integer-related. */
const excludeIntegerTypes = () => excludeTypes("group", "integer");

// (typeof filter === "function" ? objects.filter(filter) : objects).map(({ value }) => value).join("");

/** Converts a value to a native `bigint`. */
const toBigInt = value => BigInt(value.toFixed());

//#endregion

//#region -------------------------------------------- OPTIONS PARSING ---------------------------------------------

/** Creates a new object, removing the ECMA-compliant limits from a resolved options object. */
const expandResolvedOptions = (resolved, options) => {
    resolved = { ...resolved };
    expandResolvedProperty(resolved, options, MAX_FD, -1);
    expandResolvedProperty(resolved, options, MIN_FD, -1);
    expandResolvedProperty(resolved, options, MIN_ID);
    expandResolvedProperty(resolved, options, MAX_SD);
    expandResolvedProperty(resolved, options, MIN_SD);

    if (resolved.maximumFractionDigits) {
        resolved.maximumFractionDigits = Math.max(resolved.minimumFractionDigits, resolved.maximumFractionDigits);
    }

    if (resolved.maximumSignificantDigits) {
        resolved.maximumSignificantDigits = Math.max(
            resolved.maximumSignificantDigits,
            resolved.maximumSignificantDigits,
        );
    }

    // Adding some defaults of our own:
    resolved.rounding ||= Decimal.ROUND_HALF_EVEN;

    return resolved;
};

/** Removes the ECMA-compliant limit of a single property of a resolved options object. */
const expandResolvedProperty = (resolved, options, prop, factor = 0) => {
    if (typeof resolved[prop] === "undefined") {
        return;
    }
    resolved[prop] = Math.max(options[prop] ?? 1 + factor, resolved[prop]);
};

/** Creates a new object, adding ECMA-compliant limits to an options object. */
const limitOptions = options => {
    options = { ...options };
    limitOptionsProperty(options, MAX_FD, -1);
    limitOptionsProperty(options, MIN_FD, -1);
    limitOptionsProperty(options, MIN_ID);
    limitOptionsProperty(options, MAX_SD);
    limitOptionsProperty(options, MIN_SD);
    return options;
};

/** Removes the ECMA-compliant limit of a single property of a resolved options object. */
const limitOptionsProperty = (options, prop, factor = 0) => {
    if (typeof options[prop] === "undefined") {
        return;
    }

    const compatibleValue = ECMA_DIGITS_LIMIT + factor;
    if (options[prop] > compatibleValue) {
        options[prop] = compatibleValue;
    }
};

/** Validate an options object against the hard limits of `decimal.js`. */
const validateOptions = options => {
    validateOptionProperty(options, MAX_FD, -1);
    validateOptionProperty(options, MIN_FD, -1);
    validateOptionProperty(options, MIN_ID);
    validateOptionProperty(options, MAX_SD);
    validateOptionProperty(options, MIN_SD);
};

/** Validate a single property in an options object. */
const validateOptionProperty = (options, prop, factor = 0) => {
    if (typeof options[prop] !== "undefined" && (options[prop] < 1 + factor || options[prop] > EXP_LIMIT + factor)) {
        throw new RangeError(prop + " value is out of range.");
    }
};

//#endregion

//#region ------------------------------------------- "PART" FORMATTING --------------------------------------------

// A part is an object used to describe a single term of decimal value transcription
// This module benefits from the `formatToParts` of `Intl.NumberFormat`, but it has its limitations
// The following functions were created in order to expand upon these native functionalities

/** Fixes the minimum integer digits, when larger than what `Intl.NumberFormat` can handle. */
const expandIntegerParts = (integerParts, minimumDigits, sign, integerFormat, zero, one) => {
    // Create an expansion value using the number of digits as a base 10 exponent
    const expanded = DECIMAL_TEN.pow(minimumDigits - 1).mul(sign);

    // Parse the parts using a default integer formatter
    //  -> allows a performative double-directed iteration with a complexity of only O(log n)
    const expandedParts = integerFormat.formatToParts(toBigInt(expanded));
    const result = [];

    // Iterate the expansion template "in reverse" while properly keeping the formatted integer parts
    while (expandedParts.length) {
        const { type, value } = expandedParts.pop();

        if (integerParts.length) {
            const part = integerParts.pop();

            // Only add integer parts to the result
            //  -> other parts can be kept as they are in the template
            if (part.type === "group" || part.type === "integer") {
                result.unshift(part);
                continue;
            }
        }

        // If there are no more true integer parts, it means we've reached the expansion
        //  -> Replace any left-over "one"s with our parsed "zero"
        if (type === "integer") {
            result.unshift({ type, value: value.replace(new RegExp(one), zero) });
            continue;
        }

        result.unshift({ type, value });
    }

    return result;
};

/** Creates and returns a format part array based on some default values. */
const formatTemplate = (decimalValue, ecmaGroups, integerParts, fractionValue) => {
    const result = [];
    const hasFraction = typeof fractionValue !== "undefined";

    let integerDone = false;
    let decimalDone = false;
    let fractionDone = !hasFraction;

    const valueParts = integerParts.filter(includeIntegerTypes());
    const otherParts = integerParts.filter(excludeIntegerTypes());

    // Simply iterate through the pre-selected groups and add them to the result in order
    for (const group of ecmaGroups) {
        if (group === "integer-group") {
            if (!integerDone) {
                integerDone = true;
                result.push(...valueParts);
                continue;
            }
            // Assumes that there is no way to create a text with duplicate integer groups:
            throw formatTemplateError("Duplicate integer grouping.");
        }

        if (group === "decimal" && hasFraction) {
            if (!decimalDone) {
                decimalDone = true;
                result.push({ type: "decimal", value: decimalValue });
            }
            continue;
        }

        if (group === "fraction" && hasFraction) {
            if (!fractionDone) {
                fractionDone = true;
                result.push({ type: "fraction", value: fractionValue });
                continue;
            }
            // Assumes that there is no way to create a text with duplicate fractions:
            throw formatTemplateError("Duplicate fraction grouping.");
        }

        const part = otherParts.shift();

        if (part && group !== part.type) {
            // Assumes that all Intl formatting is pretty straight-forward:
            throw formatTemplateError("Invalid group/format part matchup.");
        }

        if (part) {
            result.push(part);
        }
    }

    return result;
};

/** Creates and returns a default error used when template formatting behaves unexpectedly. */
const formatTemplateError = message =>
    new Error(
        message +
            " This is likely an issue with the `decimal.js-i18n` plugin." +
            " Please submit a report to https://github.com/pjbatista/decimal.js-i18n/issues.",
    );

/** Creates and returns an array of groups describing a set of formatted parts. */
const getGroupsFromParts = parts => {
    const result = [];
    let previousInteger = false;

    for (const { type } of parts) {
        if (type === "group" || type === "integer") {
            if (!previousInteger) {
                previousInteger = true;
                result.push("integer-group");
            }
            continue;
        }

        result.push(type);
    }
    return result;
};

//#endregion

//#region -------------------------------------------- FORMATTER CLASS ---------------------------------------------

if (typeof Decimal.Format === "undefined") {
    // Implementing the `Decimal.Format` using a function in order to have better 'privacy' for internal members
    // Methods and properties are 'inserted' on the object via `Object.defineProperty`
    Decimal.Format = function (locales, options) {
        options = options || {};
        validateOptions(options);

        // Create an ECMA formatter, used to template the final outputs
        const ecmaOptions = limitOptions(options);
        const ecmaFormat = new Intl.NumberFormat(locales, ecmaOptions);

        // Re-expand the resolved options of this formatter using the ECMA one as base
        const resolved = expandResolvedOptions(ecmaFormat.resolvedOptions(), options);

        // Create the integer part-specific formatter
        const integerOptions = {
            ...ecmaOptions,
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
            maximumSignificantDigits: undefined,
            minimumSignificantDigits: undefined,
        };
        const integerFormat = new Intl.NumberFormat(locales, integerOptions);

        const fractionOptions = {
            ...integerOptions,
            minimumIntegerDigits: 1,
            notation: "standard",
            signDisplay: "never",
            style: "decimal",
            useGrouping: false,
        };
        const fractionFormat = new Intl.NumberFormat(locales, fractionOptions);

        // If the formatter should take into consideration the significant digits instead of the fraction digits
        const isResolvedWithSignificance =
            typeof resolved.maximumSignificantDigits === "number" ||
            typeof resolved.minimumSignificantDigits === "number";

        // Obtain the expression for the numbers 'zero' and 'one' in the current formatting
        const zero = concatenate(fractionFormat.formatToParts(0), includeIntegerTypes)[0];
        const one = concatenate(fractionFormat.formatToParts(1), includeIntegerTypes)[0];

        // Main formatting implementation:
        const formatToParts = value => {
            value = new Decimal(value).toSD(undefined, resolved.rounding);

            // No need to further parse non-numeric values and infinities
            if (
                (typeof value.isNaN === "function" && value.isNaN()) ||
                (typeof value.isFinite === "function" && !value.isFinite())
            ) {
                return ecmaFormat.formatToParts(value.toNumber());
            }

            // Shifting the value for processing in case it's a percentage
            if (resolved.style === "percent") {
                value = value.mul(100);
            }

            // Gathering information about the decimal value in order to post-process the template:
            const integer = value.trunc();
            const integerDigits = integer.abs().toFixed().length;
            let fraction = value.sub(integer).abs();
            const fractionDigits = value.dp();

            // Creating parts from simple rest
            const ecmaParts = ecmaFormat.formatToParts(fraction.mul(Decimal.sign(value)));
            const ecmaGroups = getGroupsFromParts(ecmaParts);
            const decimalSeparator = concatenate(ecmaParts, includeTypes("decimal"));

            const decimalPlaces = isResolvedWithSignificance
                ? resolved.maximumSignificantDigits - integerDigits
                : Math.max(fractionDigits, resolved.maximumFractionDigits);

            const significantDigits = isResolvedWithSignificance
                ? Math.min(integerDigits + decimalPlaces, resolved.maximumSignificantDigits)
                : decimalPlaces + integerDigits;

            // Proper formatting of the integer part of the decimal value:
            //  -> it's worth pointing out that there is a distinction between +0 and -0
            let integerParts = integer.eq(-0)
                ? integerFormat.formatToParts(-0)
                : integerFormat.formatToParts(toBigInt(integer.toSD(significantDigits)));

            if (resolved.minimumIntegerDigits > ECMA_DIGITS_LIMIT && integerDigits < resolved.minimumIntegerDigits) {
                integerParts = expandIntegerParts(
                    integerParts,
                    resolved.minimumIntegerDigits,
                    Decimal.sign(value),
                    integerFormat,
                    zero,
                    one,
                );
            }

            if (decimalSeparator.length === 0) {
                return formatTemplate(decimalSeparator, ecmaGroups, integerParts);
            }

            const maximumFractionDigits = resolved.maximumFractionDigits ?? decimalPlaces;
            const minimumFractionDigits = resolved.minimumFractionDigits ?? 0;

            if (fraction.eq(0)) {
                const fractionValue = Array(minimumFractionDigits).fill(zero).join("");
                return formatTemplate(decimalSeparator, ecmaGroups, integerParts, fractionValue);
            }

            const resultDecimalPlaces = Math.max(minimumFractionDigits, fractionDigits);

            // Proper formatting of the fraction, as an integer, using the decimal system (without grouping)
            const fractionInteger = fraction
                .toDP(resultDecimalPlaces, resolved.rounding)
                .mul(DECIMAL_TEN.pow(resultDecimalPlaces))
                .trunc();

            let fractionValue = fractionFormat.format(fractionInteger);

            // Fill any missing content with constant zeroes to the left
            if (fractionValue.length < resultDecimalPlaces) {
                fractionValue = Array(resultDecimalPlaces - fractionValue.length).fill(zero).join("") + fractionValue;
            }

            // Remove any extra digits
            if (fractionValue.length > maximumFractionDigits) {
                fractionValue = fractionValue.substring(0, maximumFractionDigits);
            }

            // Clip the unnecessary zeroes
            while (fractionValue.endsWith(zero) && fractionValue.length > minimumFractionDigits) {
                fractionValue = fractionValue.substring(0, fractionValue.length - 1);
            }

            return formatTemplate(decimalSeparator, ecmaGroups, integerParts, fractionValue);
        };

        Object.defineProperty(this, Symbol.toStringTag, { value: "Decimal.Format" });
        Object.defineProperty(this, "format", { value: value => concatenate(formatToParts(value)) });
        Object.defineProperty(this, "formatToParts", { value: formatToParts });
        Object.defineProperty(this, "resolvedOptions", { value: () => ({ ...resolved }) });
    };
}
// Static members of `Decimal.Format`:
Object.defineProperty(Decimal.Format, Symbol.toPrimitive, { value: Decimal.Format });
Object.defineProperty(Decimal.Format, "supportedLocalesOf", { value: Intl.NumberFormat.supportedLocalesOf });

// Extending the prototype of `Decimal` with a proper `toLocaleString`
Object.defineProperty(Decimal.prototype, "toLocaleString", {
    value: function (locales, options) {
        return new Decimal.Format(locales, options).format(this);
    },
});

//#endregion
//#source-end
