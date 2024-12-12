function getToken() {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1];
  return token;
}

function decodificarToken(token) {
  return JSON.parse(atob(token.split(".")[1]));
}

const modulosSidebar = {
  Usuários: "/frontEnd/src/pages/usuarios/index.html",
  Perfis: "/frontEnd/src/pages/perfis/index.html",
  Lojas: "/frontEnd/src/pages/lojas/index.html",
  "Envio de Talões": "/frontEnd/src/pages/envioTaloes/index.html",
  "Recebimento de Talões": "/frontEnd/src/pages/recebimentoTaloes/index.html",
  Solicitações: "/frontEnd/src/pages/solicitacoes/index.html",
  Estoque: "/frontEnd/src/pages/estoque/index.html",
  Relatórios: "/frontEnd/src/pages/relatorios/index.html",
};

function getIconForModule(modulo) {
  const icons = {
    Usuários: "users",
    Perfis: "user-tag",
    Lojas: "store",
    "Envio de Talões": "paper-plane",
    "Recebimento de Talões": "inbox",
    Solicitações: "file-alt",
    Estoque: "boxes",
    Relatórios: "chart-line",
  };
  return icons[modulo] || "circle";
}

export function atualizarSidebar() {
  const token = getToken();
  if (!token) {
    alert("Token não encontrado. Faça login novamente.");
    window.location.href = "/frontEnd/src/pages/login/index.html";
    return;
  }

  const usuario = decodificarToken(token);
  const permissoes = usuario.permissoes.map((p) => p.modulo);

  const sidebar = document.querySelector(".sidebar");
  sidebar.innerHTML = `
      <a href="/frontEnd/src/pages/dashboard/index.html" class="active">
        <i class="fas fa-tachometer-alt"></i> Dashboard
      </a>
    `;

  permissoes.forEach((modulo) => {
    const link = modulosSidebar[modulo];
    if (link) {
      sidebar.innerHTML += `
          <a href="${link}">
            <i class="fas fa-${getIconForModule(modulo)}"></i> ${modulo}
          </a>
        `;
    }
  });

  sidebar.innerHTML += `
      <a href="/frontEnd/src/pages/login/index.html" class="logout">
        <i class="fas fa-sign-out-alt"></i> Logout
      </a>
    `;
}
