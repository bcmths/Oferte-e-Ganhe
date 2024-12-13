document.addEventListener("DOMContentLoaded", () => {
  const tabelaRecebimentos = document.getElementById("tabela-recebimentos");
  const searchInput = document.getElementById("search");
  const rowsPerPageSelect = document.getElementById("rows-per-page");
  const paginationContainer = document.querySelector(".pagination");

  let recebimentos = [];
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

  function renderizarTabela(recebimentosFiltrados) {
    tabelaRecebimentos.innerHTML = "";

    const inicio = (paginaAtual - 1) * rowsPerPage;
    const fim = inicio + rowsPerPage;

    const recebimentosPaginados = recebimentosFiltrados.slice(inicio, fim);
    const token = getToken();
    const podeEditarRecebimento = verificarPermissao(
      token,
      "Movimentações",
      "Edição"
    );

    recebimentosPaginados.forEach((recebimento) => {
      const statusClass = recebimento.status.status
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "")
        .toLowerCase();

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${recebimento.remessa}</td>
        <td>${recebimento.quantidade}</td>
        <td>${recebimento.solicitacao.usuario.loja.nome}</td>
        <td>${formatarDataHora(recebimento.created_at)}</td>
        <td>${formatarDataHora(recebimento.data_prevista)}</td>
        <td>${recebimento.solicitacao.usuario.nome}</td>
        <td>
          <span class="badge ${statusClass}">
            ${recebimento.status.status}
          </span>
        </td>
        ${
          podeEditarRecebimento
            ? `<td>
          <button class="edit-btn" onclick="abrirModalEdicao('${recebimento.id_movimentacao}')">✏️</button>
          <button class="delete-btn" onclick="deletarRecebimento('${recebimento.id_movimentacao}')">🗑️</button>
        </td>`
            : ""
        }
        
      `;
      tabelaRecebimentos.appendChild(tr);
    });

    renderizarPaginacao(recebimentosFiltrados.length);
  }

  function renderizarPaginacao(totalRecebimentos) {
    const totalPaginas = Math.ceil(totalRecebimentos / rowsPerPage);
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
        filtrarRecebimentos();
      });
      paginationContainer.appendChild(button);
    }
  }

  function filtrarRecebimentos() {
    const termoPesquisa = searchInput.value.toLowerCase();
    const recebimentosFiltrados = recebimentos.filter((recebimento) => {
      return (
        recebimento.remessa?.toLowerCase().includes(termoPesquisa) ||
        recebimento.solicitacao.usuario.loja.nome
          ?.toLowerCase()
          .includes(termoPesquisa) ||
        recebimento.status?.status?.toLowerCase().includes(termoPesquisa)
      );
    });

    renderizarTabela(recebimentosFiltrados);
  }

  rowsPerPageSelect.addEventListener("change", () => {
    rowsPerPage = parseInt(rowsPerPageSelect.value);
    paginaAtual = 1;
    filtrarRecebimentos();
  });

  searchInput.addEventListener("input", () => {
    paginaAtual = 1;
    filtrarRecebimentos();
  });

  async function carregarRecebimentos() {
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
        throw new Error("Erro ao carregar os recebimentos.");
      }

      const data = await response.json();
      recebimentos = data.movimentacoes
        .filter((mov) => mov.tipo_movimentacao === "Recebimento")
        .sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });

      filtrarRecebimentos();
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar os recebimentos.");
    }
  }

  async function deletarRecebimento(idRecebimento) {
    const token = getToken();
    const confirmacao = confirm(
      "Tem certeza que deseja deletar este recebimento?"
    );
    if (!confirmacao) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/talons/deletar/${idRecebimento}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao deletar o recebimento.");
      }

      alert("Recebimento deletado com sucesso!");
      carregarRecebimentos();
    } catch (error) {
      console.error(error);
      alert("Erro ao deletar o recebimento.");
    }
  }

  carregarRecebimentos();
  window.deletarRecebimento = deletarRecebimento;
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

function getToken() {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1];
}

document.addEventListener("DOMContentLoaded", () => {
  const token = getToken();
  const podeEditarRecebimento = verificarPermissao(
    token,
    "Movimentações",
    "Edição"
  );

  const botaoCadastro = document.querySelector(".add-recebimento-taloes-btn");
  const status = document.querySelector(".status-column");
  const colunaAcoes = document.querySelector(".action-column");
  if (!podeEditarRecebimento) {
    botaoCadastro.style.display = "none";
    colunaAcoes.style.display = "none";
    status.style.borderTopRightRadius = "8px";
    status.style.borderBottomRightRadius = "8px";
  }
});
