/*
 * decimal.js-i18n v0.2.6
 * Full internationalization support for decimal.js.
 * MIT License
 * Copyright (c) 2022 Pedro José Batista <pedrobatista@myself.com>
 * https://github.com/pjbatista/decimal.js-i18n
 */
import type FormatPartTypes from "./partTypes";

// Filters:
export const decimals = <T extends PartType>({ type }: T) => type === "decimal";
export const exponents = <T extends PartType>({ type: t }: T) => t === "exponentInteger" || t === "exponentMinusSign";
export const fractions = <T extends PartType>({ type }: T) => type === "fraction";
export const integerGroups = <T extends PartType>({ type }: T) => type === "integer" || type === "group";
export const integers = <T extends PartType>({ type }: T) => type === "integer";

/** Object used to describe a single transliteration part of `Decimal.Format.formatToParts`. */
export type FormatPart = PartType & PartValue;

/** Fragment of a part containing the type. */
export interface PartType {
    /** A string describing the formatting part. */
    type: Intl.NumberFormatPartTypes | FormatPartTypes;
}

/** Fragment of a part containing the value. */
export interface PartValue {
    /** Localized string with a fragment of the result. */
    value: string;
}

export default FormatPart;
