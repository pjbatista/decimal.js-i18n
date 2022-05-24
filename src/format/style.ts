/*
 * decimal.js-i18n v0.2.4
 * Full internationalization support for decimal.js.
 * MIT License
 * Copyright (c) 2022 Pedro José Batista <pedrobatista@myself.com>
 * https://github.com/pjbatista/decimal.js-i18n
 */

/**
 * The formatting style to use.
 *
 * - "`decimal`" for plain number formatting;
 * - "`currency`" for currency formatting;
 * - "`percent`" for percent formatting;
 * - "`unit`" for unit formatting.
 */
export type Style = "decimal" | "currency" | "percent" | "unit";
export default Style;
