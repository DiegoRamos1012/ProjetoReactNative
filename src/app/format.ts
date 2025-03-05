// Arquivo de funções de formatação de dados

export const formatPhoneNumber = (value: string) => {
  // Remove non-digit characters
  const cleanedValue = value.replace(/\D/g, "");

  // Phone formatting with simple structure
  if (cleanedValue.length <= 2) {
    return cleanedValue;
  }
  if (cleanedValue.length <= 7) {
    return `(${cleanedValue.slice(0, 2)}) ${cleanedValue.slice(2)}`;
  }
  return `(${cleanedValue.slice(0, 2)}) ${cleanedValue.slice(
    2,
    7
  )}-${cleanedValue.slice(7, 11)}`;
};

export const formatBirthDate = (value: string) => {
  // Remove non-digit characters
  const cleanedValue = value.replace(/\D/g, "");

  // Limit to 8 digits (DD/MM/YYYY)
  const limitedValue = cleanedValue.slice(0, 8);

  // Format date in Brazilian format (DD/MM/YYYY)
  if (limitedValue.length <= 2) {
    return limitedValue;
  }
  if (limitedValue.length <= 4) {
    return `${limitedValue.slice(0, 2)}/${limitedValue.slice(2)}`;
  }
  return `${limitedValue.slice(0, 2)}/${limitedValue.slice(
    2,
    4
  )}/${limitedValue.slice(4)}`;
};
