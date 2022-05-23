/*
 * decimal.js-i18n v0.2.1
 * Full internationalization support for decimal.js.
 * MIT License
 * Copyright (c) 2022 Pedro José Batista <pedrobatista@myself.com>
 * https://github.com/pjbatista/decimal.js-i18n
 */

/**
 * Whether to use grouping separators, such as thousands separators or thousand/lakh/crore separators.
 *
 * - "`always`": display grouping separators even if the locale prefers otherwise;
 * - "`auto`": display grouping separators based on the locale preference, which may also depend on the `currency`;
 * - "`false`"/`false`: do not display grouping separators;
 * - "`min2`": display grouping separators when there are at least 2 digits in a group;
 * - "`true`"/`true`: alias for always.
 */
export type UseGrouping = boolean | "always" | "auto" | "false" | "min2" | "true";
export default UseGrouping;
