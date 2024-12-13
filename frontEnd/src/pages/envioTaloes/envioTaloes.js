document.addEventListener("DOMContentLoaded", () => {
  const tabelaEnvios = document.getElementById("tabela-envios");
  const searchInput = document.getElementById("search");
  const rowsPerPageSelect = document.getElementById("rows-per-page");
  const paginationContainer = document.querySelector(".pagination");

  let envios = [];
  let paginaAtual = 1;
  let rowsPerPage = 5;

  function getToken() {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];
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

  function renderizarTabela(enviosFiltrados) {
    tabelaEnvios.innerHTML = "";

    const inicio = (paginaAtual - 1) * rowsPerPage;
    const fim = inicio + rowsPerPage;

    const enviosPaginados = enviosFiltrados.slice(inicio, fim);
    
    const token = getToken();
    const podeEditarMovimentacoes = verificarPermissao(
      token,
      "Movimentações",
      "Edição"
    );

    enviosPaginados.forEach((envio) => {
      const statusClass = envio.status.status
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "")
        .toLowerCase();

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${envio.remessa}</td>
        <td>${envio.solicitacao.usuario.loja.nome}</td>
        <td>${envio.quantidade}</td>
        <td>${formatarDataHora(envio.created_at)}</td>
        <td>${formatarDataHora(envio.data_prevista)}</td>
        <td>
            <span class="badge ${statusClass}">
              ${envio.status.status}
            </span>
        </td>
        <td>
        ${
          podeEditarMovimentacoes
            ? `<button class="edit-btn" onclick="abrirModalEdicao('${envio.id_movimentacao}')">✏️</button>
               <button class="delete-btn" onclick="deletarEnvio('${envio.id_movimentacao}')">🗑️</button>`
            : ""
        }
        <button class="details-btn" onclick="abrirModalDetalhar('${
          envio.id_movimentacao
        }')">🔍</button>
      </td>
      `;
      tabelaEnvios.appendChild(tr);
    });

    renderizarPaginacao(enviosFiltrados.length);
  }

  function renderizarPaginacao(totalEnvios) {
    const totalPaginas = Math.ceil(totalEnvios / rowsPerPage);
    paginationContainer.innerHTML = "";

    for (let i = 1; i <= totalPaginas; i++) {
      const button = document.createElement("button");
      button.classList.add("page-btn");
      if (i === paginaAtual) {
        button.classList.add("active");
      }
      button.textContent = i;
      button.addEventListener("click", () => {
        paginaAtual = i;
        filtrarEnvios();
      });
      paginationContainer.appendChild(button);
    }
  }

  function filtrarEnvios() {
    const termoPesquisa = searchInput.value.toLowerCase();
    const enviosFiltrados = envios.filter((envio) => {
      return (
        envio.remessa?.toLowerCase().includes(termoPesquisa) ||
        envio.solicitacao?.usuario?.loja?.nome
          ?.toLowerCase()
          .includes(termoPesquisa) ||
        envio.status?.status?.toLowerCase().includes(termoPesquisa)
      );
    });

    renderizarTabela(enviosFiltrados);
  }

  rowsPerPageSelect.addEventListener("change", () => {
    rowsPerPage = parseInt(rowsPerPageSelect.value);
    paginaAtual = 1;
    filtrarEnvios();
  });

  searchInput.addEventListener("input", () => {
    paginaAtual = 1;
    filtrarEnvios();
  });

  async function carregarEnvios() {
    const token = getToken();

    try {
      const response = await fetch("http://localhost:3000/api/talons/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao carregar os envios.");
      }

      const data = await response.json();
      envios = data.movimentacoes
        .filter((mov) => mov.tipo_movimentacao === "Envio")
        .sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });

      filtrarEnvios();
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar os envios.");
    }
  }

  async function deletarEnvio(idEnvio) {
    const token = getToken();
    const confirmacao = confirm("Tem certeza que deseja deletar este envio?");
    if (!confirmacao) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/talons/deletar/${idEnvio}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao deletar o envio.");
      }

      alert("Envio deletado com sucesso!");
      carregarEnvios();
    } catch (error) {
      console.error(error);
      alert("Erro ao deletar o envio.");
    }
  }

  carregarEnvios();
  window.deletarEnvio = deletarEnvio;
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

async function abrirModalDetalhar(idEnvio) {
  const token = getToken();
  try {
    const response = await fetch("http://localhost:3000/api/talons/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    const envios = data.movimentacoes;

    const envio = envios.find((e) => e.id_movimentacao == idEnvio);

    const remessa = envio.remessa;
    const usuario = envio.solicitacao.usuario.nome;
    const loja = envio.solicitacao.usuario.loja.nome;
    const quantidade_solicitada = envio.solicitacao.quantidade_taloes;
    const quantidade_enviada = envio.quantidade;
    const data_envio = envio.data_movimentacao;
    const data_prevista = envio.data_prevista;
    const status = envio.status.status;

    const conteudoModal = document.getElementById("conteudoModal");
    conteudoModal.innerHTML = `
      <table class="details-table">
        <tr>
          <td><strong>Remessa do Talão:</strong></td>
          <td>${remessa}</td>
        </tr>
        <tr>
          <td><strong>Quantidade Solicitada:</strong></td>
          <td>${quantidade_solicitada}</td>
        </tr>
        <tr>
          <td><strong>Quantidade Enviada:</strong></td>
          <td>${quantidade_enviada}</td>
        </tr>
        <tr>
          <td><strong>Status:</strong></td>
          <td>${status}</td>
        </tr>
        <tr>
          <td><strong>Data do Envio:</strong></td>
          <td>${formatarDataHora(data_envio)}</td>
        </tr>
        <tr>
          <td><strong>Entrega Prevista:</strong></td>
          <td>${formatarDataHora(data_prevista)}</td>
        </tr>
        <tr>
          <td><strong>Usuário:</strong></td>
          <td>${usuario}</td>
        </tr>
        <tr>
          <td><strong>Loja:</strong></td>
          <td>${loja}</td>
        </tr>
      </table>
    `;
    const modal = document.getElementById("modalDetalhes");
    modal.style.display = "block";
  } catch (err) {
    console.error("Erro ao abrir modal.", err);
  }
}

function fecharModalDetalhar(modalId) {
  document.getElementById(modalId).style.display = "none";
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

function verificarPermissao(token, modulo, tipoPermissao) {
  const decodedToken = parseJwt(token);

  if (decodedToken && decodedToken.permissoes) {
    return decodedToken.permissoes.some(
      (permissao) =>
        permissao.modulo === modulo &&
        permissao.tipo_permissao === tipoPermissao
    );
  }
  return false;
}

document.addEventListener("DOMContentLoaded", () => {
  const token = getToken();
  const podeEditarMovimentacoes = verificarPermissao(
    token,
    "Movimentações",
    "Edição"
  );

  const botaoCadastro = document.querySelector(".add-envio-taloes-btn");
  if (!podeEditarMovimentacoes) {
    botaoCadastro.style.display = "none";
  }
});
