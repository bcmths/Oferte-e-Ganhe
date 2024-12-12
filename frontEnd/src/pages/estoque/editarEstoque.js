function getToken() {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1];
}

async function abrirModalEdicao(idEstoque) {
  const token = getToken();

  try {
    const response = await fetch("http://localhost:3000/api/stocks/all", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao carregar a lista de estoques.");
    }

    const { estoques } = await response.json();

    const estoque = estoques.find((e) => e.id_estoque === idEstoque);
    if (!estoque) {
      throw new Error("Estoque não encontrado.");
    }

    document.getElementById("id-estoque-editar").value = estoque.id_estoque;
    document.getElementById("estoque-atual-editar").value =
      estoque.estoque_atual;
    document.getElementById("estoque-minimo-editar").value =
      estoque.estoque_minimo;
    document.getElementById("estoque-recomendado-editar").value =
      estoque.estoque_recomendado;
    carregarLojasEdicao(estoque.loja.id_loja);

    abrirModal("modal-editar-estoque");
  } catch (error) {
    console.error(error);
    alert("Erro ao carregar os dados do estoque.");
  }
}

async function carregarLojasEdicao(idLojaAtual) {
  const token = getToken();
  const lojaSelect = document.getElementById("loja-editar");
  lojaSelect.innerHTML = "";

  try {
    const response = await fetch("http://localhost:3000/api/stores/all", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { lojas } = await response.json();
    lojas.forEach((loja) => {
      const option = document.createElement("option");
      option.value = loja.id_loja;
      option.textContent = loja.nome;
      if (loja.id_loja === idLojaAtual) option.selected = true;
      lojaSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao carregar lojas:", error);
  }
}

function abrirModal(modalId, idEstoque) {
  const modal = document.getElementById(modalId);
  if (modal) {
    document.getElementById(modalId).style.display = "block";
    modal.setAttribute("id-estoque-editar", idEstoque);
  }
}

function fecharModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

document
  .getElementById("editar-estoque-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = getToken();

    const idEstoque = document.getElementById("id-estoque-editar").value;
    const estoqueAtual = document.getElementById("estoque-atual-editar").value;
    const estoqueRecomendado = document.getElementById(
      "estoque-recomendado-editar"
    ).value;
    const estoqueMinimo = document.getElementById(
      "estoque-minimo-editar"
    ).value;
    const loja = document.getElementById("loja-editar").value;

    try {
      const response = await fetch(
        `http://localhost:3000/api/stocks/editar/${idEstoque}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            estoque_atual: estoqueAtual,
            estoque_minimo: estoqueMinimo,
            estoque_recomendado: estoqueRecomendado,
            id_loja: loja,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar o usuário.");
      }

      alert("Estoque atualizado com sucesso!");
      fecharModal("modal-editar-estoque");
      carregarEstoques();
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar o estoque.");
    }
  });

window.abrirModalEdicao = abrirModalEdicao;
window.fecharModal = fecharModal;
