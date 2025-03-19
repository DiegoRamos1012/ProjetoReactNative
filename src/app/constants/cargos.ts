export const CARGOS = [
  {
    id: "cliente",
    nome: "Cliente",
    descricao: "Usuário comum da plataforma",
    cor: "#4b5563",
  },
  {
    id: "funcionario",
    nome: "Funcionário",
    descricao: "Funcionário da barbearia com acesso à área administrativa",
    cor: "#047857",
  },
  {
    id: "barbeiro",
    nome: "Barbeiro",
    descricao: "Profissional que realiza os cortes e serviços",
    cor: "#0891b2",
  },
  {
    id: "gerente",
    nome: "Gerente",
    descricao: "Gerente da barbearia com permissões avançadas",
    cor: "#9333ea",
  },
];

export const getCargoById = (id: string) => {
  return CARGOS.find((cargo) => cargo.id === id) || CARGOS[0];
};

export const getCargoNome = (id: string) => {
  const cargo = getCargoById(id);
  return cargo.nome;
};

export const getCargoCor = (id: string) => {
  const cargo = getCargoById(id);
  return cargo.cor;
};

export default {
  CARGOS,
  getCargoById,
  getCargoNome,
  getCargoCor,
};
