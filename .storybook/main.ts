import type { StorybookConfig } from "@storybook/react-webpack5";

const config: StorybookConfig = {
  // Povieme mu, aby hľadal príbehy iba v tvojom components priečinku
  stories: ["../src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/preset-create-react-app"
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  typescript: {
    check: false,
  },
};
export default config;