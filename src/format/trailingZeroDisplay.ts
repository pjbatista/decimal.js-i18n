/*
 * decimal.js-i18n v0.2.3
 * Full internationalization support for decimal.js.
 * MIT License
 * Copyright (c) 2022 Pedro José Batista <pedrobatista@myself.com>
 * https://github.com/pjbatista/decimal.js-i18n
 */

/**
 * A string expressing the strategy for displaying trailing zeros on whole numbers.
 *
 * - "`auto`": keep trailing zeros according to `minimumFractionDigits` and `minimumSignificantDigits`;
 * - "`stripIfInteger`": the result with more precision wins a conflict;
 * - "`lessPrecision`": same as "auto", but remove the fraction digits if they are all zero.
 */
export type TrailingZeroDisplay = "auto" | "stripIfInteger" | "lessPrecision";
export default TrailingZeroDisplay;
