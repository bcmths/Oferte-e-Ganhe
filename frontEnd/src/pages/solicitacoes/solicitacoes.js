document.addEventListener("DOMContentLoaded", () => {
  const tabelaSolicitacoes = document.querySelector("tbody");
  const searchInput = document.getElementById("search");
  const rowsPerPageSelect = document.getElementById("rows-per-page");
  const paginationContainer = document.querySelector(".pagination");

  let solicitacoes = [];
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

    const hora = String(data.getHours()).padStart(2, "0");
    const minutos = String(data.getMinutes()).padStart(2, "0");

    return `${dia}/${mes}/${ano} ${hora}:${minutos}`;
  }

  function getBadgeClass(status) {
    switch (status.toLowerCase()) {
      case "solicitação aceita":
        return "badge status-aceita";
      case "solicitação recusada":
        return "badge status-recusada";
      case "pendente":
        return "badge status-pendente";
      default:
        return "badge";
    }
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

  function renderizarTabela(solicitacoesFiltradas) {
    tabelaSolicitacoes.innerHTML = "";

    const inicio = (paginaAtual - 1) * rowsPerPage;
    const fim = inicio + rowsPerPage;

    const solicitacoesPaginadas = solicitacoesFiltradas.slice(inicio, fim);
    const token = getToken();
    const podeEditarSolicitacoes = verificarPermissao(
      token,
      "Movimentações",
      "Edição"
    );

    solicitacoesPaginadas.forEach((solicitacao) => {
      const statusClass = solicitacao.status.status
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "")
        .toLowerCase();

      const tr = document.createElement("tr");
      tr.innerHTML = `
              <td>${solicitacao.usuario.loja.nome}</td>
              <td>${solicitacao.quantidade_taloes}</td>
              <td>${formatarDataHora(solicitacao.updated_at)}</td>
              <td>${solicitacao.usuario.nome || "N/A"}</td>
              ${
                podeEditarSolicitacoes
                  ? `<td>
                ${
                  solicitacao.status.status === "Pendente"
                    ? `
                  <button class="btn-status aceitar" data-id="${solicitacao.id_solicitacao}">Aceitar</button>
                  <button class="btn-status recusar" data-id="${solicitacao.id_solicitacao}">Recusar</button>
                `
                    : `<span class="${getBadgeClass(
                        solicitacao.status?.status || ""
                      )}">${solicitacao.status?.status || "N/A"}</span>`
                }
              </td>`
                  : `<td><span class="${getBadgeClass(
                      solicitacao.status?.status || ""
                    )}">${solicitacao.status?.status || "N/A"}</span></td>`
              }
              
              ${
                podeEditarSolicitacoes
                  ? ` <td>
                <button class="edit-btn" onclick="abrirModalEdicaoSolicitacao(${solicitacao.id_solicitacao})">✏️</button>
                <button class="delete-btn" onclick="deletarSolicitacao(${solicitacao.id_solicitacao})">🗑️</button>
              </td>`
                  : ""
              }
             
            `;
      tabelaSolicitacoes.appendChild(tr);

      if (solicitacao.status.status === "Pendente" && podeEditarSolicitacoes) {
        tr.querySelector(".btn-status.aceitar").addEventListener("click", () =>
          atualizarStatusSolicitacao(solicitacao, 2)
        );
        tr.querySelector(".btn-status.recusar").addEventListener("click", () =>
          atualizarStatusSolicitacao(solicitacao, 3)
        );
      }
    });

    renderizarPaginacao(solicitacoesFiltradas.length);
  }

  function renderizarPaginacao(totalSolicitacoes) {
    const totalPaginas = Math.ceil(totalSolicitacoes / rowsPerPage);
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
        filtrarSolicitacoes();
      });
      paginationContainer.appendChild(button);
    }
  }

  function filtrarSolicitacoes() {
    const termoPesquisa = searchInput.value.toLowerCase();
    const solicitacoesFiltradas = solicitacoes.filter((solicitacao) => {
      return (
        solicitacao.usuario.nome?.toLowerCase().includes(termoPesquisa) ||
        solicitacao.usuario?.loja?.nome.toLowerCase().includes(termoPesquisa) ||
        solicitacao.status?.status?.toLowerCase().includes(termoPesquisa)
      );
    });

    renderizarTabela(solicitacoesFiltradas);
  }

  rowsPerPageSelect.addEventListener("change", () => {
    rowsPerPage = parseInt(rowsPerPageSelect.value);
    paginaAtual = 1;
    filtrarSolicitacoes();
  });

  searchInput.addEventListener("input", () => {
    paginaAtual = 1;
    filtrarSolicitacoes();
  });

  async function carregarSolicitacoes() {
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
        throw new Error("Erro ao carregar as solicitações.");
      }

      const solicitacoesData = await response.json();
      solicitacoes = solicitacoesData.solicitacoes.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
      filtrarSolicitacoes();
    } catch (error) {
      console.error("Erro ao carregar as solicitações:", error);
      alert("Erro ao carregar as solicitações.");
    }
  }

  async function atualizarStatusSolicitacao(solicitacao, novoStatus) {
    const token = getToken();
    const usuarioAtual = parseJwt(token);
    try {
      if (usuarioAtual.id_usuario === solicitacao.usuario.id_usuario) {
        alert("Você não pode atualizar o status da sua própria solicitação.");
        return;
      }

      const response = await fetch(
        `http://localhost:3000/api/solicitations/editar/${solicitacao.id_solicitacao}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quantidade_taloes: solicitacao.quantidade_taloes,
            id_status_solicitacao: novoStatus,
            id_usuario: solicitacao.usuario.id_usuario,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar o status da solicitação.");
      }

      alert(
        novoStatus === 2
          ? "Solicitação aceita com sucesso!"
          : "Solicitação recusada com sucesso!"
      );
      carregarSolicitacoes();
    } catch (error) {
      console.error("Erro ao atualizar o status da solicitação:", error);
      alert("Erro ao atualizar o status da solicitação.");
    }
  }

  async function deletarSolicitacao(idSolicitacao) {
    const confirmacao = confirm(
      "Tem certeza que deseja deletar esta solicitação?"
    );
    if (!confirmacao) return;

    const token = getToken();

    try {
      const response = await fetch(
        `http://localhost:3000/api/solicitations/deletar/${idSolicitacao}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao deletar a solicitação.");
      }

      alert("Solicitação deletada com sucesso!");
      carregarSolicitacoes();
    } catch (error) {
      console.error("Erro ao deletar a solicitação:", error);
      alert("Erro ao deletar a solicitação.");
    }
  }

  carregarSolicitacoes();
  window.deletarSolicitacao = deletarSolicitacao;
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
  const podeEditarSolicitacoes = verificarPermissao(
    token,
    "Movimentações",
    "Edição"
  );

  const botaoCadastro = document.querySelector(".add-solicitacoes-btn");
  const status = document.querySelector(".status-column");
  const colunaAcoes = document.querySelector(".action-column");
  if (!podeEditarSolicitacoes) {
    botaoCadastro.style.display = "none";
    colunaAcoes.style.display = "none";
    status.style.borderTopRightRadius = "8px";
    status.style.borderBottomRightRadius = "8px";
  }
});
