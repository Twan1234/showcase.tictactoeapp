import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },

    component: {
        devServer: {
            framework: "react",
            bundler: "webpack",
            webpackConfig: require("./webpack.config.js"),
        },
        specPattern: "cypress/component/**/*.cy.{js,jsx,ts,tsx}",
    },
});