/*
 * decimal.js-i18n v0.2.6
 * Full internationalization support for decimal.js.
 * MIT License
 * Copyright (c) 2022 Pedro José Batista <pedrobatista@myself.com>
 * https://github.com/pjbatista/decimal.js-i18n
 */

/**
 * When to display the sign for the number:
 *
 * - "`always`" always display sign;
 * - "`auto`" sign display for negative numbers only;
 * - "`exceptZero`" sign display for positive and negative numbers, but not zero;
 * - "`negative`" sign display for negative numbers only, excluding negative zero;
 * - "`never`" never display sign.
 */
export type FormatSignDisplay = "auto" | "never" | "always" | "exceptZero" | "negative";
export default FormatSignDisplay;
