const [nome, nascimento] = document.querySelectorAll("input");
const botao = document.querySelector("button");
const tabela = document.querySelector("table");
const form = document.querySelector("form");

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
  if (nome && nascimento) {
    nome.value = "";
    nascimento.value = "";
  }
};
const formatBornDate = (date) => {
  const dataLocal = moment(date);
  if (!dataLocal.isValid()) {
    console.error("Data inválida!");
    return "";
  }
  return dataLocal.format("DD [de] MMM [de] YYYY");
};

const cadastrar = (e) => {
  e.preventDefault();
  const pessoas = pegaDados();
  const dado = {
    nome: nome.value,
    nascimento: nascimento.value,
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

  form.removeEventListener("submit", cadastrar);
  form.addEventListener("submit", e => {
    e.preventDefault()
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
  nascimentoAtual.innerText = formatBornDate(elemento.nascimento);
  item.appendChild(nascimentoAtual);

  const acoes = document.createElement("td");
  acoes.classList.add("flex", "gap-4");

  const botaoExcluir = document.createElement("i");
  botaoExcluir.classList.add("fa-solid", "cursor-pointer", "fa-trash");
  botaoExcluir.addEventListener("click", () => deletar(elemento));
  acoes.appendChild(botaoExcluir);

  const botaoEditar = document.createElement("i");
  botaoEditar.classList.add("fa-solid", "fa-pen-to-square", "cursor-pointer");
  botaoEditar.addEventListener("click", () => editar(elemento));
  acoes.appendChild(botaoEditar);

  item.appendChild(acoes);
  tabela.appendChild(item);

  limparInput();
};

mostraDados();
form.addEventListener("submit", cadastrar);
