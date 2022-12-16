import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import MainPage from "./MainPage";
import { Typography } from "@mui/material";
import React from "react";
import UserState from "./context/UserState";
import { deepOrange, grey } from "@mui/material/colors";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      light: "#8884d8",
      main: "#8884d8",
      dark: "#8884d8",
      contrastText: "#fff",
    },
    secondary: {
      light: "#8884d8",
      main: "#8884d8",
      dark: "#8884d8",
      contrastText: "#000",
    },
  },
});

const UsersContext = React.createContext([]);

function App() {
  return (
    <UserState>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <MainPage />
      </ThemeProvider>
    </UserState>
  );
}

export { App, UsersContext };
