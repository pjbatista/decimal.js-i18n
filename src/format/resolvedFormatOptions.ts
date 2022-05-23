/*
 * decimal.js-i18n v0.1.1
 * Full internationalization support for decimal.js.
 * MIT License
 * Copyright (c) 2022 Pedro José Batista <pedrobatista@myself.com>
 * https://github.com/pjbatista/decimal.js-i18n
 */
import type Decimal from "decimal.js";
import type BaseFormatOptions from "./baseOptions";
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

/** Describes the resolved configuration of a formatter instance, obtained via `Decimal.Format.resolvedOptions`. */
export interface ResolvedFormatOptions extends Partial<BaseFormatOptions> {
    // Deterministic properties
    minimumIntegerDigits: number;
    notation: Notation;
    numberingSystem: NumberingSystem;
    rounding: Decimal.Rounding;
    signDisplay: SignDisplay;
    style: Style;
    useGrouping: UseGrouping;
    trailingZeroDisplay: TrailingZeroDisplay;

    // Configuration-dependent properties
    compactDisplay?: CompactDisplay | undefined;
    currency?: Currency | undefined;
    currencyDisplay?: CurrencyDisplay | undefined;
    currencySign?: CurrencySign | undefined;
    maximumFractionDigits?: number | undefined;
    maximumSignificantDigits?: number | undefined;
    minimumFractionDigits?: number | undefined;
    minimumSignificantDigits?: number | undefined;
    unit?: Unit | undefined;
    unitDisplay?: UnitDisplay | undefined;

    /**
     * A string with a BCP 47 language tag For the general form and interpretation of the `locale` property,
     * see the [Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) page.
     */
    locale: string;
}
export default ResolvedFormatOptions;
