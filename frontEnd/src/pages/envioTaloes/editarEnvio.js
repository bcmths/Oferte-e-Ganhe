document.addEventListener("DOMContentLoaded", () => {
    const formEditarEnvio = document.getElementById("form-editar-envio");
    const selectSolicitacao = document.getElementById("solicitacao");
    const selectStatus = document.getElementById("status");
    const queryParams = new URLSearchParams(window.location.search);
    const idEnvio = queryParams.get("id");
  
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
          "http://localhost:3000/api/statusMovimentacoes/all",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (!response.ok) {
          throw new Error("Erro ao carregar status de movimentação.");
        }
  
        const data = await response.json();        
        const statusMovimentacao = data.statusMovimentacao;
  
        statusMovimentacao.forEach((status) => {
          const option = document.createElement("option");
          option.value = status.id_status_movimentacao;
          option.textContent = status.status;
          selectStatus.appendChild(option);
        });
      } catch (error) {
        console.error("Erro ao carregar status:", error);
        alert("Erro ao carregar status de movimentação.");
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
  
    async function carregarDadosEnvio() {
      const token = getToken();
  
      try {
        const response = await fetch("http://localhost:3000/api/talons/all", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Erro ao carregar os dados do envio.");
        }
  
        const data = await response.json();
        const envios = data.movimentacoes;
  
        // Filtrar o envio pelo ID
        const envio = envios.find(
          (envio) => envio.id_movimentacao === parseInt(idEnvio)
        );
  
        if (!envio) {
          throw new Error("Envio não encontrado.");
        }
  
        document.getElementById("remessa").value = envio.remessa || "";
        document.getElementById("data-prevista").value =
          formatarDataParaDatetimeLocal(envio.data_prevista) || "";
        document.getElementById("quantidade").value = envio.quantidade || "";
        selectSolicitacao.value = envio.id_solicitacao || "";
        selectStatus.value = envio.id_status || "";
      } catch (error) {
        console.error("Erro ao carregar os dados do envio:", error);
        alert("Erro ao carregar os dados do envio.");
      }
    }
  
    formEditarEnvio.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const remessa = document.getElementById("remessa").value;
      const dataPrevista = document.getElementById("data-prevista").value;
      const quantidade = parseInt(document.getElementById("quantidade").value);
      const solicitacaoId = selectSolicitacao.value;
      const statusId = selectStatus.value;
  
      const token = getToken();
  
      try {
        const response = await fetch(
          `http://localhost:3000/api/talons/editar/${idEnvio}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              remessa,
              data_prevista: dataPrevista,
              quantidade,
              id_solicitacao: solicitacaoId,
              id_status: statusId,
            }),
          }
        );
  
        if (!response.ok) {
          throw new Error("Erro ao editar o envio.");
        }
  
        alert("Envio editado com sucesso!");
        window.location.href = "/frontEnd/src/pages/envioTaloes/index.html";
      } catch (error) {
        console.error("Erro ao editar o envio:", error);
        alert("Erro ao editar o envio.");
      }
    });
  
    carregarSolicitacoes();
    carregarStatus();
    carregarDadosEnvio();
  });
  