/*!
 * Copyright (c) 2022 Pedro José Batista, licensed under the MIT License.
 * See the LICENSE.md file in the project root for more information.
 */

/**
 * In many locales, accounting format means to wrap the number with parentheses instead of appending a
 * minus sign. You can enable this formatting by setting the currencySign option to "`accounting`". The
 * default value is "`standard`".
 */
export type FormatCurrencySign = "standard" | "accounting";
export default FormatCurrencySign;
