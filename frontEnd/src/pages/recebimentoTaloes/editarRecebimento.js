document.addEventListener("DOMContentLoaded", () => {
  const formEditarRecebimento = document.getElementById(
    "form-editar-recebimento"
  );
  const selectSolicitacao = document.getElementById("solicitacao");
  const selectStatus = document.getElementById("status");
  const queryParams = new URLSearchParams(window.location.search);
  const idRecebimento = queryParams.get("id");

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

  async function carregarStatus() {
    const token = getToken();

    try {
      const response = await fetch(
        "http://localhost:3000/api/statusMovimentacao/all",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao carregar os status de movimentação.");
      }

      const data = await response.json();
      const statusList = data.status;

      statusList.forEach((status) => {
        const option = document.createElement("option");
        option.value = status.id_status;
        option.textContent = status.status;
        selectStatus.appendChild(option);
      });
    } catch (error) {
      console.error("Erro ao carregar os status:", error);
      alert("Erro ao carregar os status de movimentação.");
    }
  }

  function formatarDataParaDatetimeLocal(dataISO) {
    const data = new Date(dataISO);

    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    const horas = String(data.getHours()).padStart(2, "0");
    const minutos = String(data.getMinutes()).padStart(2, "0");

    return `${ano}-${mes}-${dia}T${horas}:${minutos}`;
  }

  async function carregarDadosRecebimento() {
    const token = getToken();

    try {
      const response = await fetch("http://localhost:3000/api/talons/all", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao carregar os dados do recebimento.");
      }

      const data = await response.json();
      const movimentacoes = data.movimentacoes;

      const recebimento = movimentacoes.find(
        (mov) => mov.id_movimentacao === parseInt(idRecebimento)
      );

      if (!recebimento) {
        throw new Error("Recebimento não encontrado.");
      }

      document.getElementById("remessa").value = recebimento.remessa || "";
      document.getElementById("quantidade").value =
        recebimento.quantidade || "";
      document.getElementById("data-prevista").value =
        formatarDataParaDatetimeLocal(recebimento.data_prevista) || "";
      selectSolicitacao.value = recebimento.id_solicitacao || "";
      selectStatus.value = recebimento.status.id_status || "";
    } catch (error) {
      console.error("Erro ao carregar os dados do recebimento:", error);
      alert("Erro ao carregar os dados do recebimento.");
    }
  }

  formEditarRecebimento.addEventListener("submit", async (event) => {
    event.preventDefault();

    const remessa = document.getElementById("remessa").value;
    const quantidade = parseInt(document.getElementById("quantidade").value);
    const dataPrevista = document.getElementById("data-prevista").value;
    const solicitacaoId = selectSolicitacao.value;
    const statusId = selectStatus.value;

    const token = getToken();

    try {
      const response = await fetch(
        `http://localhost:3000/api/talons/editar/${idRecebimento}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            remessa,
            quantidade,
            data_prevista: dataPrevista,
            id_solicitacao: solicitacaoId,
            id_status: statusId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao editar o recebimento.");
      }

      alert("Recebimento editado com sucesso!");
      window.location.href = "/frontEnd/src/pages/recebimentoTaloes/index.html";
    } catch (error) {
      console.error("Erro ao editar o recebimento:", error);
      alert("Erro ao editar o recebimento.");
    }
  });

  carregarSolicitacoes();
  carregarStatus();
  carregarDadosRecebimento();
});
