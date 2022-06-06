/*!
 * Copyright (c) 2022 Pedro José Batista, licensed under the MIT License.
 * See the LICENSE.md file in the project root for more information.
 */
import type Decimal from "..";
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

/**
 * Describes the resolved configuration of a formatter instance, obtained via `Decimal.Format.resolvedOptions`.
 *
 * @template N Numeric notation of formatting.
 * @template S Numeric style of formatting.
 */
export interface ResolvedFormatOptions<N extends Notation = "standard", S extends Style = "decimal">
    extends Partial<BaseFormatOptions<N, S>> {
    // Deterministic properties
    minimumIntegerDigits: number;
    notation: N;
    numberingSystem: NumberingSystem;
    rounding: Decimal.Rounding;
    signDisplay: SignDisplay;
    style: S;
    useGrouping: UseGrouping;
    trailingZeroDisplay: TrailingZeroDisplay;

    // Configuration-dependent properties
    compactDisplay: N extends "compact" ? CompactDisplay : undefined;
    currency: S extends "currency" ? Currency : undefined;
    currencyDisplay: S extends "currency" ? CurrencyDisplay : undefined;
    currencySign: S extends "currency" ? CurrencySign : undefined;
    unit: S extends "unit" ? Unit : undefined;
    unitDisplay?: S extends "unit" ? UnitDisplay : undefined;

    /**
     * A string with a [BCP 47](https://www.rfc-editor.org/info/bcp47) language tag.
     *
     * For the general form and interpretation of this property, see the [Intl page on
     * MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl).
     */
    locale: string;
}

export default ResolvedFormatOptions;
