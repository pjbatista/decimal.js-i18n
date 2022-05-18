/*
 * decimal.js-i18n v0.1.0
 * Full internationalization support for decimal.js.
 * MIT License
 * Copyright (c) 2022 Pedro José Batista <pedrobatista@myself.com>
 * https://github.com/pjbatista/decimal.js-i18n
 */
const { Assertion, expect } = require("chai");
require("mocha");

const { locales } = require("./locales.json");

Assertion.addMethod("equivalentTo", function (larger) {
    let lesser = this._obj;

    if (lesser.length > larger.length) {
        const temp = larger;
        larger = lesser;
        lesser = temp;
    }

    larger = Array(larger);
    lesser = Array(lesser);
    let degree = 1;

    while (larger.length) {
        const largerChar = larger.shift();
        const lesserChar = lesser.length ? lesser.shift() : null;

        if (largerChar !== lesserChar) {
            degree /= 1.1;
        }
    }

    this.assert(
        degree > 0.751314, // three characters of difference
        `expected #{this} to be #{exp} to be equivalent to #{act} but it failed (d=${degree})`,
        `expected #{this} to be #{exp} to not be equivalent to #{act} but it failed (d=${degree})`,
    );
});

describe("Locales", () => {
    let Decimal;

    it("should load the test locales", () => {
        Decimal = require("../index");
    });

    for (const locale of locales) {
        it(`should properly translate to '${locale}'`, () => {
            const number = 1e3 + Math.random() * 1e3;
            const decimal = new Decimal(number);

            const numberValue = number.toLocaleString(locale);
            const decimalValue = decimal.toLocaleString(locale);
            expect(decimalValue).to.be.equivalentTo(numberValue);
        });
    }
});
