/*
 * decimal.js-i18n v0.2.6
 * Full internationalization support for decimal.js.
 * MIT License
 * Copyright (c) 2022 Pedro José Batista <pedrobatista@myself.com>
 * https://github.com/pjbatista/decimal.js-i18n
 */
import type Decimal from "decimal.js";
import type BaseFormatOptions from "./baseOptions";
import type FormatCompactDisplay from "./compactDisplay";
import type FormatCurrency from "./currency";
import type FormatCurrencyDisplay from "./currencyDisplay";
import type FormatCurrencySign from "./currencySign";
import type FormatNotation from "./notation";
import type FormatNumberingSystem from "./numberingSystem";
import type FormatSignDisplay from "./signDisplay";
import type FormatStyle from "./style";
import type FormatTrailingZeroDisplay from "./trailingZeroDisplay";
import type FormatUnit from "./unit";
import type FormatUnitDisplay from "./unitDisplay";
import type FormatUseGrouping from "./useGrouping";

/**
 * Describes the resolved configuration of a formatter instance, obtained via `Decimal.Format.resolvedOptions`.
 *
 * @template TNotation Numeric notation of formatting.
 * @template TStyle Numeric style of formatting.
 */
export interface ResolvedFormatOptions<
    TNotation extends FormatNotation = "standard",
    TStyle extends FormatStyle = "decimal",
> extends Partial<BaseFormatOptions<TNotation, TStyle>> {
    // Deterministic properties
    minimumIntegerDigits: number;
    notation: TNotation;
    numberingSystem: FormatNumberingSystem;
    rounding: Decimal.Rounding;
    signDisplay: FormatSignDisplay;
    style: TStyle;
    useGrouping: FormatUseGrouping;
    trailingZeroDisplay: FormatTrailingZeroDisplay;

    // Configuration-dependent properties
    compactDisplay: TNotation extends "compact" ? FormatCompactDisplay : undefined;
    currency: TStyle extends "currency" ? FormatCurrency : undefined;
    currencyDisplay: TStyle extends "currency" ? FormatCurrencyDisplay : undefined;
    currencySign: TStyle extends "currency" ? FormatCurrencySign : undefined;
    unit?: TStyle extends "unit" ? FormatUnit : undefined;
    unitDisplay?: TStyle extends "unit" ? FormatUnitDisplay : undefined;

    /**
     * A string with a [BCP 47](https://www.rfc-editor.org/info/bcp47) language tag.
     *
     * For the general form and interpretation of this property, see the [Intl page on
     * MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl).
     */
    locale: string;
}

export default ResolvedFormatOptions;
