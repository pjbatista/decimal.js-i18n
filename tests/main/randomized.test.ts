/*
 * decimal.js-i18n v0.2.4
 * Full internationalization support for decimal.js.
 * MIT License
 * Copyright (c) 2022 Pedro José Batista <pedrobatista@myself.com>
 * https://github.com/pjbatista/decimal.js-i18n
 */
import { basicNumbers, constants, Format, randomOptionsCombinations, toString } from "@test/helpers";
import { expect, use } from "chai";
import chaiSubset from "chai-subset";
import "mocha";

use(chaiSubset);

describe("Randomized localization test (comparing results to native)", () => {
    const languages: string[] = [];

    for (const locale of [undefined, ...constants.LOCALES]) {
        const language = locale?.toLowerCase().slice(0, locale?.indexOf("-"));
        const firstOfKind = !languages.includes(language!);

        if (firstOfKind) languages.push(language!);

        it(`locale=${locale ?? "undefined"}, default options, should match native`, () => {
            const decFormat = new Format(locale);
            const numFormat = new Intl.NumberFormat(locale);
            for (const number of basicNumbers) {
                expect(decFormat.formatToParts(number)).to.deep.equal(numFormat.formatToParts(Number(number)));
            }
        });

        if (!firstOfKind) continue;

        it(`locale=${locale ?? "undefined"}, 822 randomized options variations, should match native`, function () {
            this.timeout(10000);
            const ecmaOptionsCombinations = randomOptionsCombinations(true);
            for (const options of ecmaOptionsCombinations) {
                const decFormat = new Format(locale, options);
                const numFormat = new Intl.NumberFormat(locale, options as Intl.NumberFormatOptions);

                for (const number of basicNumbers) {
                    const decParts = decFormat.formatToParts(number);
                    const numParts = numFormat.formatToParts(number as any);

                    expect(decParts.length).to.equal(numParts.length);
                }
            }
        });
    }
});
