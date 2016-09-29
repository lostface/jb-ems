module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true
  },
  "extends": [
    "eslint:recommended",
  ],
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "script",
  },
  "plugins": [],
  "rules": {
    // Possible Errors
    "no-console": "off",
    "no-template-curly-in-string": "error",
    "no-unsafe-negation": "error",

    // Best Practices
    "array-callback-return": "error",
    "consistent-return": "error",
    "curly": "error",
    "guard-for-in": "error",
    "no-alert": "error",
    "no-caller": "error",
    "no-eval": "error",
    "no-extra-bind": "error",
    "no-extend-native": "error",
    "no-extra-label": "error",
    "no-global-assign": "error",
    "no-implicit-globals": "error",
    "no-implied-eval": "error",
    "no-iterator": "error",
    "no-multi-spaces": "error",
    "no-new-func": "error",
    "no-new-wrappers": "error",
    "no-proto": "error",
    "no-self-compare": "error",
    "no-sequences": "error",
    "no-shadow-restricted-names": "error",
    "no-throw-literal": "error",
    "no-useless-concat": "error",
    "no-useless-escape": "error",
    "no-with": "error",
    "strict": ["error", "safe"],
    "wrap-iife": ["error", "any"],

    // Stylistic
    "block-spacing": "error",
    "brace-style": ["error", "1tbs", { "allowSingleLine": true }],
    "comma-spacing": ["error", { "before": false, "after": true }],
    "computed-property-spacing": ["error", "never"],
    "eol-last": "error",
    "func-call-spacing": ["error", "never"],
    "indent": ["error", 2, { SwitchCase: 1 }],
    "jsx-quotes": ["error", "prefer-double"],
    "keyword-spacing": "error",
    // TODO this is ok from CLI, but not in Sublime (opposite result!)
    // "linebreak-style": ["error", "windows"],
    "no-array-constructor": "error",
    "no-lonely-if": "error",
    "no-trailing-spaces": "off",
    "no-unneeded-ternary": "error",
    "no-whitespace-before-property": "error",
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "semi-spacing": ["error", {"before": false, "after": true}],
    "space-before-blocks": "error",
    "space-in-parens": ["error", "never"],
    // TODO es6 default params not supported :(
    "space-infix-ops": "off",
    "space-unary-ops": ["error", { "words": true, "nonwords": false }],

    // ES6
    "no-useless-rename": "error",
    "prefer-const": "error",
    "prefer-rest-params": "error",
    "prefer-spread": "error",
    "prefer-template": "error",
    "rest-spread-spacing": ["error", "never"],
  }
};
