document.addEventListener("DOMContentLoaded", () => {
    const formEditarLoja = document.getElementById("form-editar-loja");
    const queryParams = new URLSearchParams(window.location.search);
    const idLoja = queryParams.get("id");
  
    function getToken() {
      return document.cookie
        .split("; ")
        .find((row) => row.startsWith("authToken="))
        ?.split("=")[1];
    }
  
    async function carregarDadosLoja() {
      const token = getToken();
  
      try {
        const response = await fetch("http://localhost:3000/api/stores/all", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Erro ao carregar as lojas.");
        }
  
        const lojasData = await response.json();
        const lojas = lojasData.lojas
  
        // Filtrar a loja pelo ID
        const loja = lojas.find((loja) => loja.id_loja == idLoja);
  
        if (!loja) {
          throw new Error("Loja não encontrada.");
        }
  
        // Preencher os campos do formulário
        document.getElementById("codigo").value = loja.cod_loja || "";
        document.getElementById("nome").value = loja.nome || "";
        document.getElementById("cidade").value = loja.cidade || "";
      } catch (error) {
        console.error("Erro ao carregar os dados da loja:", error);
        alert("Erro ao carregar os dados da loja.");
      }
    }
  
    formEditarLoja.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const codigo = document.getElementById("codigo").value;
      const nome = document.getElementById("nome").value;
      const cidade = document.getElementById("cidade").value;
  
      const token = getToken();
  
      try {
        const response = await fetch(
          `http://localhost:3000/api/stores/editar/${idLoja}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              cod_loja: codigo,
              nome,
              cidade,
            }),
          }
        );
  
        if (!response.ok) {
          throw new Error("Erro ao editar a loja.");
        }
  
        alert("Loja editada com sucesso!");
        window.location.href = "/frontEnd/src/pages/lojas/index.html";
      } catch (error) {
        console.error("Erro ao editar a loja:", error);
        alert("Erro ao editar a loja.");
      }
    });
  
    carregarDadosLoja();
  });
  