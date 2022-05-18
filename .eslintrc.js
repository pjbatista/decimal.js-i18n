module.exports = {
    env: {
        browser: true,
        es2020: true,
        es6: true,
        node: true,
    },
    extends: ["eslint:recommended", "prettier"],
    plugins: ["only-warn"],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    globals: { define: "readonly", describe: "readonly", it: "readonly" },
    rules: {
        indent: ["error", 4],
        "linebreak-style": ["error", "unix"],
        "max-len": ["error", 120],
        quotes: ["error", "double"],
        semi: ["error", "always"],
    },
};
