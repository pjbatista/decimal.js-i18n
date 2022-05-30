/*!
 * Copyright (c) 2022 Pedro José Batista, licensed under the MIT License.
 * See the LICENSE.md file in the project root for more information.
 */
import type Decimal from "decimal.js";
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
 * Base type of object used to configure {@link Decimal.Format} formatters.
 *
 * @template TNotation Numeric notation of formatting.
 * @template TStyle Numeric style of formatting.
 */
export interface BaseFormatOptions<
    TNotation extends FormatNotation = "standard",
    TStyle extends FormatStyle = "decimal",
> {
    /** Only used when {@link notation `notation`} is "`compact`". */
    compactDisplay: FormatCompactDisplay;

    /**
     * The currency to use in currency formatting. Possible values are the ISO 4217 currency codes, such as
     * "`USD`" for the US dollar, "`EUR`" for the euro, or "`CNY`" for the Chinese RMB — see the [Current
     * currency & funds code list](https://iso.org/iso-4217-currency-codes.html). There is no default value; if
     * the {@link style} is "`currency`", the `currency` property must be provided.
     */
    currency: FormatCurrency;

    /** How to display the {@link currency `currency`} in currency formatting. The default is "`symbol`". */
    currencyDisplay: FormatCurrencyDisplay;

    /**
     * In many locales, accounting format means to wrap the number with parentheses instead of appending a
     * minus sign. You can enable this formatting by setting the currencySign option to "`accounting`". The
     * default value is "`standard`".
     */
    currencySign: FormatCurrencySign;

    /**
     * The maximum number of fraction digits to use. This allows any positive integer value up to `999999999`,
     * including; the default for plain number formatting is the larger of
     * {@link minimumFractionDigits `minimumFractionDigits`} and `3`; the default for currency formatting is the
     * larger of `minimumFractionDigits` and the number of minor unit digits provided by the [ISO 4217 currency
     * code list](https://www.currency-iso.org/en/home/tables/table-a1.html) (`2` if the list doesn't provide
     * that information); the default for percent formatting is the larger of `minimumFractionDigits` and `0`.
     */
    maximumFractionDigits: number;

    /**
     * The maximum number of significant digits to use. This allows any positive natural value up to
     * `1000000000`, including; the default for plain number formatting is the larger of
     * {@link minimumSignificantDigits `minimumSignificantDigits`} and `21`.
     */
    maximumSignificantDigits: number;

    /**
     * The minimum number of fraction digits to use. This allows any positive integer value up to `999999999`,
     * including; the default for plain number and percent formatting is `0`; the default for
     * {@link currency `currency`} formatting is the number of minor unit digits provided by the [ISO 4217
     * currency code list](https://www.currency-iso.org/en/home/tables/table-a1.html) (`2` if the list doesn't
     * provide that information).
     */
    minimumFractionDigits: number;

    /**
     * The minimum number of integer digits to use. This allows any positive natural value up to `1000000000`,
     * including; the default is `1`.
     */
    minimumIntegerDigits: number;

    /**
     * The minimum number of significant digits to use. This allows any positive natural value up to
     * `1000000000`, including; the default is `1`.
     */
    minimumSignificantDigits: number;

    /** The formatting that should be displayed for the number, the defaults is "`standard`". */
    notation: TNotation;

    /**
     * A numeral system is a system for expressing numbers. The numberingSystem property helps to represent the
     * different numeral systems used by various countries, regions, and cultures around the world.
     *
     * See [the MDN page](https://mdn.io/Intl.Locale.prototype.numberingSystem) for more information.
     */
    numberingSystem: FormatNumberingSystem;

    /**
     * Options for rounding modes reflecting the [ICU user guide][1]. Used in this plugin as in
     * [decimal.js](https://mikemcl.github.io/decimal.js/#modes).
     *
     * [1]: https://unicode-org.github.io/icu/userguide/format_parse/numbers/rounding-modes.html
     */
    rounding: Decimal.Rounding;

    /** When to display the sign for the number; defaults to "`auto`". */
    signDisplay: FormatSignDisplay;

    /** The formatting style to use. The default is "`decimal`". */
    style: TStyle;

    /**
     * The unit to use in unit formatting, possible values are core unit identifiers. There is no default
     * value; if the {@link style} is "`unit`", the `unit` property must be provided.
     */
    unit: FormatUnit;

    /**
     * The unit formatting style to use in {@link unit} formatting, the defaults is "`short`". Can be "`long`",
     * "`narrow`" or "`short`".
     */
    unitDisplay: FormatUnitDisplay;

    /**
     * Whether to use grouping separators, such as thousands separators or thousand/lakh/crore separators. The
     * default is "`auto`".
     */
    useGrouping: FormatUseGrouping;

    /** A string expressing the strategy for displaying trailing zeros on whole numbers. The default is "`auto`". */
    trailingZeroDisplay: FormatTrailingZeroDisplay;
}
export default BaseFormatOptions;
