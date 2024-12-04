document.addEventListener("DOMContentLoaded", () => {
  const formCadastrarEnvio = document.getElementById("form-cadastrar-envio");
  const selectSolicitacao = document.getElementById("solicitacao");

  function getToken() {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];
  }

  async function carregarSolicitacoes() {
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
        throw new Error("Erro ao carregar solicitações.");
      }

      const data = await response.json();
      const solicitacoes = data.solicitacoes;

      solicitacoes.forEach((solicitacao) => {
        const option = document.createElement("option");
        option.value = solicitacao.id_solicitacao;
        option.textContent = `ID: ${solicitacao.id_solicitacao} - ${solicitacao.usuario.nome} - ${solicitacao.quantidade_taloes} talões`;
        selectSolicitacao.appendChild(option);
      });
    } catch (error) {
      console.error("Erro ao carregar solicitações:", error);
      alert("Erro ao carregar solicitações.");
    }
  }

  formCadastrarEnvio.addEventListener("submit", async (event) => {
    event.preventDefault();

    const remessa = document.getElementById("remessa").value;
    const dataPrevista = document.getElementById("data-prevista").value;
    const quantidade = parseInt(document.getElementById("quantidade").value);
    const solicitacaoId = selectSolicitacao.value;
    const dataMovimentacao = new Date().toISOString();

    const token = getToken();

    try {
      const response = await fetch(
        "http://localhost:3000/api/talons/cadastrar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            remessa,
            tipo_movimentacao: "Envio",
            data_movimentacao: dataMovimentacao,
            data_prevista: dataPrevista,
            quantidade,
            id_status: 1,
            id_solicitacao: solicitacaoId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao cadastrar o envio.");
      }

      alert("Envio cadastrado com sucesso!");
      window.location.href = "/frontEnd/src/pages/envioTaloes/index.html";
    } catch (error) {
      console.error("Erro ao cadastrar o envio:", error);
      alert("Erro ao cadastrar o envio.");
    }
  });

  carregarSolicitacoes();
});
