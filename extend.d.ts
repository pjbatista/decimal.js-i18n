/*
 * decimal.js-i18n v0.1.0
 * Full internationalization support for decimal.js.
 * MIT License
 * Copyright (c) 2022 Pedro José Batista <pedrobatista@myself.com>
 * https://github.com/pjbatista/decimal.js-i18n
 */
import DecimalBase from "decimal.js";
import Decimal from "./index";

declare module "decimal.js-i18n/extend" {
    /**
     * Extends a `Decimal` constructor with the formatting classes and functions of `decimal.js-i18n`.
     *
     * @param target Decimal class, imported from a module or globally available.
     * @returns An i18n-augmented Decimal class.
     */
    export default function extend<T extends typeof DecimalBase>(target: T): typeof Decimal;
    export { extend };
}
