import { useState, ChangeEvent, useEffect } from "react";
import Head from "next/head";
import { Flex, Heading, Button, Input, Select, Text } from "@chakra-ui/react";
// Página pública: não usa Sidebar autenticado
import { toast } from "sonner";

export default function SimularAgendamento() {
  // Valores estáticos solicitados
  const [nome, setNome] = useState("Ronaldin do inguiça");
  const [email, setEmail] = useState("brenodesouzaeler@gmail.com");
  const [telefone, setTelefone] = useState("27981235799");
  const [chatId, setChatId] = useState("1992351796");
  const [data, setData] = useState("2025-09-25");
  const [horario, setHorario] = useState("14:30");
  const [userId, setUserId] = useState("2d813ce9-2978-4167-a8b8-fde1e7df184f");
  const [haircuts, setHaircuts] = useState([
    { id: "3954661d-a2ec-427f-a3eb-5404f6c97ca6", name: "Corte selecionado" },
  ]);
  const [haircutId, setHaircutId] = useState<string>(
    "3954661d-a2ec-427f-a3eb-5404f6c97ca6"
  );
  const [loadingCuts, setLoadingCuts] = useState(false);
  const [cutsError, setCutsError] = useState<string | null>(null);
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

  useEffect(() => {
    async function fetchCuts() {
      setLoadingCuts(true);
      setCutsError(null);
      try {
        const url = new URL("/haircuts", apiBase);
        url.searchParams.set("status", "true");
        const res = await fetch(url.toString());
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        const mapped = list.map((i: any) => ({ id: i.id, name: i.name }));
        const hasSelected = mapped.some((i: any) => i.id === haircutId);
        const finalList =
          hasSelected || !haircutId
            ? mapped
            : [{ id: haircutId, name: "Corte selecionado" }, ...mapped];
        setHaircuts(finalList);
        if (
          (!haircutId || String(haircutId).trim() === "") &&
          finalList.length > 0
        ) {
          setHaircutId(finalList[0].id);
        }
      } catch (e) {
        setCutsError("Não foi possível carregar os cortes.");
        setHaircuts([]);
      } finally {
        setLoadingCuts(false);
      }
    }
    fetchCuts();
  }, []);

  async function handleSubmit() {
    // Fallback: se haircutId vazio mas há itens, seleciona o primeiro
    if (String(haircutId).trim() === "" && haircuts.length > 0) {
      setHaircutId(haircuts[0].id);
    }

    const missing: string[] = [];
    if (String(chatId).trim() === "") missing.push("chatId");
    if (nome.trim() === "") missing.push("nome");
    if (email.trim() === "") missing.push("email");
    if (telefone.trim() === "") missing.push("telefone");
    if (data.trim() === "") missing.push("data");
    if (horario.trim() === "") missing.push("horário");
    if (userId.trim() === "") missing.push("user_id");
    if (String(haircutId).trim() === "") missing.push("haircutId");

    if (missing.length > 0) {
      console.log("Campos faltando:", {
        chatId,
        nome,
        email,
        telefone,
        data,
        horario,
        userId,
        haircutId,
      });
      toast.error(`Preencha: ${missing.join(", ")}`);
      return;
    }

    try {
      const dataIso = new Date(`${data}T${horario}:00`).toISOString();

      const res = await fetch(`${apiBase}/simular-agendamento`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: Number(chatId),
          nameClient: nome,
          customerContact: telefone,
          customerEmail: email,
          scheculeDateTime: dataIso,
          user_id: userId,
          haircutId: haircutId,
        }),
      });
      if (!res.ok) throw new Error("Request failed");

      toast.success("Solicitação enviada! Aguardando aprovação do barbeiro.");
      setNome("");
      setEmail("");
      setTelefone("");
      setChatId("");
      setData("");
      setHorario("");
      setHaircutId("");
    } catch (err) {
      console.log(err);
      toast.error("Erro ao enviar solicitação.");
    }
  }

  return (
    <>
      <Head>
        <title>Solicitar agendamento</title>
      </Head>
      <Flex
        minH="100vh"
        bg="barber.900"
        direction="column"
        align="center"
        justify="flex-start"
        p={4}
      >
        <Heading fontSize="3xl" mt={4} mb={4}>
          Solicitar agendamento
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
          <Text mb={4} w="85%">
            O pedido ficará em análise até o barbeiro aprovar.
          </Text>

          <Input
            placeholder="Chat ID (ex.: Telegram)"
            w="85%"
            mb={3}
            size="lg"
            bg="barber.900"
            type="number"
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
          />
          <Input
            placeholder="Nome"
            w="85%"
            mb={3}
            size="lg"
            bg="barber.900"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <Input
            placeholder="Email"
            w="85%"
            mb={3}
            size="lg"
            bg="barber.900"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Telefone"
            w="85%"
            mb={3}
            size="lg"
            bg="barber.900"
            type="tel"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
          <Input
            placeholder="User ID do barbeiro"
            w="85%"
            mb={3}
            size="lg"
            bg="barber.900"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />

          <Input
            type="date"
            w="85%"
            mb={3}
            size="lg"
            bg="barber.900"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />

          <Input
            type="time"
            w="85%"
            mb={3}
            size="lg"
            bg="barber.900"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
          />

          <Select
            bg="barber.900"
            color="white"
            mb={3}
            size="lg"
            w="85%"
            placeholder={
              loadingCuts ? "Carregando cortes..." : "Selecione um corte"
            }
            value={haircutId}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setHaircutId(e.target.value)
            }
            isDisabled={loadingCuts}
          >
            {cutsError && (
              <option
                value=""
                style={{ backgroundColor: "#FFF", color: "#000" }}
              >
                {cutsError}
              </option>
            )}
            {!cutsError && !loadingCuts && haircuts.length === 0 && (
              <option
                value=""
                style={{ backgroundColor: "#FFF", color: "#000" }}
              >
                Nenhum corte disponível
              </option>
            )}
            {haircuts.map((h) => (
              <option
                key={h.id}
                value={h.id}
                style={{ backgroundColor: "#FFF", color: "#000" }}
              >
                {h.name}
              </option>
            ))}
          </Select>

          <Button
            w="85%"
            size="lg"
            color="gray.900"
            bg="button.cta"
            _hover={{ bg: "#FFb13e" }}
            onClick={handleSubmit}
          >
            Solicitar
          </Button>
        </Flex>
      </Flex>
    </>
  );
}
