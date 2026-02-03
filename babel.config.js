module.exports = function (api) {
    api.cache(true);

    return {
        presets: ["babel-preset-expo"],

        plugins: [
            "nativewind/babel",

            [
                "module-resolver",
                {
                    extensions: [".js", ".jsx", ".ts", ".tsx"],
                    alias: {
                        "@": "./apps/mobile_3/src",
                    },
                },
            ],
        ],
    };
};
