import React from "react";
import ReactDOM from "react-dom";
import Router from "./Router";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./styles";

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <Router />
  </ChakraProvider>,
  document.getElementById("root")
);
