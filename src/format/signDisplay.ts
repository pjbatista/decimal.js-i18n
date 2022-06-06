/*!
 * Copyright (c) 2022 Pedro José Batista, licensed under the MIT License.
 * See the LICENSE.md file in the project root for more information.
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
