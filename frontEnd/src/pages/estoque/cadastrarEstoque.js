function getToken() {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1];
}

document
  .getElementById("novo-estoque-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const loja = document.getElementById("loja").value;
    const estoqueAtual = document.getElementById("estoque-atual").value;
    console.log(estoqueAtual);    
    const estoqueMinimo = document.getElementById("estoque-minimo").value;
    const estoqueRecomendado = document.getElementById(
      "estoque-recomendado"
    ).value;

    try {
      const token = getToken();

      const response = await fetch(
        "http://localhost:3000/api/stocks/cadastrar",
        {
          method: "POST",
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
        throw new Error("Erro ao cadastrar usuário.");
      }

      alert("Estoque cadastrado com sucesso!");
      fecharModal("modal-novo-estoque");
      document.getElementById("novo-estoque-form").reset();
      carregarEstoques();
    } catch (error) {
      console.error("Erro ao cadastrar estoque:", error);
      alert("Erro ao cadastrar estoque.");
    }
  });

async function carregarEstoques() {
  const token = getToken();
  const tabelaEstoques = document.getElementById("tabela-estoques");

  try {
    const response = await fetch("http://localhost:3000/api/stocks/all", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao carregar os estoques.");
    }

    const { estoques } = await response.json();
    estoques.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    tabelaEstoques.innerHTML = "";

    estoques.forEach((estoque) => {
      const statusClass =
        estoque.estoque_atual < estoque.estoque_minimo
          ? "warning red"
          : estoque.estoque_atual < estoque.estoque_recomendado
          ? "warning"
          : "";

      const tr = document.createElement("tr");
      tr.innerHTML = `
          <td>${estoque.loja.nome}</td>
          <td>
            <span class="${statusClass}">${estoque.estoque_atual}${
        statusClass ? " ⚠️" : ""
      }</span>
          </td>
          <td>${estoque.estoque_minimo}</td>
          <td>${estoque.estoque_recomendado}</td>
          <td>
            <button class="edit-btn" onclick="abrirModalEdicao(${
              estoque.id_estoque
            })">✏️</button>
            <button class="delete-btn" onclick="deletarEstoque(${
              estoque.id_estoque
            })">🗑️</button>
          </td>
        `;
      tabelaEstoques.appendChild(tr);
    });
  } catch (error) {
    console.error("Erro ao carregar os estoques:", error);
  }
}

async function carregarLojasSemEstoque() {
  const token = getToken();
  const lojaSelect = document.getElementById("loja");
  lojaSelect.innerHTML =
    '<option value="" disabled selected>Selecione uma loja</option>';

  try {
    const lojasResponse = await fetch("http://localhost:3000/api/stores/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!lojasResponse.ok) {
      throw new Error("Erro ao carregar as lojas.");
    }

    const lojasData = await lojasResponse.json();
    const lojas = lojasData.lojas;

    const estoquesResponse = await fetch(
      "http://localhost:3000/api/stocks/all",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!estoquesResponse.ok) {
      throw new Error("Erro ao carregar os estoques.");
    }

    const estoquesData = await estoquesResponse.json();
    const estoques = estoquesData.estoques;

    const lojasSemEstoque = lojas.filter(
      (loja) => !estoques.some((estoque) => estoque.id_loja === loja.id_loja)
    );

    lojasSemEstoque.forEach((loja) => {
      const option = document.createElement("option");
      option.value = loja.id_loja;
      option.textContent = loja.nome;
      lojaSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao carregar as lojas sem estoque:", error);
    alert("Erro ao carregar as lojas sem estoque.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  carregarLojasSemEstoque();
});

function fecharModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}
