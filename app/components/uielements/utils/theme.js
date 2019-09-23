// @flow
import { reversePalette } from "styled-theme/composer";
import type { Theme } from "styled-theme/types";

const theme: Theme = {};

theme.palette = {
  primary: "#0072bc",
  secondary: "#0072bc",
  danger: "#ff4d4f",
  alert: "#ff4d4f;",
  success: "#b7eb8f",
  grayscale: ["#212121", "#616161", "#9e9e9e", "#bdbdbd", "#e0e0e0", "#ffffff"]
};

theme.reversePalette = reversePalette(theme.palette);

export default theme;
