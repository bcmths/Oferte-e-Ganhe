export function atualizarSidebar() {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];
  
    if (!token) {
      console.error("Token não encontrado.");
      return;
    }
  
    function parseJwt(token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        return JSON.parse(jsonPayload);
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        return null;
      }
    }
  
    try {
      const decodedToken = parseJwt(token);
      const permissoes = decodedToken.permissoes.map((p) => p.modulo);
      const currentPath = window.location.pathname;
  
      const sidebar = document.querySelector(".sidebar");
      sidebar.innerHTML = "";
  
      const dashboardLink = document.createElement("a");
      dashboardLink.href = `/frontEnd/src/pages/dashboard/index.html`;
      dashboardLink.className = currentPath.includes("dashboard") ? "active" : "";
      dashboardLink.innerHTML = `<i class="fas fa-tachometer-alt"></i> Dashboard`;
      sidebar.appendChild(dashboardLink);
  
      const opcoesSidebar = [
        { modulo: "Usuários", icone: "fa-users", link: "usuarios" },
        { modulo: "Perfis", icone: "fa-user-tag", link: "perfis" },
        { modulo: "Lojas", icone: "fa-store", link: "lojas" },
        {
          modulo: "Movimentações",
          submodulos: [
            { modulo: "Envio de Talões", icone: "fa-paper-plane", link: "envioTaloes" },
            { modulo: "Recebimento de Talões", icone: "fa-inbox", link: "recebimentoTaloes" },
            { modulo: "Solicitações", icone: "fa-file-alt", link: "solicitacoes" },
          ],
        },
        { modulo: "Estoque", icone: "fa-boxes", link: "estoque" },
        { modulo: "Relatórios", icone: "fa-chart-line", link: "relatorios" },
      ];
  
      opcoesSidebar.forEach((opcao) => {
        if (opcao.submodulos) {
          if (permissoes.includes("Movimentações")) {
            opcao.submodulos.forEach((submodulo) => {
              const link = document.createElement("a");
              link.href = `/frontEnd/src/pages/${submodulo.link}/index.html`;
              link.className = currentPath.includes(submodulo.link) ? "active" : "";
              link.innerHTML = `<i class="fas ${submodulo.icone}"></i> ${submodulo.modulo}`;
              sidebar.appendChild(link);
            });
          }
        } else if (
          (opcao.modulo === "Estoque" && permissoes.includes("Lojas")) ||
          permissoes.includes(opcao.modulo)
        ) {
          const link = document.createElement("a");
          link.href = `/frontEnd/src/pages/${opcao.link}/index.html`;
          link.className = currentPath.includes(opcao.link) ? "active" : "";
          link.innerHTML = `<i class="fas ${opcao.icone}"></i> ${opcao.modulo}`;
          sidebar.appendChild(link);
        }
      });
  
      const logoutLink = document.createElement("a");
      logoutLink.href = "/frontEnd/src/pages/login/index.html";
      logoutLink.className = "logout";
      logoutLink.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
      sidebar.appendChild(logoutLink);
    } catch (error) {
      console.error("Erro ao atualizar a sidebar:", error);
    }
  }
  