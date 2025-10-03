import Head from "next/head";
import { Flex, Text } from "@chakra-ui/react";
export default function Home() {
  return (
    <>
      <Head>
        <title>Barber-Pro - Seu Sistema completo</title>
      </Head>
      <Flex
        background="barber.900"
        height="100vh"
        alignItems="center"
        justifyContent="center"
        color="#fff"
      >
        <Text>Pagina Home</Text>
      </Flex>
    </>
  );
}
