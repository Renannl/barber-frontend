import { useState, useContext } from "react";
import Head from "next/head";
import logoImg from "../../../public/images/logo.svg";
import Image from "next/image";
import { Flex, Text, Center, Input, Button } from "@chakra-ui/react";
import Link from "next/link";
import { AuthContext } from "../../context/AuthContext";
import { canSSRGuest } from "../../utils/canSSRGuest";
export default function Register() {
  const { signUp } = useContext(AuthContext);
  const [name, setNameBarber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handlerRegister() {
    console.log(name, email, password);
    if (name === "" && email === "" && password === "") {
      return;
    }

    await signUp({
      name,
      email,
      password,
    });
  }
  return (
    <>
      <Head>
        <title>Crie sua conta no BarberPro</title>
      </Head>
      <Flex
        background="barber.900"
        height="100vh"
        alignItems="center"
        justifyContent="center"
        color="#fff"
      >
        <Flex width={640} direction="column" p={14} rounded={8}>
          <Center p={4}>
            <Image
              src={logoImg}
              quality={100}
              objectFit="fill"
              alt="logo barber pro"
              width={240}
            />
          </Center>
          <Input
            background="barber.400"
            variant="filled"
            size="lg"
            placeholder="Nome da barbearia"
            type="text"
            mb={3}
            _hover={{ bg: "#1b1c29" }}
            value={name}
            onChange={(e) => setNameBarber(e.target.value)}
          ></Input>
          <Input
            background="barber.400"
            variant="filled"
            size="lg"
            placeholder="email@email.com"
            type="email"
            mb={3}
            _hover={{ bg: "#1b1c29" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Input>
          <Input
            background="barber.400"
            variant="filled"
            size="lg"
            placeholder="*************"
            type="text"
            mb={6}
            _hover={{ bg: "#1b1c29" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Input>
          <Button
            background="button.cta"
            marginBottom={6}
            color="gray.900"
            size="lg"
            _hover={{ bg: "#ffb13e" }}
            onClick={handlerRegister}
          >
            Cadastrar
          </Button>

          <Center mt={2}>
            <Link href="/login">
              <Text>
                Já possui uma conta?<strong> Faça login</strong>
              </Text>
            </Link>
          </Center>
        </Flex>
      </Flex>
    </>
  );
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {},
  };
});
