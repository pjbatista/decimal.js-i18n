/*
 * decimal.js-i18n v0.1.0
 * Full internationalization support for decimal.js.
 * MIT License
 * Copyright (c) 2022 Pedro José Batista <pedrobatista@myself.com>
 * https://github.com/pjbatista/decimal.js-i18n
 */
const { expect } = require("chai");
const { cloneClass } = require("clone-class");
require("mocha");
const extend = require("../extend");

describe("`extend` submodule", () => {
    // Creates a clean Decimal 'clone' for testing
    const createTestClass = () => cloneClass(require("decimal.js"));

    it("should not be activated by default", () => {
        const Decimal = createTestClass();
        expect(Decimal.Format).to.be.a("undefined");
        expect(Decimal.prototype).to.not.haveOwnProperty("toLocaleString");

        const value = new Decimal(0);
        expect(value.toNumber()).to.equal(0);
    });

    it("should properly extend `Decimal`", () => {
        const Decimal = extend(createTestClass());
        expect(typeof Decimal.isDecimal).to.equal("function");
        expect(typeof Decimal.Format).to.equal("function");
        expect(Decimal.prototype).to.haveOwnProperty("toLocaleString");

        const value = new Decimal(1e3);
        expect(value.toNumber()).to.equal(1e3);

        // Simple toLocaleString test
        expect(value.toLocaleString()).to.equal((1e3).toLocaleString());
    });

    it("`extend` should throw when used on an invalid class", () => {
        expect(() => extend(class Decimal {})).to.throw(TypeError);
    });

    it("should not be activated by default (tested again to ensure proper scoping)", () => {
        const Decimal = createTestClass();
        expect(Decimal.Format).to.be.a("undefined");
        expect(Decimal.prototype).to.not.haveOwnProperty("toLocaleString");

        const value = new Decimal(0);
        expect(value.toNumber()).to.equal(0);
    });
});
