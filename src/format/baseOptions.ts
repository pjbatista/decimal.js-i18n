/*
 * decimal.js-i18n v0.2.4
 * Full internationalization support for decimal.js.
 * MIT License
 * Copyright (c) 2022 Pedro José Batista <pedrobatista@myself.com>
 * https://github.com/pjbatista/decimal.js-i18n
 */
import type Decimal from "decimal.js";
import type CompactDisplay from "./compactDisplay";
import type Currency from "./currency";
import type CurrencyDisplay from "./currencyDisplay";
import type CurrencySign from "./currencySign";
import type Notation from "./notation";
import type NumberingSystem from "./numberingSystem";
import type SignDisplay from "./signDisplay";
import type Style from "./style";
import type TrailingZeroDisplay from "./trailingZeroDisplay";
import type Unit from "./unit";
import type UnitDisplay from "./unitDisplay";
import type UseGrouping from "./useGrouping";

/** Base type of object used to configure {@link Decimal.Format} formatters. */
export interface BaseFormatOptions {
    /** Only used when {@link notation} is "`compact`". */
    compactDisplay: CompactDisplay;

    /**
     * The currency to use in currency formatting. Possible values are the ISO 4217 currency codes, such as
     * "`USD`" for the US dollar, "`EUR`" for the euro, or "`CNY`" for the Chinese RMB — see the [Current
     * currency & funds code list](https://iso.org/iso-4217-currency-codes.html). There is no default value; if
     * the {@link style} is "`currency`", the `currency` property must be provided.
     */
    currency: Currency;

    /** How to display the {@link currency} in currency formatting. The default is "`symbol`". */
    currencyDisplay: CurrencyDisplay;

    /**
     * In many locales, accounting format means to wrap the number with parentheses instead of appending a
     * minus sign. You can enable this formatting by setting the currencySign option to "`accounting`". The
     * default value is "`standard`".
     */
    currencySign: CurrencySign;

    /**
     * The maximum number of fraction digits to use. Unlike `Intl.NumberFormat`, this allows any integer value
     * up to 999999999; the default for plain number formatting is the larger of {@link minimumFractionDigits}
     * and 3; the default for currency formatting is the larger of `minimumFractionDigits` and the number of
     * minor unit digits provided by the [ISO 4217 currency code
     * list](https://www.currency-iso.org/en/home/tables/table-a1.html) (2 if the list doesn't provide that
     * information); the default for percent formatting is the larger of `minimumFractionDigits` and 0.
     */
    maximumFractionDigits: number;

    /**
     * The maximum number of significant digits to use. Unlike `Intl.NumberFormat`, this allows any natural
     * value up to 1000000000, including; the default is 21.
     */
    maximumSignificantDigits: number;

    /**
     * The minimum number of fraction digits to use. Unlike `Intl.NumberFormat`, this allows any integer value
     * up to 999999999; the default for plain number and percent formatting is 0; the default for currency
     * formatting is the number of minor unit digits provided by the [ISO 4217 currency code
     * list](https://www.currency-iso.org/en/home/tables/table-a1.html) (2 if the list doesn't provide that
     * information).
     */
    minimumFractionDigits: number;

    /**
     * The minimum number of integer digits to use. Unlike `Intl.NumberFormat`, this allows any natural value
     * up to 1000000000, including; the default is 1.
     */
    minimumIntegerDigits: number;

    /**
     * The minimum number of significant digits to use. Unlike `Intl.NumberFormat`, this allows any natural
     * value up to 1000000000, including; the default is 1.
     */
    minimumSignificantDigits: number;

    /** The formatting that should be displayed for the number, the defaults is "`standard`". */
    notation: Notation;

    /**
     * A numeral system is a system for expressing numbers. The numberingSystem property helps to represent the
     * different numeral systems used by various countries, regions, and cultures around the world.
     *
     * See [the MDN page](https://mdn.io/Intl.Locale.prototype.numberingSystem) for more information.
     */
    numberingSystem: NumberingSystem;

    /**
     * Options for rounding modes reflecting the [ICU user guide][1]. Used in this plugin as in
     * [decimal.js](https://mikemcl.github.io/decimal.js/#modes).
     *
     * [1]: https://unicode-org.github.io/icu/userguide/format_parse/numbers/rounding-modes.html
     */
    rounding: Decimal.Rounding;

    /** When to display the sign for the number; defaults to "`auto`". */
    signDisplay: SignDisplay;

    /** The formatting style to use. The default is "`decimal`". */
    style: Style;

    /**
     * The unit to use in unit formatting, possible values are core unit identifiers. There is no default
     * value; if the {@link style} is "`unit`", the `unit` property must be provided.
     */
    unit: Unit;

    /**
     * The unit formatting style to use in {@link unit} formatting, the defaults is "`short`". Can be "`long`",
     * "`narrow`" or "`short`".
     */
    unitDisplay: UnitDisplay;

    /**
     * Whether to use grouping separators, such as thousands separators or thousand/lakh/crore separators. The
     * default is "`auto`".
     */
    useGrouping: UseGrouping;

    /** A string expressing the strategy for displaying trailing zeros on whole numbers. The default is "`auto`". */
    trailingZeroDisplay: TrailingZeroDisplay;
}
export default BaseFormatOptions;
