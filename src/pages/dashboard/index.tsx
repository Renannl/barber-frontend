import { useState } from "react";
import Head from "next/head";
import {
  Flex,
  Text,
  Heading,
  Button,
  Container,
  Link as ChakraLink,
  useMediaQuery,
  useDisclosure,
} from "@chakra-ui/react";

import Link from "next/link";
import { IoMdPerson } from "react-icons/io";

import { canSSRAuth } from "../../utils/canSSRAuth";
import { Sidebar } from "../../components/sidebar";
import { setupAPIClient } from "../../services/api";
import { ModalInfo } from "../../components/modal";
import { FaTelegram, FaMobileAlt  } from 'react-icons/fa';

export interface ScheduleItem {
  id: string;
  customer: string;
  // Datas/horários
  dataHora?: string; // ex: "2025-09-24 14:00:00" ou "2025-09-24T14:00:00Z"
  date?: string; // ex: "2025-09-24"
  time?: string; // ex: "14:00"
  horario?: string; // ex: "14:00"
  data?: string; // ex: "2025-09-24"
  scheduled_at?: string; // ex: ISO string
  status?: string;
  source: string;
  haircut: {
    id: string;
    name: string;
    price: string | number;
    user_id: string;
  };
}

export interface TelegramScheduleItem extends ScheduleItem {
  customerName: string;
  scheduledAt: Date;
}

interface DashboardProps {
  schedule: ScheduleItem[];
}

export default function Dashboard({ schedule }: DashboardProps) {
  // Os schedules já vêm filtrados do servidor (apenas com status 'active')
  const [list, setList] = useState(schedule);
  const [service, setService] = useState<ScheduleItem>();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isMobile] = useMediaQuery("(max-width: 500px)");

  function handleOpenModal(item: ScheduleItem) {
    setService(item);
    onOpen();
  }

  function getDateTime(item: ScheduleItem) {
    // Tenta compor a partir de campos separados
    const dateStr = item.date || item.data;
    const timeStr = item.time || item.horario;
    const combined =
      item.dataHora ||
      item.scheduled_at ||
      (dateStr && timeStr ? `${dateStr} ${timeStr}` : undefined);

    if (!combined && !dateStr && !timeStr) {
      return { displayDate: "", displayTime: "" };
    }

    // Se temos data e hora separados
    if (dateStr && timeStr && !item.dataHora && !item.scheduled_at) {
      return {
        displayDate: formatDate(dateStr),
        displayTime: formatTime(timeStr),
      };
    }

    // Caso tenhamos um datetime único
    const dateObj = parseDate(combined as string);
    if (!dateObj) {
      return {
        displayDate: dateStr ? formatDate(dateStr) : "",
        displayTime: timeStr ? formatTime(timeStr) : "",
      };
    }

    return {
      displayDate: dateObj.toLocaleDateString("pt-BR"),
      displayTime: dateObj.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  }

  function parseDate(input: string | undefined) {
    if (!input) return undefined;
    // Normaliza espaço para "T" se vier como "YYYY-MM-DD HH:mm:ss"
    const normalized =
      input.includes(" ") && !input.includes("T")
        ? input.replace(" ", "T")
        : input;
    const d = new Date(normalized);
    return isNaN(d.getTime()) ? undefined : d;
  }

  function formatDate(d: string) {
    // d esperado: YYYY-MM-DD
    const parts = d.split("-");
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    // fallback
    const dateObj = parseDate(d);
    return dateObj ? dateObj.toLocaleDateString("pt-BR") : d;
  }

  function formatTime(t: string) {
    // t esperado: HH:mm ou HH:mm:ss
    const [hh, mm] = t.split(":");
    if (hh && mm) return `${hh}:${mm}`;
    return t;
  }

  async function handleFinish(id: string) {
    try {
      const apiClient = setupAPIClient();
      await apiClient.put("/schedule", {
        schedule_id: id,
        status: "inactive",
      });

      const filterItem = list.filter((item) => {
        return item?.id !== id && item?.status !== "inactive";
        // item?.id !== id;
      });

      setList(filterItem);
      onClose();
    } catch (err) {
      console.log(err);
      onClose();
      import("sonner").then(({ toast }) =>
        toast.error("Erro ao finalizar este serviço")
      );
    }
  }

  return (
    <>
      <Head>
        <title>BarberPRO - Minha barbearia</title>
      </Head>
      <Sidebar>
        <Flex direction="column" align="flex-start" justify="flex-start">
          <Flex w="100%" direction="row" align="center" justify="flex-start">
            <Heading fontSize="3xl" mt={4} mb={4} mr={4}>
              Agenda
            </Heading>
            <Button
              as={Link}
              href="/new"
              bg="button.cta"
              _hover={{ background: "#FFB13E" }}
            >
              Registrar
            </Button>
          </Flex>
          {/* Lista de agendamentos - mostra apenas schedules com status 'active' */}
          {list.map((item) => {
            const { displayDate, displayTime } = getDateTime(item);
            return (
              <ChakraLink
                onClick={() => handleOpenModal(item)}
                key={item?.id}
                w="100%"
                m={0}
                p={0}
                mt={1}
                bg="transparent"
                style={{ textDecoration: "none" }}
              >
                <Flex
                  w="100%"
                  direction={isMobile ? "column" : "row"}
                  p={4}
                  rounded={4}
                  mb={2}
                  bg="barber.400"
                  align={isMobile ? "center" : "center"}
                  justifyContent={isMobile ? "center" : "space-between"}
                  textAlign={"center"}
                  gap={10}
                >
                  
                  <Flex
                    direction="row"
                    mb={isMobile ? 0 : 0}
                    align="center"
                    justify={isMobile ? "center" :"flex-start"}
                    textAlign="center"
                    w="100%"
                  >
                      <IoMdPerson  size={30} color="#f1f1f1" />
                      <Container
                        w="fit-content"
                        textAlign="center"
                        ml={isMobile ? 2 : 4}
                        p={0}
                        m={0}
                      >
                      <Text
                        fontWeight="bold"
                        noOfLines={1}
                        ml={isMobile ? "0" : "3"}
                        textAlign="center"
                        w="100%"
                      >
                        {item?.customer}
                      </Text>
                    </Container>
                  </Flex>
                  <Container minW='30px' textAlign="center">
                    <Text fontWeight="bold" mb={isMobile ? 0 : 0}>
                      {item?.haircut?.name}
                    </Text>
                  </Container>
                  <Container minW='30px' textAlign="center">
                    <Text fontWeight="bold" mb={isMobile ? 0 : 0}>
                      R$ {item?.haircut?.price}
                    </Text>
                  </Container>
                  <Container minW='30px' textAlign="center" justifyItems="center">
                    <Text fontSize="sm" color="gray.300">
                      {item.source === "telegram" ? <FaTelegram size={30} color="#0088cc" /> : <FaMobileAlt size={30} /> }
                    </Text>
                  </Container>
                  {(displayDate || displayTime) && (  
                    <Flex
                      direction={"column"}
                      align={isMobile ? "flex-start" : "flex-end"}
                    >
                      {displayDate && (
                        <Container minW='30px' textAlign="center">
                          <Text fontWeight="bold" mb={isMobile ? 0 : 0}>
                            {displayDate}
                          </Text>
                        </Container>
                      )}
                      {displayTime && (
                        <Container minW='30px' textAlign="center">
                          <Text fontWeight="bold">{displayTime}</Text>
                        </Container>
                      )}
                    </Flex>
                  )}
                </Flex>
              </ChakraLink>
            );
          })}
        </Flex>
      </Sidebar>
      <ModalInfo
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        data={service}
        finishService={() => {
          if (service?.id) {
            return handleFinish(service.id);
          }
          return Promise.resolve();
        }}
      />
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);

    const [response, telegramResponse] = await Promise.all([
      apiClient.get("/schedule"),
      apiClient.get("/telegramlist"),
    ]);

    // Filtrar schedules no servidor para otimizar performance
    // Apenas schedules com status 'active' serão enviados para o cliente
    const activeSchedules = response.data.filter(
      (item: ScheduleItem) => item.status === "active"
    );

    const activeTelegram = telegramResponse.data.filter(
      (item: TelegramScheduleItem) => item.status === "accepted"
    );

    const normalizedApp: ScheduleItem[] = activeSchedules.map((item: ScheduleItem) => ({
      id: item.id,
      customer: item.customer || "Cliente",
      haircut: {
        id: item.haircut?.id,
        name: item.haircut?.name,
        price: item.haircut?.price,
      },
      scheduled_at: item.dataHora,
      status: item.status,
      source: "app",
    }));

    const normalizedTelegram: TelegramScheduleItem[] = activeTelegram.map((item: TelegramScheduleItem) => ({
      id: item.id,
      customer: item.customerName || "Cliente Telegram",
      haircut: {
        id: "telegram",
        name: item.haircut?.name,
        price: item.haircut?.price,
      },
      scheduled_at: item.scheduledAt,
      status: item.status,
      source: "telegram",
    }));

    const unified: ScheduleItem[] = [...normalizedApp, ...normalizedTelegram].sort(
      (a, b) => 
        new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
    );
    
    return {
      props: {
        schedule: unified,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      props: {
        schedule: [],
      },
    };
  }
});
