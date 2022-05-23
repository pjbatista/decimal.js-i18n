/*
 * decimal.js-i18n v0.2.3
 * Full internationalization support for decimal.js.
 * MIT License
 * Copyright (c) 2022 Pedro José Batista <pedrobatista@myself.com>
 * https://github.com/pjbatista/decimal.js-i18n
 */
import Decimal from "decimal.js";
import type Currency from "./currency";
import type Locale from "./locale";
import type NumberingSystem from "./numberingSystem";

/** Format extension used to create large integers with user-defined grouping. */
export const BIGINT_MODIFIERS = {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    maximumSignificantDigits: undefined,
    minimumSignificantDigits: undefined,
    notation: "standard",
    style: "decimal",
} as const;

/** Format extension used to create large integers using the standard notation and decimal system. */
export const PLAIN_MODIFIERS = {
    minimumIntegerDigits: 1,
    signDisplay: "never",
    useGrouping: false,
} as const;

/** The hard exponent limit of `decimal.js` and the digit-count threshold of the plugin. */
export const DECIMAL_LIMIT = 1e9;

/**
 * Hard digit-count limit set by the ECMA internalization standard. Due to the arbitrary-precision of
 * `decimal.js`, this plugin chooses to ignore such limits, allowing values far larger.
 */
export const ECMA_LIMIT = 21;

/** Default configuration of the formatting objects. */
export const DEFAULT_OPTIONS = {
    compactDisplay: "short",
    currencyDisplay: "symbol",
    currencySign: "standard",
    maximumFractionDigits: 3,
    minimumFractionDigits: 0,
    minimumIntegerDigits: 1,
    maximumSignificantDigits: DECIMAL_LIMIT,
    minimumSignificantDigits: 1,
    notation: "standard",
    rounding: Decimal.ROUND_HALF_EVEN,
    signDisplay: "auto",
    style: "decimal",
    unitDisplay: "short",
    trailingZeroDisplay: "auto",
} as const;

/** A big list of {@link Currency currencies}, containing most of the standard currencies of the world. */
export const CURRENCIES: ReadonlyArray<Currency> = [
    "AED",
    "AFN",
    "ALL",
    "AMD",
    "ANG",
    "AOA",
    "ARS",
    "AUD",
    "AWG",
    "AZN",
    "BAM",
    "BBD",
    "BDT",
    "BGN",
    "BHD",
    "BIF",
    "BMD",
    "BND",
    "BOB",
    "BRL",
    "BSD",
    "BTN",
    "BWP",
    "BYR",
    "BZD",
    "CAD",
    "CDF",
    "CHF",
    "CLP",
    "CNY",
    "COP",
    "CRC",
    "CUP",
    "CVE",
    "CZK",
    "DJF",
    "DKK",
    "DOP",
    "DZD",
    "EEK",
    "EGP",
    "ERN",
    "ETB",
    "EUR",
    "FJD",
    "FKP",
    "GBP",
    "GEL",
    "GHS",
    "GIP",
    "GMD",
    "GNF",
    "GTQ",
    "GYD",
    "HKD",
    "HNL",
    "HRK",
    "HTG",
    "HUF",
    "IDR",
    "ILS",
    "INR",
    "IQD",
    "IRR",
    "ISK",
    "JMD",
    "JOD",
    "JPY",
    "KES",
    "KGS",
    "KHR",
    "KMF",
    "KPW",
    "KRW",
    "KWD",
    "KYD",
    "KZT",
    "LAK",
    "LBP",
    "LKR",
    "LRD",
    "LSL",
    "LTL",
    "LVL",
    "LYD",
    "MAD",
    "MDL",
    "MGA",
    "MKD",
    "MMK",
    "MNT",
    "MOP",
    "MRO",
    "MUR",
    "MVR",
    "MWK",
    "MXN",
    "MYR",
    "MZN",
    "NAD",
    "NGN",
    "NIO",
    "NOK",
    "NPR",
    "NZD",
    "OMR",
    "PAB",
    "PEN",
    "PGK",
    "PHP",
    "PKR",
    "PLN",
    "PYG",
    "QAR",
    "RON",
    "RSD",
    "RUB",
    "RWF",
    "SAR",
    "SBD",
    "SCR",
    "SDG",
    "SEK",
    "SGD",
    "SHP",
    "SLL",
    "SOS",
    "SRD",
    "STD",
    "SVC",
    "SYP",
    "SZL",
    "THB",
    "TJS",
    "TND",
    "TOP",
    "TRY",
    "TTD",
    "TWD",
    "TZS",
    "UAH",
    "UGX",
    "USD",
    "UYU",
    "UZS",
    "VEF",
    "VES",
    "VND",
    "VUV",
    "WST",
    "XAF",
    "XCD",
    "XOF",
    "XPF",
    "YER",
    "ZAR",
    "ZMK",
    "ZWD",
] as const;

/** A big list of BCP 47 {@link Locale locales}, used for the new method `Decimal.Format.supportedLocales` */
export const LOCALES: ReadonlyArray<Locale> = [
    "af-ZA",
    "am-ET",
    "ar-AE",
    "ar-BH",
    "ar-DZ",
    "ar-EG",
    "ar-IQ",
    "ar-JO",
    "ar-KW",
    "ar-LB",
    "ar-LY",
    "ar-MA",
    "arn-CL",
    "ar-OM",
    "ar-QA",
    "ar-SA",
    "ar-SD",
    "ar-SY",
    "ar-TN",
    "ar-YE",
    "as-IN",
    "az-az",
    "az-Cyrl-AZ",
    "az-Latn-AZ",
    "ba-RU",
    "be-BY",
    "bg-BG",
    "bn-BD",
    "bn-IN",
    "bo-CN",
    "br-FR",
    "bs-Cyrl-BA",
    "bs-Latn-BA",
    "ca-ES",
    "co-FR",
    "cs-CZ",
    "cy-GB",
    "da-DK",
    "de-AT",
    "de-CH",
    "de-DE",
    "de-LI",
    "de-LU",
    "dsb-DE",
    "dv-MV",
    "el-CY",
    "el-GR",
    "en-029",
    "en-AU",
    "en-BZ",
    "en-CA",
    "en-cb",
    "en-GB",
    "en-IE",
    "en-IN",
    "en-JM",
    "en-MT",
    "en-MY",
    "en-NZ",
    "en-PH",
    "en-SG",
    "en-TT",
    "en-US",
    "en-ZA",
    "en-ZW",
    "es-AR",
    "es-BO",
    "es-CL",
    "es-CO",
    "es-CR",
    "es-DO",
    "es-EC",
    "es-ES",
    "es-GT",
    "es-HN",
    "es-MX",
    "es-NI",
    "es-PA",
    "es-PE",
    "es-PR",
    "es-PY",
    "es-SV",
    "es-US",
    "es-UY",
    "es-VE",
    "et-EE",
    "eu-ES",
    "fa-IR",
    "fi-FI",
    "fil-PH",
    "fo-FO",
    "fr-BE",
    "fr-CA",
    "fr-CH",
    "fr-FR",
    "fr-LU",
    "fr-MC",
    "fy-NL",
    "ga-IE",
    "gd-GB",
    "gd-ie",
    "gl-ES",
    "gsw-FR",
    "gu-IN",
    "ha-Latn-NG",
    "he-IL",
    "hi-IN",
    "hr-BA",
    "hr-HR",
    "hsb-DE",
    "hu-HU",
    "hy-AM",
    "id-ID",
    "ig-NG",
    "ii-CN",
    "in-ID",
    "is-IS",
    "it-CH",
    "it-IT",
    "iu-Cans-CA",
    "iu-Latn-CA",
    "iw-IL",
    "ja-JP",
    "ka-GE",
    "kk-KZ",
    "kl-GL",
    "km-KH",
    "kn-IN",
    "kok-IN",
    "ko-KR",
    "ky-KG",
    "lb-LU",
    "lo-LA",
    "lt-LT",
    "lv-LV",
    "mi-NZ",
    "mk-MK",
    "ml-IN",
    "mn-MN",
    "mn-Mong-CN",
    "moh-CA",
    "mr-IN",
    "ms-BN",
    "ms-MY",
    "mt-MT",
    "nb-NO",
    "ne-NP",
    "nl-BE",
    "nl-NL",
    "nn-NO",
    "no-no",
    "nso-ZA",
    "oc-FR",
    "or-IN",
    "pa-IN",
    "pl-PL",
    "prs-AF",
    "ps-AF",
    "pt-BR",
    "pt-PT",
    "qut-GT",
    "quz-BO",
    "quz-EC",
    "quz-PE",
    "rm-CH",
    "ro-mo",
    "ro-RO",
    "ru-mo",
    "ru-RU",
    "rw-RW",
    "sah-RU",
    "sa-IN",
    "se-FI",
    "se-NO",
    "se-SE",
    "si-LK",
    "sk-SK",
    "sl-SI",
    "sma-NO",
    "sma-SE",
    "smj-NO",
    "smj-SE",
    "smn-FI",
    "sms-FI",
    "sq-AL",
    "sr-BA",
    "sr-CS",
    "sr-Cyrl-BA",
    "sr-Cyrl-CS",
    "sr-Cyrl-ME",
    "sr-Cyrl-RS",
    "sr-Latn-BA",
    "sr-Latn-CS",
    "sr-Latn-ME",
    "sr-Latn-RS",
    "sr-ME",
    "sr-RS",
    "sr-sp",
    "sv-FI",
    "sv-SE",
    "sw-KE",
    "syr-SY",
    "ta-IN",
    "te-IN",
    "tg-Cyrl-TJ",
    "th-TH",
    "tk-TM",
    "tlh-QS",
    "tn-ZA",
    "tr-TR",
    "tt-RU",
    "tzm-Latn-DZ",
    "ug-CN",
    "uk-UA",
    "ur-PK",
    "uz-Cyrl-UZ",
    "uz-Latn-UZ",
    "uz-uz",
    "vi-VN",
    "wo-SN",
    "xh-ZA",
    "yo-NG",
    "zh-CN",
    "zh-HK",
    "zh-MO",
    "zh-SG",
    "zh-TW",
    "zu-ZA",
] as const;

/** A big list of {@link NumberingSystem numbering systems} representing multiple regions of the world. */
export const NUMBERING_SYSTEMS: ReadonlyArray<NumberingSystem> = [
    "adlm",
    "ahom",
    "arab",
    "arabext",
    "armn",
    "armnlow",
    "bali",
    "beng",
    "bhks",
    "brah",
    "cakm",
    "cham",
    "cyrl",
    "deva",
    "ethi",
    "finance",
    "fullwide",
    "geor",
    "gong",
    "gonm",
    "grek",
    "greklow",
    "gujr",
    "guru",
    "hanidays",
    "hanidec",
    "hans",
    "hansfin",
    "hant",
    "hantfin",
    "hebr",
    "hmng",
    "hmnp",
    "java",
    "jpan",
    "jpanfin",
    "jpanyear",
    "kali",
    "khmr",
    "knda",
    "lana",
    "lanatham",
    "laoo",
    "latn",
    "lepc",
    "limb",
    "mathbold",
    "mathdbl",
    "mathmono",
    "mathsanb",
    "mathsans",
    "mlym",
    "modi",
    "mong",
    "mroo",
    "mtei",
    "mymr",
    "mymrshan",
    "mymrtlng",
    "native",
    "newa",
    "nkoo",
    "olck",
    "orya",
    "osma",
    "rohg",
    "roman",
    "romanlow",
    "saur",
    "shrd",
    "sind",
    "sinh",
    "sora",
    "sund",
    "takr",
    "talu",
    "taml",
    "tamldec",
    "telu",
    "thai",
    "tirh",
    "tibt",
    "traditio",
    "vaii",
    "wara",
    "wcho",
] as const;
