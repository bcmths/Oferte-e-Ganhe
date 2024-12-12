document.addEventListener("DOMContentLoaded", () => {
  const formCadastrarSolicitacao = document.getElementById(
    "form-cadastrar-solicitacao"
  );
  const userNameDisplay = document.getElementById("user-name");
  const userStoreDisplay = document.getElementById("user-store");

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

  async function verificarSolicitacaoExistente(lojaID) {
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
        throw new Error("Erro ao verificar solicitações.");
      }

      const data = await response.json();
      const solicitacoes = data.solicitacoes;

      const solicitacaoExistente = solicitacoes.find(
        (solicitacao) =>
          solicitacao.usuario.id_loja === lojaID &&
          solicitacao.id_status_solicitacao === 1
      );

      if (solicitacaoExistente) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Erro ao verificar solicitações:", error);
      return false;
    }
  }

  async function preencherInformacoesUsuario() {
    const token = getToken();
    const decodedToken = decodeToken(token);

    if (!decodedToken || !decodedToken.id_usuario) {
      alert("Erro ao identificar o usuário. Faça login novamente.");
      return;
    }

    userNameDisplay.textContent = decodedToken.nome || "N/A";
    userStoreDisplay.textContent = decodedToken.loja || "N/A";
  }

  formCadastrarSolicitacao.addEventListener("submit", async (event) => {
    event.preventDefault();

    const token = getToken();
    const decodedToken = decodeToken(token);

    if (!decodedToken || !decodedToken.id_usuario) {
      alert("Erro ao identificar o usuário. Faça login novamente.");
      return;
    }
    const lojaID = decodedToken.id_loja;
    const existeSolicitacao = await verificarSolicitacaoExistente(lojaID);
    if (existeSolicitacao) {
      alert("Já existe uma solicitação pendente para esta loja.");
      fecharModal("modal-nova-solicitacao");
      return;
    }

    const usuarioID = decodedToken.id_usuario;
    const quantidade = parseInt(document.getElementById("quantidade").value);

    try {
      const response = await fetch(
        "http://localhost:3000/api/solicitations/cadastrar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quantidade_taloes: quantidade,
            id_status_solicitacao: 1,
            id_usuario: usuarioID,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao cadastrar a solicitação.");
      }

      alert("Solicitação cadastrada com sucesso!");
      fecharModal("modal-nova-solicitacao");
      formCadastrarSolicitacao.reset();
      location.reload();
    } catch (error) {
      console.error("Erro ao cadastrar a solicitação:", error);
      alert("Erro ao cadastrar a solicitação.");
    }
  });

  preencherInformacoesUsuario();
});

function fecharModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}
