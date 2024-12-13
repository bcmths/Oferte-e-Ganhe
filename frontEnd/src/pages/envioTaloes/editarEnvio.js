function getToken() {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1];
}

function parseJwt(token) {
  if (!token) return null;
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
      .join("")
  );
  return JSON.parse(jsonPayload);
}

function formatarDataHora(dataISO) {
  const data = new Date(dataISO);
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  const horas = String(data.getHours()).padStart(2, "0");
  const minutos = String(data.getMinutes()).padStart(2, "0");
  return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
}

function formatarTimestampParaInput(dataISO) {
  const data = new Date(dataISO);
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  const horas = String(data.getHours()).padStart(2, "0");
  const minutos = String(data.getMinutes()).padStart(2, "0");
  return `${ano}-${mes}-${dia}T${horas}:${minutos}`;
}

async function abrirModalEdicao(idEnvio) {
  const token = getToken();

  try {
    const response = await fetch("http://localhost:3000/api/talons/all", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao carregar a lista de envios.");
    }

    const data = await response.json();
    const envios = data.movimentacoes;

    const envio = envios.find((e) => e.id_movimentacao == idEnvio);

    if (!envio) {
      throw new Error("Envio não encontrado.");
    }

    document.getElementById("id-envio-editar").value = idEnvio;
    document.getElementById("remessa-editar").value = envio.remessa;
    document.getElementById("quantidade-editar").value = envio.quantidade;
    document.getElementById("data-editar").value = formatarTimestampParaInput(
      envio.data_prevista
    );
    document.getElementById("data-mov-editar").value =
      formatarTimestampParaInput(envio.data_movimentacao);

    carregarSolicitacaoEdicao(envio.solicitacao.id_solicitacao);
    carregarStatusEdicao(envio.status.id_status_solicitacao);

    abrirModal("modal-editar-envio");
  } catch (error) {
    console.error(error);
    alert("Erro ao carregar os dados do envio.");
  }
}

async function carregarSolicitacaoEdicao(idEnvio) {
  const token = getToken();
  const solicitacaoSelect = document.getElementById("solicitacao-editar");
  solicitacaoSelect.innerHTML = "";

  try {
    const response = await fetch(
      "http://localhost:3000/api/solicitations/all",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { solicitacoes } = await response.json();
    solicitacoes.forEach((solicitacao) => {
      const option = document.createElement("option");
      option.value = solicitacao.id_solicitacao;
      option.textContent = `ID: ${solicitacao.id_solicitacao} - ${solicitacao.usuario.nome} - ${solicitacao.quantidade_taloes} talões`;
      if (solicitacao.id_solicitacao === idEnvio) option.selected = true;
      solicitacaoSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao carregar envios:", error);
  }
}

async function carregarStatusEdicao(idStatus) {
  const token = getToken();
  const statusSelect = document.getElementById("status-editar");
  statusSelect.innerHTML = "";

  try {
    const response = await fetch(
      "http://localhost:3000/api/statusMovimentacoes/all",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao carregar os status.");
    }

    const { statusMovimentacao } = await response.json();
    statusMovimentacao
      .filter((s) => s.status !== "Recebido")
      .forEach((s) => {
        const option = document.createElement("option");
        option.value = s.id_status_movimentacao;
        option.textContent = s.status;
        if (s.id_status_movimentacao == idStatus) {
          option.selected = true;
        }
        statusSelect.appendChild(option);
      });

    if (!Array.from(statusSelect.options).some((opt) => opt.selected)) {
      console.warn("Status não encontrado. Selecione o primeiro valor.");
      statusSelect.options[0].selected = true;
    }
  } catch (error) {
    console.error("Erro ao carregar status:", error);
  }
}

function abrirModal(modalId, idEnvio) {
  const modal = document.getElementById(modalId);
  if (modal) {
    document.getElementById(modalId).style.display = "block";
    modal.setAttribute("id-envio-editar", idEnvio);
  }
}

function fecharModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

document
  .getElementById("editar-envio-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const remessa = document.getElementById("remessa-editar").value;
    const quantidade = document.getElementById("quantidade-editar").value;
    const data = document.getElementById("data-editar").value;
    const data_movimentacao = document.getElementById("data-mov-editar").value;
    const solicitacao = document.getElementById("solicitacao-editar").value;
    const status = document.getElementById("status-editar").value;
    const idEnvio = document.getElementById("id-envio-editar").value;

    try {
      const token = getToken();
      const user = parseJwt(token);
      if (user.id_loja !== 9) {
        alert("Somente a Matriz pode editar envios");
        fecharModal("modal-editar-envio");
        return;
      }
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
            quantidade,
            tipo_movimentacao: "Envio",
            data_prevista: data,
            data_movimentacao: data_movimentacao,
            id_solicitacao: solicitacao,
            id_status: status,
          }),
        }
      );

      const dataEnvio = await response.json();

      if (!response.ok) {
        throw new Error(dataEnvio.error || "Erro ao cadastrar envio.");
      }

      alert("Envio atualizado com sucesso!");
      fecharModal("modal-editar-envio");

      window.location.href = "/frontEnd/src/pages/envioTaloes/index.html";
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  });

window.abrirModalEdicao = abrirModalEdicao;
window.fecharModal = fecharModal;
