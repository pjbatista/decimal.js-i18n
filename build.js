/*
 * decimal.js-i18n v0.1.0
 * Full internationalization support for decimal.js.
 * MIT License
 * Copyright (c) 2022 Pedro José Batista <pedrobatista@myself.com>
 * https://github.com/pjbatista/decimal.js-i18n
 */
const { existsSync } = require("fs");
const { copyFile, mkdir, readFile, rm, writeFile } = require("fs/promises");
const { join } = require("path");
const eslint = require("prettier-eslint");
const { minify } = require("uglify-js");
const nodePackage = require("./package.json");

const DIST = "./dist";
const EXT_OUT = "extend";
const NAME = "decimal.js-i18n";
const MOD_OUT = "index";
const ROOT = "https://github.com/pjbatista/decimal.js-i18n/blob/master/source.js";
const SOURCE = "index.js";
const TEMP = join(__dirname, "/temp.js");
const ZIP_OUT = "decimal-i18n";

/* eslint-disable max-len,quotes */
const template = {
    head: `/// <reference path="${MOD_OUT}.d.ts" />\n`,
    module: [
        '/*\n* decimal.js-i18n v0.1.0\n* Full internationalization support for decimal.js.\n* MIT License\n* Copyright (c) 2022 Pedro José Batista <pedrobatista@myself.com>\n* https://github.com/pjbatista/decimal.js-i18n\n*/\n"use strict";\nimport Decimal from "decimal.js";\n',
        "export default Decimal;\nexport { Decimal };\n",
    ],
    normal: [
        '!(function (globalScope) {\n    /*\n     * decimal.js-i18n v0.1.0\n     * Full internationalization support for decimal.js.\n     * MIT License\n     * Copyright (c) 2022 Pedro José Batista <pedrobatista@myself.com>\n     * https://github.com/pjbatista/decimal.js-i18n\n     */\n    "use strict";\n    let Decimal;\n\n    if (typeof globalScope.Decimal === "function") {\n        Decimal = globalScope.Decimal;\n    } else if (typeof define === "function" && define.amd) {\n        define(["decimal.js"], D => (Decimal = D));\n    } else if (typeof module !== "undefined" && module.exports) {\n        Decimal = require("decimal.js");\n        module.exports = Decimal;\n    }\n\n    if (typeof Decimal !== "function") {\n        throw new TypeError("Could not find type `Decimal` and/or module `decimal.js`.");\n    }\n',
        "})(this);\n",
    ],
};
/* eslint-enable max-len,quotes */

const doubleFormat = async text => await format(await format(text));
const format = async text => await eslint({ filePath: TEMP, text });

const uglify = (text, filename, toplevel = true) =>
    minify(text, { sourceMap: { filename, root: ROOT, url: filename + ".map" }, toplevel, v8: true });

const buildJavaScript = async () => {
    const source = (await readFile("./" + SOURCE)).toString();
    const sourceCode = /\/\/#source-begin(.*?)\/\/#source-end/gms.exec(source)[1];

    const moduleText = template.head + template.module[0] + sourceCode + template.module[1];
    const normalText = template.head + template.normal[0] + sourceCode + template.normal[1];

    const moduleData = await format(moduleText);
    const normalData = await doubleFormat(normalText);

    const moduleUgly = uglify(moduleText, MOD_OUT + ".mjs");
    const normalUgly = uglify(normalText, MOD_OUT + ".js");

    await writeFile(join(DIST, MOD_OUT + ".mjs"), moduleData);
    await writeFile(join(DIST, MOD_OUT + ".js"), normalData);

    await writeFile(join(DIST, ZIP_OUT + ".mjs"), moduleData);
    await writeFile(join(DIST, ZIP_OUT + ".js"), normalData);
    await writeFile(join(DIST, ZIP_OUT + ".min.mjs"), moduleUgly.code);
    await writeFile(join(DIST, ZIP_OUT + ".min.js"), normalUgly.code);
    await writeFile(join(DIST, ZIP_OUT + ".min.mjs.map"), moduleUgly.map);
    await writeFile(join(DIST, ZIP_OUT + ".min.js.map"), normalUgly.map);
};

const clean = async () => {
    if (existsSync(DIST)) {
        await rm(DIST, { force: true, recursive: true });
    }

    await mkdir(DIST);
};

const copyFiles = async () => {
    await copyFile("./LICENSE.md", join(DIST, "LICENSE.md"));
    await copyFile("./README.md", join(DIST, "README.md"));
    await copyFile("./extend.js", join(DIST, EXT_OUT + ".js"));
    await copyFile("./extend.d.ts", join(DIST, EXT_OUT + ".d.ts"));
    await copyFile(`./${MOD_OUT}.d.ts`, join(DIST, MOD_OUT + ".d.ts"));
};

const makePackage = async () => {
    delete nodePackage.devDependencies;
    delete nodePackage.scripts;
    delete nodePackage.private;

    nodePackage.main = MOD_OUT;
    nodePackage.name = NAME;
    nodePackage.files = [MOD_OUT + ".js", MOD_OUT + ".mjs", MOD_OUT + ".d.ts", EXT_OUT + ".js", EXT_OUT + ".d.ts"];
    nodePackage.browser = MOD_OUT + ".js";
    nodePackage.module = MOD_OUT + ".mjs";
    nodePackage.types = MOD_OUT + ".d.ts";

    await writeFile(join(DIST, "package.json"), JSON.stringify(nodePackage, null, 4));
};

const main = async () => {
    const time0 = process.hrtime.bigint();
    await clean();
    await buildJavaScript();
    await copyFiles();
    await makePackage();

    const timeTotal = (Number(process.hrtime.bigint() - time0) / 1e9).toFixed(2);
    process.stdout.write(`Build: 🟢 Successful (${timeTotal}s)\n`);
};

main().catch(e => process.stderr.write(`Build: 🔴 Failed. Reason: ${e.message ?? e}${e.stack ?? ""}\n`));
