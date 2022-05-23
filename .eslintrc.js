module.exports = {
    env: {
        browser: true,
        es6: true,
        es2020: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "prettier",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: ["./tsconfig.json"],
        sourceType: "module",
    },
    plugins: ["@typescript-eslint", "jsdoc", "prefer-arrow", "only-warn"],
    rules: {
        "@typescript-eslint/indent": ["error", 4, { SwitchCase: 1 }],
        "@typescript-eslint/member-delimiter-style": [
            "error",
            {
                multiline: { delimiter: "semi", requireLast: true },
                singleline: { delimiter: "semi", requireLast: false },
            },
        ],
        "@typescript-eslint/member-ordering": [
            "error",
            {
                default: [
                    "signature",
                    "static-field",
                    "decorated-field",
                    "instance-field",
                    "abstract-field",
                    "constructor",
                    "static-method",
                    "decorated-method",
                    "instance-method",
                    "abstract-method",
                ],
            },
        ],
        "@typescript-eslint/naming-convention": [
            "error",
            {
                format: ["camelCase"],
                selector: "default",
            },
            {
                format: ["camelCase", "PascalCase", "UPPER_CASE"],
                leadingUnderscore: "allow",
                selector: "variable",
            },
            {
                format: ["camelCase", "PascalCase", "UPPER_CASE"],
                selector: "function",
            },
            {
                format: ["camelCase"],
                leadingUnderscore: "allow",
                selector: "parameter",
            },
            {
                format: ["camelCase"],
                leadingUnderscore: "require",
                modifiers: ["private"],
                selector: "memberLike",
            },
            {
                format: ["PascalCase"],
                selector: "typeLike",
            },
        ],
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/triple-slash-reference": "off",
        indent: "off",
        "jsdoc/check-indentation": "off",
        "jsdoc/no-undefined-types": "error",
        "linebreak-style": ["error", "unix"],
        "max-len": ["error", 120],
        quotes: ["error", "double"],
        semi: "error"
    },
};
