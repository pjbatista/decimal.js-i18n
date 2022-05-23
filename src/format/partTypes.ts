/*
 * decimal.js-i18n v0.1.1
 * Full internationalization support for decimal.js.
 * MIT License
 * Copyright (c) 2022 Pedro José Batista <pedrobatista@myself.com>
 * https://github.com/pjbatista/decimal.js-i18n
 */
import type Format from "./class";

/** Strings describing the type of parts available as result of {@link Format.formatToParts}. */
export type FormatPartTypes =
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
export default FormatPartTypes;
