/*!
 * Copyright (c) 2022 Pedro José Batista, licensed under the MIT License.
 * See the LICENSE.md file in the project root for more information.
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
                expect(decFormat.format(number)).to.match(new RegExp("^" + numFormat.format(Number(number))));
            }
        });
    }
});
