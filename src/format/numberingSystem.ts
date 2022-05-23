/*
 * decimal.js-i18n v0.2.2
 * Full internationalization support for decimal.js.
 * MIT License
 * Copyright (c) 2022 Pedro José Batista <pedrobatista@myself.com>
 * https://github.com/pjbatista/decimal.js-i18n
 */

/**
 * A numeral system is a system for expressing numbers. The `NumberingSystem` type helps to represent the
 * different numeral systems used by various countries, regions, and cultures around the world.
 *
 * See the [numberingSystem](https://mdn.io/Intl.Locale.prototype.numberingSystem) page for more information.
 */
export type NumberingSystem =
    | "adlm"
    | "ahom"
    | "arab"
    | "arabext"
    | "armn"
    | "armnlow"
    | "bali"
    | "beng"
    | "bhks"
    | "brah"
    | "cakm"
    | "cham"
    | "cyrl"
    | "deva"
    | "ethi"
    | "finance"
    | "fullwide"
    | "geor"
    | "gong"
    | "gonm"
    | "grek"
    | "greklow"
    | "gujr"
    | "guru"
    | "hanidays"
    | "hanidec"
    | "hans"
    | "hansfin"
    | "hant"
    | "hantfin"
    | "hebr"
    | "hmng"
    | "hmnp"
    | "java"
    | "jpan"
    | "jpanfin"
    | "jpanyear"
    | "kali"
    | "khmr"
    | "knda"
    | "lana"
    | "lanatham"
    | "laoo"
    | "latn"
    | "lepc"
    | "limb"
    | "mathbold"
    | "mathdbl"
    | "mathmono"
    | "mathsanb"
    | "mathsans"
    | "mlym"
    | "modi"
    | "mong"
    | "mroo"
    | "mtei"
    | "mymr"
    | "mymrshan"
    | "mymrtlng"
    | "native"
    | "newa"
    | "nkoo"
    | "olck"
    | "orya"
    | "osma"
    | "rohg"
    | "roman"
    | "romanlow"
    | "saur"
    | "shrd"
    | "sind"
    | "sinh"
    | "sora"
    | "sund"
    | "takr"
    | "talu"
    | "taml"
    | "tamldec"
    | "telu"
    | "thai"
    | "tirh"
    | "tibt"
    | "traditio"
    | "vaii"
    | "wara"
    | "wcho"
    | NumberingSystemString;

// eslint-disable-next-line
type NumberingSystemString = string & {};
export default NumberingSystem;
