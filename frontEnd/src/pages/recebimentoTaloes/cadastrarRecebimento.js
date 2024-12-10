document.addEventListener("DOMContentLoaded", () => {
  const formCadastrarRecebimento = document.getElementById(
    "form-cadastrar-recebimento"
  );
  const selectEnvio = document.getElementById("envio");  

  function getToken() {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];
  }

  async function carregarEnvios() {
    const token = getToken();

    try {
      const response = await fetch("http://localhost:3000/api/talons/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao carregar envios.");
      }

      const data = await response.json();
      const movimentacoes = data.movimentacoes;

      const envios = movimentacoes.filter(
        (mov) => mov.tipo_movimentacao === "Envio"
      );
      const recebimentos = movimentacoes.filter(
        (mov) => mov.tipo_movimentacao === "Recebimento"
      );

      const recebidosIds = recebimentos.map(
        (recebimento) => recebimento.id_solicitacao
      );

      const enviosDisponiveis = envios.filter(
        (envio) => !recebidosIds.includes(envio.id_solicitacao)
      );

      enviosDisponiveis.forEach((envio) => {
        const option = document.createElement("option");
        option.value = JSON.stringify({
          remessa: envio.remessa,
          data_prevista: envio.data_prevista,
          quantidade: envio.quantidade,
          id_solicitacao: envio.id_solicitacao,
        });
        option.textContent = `Remessa: ${envio.remessa}, Quantidade: ${
          envio.quantidade
        }, Data de envio: ${new Date(
          envio.data_movimentacao
        ).toLocaleDateString()}`;
        selectEnvio.appendChild(option);
      });
    } catch (error) {
      console.error("Erro ao carregar envios:", error);
      alert("Erro ao carregar envios.");
    }
  }

  formCadastrarRecebimento.addEventListener("submit", async (event) => {
    event.preventDefault();

    const envioData = JSON.parse(selectEnvio.value);
    console.log(envioData);
    

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
            remessa: envioData.remessa,
            tipo_movimentacao: "Recebimento",
            data_movimentacao: dataMovimentacao,
            data_prevista: envioData.data_prevista,
            quantidade: envioData.quantidade,
            id_status: 7,
            id_solicitacao: envioData.id_solicitacao,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao cadastrar o recebimento.");
      }

      alert("Recebimento cadastrado com sucesso!");
      window.location.href = "/frontEnd/src/pages/recebimentoTaloes/index.html";
    } catch (error) {
      console.error("Erro ao cadastrar o recebimento:", error);
      alert("Erro ao cadastrar o recebimento.");
    }
  });

  carregarEnvios();
});
