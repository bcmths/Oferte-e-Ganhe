document.addEventListener("DOMContentLoaded", () => {
  const formEditarEstoque = document.getElementById("form-editar-estoque");
  const selectLoja = document.getElementById("loja");
  const queryParams = new URLSearchParams(window.location.search);
  const idEstoque = queryParams.get("id");

  function getToken() {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];
  }

  async function carregarLojasEEstoque() {
    const token = getToken();

    try {
      // Fetch para obter todos os estoques
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

      // Filtrar o estoque pelo ID
      const estoque = estoques.find(
        (estoque) => estoque.id_estoque === parseInt(idEstoque)
      );

      if (!estoque) {
        throw new Error("Estoque não encontrado.");
      }

      // Fetch para obter todas as lojas
      const lojasResponse = await fetch(
        "http://localhost:3000/api/stores/all",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!lojasResponse.ok) {
        throw new Error("Erro ao carregar as lojas.");
      }

      const lojasData = await lojasResponse.json();
      const lojas = lojasData.lojas;

      // Preencher o select com as lojas
      lojas.forEach((loja) => {
        const option = document.createElement("option");
        option.value = loja.id_loja;
        option.textContent = loja.nome;
        if (loja.id_loja === estoque.id_loja) {
          option.selected = true;
        }
        selectLoja.appendChild(option);
      });

      // Preencher os campos do formulário
      document.getElementById("estoque-atual").value = estoque.estoque_atual;
      document.getElementById("estoque-minimo").value = estoque.estoque_minimo;
      document.getElementById("estoque-recomendado").value =
        estoque.estoque_recomendado;
    } catch (error) {
      console.error("Erro ao carregar os dados:", error);
      alert("Erro ao carregar os dados.");
    }
  }

  formEditarEstoque.addEventListener("submit", async (event) => {
    event.preventDefault();

    const lojaId = selectLoja.value;
    const estoqueAtual = document.getElementById("estoque-atual").value;
    const estoqueMinimo = document.getElementById("estoque-minimo").value;
    const estoqueRecomendado = document.getElementById(
      "estoque-recomendado"
    ).value;

    const token = getToken();

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
            id_loja: lojaId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao editar o estoque.");
      }

      alert("Estoque atualizado com sucesso!");
      window.location.href = "/frontEnd/src/pages/estoque/index.html";
    } catch (error) {
      console.error("Erro ao editar o estoque:", error);
      alert("Erro ao editar o estoque.");
    }
  });

  carregarLojasEEstoque();
});
