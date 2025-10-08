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
  Center,
} from "@chakra-ui/react";
import { useState } from "react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { IconType } from "react-icons"; //Tipagem de icones
import { FiClipboard, FiDollarSign, FiArchive, FiCalendar, FiEye } from "react-icons/fi";
import { ReportCard } from "../../components/reports/ReportCard";
import { FaFilePdf, FaTicket  } from 'react-icons/fa6';


//interface propriedades do relatório
export interface ReportProps {
  name: string;
  icon: IconType; //<--Import aquii
  value?: number;
  quantity?: number;
}

export default function Reports() {
  const [selectDate, setSelectDate] = useState<Date | null>(new Date());

  const reportItems: Array<ReportProps> = [
    // {
    //   name: "Relatório de agendamentos",
    //   icon: FiCalendar,
    // },
    {
      name: "Clientes atendidos",
      icon: FiEye,
      quantity: 500,
    },
    {
      name: "Ticket Médio",
      icon: FaTicket,
      value: 40,
    },
    {
      name: "Faturamento Líquido",
      icon: FiCalendar,
      value: 100,
    },
    {
      name: "Faturamento Bruto",
      icon: FiArchive,
      value: 1000,
    },
    {
      name: "Faturamento Líquido",
      icon: FiDollarSign,
      value: 700,
    },
  ];
  return (
    <>
      <Head>
        <title>Relatórios - Minha barbearia</title>
      </Head>

      <Sidebar>

          <Heading fontSize="3xl" mt={4} mb={4} mr={4} color="orange.900" >
            Relatórios
          </Heading>
          {/*Utilizar o MAP para renderizar as opções do select*/}
          <Flex direction="row" align="center" gap={4}>

            <Select color="orange.900"  _hover={{ bg: "gray.800" }}>

              <option value="1">Relatório de agendamentos</option>
              <option value="2">Relatório de cortes</option>
              <option value="3">Relatório de clientes</option>
              <option value="4">Relatório de pagamentos</option>
              <option value="5">Relatório de usuários</option>
              <option value="6">Relatório de financeiro</option>
              <option value="7">Relatório de estoque</option>

            </Select>

            {/* Periodo do filtro, logo apos criar uma validação para que a data inicial seja menor que a data final*/}

            <Input type="date" w="300px" placeholder="Data inicial" color="orange.900"  _hover={{ bg: "gray.800" }} />
            <Input type="date" w="300px" placeholder="Data final" color="orange.900"  _hover={{ bg: "gray.800" }} />

            <Button w="300px" size="lg" color="gray.900" bg="button.cta" _hover={{ bg: "#FFb13e" }}>
              Gerar relatório
            </Button>

          </Flex>

          <Divider position="relative" my={8}/>

          <Flex direction="row" wrap="wrap" gap={4} justify="center"> 
            {reportItems.map((item, idx) => ( 
            <ReportCard key={idx} item={item} />
            ))}
          </Flex>

          <Flex justify="flex-end" marginTop="10">
            <Button leftIcon={<Icon as={FaFilePdf} w={5} h={5} />} w="200px" size="lg" color="gray.900" bg="button.cta" _hover={{ bg: "#FFb13e" }}>
              Exportar relatório
            </Button>
          </Flex>

      </Sidebar>
    </>
  );
}
