import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";

import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "sonner";

const styles = {
  global: {
    body: {
      color: "gray.100",
    },
    a: {
      color: "#FFF",
    },
  },
};

const colors = {
  barber: {
    900: "#12131b",
    400: "#1b1c29",
    100: "#c6c6c6",
  },
  button: {
    cta: "#fba931",
    default: "#FFF",
    gray: "#DFDFDF",
    danger: "#FF4040",
  },
  orange: {
    900: "#fba931",
  },
};

const theme = extendTheme({ styles, colors });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Toaster richColors position="top-right" />
        <Component {...pageProps} />
      </AuthProvider>
    </ChakraProvider>
  );
}

export default MyApp;
