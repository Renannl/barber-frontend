import { useState, ChangeEvent } from "react";
import Head from "next/head";
import { Sidebar } from "../../components/sidebar";
import { Flex, Heading, Button, Input, Select } from "@chakra-ui/react";

import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupAPIClient } from "../../services/api";
import { useRouter } from "next/router";
import { toast } from "sonner";

interface HaircutProps {
  id: string;
  name: string;
  price: string | number;
  status: boolean;
  user_id: string;
}

interface NewProps {
  haircuts: HaircutProps[];
}

export default function New({ haircuts }: NewProps) {
  const [customer, setCustomer] = useState("");
  const [haircutSelected, setHaircutSelected] = useState(haircuts[0]);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);
  const [dataAgendamento, setDataAgendamento] = useState("");
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [email, setEmail] = useState("");
  const [contato, setContato] = useState("");

  const router = useRouter();

  async function buscarHorarios(data: string) {
    try {
      const apiClient = setupAPIClient();
      const response = await apiClient.post("/schedule/times", { data });

      console.log("🔎 Retorno da API:", response.data);

      // Se for array direto
      if (Array.isArray(response.data)) {
        setHorariosDisponiveis(response.data);
      }
      // Se vier dentro de um objeto
      else if (
        response.data.horarios &&
        Array.isArray(response.data.horarios)
      ) {
        setHorariosDisponiveis(response.data.horarios);
      } else {
        setHorariosDisponiveis([]);
        console.warn("Formato inesperado de horários:", response.data);
      }
    } catch (err) {
      console.error("Erro ao buscar horários:", err);
    }
  }

  function handleChangeSelect(id: string) {
    const haircutItem = haircuts.find((item) => item.id === id);
    if (haircutItem) setHaircutSelected(haircutItem);
  }

  function handleHorario(event: ChangeEvent<HTMLSelectElement>) {
    setHorarioSelecionado(event.target.value);
  }

  async function handleRegister() {
    if (customer === "" || !dataAgendamento || !horarioSelecionado) {
      toast.error("Preencha nome, data e horário.");
      return;
    }

    try {
      const apiClient = setupAPIClient();

      // Monta ISO 8601 para o backend (ex.: 2025-09-23T15:00:00.000Z)
      const dataIso = new Date(
        `${dataAgendamento}T${horarioSelecionado}:00`
      ).toISOString();

      await apiClient.post("/schedule", {
        customer,
        haircut_id: haircutSelected?.id,
        clientCelular: contato,
        clientEmail: email,
        dataHora: dataIso,
      });

      toast.success("Agendamento registrado com sucesso!");
      router.push("/dashboard");
    } catch (err) {
      console.log("Erro ao registrar:", err);
      toast.error("Erro ao registrar!");
    }
  }

  return (
    <>
      <Head>
        <title>BarberPro - Novo agendamento</title>
      </Head>
      <Sidebar>
        <Flex direction="column" align="flex-start" justify="flex-start">
          <Heading fontSize="3xl" mt={4} mb={4}>
            Novo agendamento
          </Heading>

          <Flex
            maxW="700px"
            pt={8}
            pb={8}
            width="100%"
            direction="column"
            align="center"
            justify="center"
            bg="barber.400"
          >
            {/* Nome cliente */}
            <Input
              placeholder="Nome do cliente"
              w="85%"
              mb={3}
              size="lg"
              bg="barber.900"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            />

            {/* Corte */}
            <Select
              bg="barber.900"
              mb={3}
              size="lg"
              w="85%"
              value={haircutSelected?.id}
              onChange={(e) => handleChangeSelect(e.target.value)}
            >
              {haircuts?.map((item) => (
                <option
                  style={{ backgroundColor: "#FFF", color: "#000" }}
                  key={item.id}
                  value={item.id}
                >
                  {item.name}
                </option>
              ))}
            </Select>

            {/* Data */}
            <Input
              type="date"
              w="85%"
              mb={3}
              size="lg"
              bg="barber.900"
              value={dataAgendamento}
              onChange={(e) => {
                setDataAgendamento(e.target.value);
                buscarHorarios(e.target.value); // chama backend sempre que muda a data
              }}
            />

            {/* Horários disponíveis */}
            <Select
              bg="barber.900"
              mb={3}
              size="lg"
              w="85%"
              value={horarioSelecionado}
              onChange={handleHorario}
              placeholder="Selecione um horário"
            >
              {horariosDisponiveis.map((hora) => (
                <option
                  style={{ backgroundColor: "#FFF", color: "#000" }}
                  key={hora}
                  value={hora}
                >
                  {hora}
                </option>
              ))}
            </Select>

            {/* Contato */}
            <Input
              placeholder="contato ex: 27 9999-9999"
              w="85%"
              mb={3}
              size="lg"
              type="tel"
              onChange={(e) => setContato(e.target.value)}
            />

            {/* Email */}
            <Input
              placeholder="email"
              w="85%"
              mb={3}
              size="lg"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button
              w="85%"
              size="lg"
              color="gray.900"
              bg="button.cta"
              _hover={{ bg: "#FFb13e" }}
              onClick={handleRegister}
            >
              Cadastrar
            </Button>
          </Flex>
        </Flex>
      </Sidebar>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get("/haircuts", {
    params: { status: true },
  });

  return {
    props: { haircuts: response.data ?? [] },
  };
});
