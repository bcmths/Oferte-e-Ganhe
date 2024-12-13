const modulosDisponiveis = [
  { modulo: "Usuários", endpoint: "usuarios" },
  { modulo: "Perfis", endpoint: "perfis" },
  { modulo: "Lojas", endpoint: "lojas" },
  { modulo: "Envio de Talões", endpoint: "envio_taloes" },
  { modulo: "Recebimento de Talões", endpoint: "recebimento_taloes" },
  { modulo: "Solicitação de Talões", endpoint: "solicitacoes" },
  { modulo: "Estoque", endpoint: "estoques" },
];

function parseJwt(token) {
  if (!token) return null;
  const base64Url = token.split(".")[1];
  if (!base64Url) return null;

  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
      .join("")
  );

  try {
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Erro ao decodificar token JWT:", error);
    return null;
  }
}

function verificarPermissao(token, permissaoDesejada) {
  const decodedToken = parseJwt(token);

  if (decodedToken && Array.isArray(decodedToken.permissoes)) {
    return decodedToken.permissoes.some(
      (permissao) => permissao.modulo === permissaoDesejada
    );
  }
  return false;
}

function getToken() {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1];
}

function gerarRelatorio(endpoint) {
  const url = `http://localhost:8000/api/generate_csv/${endpoint}`;
  window.open(url, "_blank");
}

function obterModulosPermitidos(token) {
  let listaNomesModulos = [];

  if (verificarPermissao(token, "Movimentações")) {
    listaNomesModulos.push(
      "Envio de Talões",
      "Recebimento de Talões",
      "Solicitação de Talões"
    );
  }

  if (verificarPermissao(token, "Lojas")) {
    listaNomesModulos.push("Lojas", "Estoque");
  }

  if (verificarPermissao(token, "Usuários")) {
    listaNomesModulos.push("Usuários");
  }
  if (verificarPermissao(token, "Perfis")) {
    listaNomesModulos.push("Perfis");
  }

  return modulosDisponiveis.filter((item) =>
    listaNomesModulos.includes(item.modulo)
  );
}

function renderizarTabela() {
  const token = getToken();
  if (!token) {
    console.warn("Token não encontrado. Nenhum relatório será exibido.");
    return;
  }

  const tbody = document.getElementById("relatorios-tbody");
  tbody.innerHTML = "";

  const modulosPermitidos = obterModulosPermitidos(token);

  modulosPermitidos.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.modulo}</td>
      <td>
        <button
          class="btn-gerar-relatorio"
          onclick="gerarRelatorio('${item.endpoint}')"
        >
          Gerar Relatório
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarTabela();

  const sidebar = document.querySelector(".sidebar");
  const toggleButton = document.getElementById("sidebar-toggle");

  toggleButton.addEventListener("click", (event) => {
    event.stopPropagation();
    sidebar.classList.toggle("active");
  });

  document.addEventListener("click", (event) => {
    if (
      !sidebar.contains(event.target) &&
      !toggleButton.contains(event.target)
    ) {
      sidebar.classList.remove("active");
    }
  });
});
