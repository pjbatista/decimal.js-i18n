/*
 * decimal.js-i18n v0.2.1
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
        const Dec = extend(getDecimalClone());
        expect(Dec.Format).to.be.a("function");
        expect(new Dec("1e9").toLocaleString("en-US")).to.equal("1,000,000,000");
    });
});
