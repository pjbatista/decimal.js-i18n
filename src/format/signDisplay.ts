/*
 * decimal.js-i18n v0.1.1
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
export type SignDisplay = "auto" | "never" | "always" | "exceptZero" | "negative";
export default SignDisplay;