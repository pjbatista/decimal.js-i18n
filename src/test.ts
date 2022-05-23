import Decimal from ".";

const f = new Decimal.Format("pt-BR", {
    maximumFractionDigits: 999,
    minimumFractionDigits: 100,
    minimumIntegerDigits: 41,
    rounding: Decimal.ROUND_UP,
    style: "unit",
    unit: "kilometer-per-hour",
});

Decimal.set({ precision: 999 });
const v1 = new Decimal(1).div(3);
const v2 = v1.cbrt().add("1e21");
console.log(f.format(v1));
console.log(f.format(v2));
