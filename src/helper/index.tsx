//Formatadores

export function formatDateTime(date: string) {
  return new Date(date).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function formaterPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

import React from "react";
import InputMask from "react-input-mask";
import { Input, FormControl, FormLabel } from "@chakra-ui/react";

interface MaskedInputProps {
  label: string;
  mask: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const MaskedInput: React.FC<MaskedInputProps> = ({
  label,
  mask,
  value,
  onChange,
  placeholder,
}) => (
  <FormControl>
    <FormLabel>{label}</FormLabel>
    <InputMask mask={mask} value={value} onChange={onChange}>
      {(inputProps: any) => <Input {...inputProps} placeholder={placeholder} />}
    </InputMask>
  </FormControl>
);

export default MaskedInput;
