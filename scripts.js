import moment from './node_modules/moment/moment.js';


const nome = document.querySelector(".inputNome");
const nascimento = document.querySelector(".nascimento");
const botao = document.querySelector("button");
const tabela = document.querySelector("table");

const pegaDados = () => {
  return JSON.parse(localStorage.getItem("pessoas")) || [];
};

const mostraDados = () => {
  const pessoas = pegaDados();
  pessoas.map((pessoa) => criarLinha(pessoa));
};

const atualizarDados = (pessoas) => {
  localStorage.setItem("pessoas", JSON.stringify(pessoas));
};

const limparInput = () => {
  nome.value = "";
  nascimento.value = "";
};
// função para formatar a data de nascimento de AAAA-MM-DD para DD mês com três primeiras letras AAAA

const formatBornDate = (date) => {
  const dataLocal = moment(date);
  return dataLocal.format("DD [de] MMM [de] YYYY");
};

const cadastrar = () => {
  const pessoas = pegaDados();
  const dado = {
    nome: nome.value,
    nascimento: formatBornDate(nascimento.value),
  };

  criarLinha(dado);
  pessoas.push(dado);
  atualizarDados(pessoas);
};

const editar = (elemento) => {
  const pessoas = pegaDados();
  botao.innerHTML = "Atualizar";

  nome.value = elemento.nome;
  nascimento.value = elemento.nascimento;

  botao.removeEventListener("click", cadastrar);
  botao.addEventListener("click", () => {
    pessoas.map((item) => {
      if (elemento.nome == item.nome) {
        item.nome = nome.value;
        item.nascimento = nascimento.value;
      }
    });
    atualizarDados(pessoas);
    limparInput();
    document.location.reload(true);
  });
};

const deletar = (elemento) => {
  const pessoas = tabela.childNodes;
  const pes = [...pessoas].forEach((item) => {
    const nomeAtual = item.firstChild;
    if (nomeAtual && nomeAtual.innerText === elemento.nome) {
      item.remove();
    }
  });
  const dados = pegaDados().filter((item) => item.nome != elemento.nome);
  atualizarDados(dados);
};

const criarLinha = (elemento) => {
  const item = document.createElement("tr");

  const nomeAtual = document.createElement("td");
  nomeAtual.innerText = elemento.nome;
  item.appendChild(nomeAtual);

  const nascimentoAtual = document.createElement("td");
  nascimentoAtual.innerText = elemento.nascimento;
  item.appendChild(nascimentoAtual);

  const botaoExcluir = document.createElement("i");
  botaoExcluir.classList.add("fa-solid");
  botaoExcluir.classList.add("fa-trash");
  botaoExcluir.addEventListener("click", () => deletar(elemento));
  item.appendChild(botaoExcluir);

  const botaoEditar = document.createElement("i");
  botaoEditar.classList.add("fa-solid");
  botaoEditar.classList.add("fa-pen-to-square");
  botaoEditar.addEventListener("click", () => editar(elemento));
  item.appendChild(botaoEditar);

  tabela.appendChild(item);

  limparInput();
};

mostraDados();
botao.addEventListener("click", cadastrar);
