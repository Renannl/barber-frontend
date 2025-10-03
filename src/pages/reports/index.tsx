import Head from "next/head";
import { Sidebar } from "../../components/sidebar";
import {
  Button,
  Flex,
  Heading,
  Icon,
  Input,
  Select,
  Text,
  Table,
  Thead,
  Box,
  Divider,
} from "@chakra-ui/react";
import { useState } from "react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { IconType } from "react-icons"; //Tipagem de icones
import { FiClipboard, FiDollarSign } from "react-icons/fi";

//interface propriedades do relatório
interface ReportProps {
  name: string;
  icon: IconType; //<--Import aquii
  value: number;
}

export default function Reports() {
  const [selectDate, setSelectDate] = useState<Date | null>(new Date());

  const reportItems: Array<ReportProps> = [
    // {
    //   name: "Relatório de agendamentos",
    //   icon: FiCalendar,
    // },
    {
      name: "Faturamento Bruto",
      icon: FiDollarSign,
      value: 500.0,
    },
    {
      name: "Faturamento Líquido",
      icon: FiClipboard,
      value: 770.0,
    },
    {
      name: "Faturamento Líquido",
      icon: FiClipboard,
      value: 100,
    },
    {
      name: "Faturamento Líquido",
      icon: FiClipboard,
      value: 100,
    },
  ];
  return (
    <>
      <Head>
        <title>Relatórios - Minha barbearia</title>
      </Head>
      <Sidebar>
        <Flex
          direction="column"
          align="flex-start"
          justify="flex-start"
          justifyContent="flex-start"
          maxW="700px"
        >
          <Heading fontSize="3xl" mt={4} mb={4} mr={4} color="orange.900">
            Relatórios
          </Heading>
          {/*Utilizar o MAP para renderizar as opções do select*/}
          <Flex direction="row" align="center" justify="center" gap={4}>
            <Select>
              <option value="1">Relatório de agendamentos</option>
              <option value="2">Relatório de cortes</option>
              <option value="3">Relatório de clientes</option>
              <option value="4">Relatório de pagamentos</option>
              <option value="5">Relatório de usuários</option>
              <option value="6">Relatório de financeiro</option>
              <option value="7">Relatório de estoque</option>
            </Select>

            {/* Periodo do filtro, logo apos criar uma validação para que a data inicial seja menor que a data final*/}

            <Input type="date" w="300px" placeholder="Data inicial" />
            <Input type="date" w="300px" placeholder="Data final" />

            <Button
              w="300px"
              size="lg"
              color="gray.900"
              bg="button.cta"
              _hover={{ bg: "#FFb13e" }}
            >
              Gerar relatório
            </Button>
          </Flex>
          <Divider margin={8} w="5xl" />
          <Flex
            direction="row"
            align="center"
            justify="center"
            gap={4}
            cursor="pointer"
          >
            {reportItems.map((item) => (
              <Flex
                key={item.name}
                direction="column"
                align="flex-start"
                alignItems="center"
                h="130px"
                w="250px"
                bg="barber.400"
                rounded="8"
                mt={4}
                p={4}
              >
                <Flex gap={4} direction="column">
                  <Flex direction="row" align="center" justify="center">
                    <Icon as={item.icon} size={24} color="#fba931" />
                  </Flex>
                  <Text fontSize="medium" fontWeight="bold">
                    {item.name}
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold">
                    {/*Formatador de moeda - Utilizar o helper para formatar a moeda*/}
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(item.value))}
                  </Text>
                </Flex>
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Sidebar>
    </>
  );
}
