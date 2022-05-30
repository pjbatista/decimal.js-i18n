/*!
 * Copyright (c) 2022 Pedro José Batista, licensed under the MIT License.
 * See the LICENSE.md file in the project root for more information.
 */
import extend from "@/extend.cjs";
import { toString, toStringTag } from "./helpers";
import { expect, use } from "chai";
import Decimal from "decimal.js";
import "mocha";

describe("Sub-module `extend` (non-automatic activation)", () => {
    it("does not activate automatically", () => {
        expect(Decimal.Format).to.be.an("undefined");
        expect(new Decimal("1e9").toLocaleString("en-US")).to.equal("1000000000");
    });

    it("throws with invalid constructor", () => {
        expect(() => extend({})).to.throw(TypeError);
    });

    it("extends a valid constructor", () => {
        const Dec = extend(Decimal);
        expect(Dec.Format).to.be.a("function");
        expect(toString(new Dec.Format())).to.equal(toStringTag);
        expect(new Dec("1e9").toLocaleString("en-US")).to.equal("1,000,000,000");
        expect(new Dec("1e9").toLocaleString("en-US", { minimumFractionDigits: 30 })).to.equal("1,000,000,000.000000000000000000000000000000");
        expect(new Dec("1e9").toLocaleString("en-US", { style: "percent" })).to.equal("100,000,000,000%");
        expect(new Dec("1e9").toLocaleString("en-US", { minimumIntegerDigits: 30, style: "percent" })).to.equal("000,000,000,000,000,000,100,000,000,000%");
    });
});
