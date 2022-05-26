/*
 * decimal.js-i18n v0.2.6
 * Full internationalization support for decimal.js.
 * MIT License
 * Copyright (c) 2022 Pedro José Batista <pedrobatista@myself.com>
 * https://github.com/pjbatista/decimal.js-i18n
 */
import type Decimal from ".";

/**
 * This function is the only export of this module, and can be used to extend custom builds of `decimal.js`.
 *
 * @param decimalClass Decimal class/constructor to be extended.
 * @returns The augmented class/constructor.
 */
export function extend(decimalClass: Partial<Decimal.Constructor>) {
    if (!decimalClass || typeof decimalClass.isDecimal !== "function") {
        throw new TypeError("Invalid argument Decimal argument.");
    }

    globalThis.__Decimal__Class__Global__ = decimalClass as Decimal.Constructor;
    require(".");
    delete globalThis.__Decimal__Class__Global__;
    return decimalClass as typeof Decimal;
}
export default extend;
