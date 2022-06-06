/*!
 * Copyright (c) 2022 Pedro José Batista, licensed under the MIT License.
 * See the LICENSE.md file in the project root for more information.
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
