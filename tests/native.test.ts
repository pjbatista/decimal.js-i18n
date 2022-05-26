/*
 * decimal.js-i18n v0.2.6
 * Full internationalization support for decimal.js.
 * MIT License
 * Copyright (c) 2022 Pedro José Batista <pedrobatista@myself.com>
 * https://github.com/pjbatista/decimal.js-i18n
 */
import { expect, use } from "chai";
import chaiSubset from "chai-subset";
import "mocha";
import { basicNumbers, constants, Format } from "./helpers";

use(chaiSubset);

describe("Localization test (comparing results to native)", () => {
    for (const locale of [undefined, ...constants.LOCALES]) {
        it(`locale=${locale ?? "undefined"}, default options, should match native`, () => {
            const decFormat = new Format(locale);
            const numFormat = new Intl.NumberFormat(locale);
            for (const number of basicNumbers) {
                expect(decFormat.formatToParts(number)).to.deep.equal(numFormat.formatToParts(Number(number)));
            }
        });

        it(`locale=${locale ?? "undefined"}, compact notation, should match native`, () => {
            const decFormat = new Format(locale, { notation: "compact" });
            const numFormat = new Intl.NumberFormat(locale, { notation: "compact"});
            for (const number of basicNumbers) {
                expect(decFormat.formatToParts(number)).to.deep.equal(numFormat.formatToParts(Number(number)));
            }
        });

        it(`locale=${locale ?? "undefined"}, engineering notation, should match native`, () => {
            const decFormat = new Format(locale, { notation: "engineering" });
            const numFormat = new Intl.NumberFormat(locale, { notation: "engineering"});
            for (const number of basicNumbers) {
                expect(decFormat.formatToParts(number)).to.deep.equal(numFormat.formatToParts(Number(number)));
            }
        });

        it(`locale=${locale ?? "undefined"}, scientific notation, should match native`, () => {
            const decFormat = new Format(locale, { notation: "scientific" });
            const numFormat = new Intl.NumberFormat(locale, { notation: "scientific"});
            for (const number of basicNumbers) {
                expect(decFormat.formatToParts(number)).to.deep.equal(numFormat.formatToParts(Number(number)));
            }
        });

        it(`locale=${locale ?? "undefined"}, percent style, should match native`, () => {
            const decFormat = new Format(locale, { style: "percent" });
            const numFormat = new Intl.NumberFormat(locale, { style: "percent"});
            for (const number of basicNumbers) {
                expect(decFormat.formatToParts(number)).to.deep.equal(numFormat.formatToParts(Number(number)));
            }
        });
    }
});
