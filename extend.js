/// <reference path="extend.d.ts" />
!(function (globalScope) {
    /*
     * decimal.js-i18n v0.1.0
     * Full internationalization support for decimal.js.
     * MIT License
     * Copyright (c) 2022 Pedro José Batista <pedrobatista@myself.com>
     * https://github.com/pjbatista/decimal.js-i18n
     */
    "use strict";
    const extend = Decimal => {
        if (!Decimal || typeof Decimal.isDecimal !== "function") {
            throw new TypeError("Invalid argument for `Decimal` to extend.");
        }

        // Setting up a "global" object that will be used instead of the importing
        globalScope.__decimal_target__ = (globalThis || {}).__decimal_target__ = Decimal;
        require("./index.js");

        // Removing the reference after the main module modifies the object.
        delete globalScope.__decimal_target__;
        delete globalThis.__decimal_target__;
        return Decimal;
    };
    module.exports = extend;
    module.exports.extend = extend;
})(this);
