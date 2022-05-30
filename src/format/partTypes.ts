/*!
 * Copyright (c) 2022 Pedro José Batista, licensed under the MIT License.
 * See the LICENSE.md file in the project root for more information.
 */
import type Format from ".";

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
