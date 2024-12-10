document.addEventListener("DOMContentLoaded", () => {
  const formCadastrarEstoque = document.getElementById(
    "form-cadastrar-estoque"
  );
  const selectLoja = document.getElementById("loja");

  function getToken() {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];
  }

  async function carregarLojasSemEstoque() {
    const token = getToken();

    try {
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
        selectLoja.appendChild(option);
      });
    } catch (error) {
      console.error("Erro ao carregar as lojas sem estoque:", error);
      alert("Erro ao carregar as lojas sem estoque.");
    }
  }

  formCadastrarEstoque.addEventListener("submit", async (event) => {
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
            id_loja: lojaId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao cadastrar o estoque.");
      }

      alert("Estoque cadastrado com sucesso!");
      window.location.href = "/frontEnd/src/pages/estoque/index.html";
    } catch (error) {
      console.error("Erro ao cadastrar o estoque:", error);
      alert("Erro ao cadastrar o estoque.");
    }
  });

  carregarLojasSemEstoque();
});
