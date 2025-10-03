import Head from "next/head";
import { Sidebar } from "../../components/sidebar";
import { Flex, Heading, Text } from "@chakra-ui/react";

export default function Cashier() {
  return (
    <>
      <Head>
        <title>Caixa - Minha barbearia</title>
      </Head>
      <Sidebar>
        <Flex direction="column" align="flex-start" justify="flex-start">
          <Flex direction="row" w="100%" align="center" justify="flex-start">
            <Heading fontSize="3xl" mt={4} mb={4} mr={4} color="orange.900">
              Caixa
            </Heading>
            <Flex ml="auto" align="center" justify="center" direction="column">
              <Text fontSize="2xl" fontWeight="bold">
                R$ 0,00
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Sidebar>
    </>
  );
}
