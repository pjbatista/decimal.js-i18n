/*!
 * Copyright (c) 2022 Pedro José Batista, licensed under the MIT License.
 * See the LICENSE.md file in the project root for more information.
 */
import { expect, use } from "chai";
import chaiSubset from "chai-subset";
import "mocha";
import { basicNumbers, constants, Format, randomOptionsCombinations } from "./helpers";

use(chaiSubset);

describe("Randomized localization test (comparing results to native)", () => {
    const languages: [undefined, ...string[]] = [] as any;

    for (const locale of [undefined, ...constants.LOCALES]) {
        const language = (locale ?? "").replace(/^.*-([a-z]+)$/i, "$1").toLowerCase();
        const firstOfKind = !languages.includes(language);
        if (!firstOfKind) continue;
        languages.push(language || undefined);
    }

    for (const language of languages.sort()) {
        it(`locale=${language || "undefined"}, 822 randomized options variations, should match native`, function () {
            this.timeout(5000);
            const ecmaOptionsCombinations = randomOptionsCombinations(true);
            for (const options of ecmaOptionsCombinations) {
                const decFormat = new Format(language, options);
                const numFormat = new Intl.NumberFormat(language, options as Intl.NumberFormatOptions);

                for (const number of basicNumbers) {
                    const decParts = decFormat.formatToParts(number);
                    const numParts = numFormat.formatToParts(number as any);

                    expect(decParts.length).to.equal(numParts.length);
                }
            }
        });
    }
});
