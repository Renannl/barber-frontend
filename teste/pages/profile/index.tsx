import { useContext, useState } from "react";
import Head from "next/head";
import { Text, Flex, Heading, Box, Input, Button } from "@chakra-ui/react";
import { Sidebar } from "../components/sidebar";
import Link from "next/link";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { AuthContext } from "../../context/AuthContext";
import { setupAPIClient } from "../../services/api";
import { toast } from "sonner";

interface UserProps {
  id: string;
  name: string;
  email: string;
  endereco: string | null;
}
interface ProfileProps {
  user: UserProps;
  premium: boolean;
}
export default function Profile({ user, premium }: ProfileProps) {
  const { logOutUser } = useContext(AuthContext);
  const [name, setName] = useState(user && user?.name);
  const [endereco, setEndereco] = useState(user?.endereco ? user.endereco : "");

  async function handleUpdateUser() {
    if (name === "") {
      //Validar
      return;
    }

    try {
      const apiClient = setupAPIClient();
      await apiClient.put("/users", {
        name: name,
        endereco: endereco,
      });
      toast.success("Dados alterados com sucesso!");
    } catch (err) {
      console.log(err);
    }
  }

  async function handleLogout() {
    await logOutUser();
  }
  return (
    <>
      <Head>
        <title>Minha Conta - Barber Pro</title>
      </Head>
      <Sidebar>
        <Flex
          direction="column"
          alignItems="flex-start"
          justifyContent="flex-start"
        >
          <Flex
            width="100%"
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
          >
            <Heading fontSize="3xl" color="orange.900" mt={4} mb={4} mr={4}>
              Minha Conta
            </Heading>
          </Flex>
          <Flex
            pt={8}
            pb={8}
            bg="barber.400"
            maxW="700px"
            w="100%"
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Flex direction="column" w="75%">
              <Text color="#fff" mb="2" fontSize="xl" fontWeight="bold">
                Nome da Barbearia:{" "}
              </Text>
              <Input
                w="100%"
                bg="gray.900"
                placeholder="Nome da sua barbearia"
                size="lg"
                mb={3}
                color="#fff"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Flex>
            <Flex direction="column" w="75%">
              <Text color="#fff" mb="2" fontSize="xl" fontWeight="bold">
                Endereço:{" "}
              </Text>
              <Input
                color="#fff"
                w="100%"
                bg="gray.900"
                placeholder="Endereço da sua barbearia"
                size="lg"
                mb={3}
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
              />

              <Text color="#fff" mb="2" fontSize="xl" fontWeight="bold">
                Plano atual:
              </Text>

              <Flex
                direction="row"
                w="100%"
                mb={3}
                border={1}
                rounded={6}
                background="barber.900"
                alignItems="center"
                justifyContent="space-between"
              >
                <Text
                  color={premium ? "#fba931" : "#4dffb4"}
                  p={2}
                  fontSize="lg"
                >
                  Plano {premium ? "Premium" : "Gratis"}
                </Text>
                <Link href="/planos">
                  <Box
                    color="#fff"
                    cursor="pointer"
                    p={1}
                    pl={2}
                    pr={2}
                    background="#00cd52"
                    rounded={4}
                  >
                    Mudar plano
                  </Box>
                </Link>
              </Flex>

              <Button
                w="100%"
                mt={3}
                mb={4}
                background="button.cta"
                _hover={{ bg: "#ffb13e" }}
                onClick={handleUpdateUser}
              >
                Salvar
              </Button>

              <Button
                w="100%"
                mb={6}
                bg="transparent"
                borderWidth={2}
                borderColor="red.500"
                color="red.500"
                _hover={{ bg: "transparent" }}
                onClick={handleLogout}
              >
                Sair da conta
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Sidebar>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/me");
    const user = {
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
      endereco: response.data.endereco,
    };

    return {
      props: {
        user: user,
        premium:
          response.data?.subscriptions?.status === "active" ? true : false,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
});
