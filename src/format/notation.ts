/*
 * decimal.js-i18n v0.1.1
 * Full internationalization support for decimal.js.
 * MIT License
 * Copyright (c) 2022 Pedro José Batista <pedrobatista@myself.com>
 * https://github.com/pjbatista/decimal.js-i18n
 */

/**
 * The formatting that should be displayed for the number, the defaults is "`standard`".
 *
 * - "`standard`" plain number formatting;
 * - "`scientific`" return the order-of-magnitude for formatted number;
 * - "`engineering`" return the exponent of ten when divisible by three;
 * - "`compact`" string representing exponent; defaults to using the "short" form.
 */
export type Notation = "standard" | "scientific" | "engineering" | "compact";
export default Notation;
