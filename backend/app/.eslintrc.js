module.exports = {
    "env":
    {
        "browser": true,
        "es2021": true
    },
    "extends":
    [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "overrides":
    [
        {
            "env":
            {
                "node": true
            },
            "files": [".eslintrc.{js,cjs}"],
            "parserOptions":
            {
                "sourceType": "script"
            }
        }
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions":
    {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": ["@typescript-eslint"],
    "rules":
    {
        "quotes":
        [
            "error",
            "double"
        ],
        "semi":
        [
            "error",
            "always"
        ],
        // custom rules based on 42
        // POSSIBLE PROBLEMS
        "no-await-in-loop": "error",
        "no-class-assign": "error",
        "no-compare-neg-zero": "error",
        "no-cond-assign":
        [
            "error",
            "always"
        ],
        "no-const-assign": "error",
        "no-constant-condition": "error",
        "no-constructor-return": "error",
        "no-dupe-args": "error",
        "no-dupe-class-members": "error",
        "no-dupe-else-if": "error",
        "no-dupe-keys": "error",
        "no-duplicate-case": "error",
        "no-duplicate-imports":
        [
            "error",
            {
                "includeExports": true
            }
        ],
        "no-ex-assign": "error",
        "no-fallthrough":
        [
            "error",
            {
                "commentPattern": "break[\\s\\w]*omitted"
            }
        ],
        "no-import-assign": "error",
        "no-inner-declarations": "error",
        "no-self-compare": "error",
        "no-use-before-define": "error",
        // SUGESTED
        "accessor-pairs":
        [
            "error",
            {
                "getWithoutSet": true,
                "setWithoutGet": true,
                "enforceForClassMembers": false
            }
        ],
        "arrow-body-style":
        [
            "error",
            "always"
        ],
        "block-scoped-var": "error",
        "camelcase":
        [
            "error",
            {
                "ignoreImports": true
            }
        ],
        "consistent-return": "error",
        "curly":
        [
            "error",
            "multi"
        ],
        "default-case": "error",
        "default-case-last": "error",
        "dot-notation": "error",
        "eqeqeq":
        [
            "error",
            "smart"
        ],
        "func-style":
        [
            "error",
            "declaration",
            {
                "allowArrowFunctions": true
            }
        ],
        "grouped-accessor-pairs": "error",
        "init-declarations":
        [
            "error",
            "never",
            {
                "ignoreForLoopInit": true
            }
        ],
        "max-classes-per-file": "error",
        "max-depth":
        [
            "error",
            4
        ],
        "max-lines-per-function":
        [
            "error",
            {
                "max": 25,
                "skipComments": true,
                "skipBlankLines": true
            }
        ],
        "max-params":
        [
            "error",
            4
        ],
        "max-statements":
        [
            "error",
            4
        ],
        "no-alert": "error",
        "no-case-declarations": "error",
        "no-inline-comments": "error",
        "no-label-var": "error",
        "no-multi-assign": "error",
        "no-nested-ternary": "error",
        "no-new": "error",
        "no-var": "error",
        "spaced-comment":
        [
            "error",
            "always"
        ],
        "vars-on-top": "error",
        "yoda":
        [
            "error",
            "never",
            {
                "onlyEquality": true
            }
        ],
        "array-element-newline":
        [
            "error",
            "always"
        ],
        "array-bracket-newline":
        [
            "error",
            {
                "multiline": true
            }
        ],
        "arrow-parens":
        [
            "error",
            "always"
        ],
        "block-spacing": "error",
        "brace-style":
        [
            "error",
            "allman"
        ],
        "comma-spacing":
        [
            "error",
            {
                "before": false,
                "after": true
            }
        ],
        "dot-location":
        [
            "error",
            "property"
        ],
        "eol-last":
        [
            "error",
            "always"
        ],
        "func-call-spacing":
        [
            "error",
            "never"
        ],
        "key-spacing":
        [
            "error",
            {
                "mode": "strict"
            }
        ],
        "line-comment-position":
        [
            "error",
            {
                "position": "above"
            }
        ],
        "lines-around-comment":
        [
            "error",
            {
                "beforeBlockComment": true,
                "allowBlockStart": true,
                "allowClassStart": true,
                "allowObjectStart": true,
            }
        ],
        "max-len":
        [
            "error",
            {
                "code": 80,
                "tabWidth": 4,
            }
        ],
        "new-parens": "error",
        "newline-per-chained-call":
        [
            "error",
            {
                "ignoreChainWithDepth": 2
            }
        ],
        "no-multi-spaces": "error",
        "no-multiple-empty-lines":
        [
            "error",
            {
                "max": 2,
                "maxEOF": 0
            }
        ],
        "no-trailing-spaces":
        [
            "error",
            {
                "ignoreComments": true
            }
        ],
        "no-whitespace-before-property": "error",
        "nonblock-statement-body-position":
        [
            "error",
            "below"
        ],
        "object-property-newline": "error",
        "operator-linebreak":
        [
            "error",
            "before"
        ],
        "padded-blocks":
        [
            "error",
            {
                "blocks": "never"
            }
        ],
    }
};
