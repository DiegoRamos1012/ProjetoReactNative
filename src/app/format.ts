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

export const formatarData = (data: Date): string => {
  if (!data) return "";

  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(data);
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return data.toString();
  }
};

/**
 * Formata uma data para o formato brasileiro (DD/MM/YYYY)
 * @param date Data a ser formatada (timestamp do Firebase, Date ou string)
 * @param options Opções de formatação
 * @returns String formatada no padrão brasileiro
 */
export const formatDate = (
  date: any,
  options: {
    includeTime?: boolean; // Incluir hora
    includeWeekday?: boolean; // Incluir dia da semana
    shortMonth?: boolean; // Usar mês abreviado
  } = {}
): string => {
  // Opções padrão
  const {
    includeTime = false,
    includeWeekday = false,
    shortMonth = false,
  } = options;

  // Se não houver data, retornar string vazia
  if (!date) return "";

  let dateObj: Date;

  try {
    // Verificar se é um timestamp do Firestore
    if (
      date &&
      typeof date === "object" &&
      date.toDate &&
      typeof date.toDate === "function"
    ) {
      dateObj = date.toDate();
    }
    // Verificar se já é um objeto Date
    else if (date instanceof Date) {
      dateObj = date;
    }
    // Se for string, tentar converter para Date
    else if (typeof date === "string") {
      // Verificar se está no formato brasileiro (DD/MM/YYYY)
      if (/^\d{2}\/\d{2}\/\d{4}/.test(date)) {
        const [day, month, year] = date.split("/").map(Number);
        dateObj = new Date(year, month - 1, day);
      } else {
        // Tentar converter normalmente
        dateObj = new Date(date);
      }
    }
    // Se for timestamp em milissegundos
    else if (typeof date === "number") {
      dateObj = new Date(date);
    } else {
      return "Data inválida";
    }

    // Verificar se a data é válida
    if (isNaN(dateObj.getTime())) {
      return "Data inválida";
    }

    // Array com os nomes dos dias da semana
    const weekdays = [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
    ];

    // Array com os nomes dos meses
    const months = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];

    // Array com os nomes abreviados dos meses
    const shortMonths = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];

    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear();

    let formattedDate = `${day}/${month}/${year}`;

    // Se solicitado incluir dia da semana
    if (includeWeekday) {
      const weekday = weekdays[dateObj.getDay()];
      formattedDate = `${weekday}, ${formattedDate}`;
    }

    // Se solicitado incluir hora
    if (includeTime) {
      const hours = dateObj.getHours().toString().padStart(2, "0");
      const minutes = dateObj.getMinutes().toString().padStart(2, "0");
      formattedDate = `${formattedDate} às ${hours}:${minutes}`;
    }

    // Se solicitado usar mês por extenso
    if (shortMonth) {
      const monthName = shortMonths[dateObj.getMonth()];
      formattedDate = formattedDate.replace(
        `/${month}/`,
        ` de ${monthName} de `
      );
    }

    return formattedDate;
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return "Data inválida";
  }
};

// Cache de formatadores para melhorar performance
const formattersCache: Record<string, Intl.NumberFormat> = {};

/**
 * Formata um valor numérico para moeda brasileira (BRL)
 * @param value Valor a ser formatado
 * @param options Opções de formatação
 * @returns String formatada
 */
export const formatCurrencyBRL = (
  value: number,
  options: {
    showCurrency?: boolean; // Exibir símbolo da moeda (R$)
    decimals?: number; // Número de casas decimais
    showPositiveSign?: boolean; // Mostrar sinal de + para valores positivos
  } = {}
): string => {
  // Opções padrão
  const {
    showCurrency = true,
    decimals = 2,
    showPositiveSign = false,
  } = options;

  // Garantir que o valor seja tratado como número
  const numericValue = Number(value) || 0;

  // Chave para cache baseada nas opções de formatação
  const cacheKey = `${showCurrency}-${decimals}-${showPositiveSign}`;

  // Usar formatador em cache ou criar novo e armazenar
  if (!formattersCache[cacheKey]) {
    formattersCache[cacheKey] = new Intl.NumberFormat("pt-BR", {
      style: showCurrency ? "currency" : "decimal",
      currency: "BRL",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      signDisplay: showPositiveSign ? "always" : "auto",
    });
  }

  // Aplicar formatação
  const formatted = formattersCache[cacheKey].format(numericValue);

  // Caso especial: valor é zero e não queremos mostrar como moeda
  if (numericValue === 0 && !showCurrency) {
    return formatted === "0" ? "0,00" : formatted;
  }

  return formatted;
};

/**
 * Converte um string de preço para valor numérico
 * @param priceString String de preço em qualquer formato
 * @returns Valor numérico preciso
 */
export const parseCurrencyValue = (priceString: string | number): number => {
  // Se já for número, retorna diretamente
  if (typeof priceString === "number") return priceString;

  // Se for string vazia ou undefined
  if (!priceString) return 0;

  // Remove espaços e caracteres não relevantes
  let cleanedValue = priceString
    .toString()
    .replace(/\s/g, "")
    .replace(/[^\d,.+-]/g, "");

  // Capturar sinal negativo do início, se existir
  const isNegative = cleanedValue.startsWith("-");
  if (isNegative) {
    cleanedValue = cleanedValue.substring(1);
  }

  // Detectar o separador decimal (último ponto ou vírgula)
  const lastCommaIndex = cleanedValue.lastIndexOf(",");
  const lastDotIndex = cleanedValue.lastIndexOf(".");

  // Identificar separador decimal (o último a aparecer)
  const decimalIndex = Math.max(lastCommaIndex, lastDotIndex);

  if (decimalIndex !== -1) {
    // Remover todos os separadores exceto o decimal
    const beforeDecimal = cleanedValue
      .substring(0, decimalIndex)
      .replace(/[,.']/g, "");
    const afterDecimal = cleanedValue.substring(decimalIndex + 1);
    // Montar o número com ponto como separador decimal
    cleanedValue = `${beforeDecimal}.${afterDecimal}`;
  } else {
    // Se não houver separador decimal, remover todos
    cleanedValue = cleanedValue.replace(/[,.']/g, "");
  }

  // Converter para número e aplicar sinal
  const result = parseFloat(cleanedValue) || 0;
  return isNegative ? -result : result;
};

// Função para formar preço com formato simplificado (ex: "R$ 199" em vez de "R$ 199,00")
export const formatSimpleCurrency = (value: number): string => {
  const isWholeNumber = value % 1 === 0;
  return formatCurrencyBRL(value, { decimals: isWholeNumber ? 0 : 2 });
};

// Função para formatar valores grandes com sufixos (K, M)
export const formatCompactCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `${formatCurrencyBRL(value / 1000000, { decimals: 1 }).replace(
      ",0",
      ""
    )}M`;
  }
  if (value >= 1000) {
    return `${formatCurrencyBRL(value / 1000, { decimals: 1 }).replace(
      ",0",
      ""
    )}K`;
  }
  return formatCurrencyBRL(value);
};

export default {
  formatPhoneNumber,
  formatBirthDate,
  formatDate,
  formatCurrencyBRL,
  parseCurrencyValue,
  formatSimpleCurrency,
  formatCompactCurrency,
};
