document.addEventListener("DOMContentLoaded", () => {
  const formEditarSolicitacao = document.getElementById(
    "form-editar-solicitacao"
  );
  const queryParams = new URLSearchParams(window.location.search);
  const idSolicitacao = queryParams.get("id");

  function getToken() {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];
  }

  async function carregarSolicitacao() {
    const token = getToken();

    try {
      const response = await fetch(
        "http://localhost:3000/api/solicitations/all",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao carregar as solicitações.");
      }

      const data = await response.json();
      const solicitacoes = data.solicitacoes;

      const solicitacao = solicitacoes.find(
        (sol) => sol.id_solicitacao === parseInt(idSolicitacao)
      );

      if (!solicitacao) {
        throw new Error("Solicitação não encontrada.");
      }

      document.getElementById("quantidade").value =
        solicitacao.quantidade_taloes || "";
    } catch (error) {
      console.error("Erro ao carregar a solicitação:", error);
      alert("Erro ao carregar a solicitação.");
    }
  }

  formEditarSolicitacao.addEventListener("submit", async (event) => {
    event.preventDefault();

    const quantidade = parseInt(document.getElementById("quantidade").value);
    const token = getToken();

    try {
      const response = await fetch(
        `http://localhost:3000/api/solicitations/editar/${idSolicitacao}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quantidade_taloes: quantidade,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao editar a solicitação.");
      }

      alert("Solicitação editada com sucesso!");
      window.location.href = "/frontEnd/src/pages/solicitacoes/index.html";
    } catch (error) {
      console.error("Erro ao editar a solicitação:", error);
      alert("Erro ao editar a solicitação.");
    }
  });

  carregarSolicitacao();
});
