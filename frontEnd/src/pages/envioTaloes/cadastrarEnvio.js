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

document
  .getElementById("novo-envio-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const remessa = document.getElementById("remessa").value;
    const solicitacao = document.getElementById("solicitacao").value;
    const data = document.getElementById("data-prevista").value;
    const quantidade = document.getElementById("quantidade").value;

    try {
      const token = getToken();
      const user = parseJwt(token);
      if (user.id_loja !== 9) {
        alert("Somente a Matriz pode realizar envios");
        fecharModal("modal-novo-envio");
        return;
      }

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
            id_solicitacao: solicitacao,
            data_movimentacao: Date.now(),
            data_prevista: data,
            quantidade: quantidade,
            id_status: 1,
          }),
        }
      );

      const dataEnvio = await response.json();

      if (!response.ok) {
        throw new Error(dataEnvio.error || "Erro ao cadastrar perfil.");
      }

      alert("Envio cadastrado com sucesso!");
      fecharModal("modal-novo-envio");
      document.getElementById("novo-envio-form").reset();
      window.location.href = "/frontEnd/src/pages/envioTaloes/index.html";
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  });

async function carregarSolicitacao() {
  const token = getToken();
  const solicitacaoSelect = document.getElementById("solicitacao");
  solicitacaoSelect.innerHTML =
    '<option value="" disabled selected>Selecione uma solicitação</option>';

  try {
    const solicitacoesResponse = await fetch(
      "http://localhost:3000/api/solicitations/all",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!solicitacoesResponse.ok) {
      throw new Error("Erro ao obter solicitações");
    }

    const { solicitacoes } = await solicitacoesResponse.json();

    const enviosResponse = await fetch("http://localhost:3000/api/talons/all", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!enviosResponse.ok) {
      throw new Error("Erro ao obter envios");
    }

    const { movimentacoes } = await enviosResponse.json();

    const idsSolicitacoesComEnvio = movimentacoes
      .filter((mov) => mov.tipo_movimentacao === "Envio")
      .map((mov) => mov.id_solicitacao);

    const solicitacoesSemEnvio = solicitacoes.filter(
      (s) =>
        s.id_status_solicitacao == 2 &&
        !idsSolicitacoesComEnvio.includes(s.id_solicitacao)
    );

    solicitacoesSemEnvio.forEach((solicitacao) => {
      const option = document.createElement("option");
      option.value = solicitacao.id_solicitacao;
      option.textContent = `ID: ${solicitacao.id_solicitacao} - ${solicitacao.usuario.loja.nome} - ${solicitacao.usuario.nome} - ${solicitacao.quantidade_taloes} talões`;
      solicitacaoSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao carregar solicitações:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  carregarSolicitacao();
});

function fecharModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}
