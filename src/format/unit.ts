/*!
 * Copyright (c) 2022 Pedro José Batista, licensed under the MIT License.
 * See the LICENSE.md file in the project root for more information.
 */

/* eslint-disable max-len */
/**
 * The unit to use in unit formatting, possible values are core unit identifiers. Only a [subset][1] of units
 * from the full list was selected for use in ECMAScript. Pairs of simple units can be concatenated with
 * "`-per-`" to make a compound unit.
 *
 * [1]: https://tc39.es/proposal-unified-intl-numberformat/section6/locales-currencies-tz_proposed_out.html#sec-issanctionedsimpleunitidentifier
 */
/* eslint-enable max-len */
export type FormatUnit =
    | "acre"
    | "bit"
    | "byte"
    | "celsius"
    | "centimeter"
    | "day"
    | "degree"
    | "fahrenheit"
    | "fluid-ounce"
    | "foot"
    | "gallon"
    | "gigabit"
    | "gigabyte"
    | "gram"
    | "hectare"
    | "hour"
    | "inch"
    | "kilobit"
    | "kilobyte"
    | "kilogram"
    | "kilometer"
    | "liter"
    | "megabit"
    | "megabyte"
    | "meter"
    | "mile"
    | "mile-scandinavian"
    | "milliliter"
    | "millimeter"
    | "millisecond"
    | "minute"
    | "month"
    | "ounce"
    | "percent"
    | "petabyte"
    | "pound"
    | "second"
    | "stone"
    | "terabit"
    | "terabyte"
    | "week"
    | "yard"
    | "year"
    | UnitString;

// eslint-disable-next-line
type UnitString = string & {};
export default FormatUnit;
