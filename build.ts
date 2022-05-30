/*!
 * Copyright (c) 2022 Pedro José Batista, licensed under the MIT License.
 * See the LICENSE.md file in the project root for more information.
 */

/* eslint-disable */
// Build routines for decimal.js-i18n (now in TypeScript!)

//#region Imports and import helpers - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import rollupBabel, { getBabelOutputPlugin } from "@rollup/plugin-babel";
import rollupNode from "@rollup/plugin-node-resolve";
import chalk from "chalk";
import {
    copyFile,
    createWriteStream,
    emptyDir,
    ensureDir,
    move,
    readFile,
    readJson,
    readJsonSync,
    writeFile,
    writeJson,
} from "fs-extra";
import JsZip from "jszip";
import { dirname, join } from "path";
import eslint from "prettier-eslint";
import { hrtime, stderr, stdout } from "process";
import { OutputAsset, OutputChunk, rollup } from "rollup";
import rollupDts from "rollup-plugin-dts";
import rollupSourcemaps from "rollup-plugin-sourcemaps";
import type { RawSourceMap } from "source-map";
import { convertCompilerOptionsFromJson, createProgram } from "typescript";
import { minify as uglifyJs } from "uglify-js";
import _package from "./package.json";
import tsconfig from "./tsconfig.json";

//#endregion

//#region Constants- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const prettierrc = readJsonSync(join(__dirname, ".prettierrc"));
const license = "/*!\n * Copyright (c) 2022 Pedro José Batista, licensed under the MIT License.\n * See the LICENSE.md file in the project root for more information.\n */\n"; // prettier-ignore
const version = _package.version;

const docBlockRegExp = /\/\*\*.*?\*\/\n/gms;
const globalRegExp = /declare global {\n {4}export class globalThis {\n {8}\/\*\* Used by the `extend` submodule to prevent it from loading directly from `decimal\.js`\. \*\/\n {8}static __Decimal__Class__Global__: Decimal.Constructor \| undefined;\n {4}\}\n\}/ms; // prettier-ignore
const mainCallRegExp = /main\(globalThis\.__Decimal__Class__Global__ \?\? require\("decimal\.js"\)\);/ms;
const mainEs5RegExp = /main\(\(_globalThis\$__Decimal = globalThis\.__Decimal__Class__Global__\) !== null && _globalThis\$__Decimal !== void 0 \? _globalThis\$__Decimal : require\("decimal\.js"\)\);/gms; // prettier-ignore
const licenseRegExp = /\/\*!\n\s+\* Copyright \(c\) 2022 Pedro José Batista, licensed under the MIT License\.\n\s+\* See the LICENSE\.md file in the project root for more information\.\n\s+\*\//gms; // prettier-ignore

const paths = {
    bundle: join(__dirname, "dist", "bundle"),
    dist: join(__dirname, "dist"),
    local: join(__dirname, "dist", "local"),
    node: join(__dirname, "dist", "node"),
    root: __dirname,
    source: join(__dirname, "src"),
};

//#endregion

//#region Helpers- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

interface CopyAndRenameConfig {
    from: string;
    to: string;
    oldExt?: string;
    oldName?: string;
    newName?: string;
    newExt?: string;
    postProcessor?: PostProcessor;
}
type PostProcessor = (contents: string) => Promise<string>;
type Task<T = unknown> = () => Promise<T> | T;

console.warn = () => {};

const cleanDocBlocks = (text: string) => text.replaceAll(docBlockRegExp, "");
const cleanLicenses = (text: string) => text.replaceAll(licenseRegExp, "");

const copyAndRename = async ({
    from,
    to,
    oldExt = ".js",
    oldName = "decimal-i18n",
    newName = "index",
    newExt = ".js",
    postProcessor,
}: CopyAndRenameConfig) => {
    const js = await readFile(join(from, oldName + oldExt));
    const map = await readJson(join(from, oldName + oldExt + ".map"));

    const newJs = js
        .toString()
        .replace(reference(oldName + ".d.ts"), reference(newName + ".d.ts"))
        .replace(sourceMappingUrl(oldName + oldExt), sourceMappingUrl(newName + newExt));
    map.file = newName + oldExt;

    await writeFile(
        join(to, newName + newExt),
        typeof postProcessor === "function" ? await postProcessor(newJs) : newJs,
    );
    await writeJson(join(to, newName + newExt + ".map"), map);
    await copyFile(join(from, oldName + ".d.ts"), join(to, newName + ".d.ts"));
};

const formatCjsExtend = (code: string) =>
    prettify(
        reference("extend.d.ts") + license + cleanDocBlocks(cleanLicenses(
            code
                .replace("export const extend", "const extend")
                .replace("export default extend;", "module.exports = extend;\nmodule.exports.default = extend;")
                .replace(sourceMappingUrl("extend.cjs.js"), sourceMappingUrl("extend.js")),
        )), // prettier-ignore
    );

const formatMjsExtend = (code: string) =>
    prettify(
        reference("extend.d.ts") +
            license +
            cleanDocBlocks(
                cleanLicenses(code.replace(sourceMappingUrl("extend.esm.js"), sourceMappingUrl("extend.mjs"))),
            ),
    );

const formatDts = (code: string) => prettify(license + cleanLicenses(code), ".d.ts");

const formatEs5 = (code: string) =>
    prettify(license + cleanDocBlocks(cleanLicenses(code)).replace(mainEs5RegExp, "main(Decimal);"));

const formatEsm = (code: string) =>
    prettify(license + cleanDocBlocks(cleanLicenses(code)).replace(mainCallRegExp, "main(Decimal);"));

const formatReadme = (markdown: string) =>
    markdown.replace(
        /<h1.*?<\/h1>/ms,
        "# [![decimal.js-i18n](https://raw.githubusercontent.com/pjbatista/decimal.js-i18n/main/logo.svg)](https://github.com/pjbatista/decimal.js-i18n)",
    );

const generateOutput = async (
    outDir: string,
    postProcessor?: PostProcessor | OutputChunk | OutputAsset,
    ...chunks: Array<OutputChunk | OutputAsset>
) => {
    if (postProcessor && typeof postProcessor !== "function") {
        chunks.unshift(postProcessor);
        postProcessor = undefined;
    }

    for (const chunk of chunks) {
        if (chunk.type === "asset") continue;

        const code = typeof postProcessor === "function" ? await postProcessor(chunk.code) : chunk.code;
        const filePath = join(outDir, chunk.fileName.replace(".d.d.ts", ".d.ts"));
        const contents =
                (chunk.fileName.endsWith(".js")
                    ? `/// <reference path="${replaceLast(chunk.fileName, ".js", ".d.ts")}" />\n`
                    : chunk.fileName.endsWith(".mjs")
                        ? `/// <reference path="${replaceLast(chunk.fileName, ".mjs", ".d.ts")}" />\n`
                        : "") + (!chunk.map ? code : code + sourceMappingUrl(chunk.fileName) + "\n"); // prettier-ignore
        await ensureDir(dirname(filePath));
        await writeFile(filePath, contents);

        if (chunk.map) await writeFile(filePath + ".map", chunk.map.toString());
    }
};

const minify = (code: string, filePath: string, original?: RawSourceMap) =>
    uglifyJs(code, {
        sourceMap: { filename: filePath, content: original ?? "inline", includeSources: true, url: filePath + ".map" },
        toplevel: true,
    });

const prettify = (text: string, extension = ".js") =>
    eslint({ filePath: join(paths.source, "/temp." + extension), prettierOptions: prettierrc, text });

const reference = (path: string) => `/// <reference path="${path}" />\n`;

const replaceLast = (haystack: string, needle: string, replacement = "") => {
    // Adapted from https://stackoverflow.com/a/5497365
    const index = haystack.lastIndexOf(needle);

    if (index === -1) return haystack;

    return haystack.substring(0, index) + replacement + haystack.substring(index + needle.length);
};

const parallel = (...tasks: Task[]) => Promise.all(tasks.map(fn => fn()));

const readString = async (path: string) => (await readFile(path)).toString();

const sourceMappingUrl = (url: string) => `//# sourceMappingURL=${url}.map`;

const task =
    <T>(name: string | Task<T>, task?: Task<T>) =>
    /* eslint-disable @typescript-eslint/indent */
    async () => {
        if (typeof name === "function") {
            task = name;
            name = "";
        }
        const time0 = hrtime.bigint();
        name.length && print("Task ", chalk.magenta(name), " started");

        const result = await task!();

        // Calculating time of task and parsing for better info
        let total = Number(process.hrtime.bigint() - time0) / 1e6;
        let unit = "ms";
        if (total >= 1000) (total /= 1e3), (unit = "s");
        if (total >= 1000) (total /= 60), (unit = "m");

        name.length && print("Task ", chalk.magenta(name), " ended (", chalk.grey(total.toFixed(2), unit), ")");
        return result;
    }; /* eslint-enable @typescript-eslint/indent */

const print = (...text: string[]) => stdout.write(text.join("") + "\n");
const printError = (...text: string[]) => stderr.write(text.join("") + "\n");

const sendError = (error: unknown) => {
    printError(chalk.bold("Build: "), chalk.red("Failed"), " because of ", error as string);
    process.exit(1);
};

const sendSuccess = () => {
    print(chalk.bold("Build: "), chalk.green("Successful!"));
    process.exit(0);
};

//#endregion

//#region Tasks- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// 0: Cleanup
const clean = task("clean", async () => {
    await emptyDir(paths.dist);
});

// 1: Transpile the source into an EcmaScript module
const transpile = task("transpile", () => {
    const { errors, options } = convertCompilerOptionsFromJson(
        {
            ...tsconfig.compilerOptions,
            module: "esnext",
            noEmit: false,
            outDir: paths.local,
            rootDir: paths.source,
        },
        paths.source,
    );

    if (errors.length) {
        throw errors;
    }

    const program = createProgram({
        options,
        rootNames: ["./src/index.ts", "./src/extend.cjs.ts", "./src/extend.esm.ts"],
    });
    const { diagnostics, emitSkipped, emittedFiles } = program.emit();

    if (emitSkipped) {
        throw diagnostics;
    }
});

// 2: Bundle the transpiled code
const bundleScript = task("bundle:script", async () => {
    const bundle = await rollup({
        external: ["decimal.js"],
        input: join(paths.local, "index.js"),
        plugins: [rollupNode(), rollupBabel({ babelHelpers: "bundled" }), rollupSourcemaps()],
    });

    // ES5 (via babel) to be used in node modules and .js distributions
    const es5 = await bundle.generate({
        amd: { id: "decimal.js-i18n" },
        file: "decimal-i18n.js",
        exports: "named",
        format: "esm",
        globals: { "decimal.js": "Decimal" },
        name: "decimal-i18n.js",
        plugins: [
            getBabelOutputPlugin({
                presets: ["@babel/preset-env"],
                plugins: ["@babel/transform-modules-umd"],
            }),
        ],
        sourcemap: true,
    });

    // ES modules
    const esm = await bundle.generate({
        file: "decimal-i18n.mjs",
        format: "esm",
        name: "decimal-i18n.mjs",
        sourcemap: true,
    });

    await generateOutput(paths.bundle, formatEs5, ...es5.output);
    await generateOutput(paths.bundle, formatEsm, ...esm.output);
});

// 3. Bundle the type declarations
const bundleType = task("bundle:type", async () => {
    const bundle = await rollup({
        external: ["decimal.js"],
        input: join(paths.local, "index.d.ts"),
        plugins: [rollupDts()],
    });

    const { output } = await bundle.generate({ format: "es" });
    await generateOutput(paths.bundle, formatDts, ...output);

    // Rewrite and copy to fix type declarations
    const dts = await readString(join(paths.bundle, "index.d.ts"));
    const noGlobalDts = dts.replace(globalRegExp, "");

    await writeFile(join(paths.bundle, "index.d.ts"), dts);
    await writeFile(join(paths.bundle, "decimal-i18n.d.ts"), noGlobalDts);
});

// 4. Copy node base files
const makeNodeFiles = task("make:node:files", async () => {
    await ensureDir(paths.node);
    await move(join(paths.bundle, "index.d.ts"), join(paths.node, "index.d.ts"));

    // Reading extend versions and rewiring them accordingly
    await copyAndRename({
        from: paths.local,
        to: paths.node,
        oldName: "extend.cjs",
        newName: "extend",
        postProcessor: formatCjsExtend,
    });
    await copyAndRename({
        from: paths.local,
        to: paths.node,
        oldName: "extend.esm",
        newName: "extend",
        newExt: ".mjs",
        postProcessor: formatMjsExtend,
    });

    // Copy scripts
    await copyAndRename({ from: paths.bundle, to: paths.node });
    await copyAndRename({ from: paths.bundle, to: paths.node, oldExt: ".mjs", newExt: ".mjs" });

    // Copy other files
    await copyFile(join(paths.root, "LICENSE.md"), join(paths.node, "LICENSE.md"));
});

// 5. Create a production package.json
const makeNodePackage = task("make:node:package", async () => {
    const nodePackage = {
        ..._package,
        name: "decimal.js-i18n",
        engines: { node: ">=12" },
        main: "index",
        browser: "index.js",
        module: "index.mjs",
        types: "index.d.ts",
        files: [
            "extend.d.ts",
            "extend.js",
            "extend.js.map",
            "extend.mjs",
            "extend.mjs.map",
            "index.d.ts",
            "index.js",
            "index.js.map",
            "index.mjs",
            "index.mjs.map",
        ],
    } as any;
    delete nodePackage.devDependencies;
    delete nodePackage.private;

    await writeJson(join(paths.node, "package.json"), nodePackage);
});

// 6. Tweak README.md to better fit https://npmjs.org's style
const makeNodeReadme = task("make:node:readme", async () => {
    const readme = await readString(join(paths.root, "README.md"));
    await writeFile(join(paths.node, "README.md"), formatReadme(readme));
});

// 7. Create minified (production-ready) scripts
const makeMinified = task("make:minified", async () => {
    const basePath = join(paths.bundle, "decimal-i18n");

    const js = await readString(basePath + ".js");
    const mjs = await readString(basePath + ".mjs");

    const jsMap: RawSourceMap = await readJson(basePath + ".js.map");
    const mjsMap: RawSourceMap = await readJson(basePath + ".mjs.map");

    const minJs = minify(js, "decimal-i18n.min.js", jsMap);
    const minMjs = minify(mjs, "decimal-i18n.min.mjs", mjsMap);

    await writeFile(basePath + ".min.js", minJs.code);
    await writeFile(basePath + ".min.js.map", minJs.map);
    await writeFile(basePath + ".min.mjs", minMjs.code);
    await writeFile(basePath + ".min.mjs.map", minMjs.map);
});

// 8. Create distributable compacted files
const makeDistributable = task("make:distributable", async () => {
    const baseName = "decimal-i18n";
    const basePath = join(paths.bundle, baseName);
    const dts = await readString(basePath + ".d.ts");

    const createZip = async (suffix: string) => {
        const zip = new JsZip();
        zip.file(baseName + ".d.ts", dts);
        zip.file(baseName + suffix, await readString(basePath + suffix));
        zip.file(baseName + suffix + ".map", await readString(basePath + suffix + ".map"));

        return new Promise(resolve =>
            zip
                .generateNodeStream({ streamFiles: true })
                .pipe(createWriteStream(basePath + suffix + "-v" + version + ".zip"))
                .on("finish", resolve),
        );
    };

    await createZip(".js");
    await createZip(".min.js");
    await createZip(".mjs");
    await createZip(".min.mjs");
});

//#endregion

//#region Program- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const build = task("build", async () => {
    await clean();
    await transpile();
    await parallel(bundleScript, bundleType);
    await parallel(makeNodeFiles, makeNodePackage, makeNodeReadme, makeMinified);
    await makeDistributable();
});

build().then(sendSuccess).catch(sendError);

//#endregion
