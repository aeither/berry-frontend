import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import "@openfonts/cherry-bomb_all";

const PRIMARY = "#FF4263";
const SECONDARY = "#822B38";
const TERTIARY = "#3D0E19";
const WHITE = "#FFFFFF";

const fonts = {
  heading: "Cherry Bomb",
  body: "Cherry Bomb",
};

const colors = {};

const styles = {
  global: (props) => ({
    body: {
      fontFamily: "body",
      color: WHITE,
      bg: PRIMARY,
      lineHeight: "base",
    },
  }),
};

const primaryLight = "#5C74FF";
const components = {
  Button: {
    baseStyle: {
      _focus: {
        boxShadow: "none",
      },
    },
  },
  CloseButton: {
    baseStyle: {
      _focus: {
        boxShadow: "none",
      },
    },
  },
  Tabs: {
    baseStyle: {
      tab: {
        _focus: {
          zIndex: 1,
          boxShadow: "none",
        },
      },
    },
    variants: {
      line: (props) => ({
        tab: {
          _selected: {
            color: props.colorMode === "dark" ? primaryLight : "red.500",
          },
        },
      }),
    },
  },
  Input: {
    variants: {
      outline: (props) => ({
        field: {
          _focus: {
            zIndex: 1,
            borderColor: props.colorMode === "dark" ? primaryLight : "red.500",
            boxShadow: `0 0 0 1px ${
              props.colorMode === "dark" ? primaryLight : "red.500"
            }`,
          },
        },
      }),
    },
  },
  Slider: {
    baseStyle: {
      thumb: {
        _focus: { boxShadow: "none" },
      },
    },
  },
};

export const theme = extendTheme({ fonts, colors, styles, components });
