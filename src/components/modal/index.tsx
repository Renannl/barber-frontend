import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Button,
  Flex,
} from "@chakra-ui/react";

import { FiUser, FiScissors, FiCalendar } from "react-icons/fi";
import { FaCalendar, FaMoneyBillAlt } from "react-icons/fa";
import { ScheduleItem } from "../../pages/dashboard";
import { formatDateTime, formaterPrice } from "../../helper";

interface ModalInfoProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  data?: ScheduleItem;
  finishService: () => Promise<void>;
}

export function ModalInfo({
  isOpen,
  onOpen,
  onClose,
  data,
  finishService,
}: ModalInfoProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="barber.400">
        <ModalHeader>Próximo</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Flex align="center" mb={3}>
            <FiUser size={28} color="#FFB13e" />
            <Text ml={3} fontSize="2xl" fontWeight="bold" color="white">
              {data?.customer}
            </Text>
          </Flex>

          <Flex align="center" mb={3}>
            <FiScissors size={28} color="#FFF" />
            <Text ml={3} fontSize="large" fontWeight="bold" color="white">
              {data?.haircut?.name}
            </Text>
          </Flex>

          <Flex align="center" mb={3}>
            <FaMoneyBillAlt size={28} color="#46ef75" />
            <Text ml={3} fontSize="large" fontWeight="bold" color="white">
              {formaterPrice(Number(data?.haircut?.price))}
            </Text>
          </Flex>

          <Flex align="center" mb={3}>
            <FaCalendar size={28} color="#FFb13e" />
            <Text ml={3} fontSize="large" fontWeight="bold" color="white">
              {formatDateTime(data?.dataHora)}
            </Text>
          </Flex>

          <ModalFooter>
            <Button
              bg="button.cta"
              _hover={{ bg: "#FFb13e" }}
              color="#FFF"
              mr={3}
              onClick={() => finishService()}
            >
              Finalizar Serviço
            </Button>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
