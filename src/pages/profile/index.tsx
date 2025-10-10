import { useContext, useState } from "react";
import Head from "next/head";
import {
  Flex,
  Text,
  Heading,
  Box,
  Input,
  Button,
  Checkbox,
} from "@chakra-ui/react";
import { Sidebar } from "../../components/sidebar";

import Link from "next/link";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { AuthContext } from "../../context/AuthContext";
import { setupAPIClient } from "../../services/api";
import { FaTelegram } from "react-icons/fa";
import { redirect } from "next/dist/server/api-utils";
import { ChangeEvent } from "react";
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
  const { logoutUser } = useContext(AuthContext);

  const [name, setName] = useState(user && user?.name);
  const [endereco, setEndereco] = useState(
    user?.endereco ? user?.endereco : ""
  );
  const [checked, setChecked] = useState("");

  console.log(checked);

  function joinTelegram() {
    window.open("https://t.me/barber_appointmentsBot", "_blank");
  }

  function myCheckBox() {
    if (checked === "enabled") {
      setChecked("disabled");
    } else {
      setChecked("enabled");
    }
  }

  async function handleLogout() {
    await logoutUser();
  }

  async function handleUpdateUser() {
    if (name === "") {
      return;
    }

    try {
      const apiClient = setupAPIClient();
      await apiClient.put("/users", {
        name: name,
        endereco: endereco,
      });

      alert("Dados alterados com sucesso!");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Head>
        <title>Minha Conta - BarberPRO</title>
      </Head>
      <Sidebar>
        <Flex
          direction="column"
          alignItems="flex-start"
          justifyContent="flex-start"
        >
          <Flex
            w="100%"
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
          >
            <Heading fontSize="3xl" mt={4} mb={4} mr={4} color="orange.900">
              Minha Conta
            </Heading>
          </Flex>

          <Flex
            pt={8}
            pb={8}
            background="barber.400"
            maxW="700px"
            w="100%"
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Flex direction="column" w="85%">
              <Text mb={2} fontSize="xl" fontWeight="bold" color="white">
                Nome da Empresa:
              </Text>
              <Input
                w="100%"
                background="gray.900"
                placeholder="Nome da sua barbearia"
                size="lg"
                type="text"
                mb={3}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Text mb={2} fontSize="xl" fontWeight="bold" color="white">
                Endereço:
              </Text>
              <Input
                w="100%"
                background="gray.900"
                placeholder="Endereço da barbearia"
                size="lg"
                type="text"
                mb={3}
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
              />
              {/*Renderizacão condicional para visualizar o solicita agendamentos*/}

              {premium && (
                <Flex direction="column">
                  <Text mb={2} fontSize="xl" fontWeight="bold" color="white">
                    Solicita agendamentos:
                  </Text>
                  <Checkbox
                    w="100%"
                    h="14"
                    borderRadius={6}
                    mb={3}
                    size="lg"
                    colorScheme="yellow"
                    isChecked={checked === "enabled"}
                    onChange={myCheckBox}
                  >
                    Sim
                  </Checkbox>
                  {checked === "enabled" && (
                    <Button
                      w="100%"
                      mb={3}
                      bg="#27A6E6"
                      size="lg"
                      flex="start"
                      gap={2}
                      _hover={{ bg: "#27A6E6", color: "#FFF" }}
                      onClick={joinTelegram}
                    >
                      BOT
                      <FaTelegram
                        size={20}
                        color="#FFF"
                        onAnimationEnd={joinTelegram}
                      />
                    </Button>
                  )}
                  <Flex
                    direction="row"
                    w="100%"
                    mb={3}
                    p={1}
                    borderWidth={1}
                    rounded={6}
                    background="barber.900"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Text
                      p={2}
                      fontSize="lg"
                      color={premium ? "#FBA931" : "#4dffb4"}
                    >
                      Editar Landing Page
                    </Text>

                    <Link href="/landingPage">
                      <Box
                        cursor="pointer"
                        p={1}
                        pl={2}
                        pr={2}
                        background="#00cd52"
                        rounded={10}
                        color="white"
                      >
                        Editar
                      </Box>
                    </Link>
                  </Flex>
                </Flex>
              )}
              <Text mb={2} fontSize="xl" fontWeight="bold" color="white">
                Plano Atual:
              </Text>

              <Flex
                direction="row"
                w="100%"
                mb={3}
                p={1}
                borderWidth={1}
                rounded={6}
                background="barber.900"
                alignItems="center"
                justifyContent="space-between"
              >
                <Text
                  p={2}
                  fontSize="lg"
                  color={premium ? "#FBA931" : "#4dffb4"}
                >
                  Plano {premium ? "Premium" : "Grátis"}
                </Text>

                <Link href="/planos">
                  <Box
                    cursor="pointer"
                    p={1}
                    pl={2}
                    pr={2}
                    background="#00cd52"
                    rounded={10}
                    color="white"
                  >
                    Mudar plano
                  </Box>
                </Link>
              </Flex>

              <Button
                w="100%"
                mt={3}
                mb={4}
                bg="button.cta"
                size="lg"
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
                size="lg"
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
      endereco: response.data?.endereco,
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
