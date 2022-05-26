/*
 * decimal.js-i18n v0.2.6
 * Full internationalization support for decimal.js.
 * MIT License
 * Copyright (c) 2022 Pedro José Batista <pedrobatista@myself.com>
 * https://github.com/pjbatista/decimal.js-i18n
 */
"use strict";

// Build routines for decimal-i18n:
//  -> Transpile a 'local' version to be used for the node package, via `tsc`
//  -> Create the bundled AMD, CommonJS, and UML distributions
//  -> Copy assets and create files for publishing

//#region Imports ------------------------------------------------------------------------------------------------------

const { existsSync, rm, writeFile, mkdir, readFile, copyFile, createWriteStream } = require("fs-extra");
const JSZip = require("jszip");
const { join } = require("path");
const eslint = require("prettier-eslint");
const { rollup } = require("rollup");
const { convertCompilerOptionsFromJson, createProgram } = require("typescript");
const { minify: uglifyJs } = require("uglify-js");
const tsconfig = require("./tsconfig.json");
const nodePackage = require("./package.json");
const version = nodePackage.version;

// ESMs are imported asynchronously on the main task
let chalk;
let cjsPlugin;
let dtsPlugin;
let nodePlugin;
let sourcemapsPlugin;

//#endregion

//#region Constants ----------------------------------------------------------------------------------------------------

// These go on top of files
const headers = {
    amd: 'require("decimal.js", Decimal =>',
    base: '/// <reference path="./index.d.ts" />\n',
    bundle: '/// <reference path="./decimal-i18n.d.ts" />\n',
    extend: '/// <reference path="./extend.d.ts" />\n',
    license: `/*\n * decimal.js-i18n v${version}\n * Full internationalization support for decimal.js.\n * MIT License\n * Copyright (c) 2022 Pedro José Batista <pedrobatista@myself.com>\n * https://github.com/pjbatista/decimal.js-i18n\n */\n`, // prettier-ignore
    strict: '"use strict";\n',
};

// Names used for modules, bundling and whatnot
const names = {
    bundle: "decimal-i18n",
    long: "decimal.js-i18n",
    node: "index",
    rootLocal: ["./src/index.ts"],
    rootNode: ["./src/index.ts", "./src/extend.ts"],
};

// Project directories
const paths = {
    bundle: join(__dirname, "dist", "bundle"),
    docs: join(__dirname, "docs"),
    dist: join(__dirname, "dist"),
    local: join(__dirname, "dist", ".localbuild"),
    node: join(__dirname, "dist", ".nodebuild"),
    package: join(__dirname, "dist", "node"),
    root: __dirname,
    source: join(__dirname, "src"),
};

const tempFile = join(paths.source, "/temp.js");

//#endregion

//#region Helpers ------------------------------------------------------------------------------------------------------

const doubleFormat = async text => await format(await format(text));
const format = async text => await eslint({ filePath: tempFile, text });

const normalizeCode = contents =>
    headers.license +
    headers.strict +
    contents
        .replaceAll(/\n\n\n\n?/gms, "\n\n")
        .replaceAll(/\/\*\*.*?\*\/\n/gms, "")
        .replaceAll(/['"`]use strict['"`];/g, "")
        .replaceAll(postProcess.licenseRegex(), "");

const normalizeType = contents =>
    headers.license + contents.replaceAll(/\n\n\n\n?/gms, "\n\n").replaceAll(postProcess.licenseRegex(), "");

const parallel = (params, ...tasks) => {
    if (!Array.isArray(params)) {
        tasks.unshift(params);
        params = [];
    }

    return Promise.all(tasks.map(fn => fn(...params)));
};

const postProcess = {
    extendMapUrl: "//# sourceMappingURL=extend.js.map\n",
    indexMapUrl: "//# sourceMappingURL=index.js.map\n",
    indexMjsMapUrl: "//# sourceMappingURL=index.mjs.map\n",
    mapUrl: "//# sourceMappingURL=decimal-i18n.js.map\n",
    mjsMapUrl: "//# sourceMappingURL=decimal-i18n.mjs.map\n",
    suffix: "\nexport { Decimal };\nexport default Decimal;\n",
    prefix: 'import Format from "./format/index";\nimport Decimal from "decimal.js";\n',
    exportRegex: () => /export \{ default as Decimal, default \} from 'decimal.js';\n/,
    licenseRegex: () => /\/\*\n\s+\* decimal.js-i18n v[0-9]+\.[0-9]+\.[0-9]+\n\s+\* Full internationalization support for decimal\.js\.\n\s+\* MIT License\n\s+\* Copyright \(c\) 2022 Pedro José Batista <pedrobatista@myself\.com>\n\s+\* https:\/\/github.com\/pjbatista\/decimal\.js-i18n\n\s+\*\//gms, // prettier-ignore
    mainRegex: () => /globalThis\.__Decimal__Class__Global__ \?\? require\("decimal\.js"\)/ms,
    sectionsRegex: () => /\/\*\*@section code\*\/(.*?)\/\*\*@section ignore\*\//ms,
};

const print = (...text) => process.stdout.write(text.join(" ") + "\n");

const printError = (...text) => process.stderr.write(text.join(" ") + "\n");

const printTask = (name, ...rest) => name && print("Task", chalk.magenta(name), ...rest);

const swapMapFile = async (mapPath, newFile) => {
    const data = JSON.parse((await readFile(mapPath)).toString());
    data.file = newFile;
    return JSON.stringify(data);
};

const task =
    (name, asyncCallback) =>
    async (...parameters) => {
        if (typeof name === "function") {
            asyncCallback = name;
            name = undefined;
        }

        const t0 = process.hrtime.bigint();
        printTask(name, "started");
        const result = await asyncCallback(...parameters);

        let total = Number(process.hrtime.bigint() - t0) / 1e6;
        let unit = "ms";
        if (total >= 1000) (total /= 1e3), (unit = "s");
        if (total >= 1000) (total /= 60), (unit = "m");

        printTask(name, "ended in", chalk.grey(total.toFixed(2), unit));
        return result;
    };

const terminateWithError = error => {
    const lineBreak = "\n    ";

    if (error instanceof Error) {
        error = `${error.message}${lineBreak}${error.stack ?? ""}`;
    }

    if (Array.isArray(error)) {
        error = error
            .map(line => lineBreak + (line.messageText?.messageText ?? line.message ?? line.toString()))
            .join("");
    }

    printError(chalk.bold("Build:"), chalk.red("Failed"), "because of", error);
    process.exit(1);
};

const terminateWithSuccess = () => {
    print(chalk.bold("Build:"), chalk.green("Successful"));
    process.exit(0);
};

const uglify = (text, filename, toplevel = true) =>
    uglifyJs(text, {
        sourceMap: { filename, content: "inline", includeSources: true, url: filename + ".map" },
        toplevel,
        v8: true,
    });

//#endregion

//#region Build tasks --------------------------------------------------------------------------------------------------

const build = task("build", async () => {
    await parallel(buildTypeScript, buildNode);
    await parallel(bundleEsm, bundleNodeExtend, bundleNodeIndex, bundleUmd, bundleType);
});

const buildTypeScript = task("build:typescript", async () => {
    const { errors: compilerErrors, options: compilerOptions } = convertCompilerOptionsFromJson(
        {
            ...tsconfig.compilerOptions,
            module: "esnext", // for easier integration with rollup
            noEmit: false,
            outDir: paths.local,
            rootDir: paths.source,
        },
        paths.source,
    );

    if (compilerErrors.length) {
        throw compilerErrors;
    }

    const program = createProgram({ options: compilerOptions, rootNames: names.rootLocal });
    const { diagnostics, emitSkipped } = program.emit();

    if (emitSkipped) {
        throw diagnostics;
    }
});

const buildNode = task("build:node", async () => {
    const { errors: compilerErrors, options: compilerOptions } = convertCompilerOptionsFromJson(
        {
            ...tsconfig.compilerOptions,
            downlevelIteration: true,
            module: "commonjs",
            noEmit: false,
            outDir: paths.node,
            rootDir: paths.source,
            target: "es5"
        },
        paths.source,
    );

    if (compilerErrors.length) {
        throw compilerErrors;
    }

    const program = createProgram({ options: compilerOptions, rootNames: names.rootNode });
    const { diagnostics, emitSkipped } = program.emit();

    if (emitSkipped) {
        throw diagnostics;
    }
});

const bundleEsm = task("bundle:esm", async () => {
    // Use the already transpiled and post-processed script to bundle
    const bundle = await rollup({
        external: ["decimal.js"],
        input: join(paths.local, "index.js"),
        plugins: [nodePlugin(), sourcemapsPlugin()],
    });

    const { output } = await bundle.generate({
        exports: "named",
        format: "esm",
        generatedCode: { constBindings: true },
        sourcemap: true,
    });

    if (output.length !== 1) {
        throw new Error(`There should 1 rollup output chunk, ${output.length} found.`);
    }

    const { code, map } = output[0];
    let contents = normalizeCode(code);

    // Post-processing the bundle
    const { mjsMapUrl, suffix, exportRegex } = postProcess;
    contents = await format(headers.bundle + contents.replace(exportRegex(), "") + suffix + mjsMapUrl);
    const contentsMinified = uglify(contents, names.bundle + ".mjs");

    if (!existsSync(paths.bundle)) await mkdir(paths.bundle);
    await writeFile(join(paths.bundle, names.bundle + ".mjs"), contents);
    await writeFile(join(paths.bundle, names.bundle + ".mjs.map"), JSON.stringify(map));
    await writeFile(join(paths.bundle, names.bundle + ".min.mjs"), contentsMinified.code);
    await writeFile(join(paths.bundle, names.bundle + ".min.mjs.map"), contentsMinified.map);
    if (bundle) bundle.close();
});

const bundleNodeExtend = task("bundle:node:extend", async () => {
    const bundle = await rollup({
        external: ["decimal.js", "."],
        input: join(paths.node, "extend.js"),
        plugins: [nodePlugin(), cjsPlugin(), sourcemapsPlugin()],
    });

    const { output } = await bundle.generate({
        exports: "named",
        format: "cjs",
        generatedCode: { constBindings: true },
        globals: { "decimal.js": "Decimal" },
        inlineDynamicImports: true,
        name: "extend.js",
        sourcemap: true,
    });

    if (output.length !== 1) {
        throw new Error(`There should 1 rollup output chunk, ${output.length} found.`);
    }

    const { code, map } = output[0];
    const contents = normalizeCode(code) + postProcess.extendMapUrl;

    if (!existsSync(paths.package)) await mkdir(paths.package);
    await writeFile(join(paths.package, "extend.js"), contents);
    await writeFile(join(paths.package, "extend.js.map"), JSON.stringify(map));
});

const bundleNodeIndex = task("bundle:node:index", async () => {
    const bundle = await rollup({
        external: ["decimal.js"],
        input: join(paths.node, "index.js"),
        plugins: [nodePlugin(), cjsPlugin(), sourcemapsPlugin()],
    });

    const { output } = await bundle.generate({
        exports: "named",
        format: "umd",
        generatedCode: { constBindings: true },
        globals: { "decimal.js": "Decimal" },
        inlineDynamicImports: true,
        name: "index.js",
        sourcemap: true,
    });

    if (output.length !== 1) {
        throw new Error(`There should 1 rollup output chunk, ${output.length} found.`);
    }

    const { code, map } = output[0];
    const contents = normalizeCode(code) + postProcess.extendMapUrl;

    if (!existsSync(paths.package)) await mkdir(paths.package);
    await writeFile(join(paths.package, "index.js"), contents);
    await writeFile(join(paths.package, "index.js.map"), JSON.stringify(map));
});

const bundleUmd = task("bundle:umd", async () => {
    const bundle = await rollup({
        external: ["decimal.js"],
        input: join(paths.local, "index.js"),
        plugins: [nodePlugin(), sourcemapsPlugin()],
    });

    const { output } = await bundle.generate({
        exports: "named",
        format: "umd",
        generatedCode: { constBindings: true },
        globals: { "decimal.js": "Decimal" },
        name: names.long,
        sourcemap: true,
    });

    if (output.length !== 1) {
        throw new Error(`There should 1 rollup output chunk, ${output.length} found.`);
    }

    const { code, map } = output[0];
    let contents = code;

    // Post-processing the bundle
    const { mapUrl } = postProcess;
    contents = contents.replace(postProcess.mainRegex(), "Decimal") + mapUrl;
    const contentsMinified = uglify(contents, names.bundle + ".js");

    if (!existsSync(paths.bundle)) await mkdir(paths.bundle);
    await writeFile(join(paths.bundle, names.bundle + ".js"), headers.bundle + normalizeCode(contents));
    await writeFile(join(paths.bundle, names.bundle + ".js.map"), JSON.stringify(map));
    await writeFile(join(paths.bundle, names.bundle + ".min.js"), contentsMinified.code);
    await writeFile(join(paths.bundle, names.bundle + ".min.js.map"), contentsMinified.map);

    if (bundle) bundle.close();
});

const bundleType = task("bundle:type", async () => {
    const bundle = await rollup({
        external: ["decimal.js"],
        input: join(paths.local, "index.d.ts"),
        plugins: [dtsPlugin()],
    });
    const { output } = await bundle.generate({ format: "es" });

    if (output.length !== 1) {
        throw new Error(`There should 1 rollup output chunk, ${output.length} found.`);
    }

    const { code: type } = output[0];
    let contents = normalizeType(type);

    // Post-processing the bundle
    const { suffix, exportRegex } = postProcess;
    contents = contents.replace(exportRegex(), "") + suffix;

    if (!existsSync(paths.bundle)) await mkdir(paths.bundle);
    await writeFile(join(paths.bundle, names.bundle + ".d.ts"), contents);

    if (bundle) bundle.close();
});

//#endregion

//#region Misc. tasks --------------------------------------------------------------------------------------------------

const clean = task("clean", async () => {
    const dirs = [paths.bundle, paths.docs, paths.local, paths.node, paths.package];

    for (const dir of dirs) {
        if (existsSync(dir)) {
            await rm(dir, { force: true, recursive: true });
        }
    }
});

const make = task("make", () => parallel(makePackage, makeZip));

const makePackage = task("make:package", async () => {
    // First create the package modifying the dev package.json
    const distPackage = { ...nodePackage };
    delete distPackage.devDependencies;
    delete distPackage.private;
    delete distPackage.scripts;
    distPackage.name = names.long;
    distPackage.main = names.node;
    distPackage.browser = names.node + ".js";
    distPackage.module = names.node + ".mjs";
    distPackage.types = names.node + ".d.ts";
    distPackage.files = [
        "extend.d.ts",
        "extend.js",
        "extend.js.map",
        names.node + ".js",
        names.node + ".js.map",
        names.node + ".mjs",
        names.node + ".mjs.map",
        names.node + ".d.ts",
    ];
    distPackage.engines.node = "^12";

    await writeFile(join(paths.package, "package.json"), JSON.stringify(distPackage, null, 4));
    await copyFile(join(paths.root, "README.md"), join(paths.package, "README.md"));
    await copyFile(join(paths.root, "LICENSE.md"), join(paths.package, "LICENSE.md"));
});

const makeZip = task("make:zip", async () => {
    const dtsData = (await readFile(join(paths.bundle, "decimal-i18n.d.ts"))).toString();

    const createZip = async name => {
        const zip = new JSZip();
        zip.file("decimal-i18n.d.ts", dtsData);
        zip.file(name, (await readFile(join(paths.bundle, name))).toString());
        zip.file(name + ".map", (await readFile(join(paths.bundle, name + ".map"))).toString());

        return new Promise(resolve =>
            zip
                .generateNodeStream({ streamFiles: true })
                .pipe(createWriteStream(join(paths.bundle, name + "-v" + version + ".zip")))
                .on("finish", resolve),
        );
    };

    await createZip("decimal-i18n.js");
    await createZip("decimal-i18n.min.js");
    await createZip("decimal-i18n.mjs");
    await createZip("decimal-i18n.min.mjs");
});

//#endregion

const start = task("all", async () => {
    await clean();
    await build();
    await make();
});

const main = async () => {
    chalk = (await import("chalk")).default;
    cjsPlugin = (await import("@rollup/plugin-commonjs")).default;
    dtsPlugin = (await import("rollup-plugin-dts")).default;
    nodePlugin = (await import("@rollup/plugin-node-resolve")).default;
    sourcemapsPlugin = (await import("rollup-plugin-sourcemaps")).default;

    await start();
};

main().then(terminateWithSuccess).catch(terminateWithError);
