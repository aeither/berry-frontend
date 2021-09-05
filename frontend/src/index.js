import React from "react";
import ReactDOM from "react-dom";
// import "./index.css";
// import App from "./App";
import BerryHot from "./BerryHot";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./styles";

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <BerryHot />
  </ChakraProvider>,
  document.getElementById("root")
);
