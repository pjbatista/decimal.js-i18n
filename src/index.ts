/*
 * decimal.js-i18n v0.2.1
 * Full internationalization support for decimal.js.
 * MIT License
 * Copyright (c) 2022 Pedro José Batista <pedrobatista@myself.com>
 * https://github.com/pjbatista/decimal.js-i18n
 */
/* eslint-disable @typescript-eslint/naming-convention,@typescript-eslint/no-unsafe-argument */
import Decimal from "decimal.js";
import Format from "./format";

const main = (Decimal: Decimal.Constructor) => {
    // Do not attempt to redefine the module, if already extended
    if (typeof Decimal.Format !== "undefined") return;

    Object.defineProperty(Decimal, "Format", { value: Format });
    Object.defineProperty(Decimal.prototype, "toLocaleString", {
        value: function (this: Decimal.Instance, locales, options) {
            return new Decimal.Format(locales, options).format(this);
        } as typeof Decimal.prototype.toLocaleString,
    });
};

main(globalThis.__Decimal__Class__Global__ ?? require("decimal.js"));

declare module "decimal.js" {
    export interface Decimal {
        /**
         * Returns a string with a language-sensitive representation of this decimal number.
         *
         * @param locales A string with a BCP 47 language tag, or an array of such strings. For the general
         *   form and interpretation of the locales argument, see the
         *   [Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) page.
         * @param options Object used to configure the behavior of the string localization.
         * @returns Formatted localized string.
         */
        toLocaleString: (locales?: Format.Locale | Format.Locale[], options?: Format.FormatOptions) => string;
    }

    // In order to appropriately represent the Format class, it needs to be placed on Decimal as a 'static' member:

    // eslint-disable-next-line @typescript-eslint/no-namespace
    export namespace Decimal {
        /**
         * The `Decimal.Format` object enables language-sensitive decimal number formatting. It is entirely
         * based on `Intl.NumberFormat`, with the options of the latter being 100% compatible with it.
         *
         * This class, however, extend the numeric digits constraints of `Intl.NumberFormat` from 21 to
         * 1000000000 in order to fully take advantage of the arbitrary-precision of `decimal.js`.
         */
        export { Format };
    }
}

declare global {
    export class globalThis {
        /** Used by the `extend` submodule to prevent it from loading directly from `decimal.js`. */
        static __Decimal__Class__Global__: Decimal.Constructor | undefined;
    }
}
export { Decimal };
export default Decimal;
