/*!
 * Copyright (c) 2022 Pedro José Batista, licensed under the MIT License.
 * See the LICENSE.md file in the project root for more information.
 */
import type Decimal from ".";

/**
 * Synchronously extend a Decimal-like constructor with the internationalization support of `decimal.js-i18n`.
 *
 * @param decimalClass Decimal class/constructor to be extended.
 * @returns The augmented class/constructor.
 */
export const extend = (decimalClass: Partial<Decimal.Constructor>) => {
    if (!decimalClass || typeof decimalClass.isDecimal !== "function") {
        throw new TypeError("Invalid Decimal argument.");
    }

    globalThis.__Decimal__Class__Global__ = decimalClass as Decimal.Constructor;
    require("./index");
    delete globalThis.__Decimal__Class__Global__;
    return decimalClass as typeof Decimal;
};
export default extend;
