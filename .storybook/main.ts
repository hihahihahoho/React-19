import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": ["@storybook/addon-onboarding", "@chromatic-com/storybook", "@storybook/addon-docs", '@storybook/addon-themes'],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  docs: {},
  "staticDirs": ['../public/'],
};
export default config;