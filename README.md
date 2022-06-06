<h1 title="decimal.js-i18n">
    <a href="https://github.com/pjbatista/decimal.js-i18n">
        <picture>
          <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/pjbatista/decimal.js-i18n/main/logo-dark.svg#gh-dark-mode-only">
          <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/pjbatista/decimal.js-i18n/main/logo.svg">
          <img alt="decimal.js-i18n" src="https://raw.githubusercontent.com/pjbatista/decimal.js-i18n/main/logo.svg">
        </picture>
    </a>
</h1>

[![Build Status](https://scrutinizer-ci.com/g/pjbatista/decimal.js-i18n/badges/build.png?b=main)](https://scrutinizer-ci.com/g/pjbatista/decimal.js-i18n/build-status/main) [![Code Coverage](https://scrutinizer-ci.com/g/pjbatista/decimal.js-i18n/badges/coverage.png?b=main)](https://scrutinizer-ci.com/g/pjbatista/decimal.js-i18n/?branch=main) ![NPM](https://img.shields.io/npm/l/decimal.js-i18n) ![node-current](https://img.shields.io/node/v/decimal.js-i18n)

> Full internationalization support for [decimal.js](https://github.com/MikeMcl/decimal.js).

- 🌎 Supports all languages, numbering systems, currencies and units of JavaScript's [Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- 🤖 Automatic extension of the `Decimal` class (custom extender available)
- 🌞 Expands upon [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl.NumberFormat), pushing it to the limits of `decimal.js`
- 🎯 Precision, minimum integer digits, and significance of up to <u>**one billion**</u>!

## Summary

- [Installation](#installation)
- [Usage](#usage)
- [Parameters](#parameters)
- [Options](#options)
- [Links](#links)
- [Changelog](#changelog)
- [Disclaimer and License](#disclaimer-and-license)

## Installation

Install [`decimal.js-i18n`](https://npmjs.org/package/decimal.js-i18n) using your preferred package manager. You'll need [`decimal.js`](https://npmjs.org/package/decimal.js) too!

```bash
npm i -S decimal.js decimal.js-i18n
```

```bash
yarn add decimal.js decimal.js-i18n
```

```bash
pnpm install decimal.js decimal.js-i18n
```

Or [download a release file](https://github.com/pjbatista/decimal.js-i18n/releases) with the appropriate version for you.

[<sub>⇧ back to top</sub>](#summary)

## Usage

The easiest way is to use the main module, which auto-extends `decimal.js`. The other option is to manually augment `Decimal` with the `extend` submodule:

**TypeScript and ES modules:**

```javascript
import Decimal from "decimal.js-i18n";
```

**Node (CommonJS):**

```javascript
const Decimal = require("decimal.js-i18n");
```

**AMD (RequireJS):**

```javascript
require(["decimal.js"], Decimal => { /* ... */ });
```

**Browsers:**

```html
<script src="./scripts/decimal[.min].[m]js" />
<script src="./scripts/decimal-i18n[.min].[m]js" />
```

**Extending manually:**

```javascript
const extend = require("decimal.js-i18n/extend");
const Decimal = extend(require("custom-decimal.js"));
```

---

From now on, the method `toLocaleString` will be available on the `Decimal` prototype:

```javascript
pi.toLocaleString('ar', { 
    minimumSignificantDigits: 100, 
    notation: "engineering", 
    style: "unit", 
    unit: "kilometer-per-hour",
});
// Returns: ٣٫١٤١٥٩٢٦٥٣٥٨٩٧٩٣٢٣٨٤٦٢٦٤٣٣٨٣٢٧٩٥٠٢٨٨٤١٩٧١٦٩٣٩٩٣٧٥١٠٥٨٢٠٩٧٤٩٤٤٥٩٢٣٠٧٨١٦٤٠٦٢٨٦٢٠٨٩٩٨٦٢٨٠٣٤٨٢٥٣٤٢١١٧٠٧٠اس٠ كم/س
```

The backbone of the module, however is the `Decimal.Format` class — to be used when translating multiple values for an increase in performance  —  which behaves pretty much like [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl.NumberFormat), without its 20/21 digits limitations and with the increase in precision of `decimal.js`:

```javascript
const formatter = new Decimal.Format("lao", {
    currency: "USD",
    minimumFractionDigits: 33, // <- Intl.NumberFormat would throw a `RangeError`
    numberingSystem: "laoo",
    style: "currency",
});

Decimal.set({ precision: 100 });

formatter.format(-1 / 3);
// Returns: US$-໐,໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐໐

formatter.format(new Decimal(-1).div(3));
// Returns: US$-໐,໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓໓

formatter.format(new Decimal("1.65e51").div(3).cbrt());
// Returns US$໘໑.໙໓໒.໑໒໗.໐໖໐.໐໖໔.໕໘໐,໙໓໗໙໕໐໗໑໒໘໖໒໘໕໗໙໙໗໓໓໓໙໑໐໓໓໘໗໐໔໕໓໗໑໓໑໓໒໘໙໒໑໕໑໓໐໗໕໒໘໒໗໔໓໖໕໒໒໓໓໘໖໑໔໗໐໓໔໙໙໖໘໓໙໓໖໑໔໒໕໑໒໖
```

Formatting to descriptive parts is also fully implemented:

```javascript
formatter.formatToParts(Decimal.acos(-1));
// Result: [
//   { type: 'currency', value: 'US$' },
//   { type: 'integer', value: '໓' },
//   { type: 'decimal', value: ',' },
//   {
//     type: 'fraction',
//     value: '໑໔໑໕໙໒໖໕໓໕໘໙໗໙໓໒໓໘໔໖໒໖໔໓໓໘໓໒໗໙໕໐໒໘໘໔໑໙໗໑໖໙໓໙໙໓໗໕໑໐໕໘໒໐໙໗໔໙໔໔໕໙໒໓໐໗໘໑໖໔໐໖໒໘໖໒໐໘໙໙໘໖໒໘໐໓໔໘໒໕໓໔໒໑໑໗໐໖໘'
//   }
// ]

```

[<sub>⇧ back to top</sub>](#summary)

## Parameters

The constructor for `Decimal.Format` and `Decimal.prototype.toLocaleString` are invoked with the following parameters:

**locales**: `string` | `string[]`

<sup>(optional)</sup> A string with a BCP 47 language tag, or an array of such strings. For the general form and interpretation of the locales argument, see the [Intl page on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl). The system default locale is used when omitted.

**options**: `object`

<sup>(optional)</sup> Object used to configure the behavior of the string localization. If omitted, it uses the same defaults as `Intl.NumberFormat`. The next section of this document will explain the behavior of each option property as well as their defaults. Descriptions were extracted directly from MDN and W3C and adapted to this document.

[<sub>⇧ back to top</sub>](#summary)

## Options

All configuration values are optional, but a few can become required depending of the [`style`](#style). Some configurations may not be available on all browsers.

### compactDisplay

▸ "`short`" | "`long`"

Only used when [`notation`](#notation) is "`compact`". Takes either "`short`" (default) or "`long`".

### currency

▸ `string`

The currency to use in currency formatting. Possible values are the ISO 4217 currency codes, such as "`USD`" for the US dollar, "`EUR`" for the euro, or "`CNY`" for the Chinese RMB — see the [Current currency & funds code list](https://iso.org/iso-4217-currency-codes.html). There is **no default value**; if the [`style`](#style) is "`currency`", the `currency` property must be provided.

### currencyDisplay

▸ "`symbol`" | "`narrowSymbol`" | "`code`" | "`name`"

How to display the currency in currency formatting. Possible values are:

- "`symbol`" to use a localized currency symbol such as €, this is default value;
- "`narrowSymbol`" to use a narrow format symbol ("$100" rather than "US$100");
- "`code`" to use the ISO currency code;
- "`name`" to use a localized currency name such as "dollar".

### currencySign

▸ "`standard`" | "`accounting`"

In many locales, accounting format means to wrap the number with parentheses instead of appending a minus sign. You can enable this formatting by setting the currencySign option to "`accounting`". The default value is "`standard`".

### localeMatcher

▸ "`best fit`" | "`lookup`"

The locale matching algorithm to use. Possible values are "`lookup`" and "`best fit`"; the default is "`best fit`". For information about this option, see the [Intl page on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl).

### notation

▸ "`standard`" | "`scientific`" | "`engineering`" | "`compact`"

The formatting that should be displayed for the number, the defaults is "`standard`".

- "`standard`" plain number formatting;
- "`scientific`" return the order-of-magnitude for formatted number;
- "`engineering`" return the exponent of ten when divisible by three;
- "`compact`" string representing exponent; defaults to using the "short" form.

### numberingSystem

▸ `string`

A numeral system is a system for expressing numbers. The numberingSystem property helps to represent the different numeral systems used by various countries, regions, and cultures around the world.

See [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl.Locale.prototype.numberingSystem](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl.Locale.prototype.numberingSystem) for more information.

### rounding

▸ [`Decimal.Rounding`](https://mikemcl.github.io/decimal.js/#modes)

Options for rounding modes reflecting the [ICU user guide](https://unicode-org.github.io/icu/userguide/format_parse/numbers/rounding-modes.html). Used in this plugin as in `decimal.js`.

### signDisplay

▸ "`auto`" | "`never`" | "`always`" | "`exceptZero`" | "`negative`"

When to display the sign for the number; defaults to "`auto`":

- "`always`" always display sign;
- "`auto`" sign display for negative numbers only;
- "`exceptZero`" sign display for positive and negative numbers, but not zero;
- "`negative`" sign display for negative numbers only, excluding negative zero;
- "`never`" never display sign.

### style

▸ "`currency`" | "`unit`" | "`decimal`" | "`percent`"

The formatting style to use , the default is "`decimal`".

- "`decimal`" for plain number formatting;
- "`currency`" for [currency](#currency) formatting;
- "`percent`" for percent formatting;
- "`unit`" for [unit](#unit) formatting.

### trailingZeroDisplay

▸ "`auto`" | "`stripIfInteger`" | "`lessPrecision`"

A string expressing the strategy for displaying trailing zeros on whole numbers. The default is "`auto`".

- "`auto`": keep trailing zeros according to [`minimumFractionDigits`](#minimumFractionDigits) and [`minimumSignificantDigits`](#minimumSignificantDigits);
- "`stripIfInteger`": the result with more precision wins a conflict;
- "`lessPrecision`": same as "auto", but remove the fraction digits if they are all zero.

### unit

▸ `string`

The unit to use in unit formatting, possible values are core unit identifiers. Only a [subset](https://tc39.es/proposal-unified-intl-numberformat/section6/locales-currencies-tz_proposed_out.html#sec-issanctionedsimpleunitidentifier) of units from the full list was selected for use in ECMAScript. Pairs of simple units can be concatenated with "`-per-`" to make a compound unit. There is **no default value**; if the [`style`](#style) is "`unit`", the `unit` property must be provided.

### unitDisplay

▸ "`short`" | "`long`" | "`narrow`"

The unit formatting style to use in [unit](#unit) formatting, the defaults is "`short`". Can be "`long`", "`narrow`" or "`short`".

### useGrouping

▸ `boolean` | "`auto`" | "`always`" | "`false`" | "`min2`" | "`true`"

Whether to use grouping separators, such as thousands separators or thousand/lakh/crore separators. The default is "`auto`".

- "`always`": display grouping separators even if the locale prefers otherwise;
- "`auto`": display grouping separators based on the locale preference, which may also be dependent on the [currency](#currency);
- "`false`": do not display grouping separators;
- "`min2`": display grouping separators when there are at least 2 digits in a group;
- "`true`": alias for always.

---

👉 The following properties fall into two groups: [`maximumFractionDigits`](#maximumFractionDigits), [`minimumFractionDigits`](#minimumFractionDigits), and [`minimumIntegerDigits`](#minimumIntegerDigits) in one group, [`maximumSignificantDigits`](#maximumSignificantDigits) and [`minimumSignificantDigits`](#minimumSignificantDigits) in the other. If at least one property from the second group is defined, then the first group <u>**is ignored**</u>.

### maximumFractionDigits

▸ `number`

₁ The maximum number of fraction digits to use. This allows any positive integer value up to `999999999`, including; the default for plain number formatting is the larger of [`minimumFractionDigits`](#minimumFractionDigits) and `3`; the default for currency formatting is the larger of `minimumFractionDigits` and the number of minor unit digits provided by the [ISO 4217 currency code list](https://www.currency-iso.org/en/home/tables/table-a1.html) (`2` if the list doesn't provide that information); the default for percent formatting is the larger of `minimumFractionDigits` and `0`.

### minimumFractionDigits

▸ `number`

₁ The minimum number of fraction digits to use. This allows any positive integer value up to `999999999`, including; the default for plain number and percent formatting is `0`; the default for currency formatting is the number of minor unit digits provided by the [ISO 4217 currency code list](https://www.currency-iso.org/en/home/tables/table-a1.html) (`2` if the list doesn't provide that information).

### minimumIntegerDigits

▸ `number`

₁ The minimum number of integer digits to use. This allows any positive natural value up to `1000000000`, including; the default is `1`.

### maximumSignificantDigits

▸ `number`

₂ The maximum number of significant digits to use. This allows any positive natural value up to `1000000000`, including; the default is the larger of [`minimumFractionDigits`](#minimumFractionDigits) and `21`.

### minimumSignificantDigits

▸ `number`

₂ The minimum number of significant digits to use. This allows any positive natural value up to `1000000000`, including; the default is `1`.

[<sub>⇧ back to top</sub>](#summary)

## Links

- [decimal.js on GitHub](https://github.com/MikeMcl/decimal.js)
- [decimal.js on NPM](https://npmjs.org/packages/decimal.js)
- [Intl on MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- [Intl on W3C Web Docs](https://docs.w3cub.com/javascript/global_objects/intl)
- [ECMAScript Internationalization API Specification](https://tc39.es/ecma402)

[<sub>⇧ back to top</sub>](#summary)

## Changelog

### v0.3.1 (2022-06-05)

Fix fraction output for all locales

- Recreate fraction output with better algorithm.
- Improve export naming.
- Improve testing according to fraction fixes.
- Improve testing speed.

### v0.3.0 (2022-05-30)

Quality-of-life improvements and fixes.

- Fix balancing of longer decimal fractions.
- Improve builder (rewrite in TypeScript).
- Improve packaging automation.

### v0.2.6 (2022-05-26)

Improve distribution, type aliasing, and docs.

- Add generic typing to `notation` and `style`.
- Established node engine ≥ 12 as a hard requirement.
- Standardize documentation on doc blocks.
- Standardize documentation on README.md.
- Prepare repository for scrutinizer.

### v0.2.4-v0.2.5 (2022-05-24)

_"What I believe to be a stable version"_ release.

- Logo SVG fix;
- Increase testing;
- Build script finalized.

### v0.2.0-0.2.3 (2022-05-23)

**Note:** Multiple versions published until many small details were combed through.

TypeScript codebase rewrite.

- Add extensive randomized testing.
- Fix many bugs related to `notation` and `style`.
- Better type declarations.

### v0.1.0 (2022-05-18)

**Note:** This was originally written in JS, not TS.

First version.

- Code base and unit tests created.
- To be replicated in more environments.
- To be published after thorough testing.

[<sub>⇧ back to top</sub>](#summary)

## Disclaimer and License

This project **IS NOT** endorsed or supported by `decimal.js`, or any of its contributors.

`decimal.js-i18n` is licensed under the MIT License. See [LICENSE.md](https://github.com/pjbatista/decimal.js-i18n/blob/master/serialize/LICENSE.md) for more information.

[<sub>⇧ back to top</sub>](#summary)

---

Thanks for reading. A big hug from 🇧🇷 to you! :-)
