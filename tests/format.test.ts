/*!
 * Copyright (c) 2022 Pedro José Batista, licensed under the MIT License.
 * See the LICENSE.md file in the project root for more information.
 */
import { basicNumbers, Decimal, Format, toString, toStringTag } from "./helpers";
import { expect, use } from "chai";
import chaiSubset from "chai-subset";
import "mocha";
import "./isolated.test"; // run isolated test fist

use(chaiSubset);

describe("Decimal.Format class", () => {
    it("constructor", () => {
        expect(Format).to.be.a("function");

        // Valid constructors:
        expect(toString(new Format())).to.equal(toStringTag);
        expect(toString(new Format(undefined, { useGrouping: false }))).to.equal(toStringTag);
        expect(toString(new Format("en-US"))).to.equal(toStringTag);
        expect(toString(new Format("en-US", { minimumFractionDigits: 100, notation: "compact" }))).to.equal(toStringTag);
        expect(toString(new Format("en-US", { minimumFractionDigits: 100, style: "unit", unit: "mile-per-second" }))).to.equal(toStringTag);
        expect(toString(new Format("en-US", { minimumIntegerDigits: 100, minimumSignificantDigits: 100, style: "currency", currency: "USD" }))).to.equal(toStringTag);
        expect(toString(new Format("en-US", { maximumFractionDigits: 100, maximumSignificantDigits: 100, style: "percent" }))).to.equal(toStringTag);

        // Invalid constructors:
        expect(() => new Format("en-US", { minimumFractionDigits: 1e9 })).to.throw(RangeError);
        expect(() => new Format(undefined, { maximumFractionDigits: 1e9, minimumFractionDigits: 1e9 })).to.throw(RangeError);
        expect(() => new Format("en-US", { minimumIntegerDigits: 1e10 })).to.throw(RangeError);
        expect(() => new Format(undefined, { maximumSignificantDigits: 1e10 })).to.throw(RangeError);
        expect(() => new Format("en-US", { minimumSignificantDigits: 1e10 })).to.throw(RangeError);
    });

    it("Static method supportedLocalesOf", () => {
        expect(Format.supportedLocalesOf(["en-US", "en-GB", "en-IN"])).to.be.an("array");
        expect(Format.supportedLocalesOf(["en-US", "en-GB", "en-IN"]).length).to.be.equal(3);
    });

    it("Static method supportedLocales", () => {
        expect(Format.supportedLocales()).to.be.an("array");
        expect(Format.supportedLocales().length).to.be.greaterThanOrEqual(50); // 50 is a good threshold everywhere
    });

    it("Method resolvedOptions", () => {
        let resolved = new Format().resolvedOptions();
        expect(resolved).to.containSubset(new Intl.NumberFormat().resolvedOptions());
        expect(resolved.rounding).to.equal(6);
        expect(resolved.trailingZeroDisplay).to.equal("auto");

        resolved = new Format(undefined, { minimumFractionDigits: 100 }).resolvedOptions();
        expect(resolved.maximumFractionDigits).to.equal(100);
        expect(resolved.minimumFractionDigits).to.equal(100);

        resolved = new Format(undefined, { minimumSignificantDigits: 100, rounding: 5 }).resolvedOptions();
        expect(resolved.maximumSignificantDigits).to.equal(100);
        expect(resolved.minimumSignificantDigits).to.equal(100);
        expect(resolved.rounding).to.equal(5);

        resolved = new Format(undefined, { minimumIntegerDigits: 100, trailingZeroDisplay: "stripIfInteger" }).resolvedOptions();
        expect(resolved.minimumIntegerDigits).to.equal(100);
        expect(resolved.trailingZeroDisplay).to.equal("stripIfInteger");
    });

    it("Method formatToParts", () => {
        const formatter = new Format("en-US", { minimumIntegerDigits: 30, maximumFractionDigits: 30, minimumFractionDigits: 30 });
        for (const number of basicNumbers) {
            const decimal = new Decimal(number).valueOf();
            const result = formatter.formatToParts(number);
            const expected = thirtyByThirtyExpected[decimal as keyof typeof thirtyByThirtyExpected];
            expect(result).to.deep.equal(expected);
        }
    });

    it("Method format", () => {
        Decimal.set({ precision: 150 });
        let pi = Decimal.acos(-1);

        const f1 = new Format("ar", { minimumSignificantDigits: 100, notation: "engineering", style: "unit", unit: "kilometer-per-hour" });
        expect(f1.format("1e+101")).to.equal("١٠٠٫٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠اس٩٩ كم/س");
        expect(f1.format("-1e+101")).to.equal("؜-١٠٠٫٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠اس٩٩ كم/س");
        expect(f1.format("-1e-101")).to.equal("؜-١٠٫٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠اس؜-١٠٢ كم/س");
        expect(f1.format("1e-101")).to.equal("١٠٫٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠٠اس؜-١٠٢ كم/س");
        expect(f1.format(pi)).to.equal("٣٫١٤١٥٩٢٦٥٣٥٨٩٧٩٣٢٣٨٤٦٢٦٤٣٣٨٣٢٧٩٥٠٢٨٨٤١٩٧١٦٩٣٩٩٣٧٥١٠٥٨٢٠٩٧٤٩٤٤٥٩٢٣٠٧٨١٦٤٠٦٢٨٦٢٠٨٩٩٨٦٢٨٠٣٤٨٢٥٣٤٢١١٧٠٦٨اس٠ كم/س");

        const f2 = new Format("lo", { minimumFractionDigits: 150, numberingSystem: "laoo", style: "percent" });
        expect(f2.format("1e11")).to.equal("໑໐.໐໐໐.໐໐໐.໐໐໐.໐໐໐,໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐%");
        expect(f2.format("-1e11")).to.equal("-໑໐.໐໐໐.໐໐໐.໐໐໐.໐໐໐,໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐%");
        expect(f2.format("-1e-11")).to.equal("-໐,໐໐໐໐໐໐໐໐໑໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐%");
        expect(f2.format("1e-11")).to.equal("໐,໐໐໐໐໐໐໐໐໑໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐%");
        expect(f2.format(pi)).to.equal("໓໑໔,໑໕໙໒໖໕໓໕໘໙໗໙໓໒໓໘໔໖໒໖໔໓໓໘໓໒໗໙໕໐໒໘໘໔໑໙໗໑໖໙໓໙໙໓໗໕໑໐໕໘໒໐໙໗໔໙໔໔໕໙໒໓໐໗໘໑໖໔໐໖໒໘໖໒໐໘໙໙໘໖໒໘໐໓໔໘໒໕໓໔໒໑໑໗໐໖໗໙໘໒໑໔໘໐໘໖໕໑໓໒໘໒໓໐໖໖໔໗໐໙໓໘໔໔໖໐໙໕໕໐໕໘໒໒໓໑໗໒໕໓໕໙໔໐໘໑໓໐໐໐%");

        Decimal.set({ precision: 1e3 });
        pi = Decimal.acos(-1);
        const f3 = new Format("pt-BR", { minimumSignificantDigits: 1e3 });
        expect(f3.format(pi)).to.equal("3,141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128481117450284102701938521105559644622948954930381964428810975665933446128475648233786783165271201909145648566923460348610454326648213393607260249141273724587006606315588174881520920962829254091715364367892590360011330530548820466521384146951941511609433057270365759591953092186117381932611793105118548074462379962749567351885752724891227938183011949129833673362440656643086021394946395224737190702179860943702770539217176293176752384674818467669405132000568127145263560827785771342757789609173637178721468440901224953430146549585371050792279689258923542019956112129021960864034418159813629774771309960518707211349999998372978049951059731732816096318595024459455346908302642522308253344685035261931188171010003137838752886587533208381420617177669147303598253490428755468731159562863882353787593751957781857780532171226806613001927876611195909216420199");
        expect(f3.format(1)).to.equal("1,000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");
        expect(f3.format(-1)).to.equal("-1,000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");
        expect(f3.format(0)).to.equal("0,000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");
        expect(f3.format(-0)).to.equal("-0,000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");
    });
});

const thirtyByThirtyExpected = {
    "0": [
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "decimal", value: "." },
        { type: "fraction", value: "000000000000000000000000000000" },
    ],
    "-0": [
        { type: "minusSign", value: "-" },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "decimal", value: "." },
        { type: "fraction", value: "000000000000000000000000000000" },
    ],

    "1": [
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "001" },
        { type: "decimal", value: "." },
        { type: "fraction", value: "000000000000000000000000000000" },
    ],
    "-1": [
        { type: "minusSign", value: "-" },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "001" },
        { type: "decimal", value: "." },
        { type: "fraction", value: "000000000000000000000000000000" },
    ],
    "0.5": [
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "decimal", value: "." },
        { type: "fraction", value: "500000000000000000000000000000" },
    ],
    "-0.5": [
        { type: "minusSign", value: "-" },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "decimal", value: "." },
        { type: "fraction", value: "500000000000000000000000000000" },
    ],
    "10": [
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "010" },
        { type: "decimal", value: "." },
        { type: "fraction", value: "000000000000000000000000000000" },
    ],
    "-10": [
        { type: "minusSign", value: "-" },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "010" },
        { type: "decimal", value: "." },
        { type: "fraction", value: "000000000000000000000000000000" },
    ],
    "10.5": [
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "010" },
        { type: "decimal", value: "." },
        { type: "fraction", value: "500000000000000000000000000000" },
    ],
    "-10.5": [
        { type: "minusSign", value: "-" },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "010" },
        { type: "decimal", value: "." },
        { type: "fraction", value: "500000000000000000000000000000" },
    ],
    "100.5": [
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "100" },
        { type: "decimal", value: "." },
        { type: "fraction", value: "500000000000000000000000000000" },
    ],
    "-100.5": [
        { type: "minusSign", value: "-" },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "100" },
        { type: "decimal", value: "." },
        { type: "fraction", value: "500000000000000000000000000000" },
    ],
    "666.6": [
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "666" },
        { type: "decimal", value: "." },
        { type: "fraction", value: "600000000000000000000000000000" },
    ],
    "-666.6": [
        { type: "minusSign", value: "-" },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "666" },
        { type: "decimal", value: "." },
        { type: "fraction", value: "600000000000000000000000000000" },
    ],
    "1000.5": [
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "001" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "decimal", value: "." },
        { type: "fraction", value: "500000000000000000000000000000" },
    ],
    "-1000.5": [
        { type: "minusSign", value: "-" },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "001" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "decimal", value: "." },
        { type: "fraction", value: "500000000000000000000000000000" },
    ],
    "123456789.1234": [
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "123" },
        { type: "group", value: "," },
        { type: "integer", value: "456" },
        { type: "group", value: "," },
        { type: "integer", value: "789" },
        { type: "decimal", value: "." },
        { type: "fraction", value: "123400000000000000000000000000" },
    ],
    "-123456789.1234": [
        { type: "minusSign", value: "-" },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "000" },
        { type: "group", value: "," },
        { type: "integer", value: "123" },
        { type: "group", value: "," },
        { type: "integer", value: "456" },
        { type: "group", value: "," },
        { type: "integer", value: "789" },
        { type: "decimal", value: "." },
        { type: "fraction", value: "123400000000000000000000000000" },
    ],
    Infinity: [{ type: "infinity", value: "∞" }],
    "-Infinity": [
        { type: "minusSign", value: "-" },
        { type: "infinity", value: "∞" },
    ],
    NaN: [{ type: "nan", value: "NaN" }],
    "-NaN": [{ type: "nan", value: "NaN" }],
};
