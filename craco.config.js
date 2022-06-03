const CracoAntDesignPlugin = require('craco-antd');

module.exports = {
    plugins: [
        {
            plugin: CracoAntDesignPlugin,
            options: {
                customizeTheme: {
                    '@primary-color': '#d58a98',
                    '@table-bg': '#fafafaf0',
                    '@table-header-bg': '#fafafaf0',
                    '@table-header-sort-bg': '#fafafaf0',
                    '@table-body-sort-bg': '#fafafaf0',
                    '@table-row-hover-bg': 'pink',
                    '@table-selected-row-bg': '#fafafaf0',
                    '@table-border-radius-base': '10px',
                    '@table-footer-bg': '#fbfbfb99',
                    '@table-footer-color': '#fbfbfb99',
                },
            },
        },
    ],
};