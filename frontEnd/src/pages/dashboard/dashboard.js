const API_BASE_URL = "http://127.0.0.1:8000";

async function fetchData(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar dados de ${endpoint}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
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

function getToken() {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1];
}

function getDecodedToken() {
  const token = getToken();
  return parseJwt(token);
}

async function renderFullDashboard() {
  const usuariosPorPerfilGeralDiv = document.querySelector(
    ".usuarios-por-perfil-geral-chart"
  );
  const taloesChartDiv = document.querySelector(".taloesChart");

  if (usuariosPorPerfilGeralDiv)
    usuariosPorPerfilGeralDiv.style.display = "block";
  if (taloesChartDiv) taloesChartDiv.style.display = "block";

  const usuarios = await fetchData("usuarios");

  if (usuariosPorPerfilGeralDiv) {
    renderUsuariosPorPerfilChart(
      generateUsuariosPorPerfilData(usuarios),
      "usuarios-por-perfil-geral-chart"
    );
  }

  const movimentacoes = await fetchData("movimentacoes");
  const taloesStats = generateTaloesStats(movimentacoes);

  if (taloesChartDiv) {
    renderTaloesChart(taloesStats.envio, taloesStats.recebimento);
  }
}

async function renderLojaDashboard(usuario) {
  const lojaInfoElement = document.querySelector("#loja-info");
  const usuariosPorPerfilLojaDiv = document.querySelector(
    ".usuarios-por-perfil-loja-chart"
  );

  if (!lojaInfoElement) {
    console.error("#loja-info não encontrado no DOM.");
    return;
  }

  const lojas = await fetchData("lojas");
  const funcionarios = await fetchData("usuarios");
  const movimentacoes = await fetchData("movimentacoes");
  const solicitacoes = await fetchData("solicitacoes");

  const lojaDoUsuario = lojas.find((loja) => loja.id_loja === usuario.id_loja);

  if (!lojaDoUsuario) {
    console.error("Loja do usuário não encontrada.");
    return;
  }

  const funcionariosPorLoja = funcionarios.filter(
    (funcionario) => funcionario.id_loja === lojaDoUsuario.id_loja
  );
  const solicitacoesPorLoja = solicitacoes.filter(
    (solicitacao) => solicitacao.usuario.id_loja === lojaDoUsuario.id_loja
  );
  const aguardandoRecebimento =
    generateAguardandoRecebimentoData(movimentacoes);

  lojaInfoElement.innerHTML = `
    <p>Nome da Loja: ${lojaDoUsuario.nome}</p>
    <p>Endereço: ${lojaDoUsuario.cidade}</p>
    <p>Total de Funcionários: ${funcionariosPorLoja.length}</p>
    <p>Solicitações em Aberto: ${
      solicitacoesPorLoja.filter(
        (solicitacao) => solicitacao.status.status === "Pendente"
      ).length
    }</p>
    <p>Aguardando Recebimento: ${aguardandoRecebimento.length}</p>
  `;
  lojaInfoElement.style.display = "block";

  if (usuariosPorPerfilLojaDiv) {
    renderUsuariosPorPerfilChart(
      generateUsuariosPorPerfilData(funcionariosPorLoja),
      "usuarios-por-perfil-loja-chart"
    );
  }
}

function generateUsuariosPorPerfilData(usuarios) {
  const usuariosPorPerfil = {};
  usuarios.forEach((usuario) => {
    const perfil = usuario.perfil.nome;
    usuariosPorPerfil[perfil] = (usuariosPorPerfil[perfil] || 0) + 1;
  });
  return {
    labels: Object.keys(usuariosPorPerfil),
    data: Object.values(usuariosPorPerfil),
  };
}

function generateTaloesStats(movimentacoes) {
  const stats = { envio: 0, recebimento: 0 };
  movimentacoes.forEach((movimentacao) => {
    if (movimentacao.tipo_movimentacao === "Envio") stats.envio++;
    if (movimentacao.tipo_movimentacao === "Recebimento") stats.recebimento++;
  });
  return stats;
}

function generateAguardandoRecebimentoData(movimentacoes) {
  return movimentacoes.filter((movimentacao) => {
    if (movimentacao.tipo_movimentacao === "Envio") {
      return !movimentacoes.some(
        (mov) =>
          mov.tipo_movimentacao === "Recebimento" &&
          mov.remessa === movimentacao.remessa
      );
    }
    return false;
  });
}

function renderUsuariosPorPerfilChart({ labels, data }, canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error(`Canvas com ID ${canvasId} não encontrado no DOM.`);
    return;
  }
  const ctx = canvas.getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Usuários por Perfil",
          data: data,
          backgroundColor: "#2b9348",
          borderColor: "#1f7a39",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: "Usuários" } },
        x: { title: { display: true, text: "Perfis" } },
      },
    },
  });
}

function renderTaloesChart(envio, recebimento) {
  const canvas = document.getElementById("taloesChart");
  if (!canvas) {
    console.error("#taloesChart não encontrado no DOM.");
    return;
  }

  const ctx = canvas.getContext("2d");
  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Envio", "Recebimento"],
      datasets: [
        {
          data: [envio, recebimento],
          backgroundColor: ["#4CAF50", "#FF9800"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true, position: "bottom" },
        title: { display: true, text: "Talões - Envio vs Recebimento" },
      },
    },
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const usuario = getDecodedToken();

  if (!usuario) {
    console.error("Usuário não autenticado");
    return;
  }

  await renderLojaDashboard(usuario);

  const permissaoMovimentacoes = usuario.permissoes.some(
    (permissao) =>
      permissao.modulo === "Movimentações" &&
      permissao.tipo_permissao === "Edição"
  );

  if (permissaoMovimentacoes) {
    const geralCharts = document.querySelector("#geral-charts");
    if (geralCharts) geralCharts.style.display = "flex";

    await renderFullDashboard();
  }
});

document.addEventListener("DOMContentLoaded", () => {
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
