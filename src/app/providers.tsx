"use client";

import {
  Theme as MUITheme,
  ThemeProvider as MUIThemeProvider,
  createTheme,
} from "@mui/material";
import React, { PropsWithChildren, useEffect, useState } from "react";

import { ThemeProvider as SCThemeProvider } from "styled-components";
import { SessionProvider } from "next-auth/react";
import { useMediaQuery } from "@mui/material";

// Declare types for styled components to work with MUI theme
declare module "styled-components" {
  interface DefaultTheme extends MUITheme {}
}

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});

const Providers = (props: PropsWithChildren) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState<"light" | "dark">();

  // Set default dark mode if user's system is in dark mode
  useEffect(() => {
    setMode(prefersDarkMode ? "dark" : "light");
  }, [prefersDarkMode]);

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = createTheme({
    palette: {
      mode: mode,
    },
  });

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MUIThemeProvider theme={theme}>
        <SCThemeProvider theme={theme}>
          <SessionProvider>{props.children}</SessionProvider>
        </SCThemeProvider>
      </MUIThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default Providers;
