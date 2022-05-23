/*
 * decimal.js-i18n v0.1.1
 * Full internationalization support for decimal.js.
 * MIT License
 * Copyright (c) 2022 Pedro José Batista <pedrobatista@myself.com>
 * https://github.com/pjbatista/decimal.js-i18n
 */

/**
 * How to display the currency in currency formatting. Possible values are:
 *
 * - "`symbol`" to use a localized currency symbol such as €;
 * - "`narrowSymbol`" to use a narrow format symbol ("$100" rather than "US$100");
 * - "`code`" to use the ISO currency code;
 * - "`name`" to use a localized currency name such as "dollar".
 */
export type CurrencyDisplay = "symbol" | "narrowSymbol" | "code" | "name";
export default CurrencyDisplay;
