/**
 * Formata um valor numérico para moeda brasileira (BRL)
 * @param value Valor numérico a ser formatado
 * @returns String formatada (ex: R$ 10,50)
 */
export const formatCurrencyBRL = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

/**
 * Converte um string de preço para valor numérico
 * @param priceString String de preço (ex: "R$ 10,50" ou "10,50")
 * @returns Valor numérico (ex: 10.5)
 */
export const parseCurrencyValue = (priceString: string): number => {
  // Remove símbolos não numéricos, exceto vírgula e ponto
  const cleanedValue = priceString.replace(/[^0-9,.]/g, "");

  // Substitui vírgula por ponto para parsing correto
  const numericString = cleanedValue.replace(",", ".");

  // Converte para número
  return parseFloat(numericString) || 0;
};
