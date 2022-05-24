/*
 * decimal.js-i18n v0.2.5
 * Full internationalization support for decimal.js.
 * MIT License
 * Copyright (c) 2022 Pedro José Batista <pedrobatista@myself.com>
 * https://github.com/pjbatista/decimal.js-i18n
 */

/**
 * In many locales, accounting format means to wrap the number with parentheses instead of appending a
 * minus sign. You can enable this formatting by setting the currencySign option to "`accounting`". The
 * default value is "`standard`".
 */
export type CurrencySign = "standard" | "accounting";
export default CurrencySign;
