/*
 * decimal.js-i18n v0.2.2
 * Full internationalization support for decimal.js.
 * MIT License
 * Copyright (c) 2022 Pedro José Batista <pedrobatista@myself.com>
 * https://github.com/pjbatista/decimal.js-i18n
 */

/** String that describes the approach taken by the formatters in order to achieve a target locale. */
export type LocaleMatcher = "best fit" | "lookup";
export default LocaleMatcher;
