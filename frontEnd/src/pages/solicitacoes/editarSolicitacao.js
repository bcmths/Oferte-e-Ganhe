function getToken() {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1];
}

function decodeToken(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
    return null;
  }
}

async function preencherInformacoesUsuario() {
  const token = getToken();

  if (!token) {
    alert("Token não encontrado. Faça login novamente.");
    return;
  }

  try {
    const decodedToken = decodeToken(token);

    if (!decodedToken || !decodedToken.id_usuario) {
      alert("Erro ao identificar o usuário. Faça login novamente.");
      return;
    }
    const userNameDisplay = document.getElementById("user-name-editar");
    const userStoreDisplay = document.getElementById("user-store-editar");

    userNameDisplay.textContent = decodedToken.nome || "N/A";
    userStoreDisplay.textContent = decodedToken.loja || "N/A";
  } catch (error) {
    console.error("Erro ao decodificar ou processar o token:", error);
    alert("Erro ao carregar informações do usuário. Tente novamente.");
  }
}

async function abrirModalEdicaoSolicitacao(idSolicitacao) {
  const token = getToken();
  const solicitacaoInput = document.getElementById("id-solicitacao-editar");
  const quantidadeInput = document.getElementById("quantidade-editar");
  const status = document.getElementById("status-editar");
  const usuario = document.getElementById("usuario-editar");

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
    console.log(solicitacao);

    if (!solicitacao) {
      throw new Error("Solicitação não encontrada.");
    }

    solicitacaoInput.value = idSolicitacao;
    quantidadeInput.value = solicitacao.quantidade_taloes;
    status.value = solicitacao.status.id_status_solicitacao;
    usuario.value = solicitacao.id_usuario;

    abrirModal("modal-editar-solicitacao");
  } catch (error) {
    console.error("Erro ao carregar a solicitação:", error);
    alert("Erro ao carregar a solicitação.");
  }
  preencherInformacoesUsuario();
}

document.addEventListener("DOMContentLoaded", () => {
  const formEditarSolicitacao = document.getElementById(
    "form-editar-solicitacao"
  );

  formEditarSolicitacao.addEventListener("submit", async (event) => {
    event.preventDefault();

    const token = getToken();
    const quantidade = document.getElementById("quantidade-editar").value;
    const status = document.getElementById("status-editar").value;
    const usuario = document.getElementById("usuario-editar").value;

    const idSolicitacao = document.getElementById(
      "id-solicitacao-editar"
    ).value;

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
            id_status_solicitacao: status,
            id_usuario: usuario,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar solicitação.");
      }

      alert("Solicitação editada com sucesso!");
      fecharModal("modal-editar-solicitacao");
      formEditarSolicitacao.reset();
      location.reload();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  });
});

function abrirModal(modalId, idSolicitacao) {
  const modal = document.getElementById(modalId);
  if (modal) {
    document.getElementById(modalId).style.display = "block";
    modal.setAttribute("id-envio-editar", idSolicitacao);
  }
}

function fecharModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

window.abrirModalEdicaoSolicitacao = abrirModalEdicaoSolicitacao;
window.fecharModal = fecharModal;
