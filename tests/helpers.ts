/*
 * decimal.js-i18n v0.2.1
 * Full internationalization support for decimal.js.
 * MIT License
 * Copyright (c) 2022 Pedro José Batista <pedrobatista@myself.com>
 * https://github.com/pjbatista/decimal.js-i18n
 */
import Format, { FormatOptions } from "@/format";
import * as constants from "@/format/constants";
import { cloneClass } from "clone-class";
import TrueDecimal from "decimal.js";

export const Decimal = cloneClass(TrueDecimal);

export const getDecimalClone = () => cloneClass(TrueDecimal);
export const pow10 = (exponent: TrueDecimal.Value) => Decimal.pow(10, exponent);
export const toString = (target: object) => Object.prototype.toString.call(target);

export const basicNumbers = [0, -0, 1, -1, 0.5, -0.5, 10, -10, 10.5, -10.5, 100.5, -100.5, 666.6, -666.6, 1000.5, -1000.5, "123456789.1234", "-123456789.1234", Infinity, -Infinity, NaN, -NaN] as const;
export const currencies = ["AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BRL", "BSD", "BTN", "BWP", "BYR", "BZD", "CAD", "CDF", "CHF", "CLP", "CNY", "COP", "CRC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EEK", "EGP", "ERN", "ETB", "EUR", "FJD", "FKP", "GBP", "GEL", "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF", "IDR", "ILS", "INR", "IQD", "IRR", "ISK", "JMD", "JOD", "JPY", "KES", "KGS", "KHR", "KMF", "KPW", "KRW", "KWD", "KYD", "KZT", "LAK", "LBP", "LKR", "LRD", "LSL", "LTL", "LVL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRO", "MUR", "MVR", "MWK", "MXN", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK", "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLL", "SOS", "SRD", "STD", "SVC", "SYP", "SZL", "THB", "TJS", "TND", "TOP", "TRY", "TTD", "TWD", "TZS", "UAH", "UGX", "USD", "UYU", "UZS", "VEF", "VES", "VND", "VUV", "WST", "XAF", "XCD", "XOF", "XPF", "YER", "ZAR", "ZMK", "ZWD"] as const;
export const units = ["acre", "bit", "byte", "celsius", "centimeter", "day", "degree", "fahrenheit", "fluid-ounce", "foot", "gallon", "gigabit", "gigabyte", "gram", "hectare", "hour", "inch", "kilobit", "kilobyte", "kilogram", "kilometer", "liter", "megabit", "megabyte", "meter", "mile", "mile-scandinavian", "milliliter", "millimeter", "millisecond", "minute", "month", "ounce", "percent", "petabyte", "pound", "second", "stone", "terabit", "terabyte", "week", "yard", "year"];

export const toStringTag = "[object Decimal.Format]";

export const ecmaOptionsDigits = {
    maximumFractionDigits: [0, 20],
    maximumSignificantDigits: [1, 21],
    minimumFractionDigits: [0, 20],
    minimumIntegerDigits: [1, 21],
    minimumSignificantDigits: [1, 21],
} as const;

export const optionsDigits = {
    maximumFractionDigits: [0, 1000],
    maximumSignificantDigits: [1, 1001],
    minimumFractionDigits: [0, 1000],
    minimumIntegerDigits: [1, 1001],
    minimumSignificantDigits: [1, 1001],
} as const;

export const optionsVariants = {
    localeMatcher: [25, "best fit", "lookup"],
    notation: [75, "standard", "scientific", "engineering", "compact"],
    numberingSystem: [75, "adlm", "ahom", "arab", "arabext", "armn", "armnlow", "bali", "beng", "bhks", "brah", "cakm", "cham", "cyrl", "deva", "ethi", "finance", "fullwide", "geor", "gong", "gonm", "grek", "greklow", "gujr", "guru", "hanidays", "hanidec", "hans", "hansfin", "hant", "hantfin", "hebr", "hmng", "hmnp", "java", "jpan", "jpanfin", "jpanyear", "kali", "khmr", "knda", "lana", "lanatham", "laoo", "latn", "lepc", "limb", "mathbold", "mathdbl", "mathmono", "mathsanb", "mathsans", "mlym", "modi", "mong", "mroo", "mtei", "mymr", "mymrshan", "mymrtlng", "native", "newa", "nkoo", "olck", "orya", "osma", "rohg", "roman", "romanlow", "saur", "shrd", "sind", "sinh", "sora", "sund", "takr", "talu", "taml", "tamldec", "telu", "thai", "tirh", "tibt", "traditio", "vaii", "wara", "wcho"],
    signDisplay: [25, "auto", "never", "always", "exceptZero"],
} as const;

export { constants, Format };

// Randomization:

export const random = (from = 0, to = 100) => Decimal.random().mul(to - from).floor().add(from).toNumber();

export const randomVariant = (ecma: boolean) => {
    const result: FormatOptions = {};

    for (const setting in optionsVariants) {
        const key = setting as keyof typeof optionsVariants;
        const [chance, ...array] = optionsVariants[key];

        if (random() >= chance) {
            continue;
        }

        const index = random(array.length - 1);
        result[key] = array[index] as any;
    }

    const { minimumFractionDigits, minimumIntegerDigits, minimumSignificantDigits, maximumSignificantDigits, maximumFractionDigits }
        = ecma ? ecmaOptionsDigits : optionsDigits;
    let fraction = false;

    if (random() >= 50) {
        const [min, max] = minimumIntegerDigits;
        result.minimumIntegerDigits = random(min, max);
    }

    if (random() >= 75) {
        fraction = true;
        const [min, max] = minimumFractionDigits;
        result.minimumFractionDigits = random(min, max);
        result.maximumFractionDigits = Math.max(random(min, max), result.minimumFractionDigits);
    }

    if (!fraction && random() >= 25) {
        fraction = true;
        const [min, max] = minimumSignificantDigits;
        result.minimumSignificantDigits = random(min, max);
        result.maximumSignificantDigits = Math.max(random(min, max), result.minimumSignificantDigits);
    }

    return result;
};

export const randomOptionsCombinations = (ecma = false) => {
    const [decimalStyle, percentStyle, currencyStyle, unitStyle] = [
        { style: "decimal" },
        { style: "percent" },
        { style: "currency", currency: [...currencies], currencyDisplay: ["symbol", "narrowSymbol", "code", "name"] },
        { style: "unit", unit: [...units], unitDisplay: ["long", "narrow", "short"] },
    ] as const;
    const result: FormatOptions[] = [{}];

    for (let i = 0; i < 30; i++) result.push({ ...decimalStyle, ...randomVariant(ecma) });
    for (let i = 0; i < 30; i++) result.push({ ...percentStyle, ...randomVariant(ecma) });

    for (const currency of currencyStyle.currency) {
        for (const currencyDisplay of currencyStyle.currencyDisplay) {
            result.push({ currency, currencyDisplay, style: "currency", ...randomVariant(ecma) });
        }
    }

    for (const unit of unitStyle.unit) {
        for (const unitDisplay of unitStyle.unitDisplay) {
            result.push({ unit, unitDisplay, style: "unit", ...randomVariant(ecma) });
        }
    }

    return result;
};
