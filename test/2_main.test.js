/*
 * decimal.js-i18n v0.1.0
 * Full internationalization support for decimal.js.
 * MIT License
 * Copyright (c) 2022 Pedro José Batista <pedrobatista@myself.com>
 * https://github.com/pjbatista/decimal.js-i18n
 */
const { expect } = require("chai");
require("mocha");

// First, simulate the "global" object without extending...
let Decimal = function () {};

describe("Main module", () => {
    it("should automatically extend `Decimal`", () => {
        expect(Decimal.Format).to.be.a("undefined");
        expect(Decimal.prototype).to.not.haveOwnProperty("toLocaleString");

        // ...Now 'extend' it
        Decimal = require("../index");

        expect(Decimal.isDecimal).to.be.a("function");
        expect(Decimal.Format).to.be.a("function");
        expect(Decimal.prototype).to.haveOwnProperty("toLocaleString");
    });

    it("should have instances capable of `toLocaleString`", () => {
        const value = new Decimal(1e3);
        expect(value.toNumber()).to.equal(1e3);
        expect(value.toLocaleString("en-US")).to.equal("1,000");
        expect(value.toLocaleString("pt-BR")).to.equal("1.000");
        expect(value.toLocaleString("pt-BR", { minimumFractionDigits: 30 })).to.equal(
            "1.000,000000000000000000000000000000",
        );
    });
});

describe("Decimal.Format", () => {
    it("should initialize properly", () => {
        expect(new Decimal.Format()).to.be.a("Decimal.Format");

        expect(new Decimal.Format("en-US")).to.be.a("Decimal.Format");
        expect(new Decimal.Format("pt-BR")).to.be.a("Decimal.Format");

        expect(new Decimal.Format("en-US", { minimumFractionDigits: 100 })).to.be.a("Decimal.Format");
        expect(new Decimal.Format("en-IN", { minimumFractionDigits: 100 })).to.be.a("Decimal.Format");

        expect(new Decimal.Format(undefined, { maximumFractionDigits: 100 })).to.be.a("Decimal.Format");
        expect(new Decimal.Format(undefined, { maximumSignificantDigits: 100 })).to.be.a("Decimal.Format");
        expect(new Decimal.Format(undefined, { minimumFractionDigits: 100 })).to.be.a("Decimal.Format");
        expect(new Decimal.Format(undefined, { minimumIntegerDigits: 100 })).to.be.a("Decimal.Format");
        expect(new Decimal.Format(undefined, { minimumSignificantDigits: 100 })).to.be.a("Decimal.Format");
    });

    it("should throw when initializing with invalid properties", () => {
        expect(() => new Decimal.Format("i-dont-exist")).to.throw(RangeError);
        expect(() => new Decimal.Format(undefined, { maximumFractionDigits: 1e10 })).to.throw(RangeError);
        expect(() => new Decimal.Format(undefined, { maximumSignificantDigits: 1e10 })).to.throw(RangeError);
        expect(() => new Decimal.Format(undefined, { minimumFractionDigits: 1e10 })).to.throw(RangeError);
        expect(() => new Decimal.Format(undefined, { minimumIntegerDigits: 1e10 })).to.throw(RangeError);
        expect(() => new Decimal.Format(undefined, { minimumSignificantDigits: 1e10 })).to.throw(RangeError);
    });

    it("should properly resolve its configurations", () => {
        let options = new Decimal.Format().resolvedOptions();
        delete options.rounding;

        expect(options).to.deep.equal(new Intl.NumberFormat().resolvedOptions());
    });
});
