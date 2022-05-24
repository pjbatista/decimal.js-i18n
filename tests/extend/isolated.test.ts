/*
 * decimal.js-i18n v0.2.5
 * Full internationalization support for decimal.js.
 * MIT License
 * Copyright (c) 2022 Pedro José Batista <pedrobatista@myself.com>
 * https://github.com/pjbatista/decimal.js-i18n
 */
import extend from "@/extend";
import { basicNumbers, constants, getDecimalClone, Format, toString, toStringTag } from "@test/helpers";
import { expect, use } from "chai";
import Decimal from "decimal.js";
import "mocha";

describe("Sub-module `extend` (non-automatic activation)", () => {
    it("Decimal class should be clean", () => {
        expect(Decimal.Format).to.be.an("undefined");
        expect(new Decimal("1e9").toLocaleString("en-US")).to.equal("1000000000");
    });

    it("should properly extend a Decimal-like constructor", () => {
        extend(Decimal);
        expect(Decimal.Format).to.be.a("function");
        expect(toString(new Decimal.Format())).to.equal(toStringTag);
        expect(new Decimal("1e9").toLocaleString("en-US")).to.equal("1,000,000,000");
        expect(new Decimal("1e9").toLocaleString("en-US", { minimumFractionDigits: 30 })).to.equal("1,000,000,000.000000000000000000000000000000");
        expect(new Decimal("1e9").toLocaleString("en-US", { style: "percent" })).to.equal("100,000,000,000%");
        expect(new Decimal("1e9").toLocaleString("en-US", { minimumIntegerDigits: 30, style: "percent" })).to.equal("000,000,000,000,000,000,100,000,000,000%");
    });
});
