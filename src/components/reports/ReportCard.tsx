import { Flex, Text, Icon } from "@chakra-ui/react";
import { ReportProps } from "../../pages/reports";

export function ReportCard({ item }: { item: ReportProps }) {
    return (

    <Flex direction="column" align="center" textAlign="center" h="130px" w="250px" bg="barber.400" rounded="8" mt={4} p={4} cursor="pointer">

        <Flex gap={3} direction="column" align="center">

            <Icon as={item.icon} boxSize={6} color="#fba931" />

            <Text fontSize="medium" fontWeight="bold">
            {item.name}
            </Text>

            <Text fontSize="2xl" fontWeight="bold">
            {item.value ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.value) : item.quantity}
            </Text>

        </Flex>

    </Flex>

    );
}
