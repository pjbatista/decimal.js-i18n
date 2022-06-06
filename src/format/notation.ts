/*!
 * Copyright (c) 2022 Pedro José Batista, licensed under the MIT License.
 * See the LICENSE.md file in the project root for more information.
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
