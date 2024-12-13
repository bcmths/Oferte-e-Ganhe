document.addEventListener("DOMContentLoaded", () => {
  const tabelaUsuarios = document.getElementById("tabela-usuarios");
  const searchInput = document.getElementById("search");
  const rowsPerPageSelect = document.getElementById("rows-per-page");
  const paginationContainer = document.querySelector(".pagination");

  let usuarios = [];
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
    return `${dia}/${mes}/${ano}`;
  }

  function renderizarTabela(usuariosFiltrados) {
    tabelaUsuarios.innerHTML = "";

    const inicio = (paginaAtual - 1) * rowsPerPage;
    const fim = inicio + rowsPerPage;

    const usuariosPaginados = usuariosFiltrados.slice(inicio, fim);
    const token = getToken();
    const podeEditarUsuarios = verificarPermissao(token, "Usuários", "Edição");

    usuariosPaginados.forEach((usuario) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${usuario.matricula}</td>
        <td>${usuario.nome}</td>
        <td>${usuario.loja.nome}</td>
        <td>${formatarDataHora(usuario.created_at)}</td>
        <td>${usuario.perfil.nome}</td>
        ${
          podeEditarUsuarios
            ? `<td><button class="edit-btn" onclick="abrirModalEdicao('${usuario.matricula}')">✏️</button>
          <button class="delete-btn" onclick="deletarUsuario('${usuario.matricula}')">🗑️</button>
             </td>`
            : ""
        }
      `;
      tabelaUsuarios.appendChild(tr);
    });

    renderizarPaginacao(usuariosFiltrados.length);
  }

  function renderizarPaginacao(totalUsuarios) {
    const totalPaginas = Math.ceil(totalUsuarios / rowsPerPage);
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
        filtrarUsuarios();
      });
      paginationContainer.appendChild(button);
    }
  }

  function filtrarUsuarios() {
    const termoPesquisa = searchInput.value.toLowerCase();

    const usuariosFiltrados = usuarios.filter((usuario) => {
      return (
        usuario.nome.toLowerCase().includes(termoPesquisa) ||
        usuario.matricula.toLowerCase().includes(termoPesquisa) ||
        usuario.loja.nome.toLowerCase().includes(termoPesquisa) ||
        usuario.perfil.nome.toLowerCase().includes(termoPesquisa)
      );
    });

    renderizarTabela(usuariosFiltrados);
  }

  rowsPerPageSelect.addEventListener("change", () => {
    rowsPerPage = parseInt(rowsPerPageSelect.value);
    paginaAtual = 1;
    filtrarUsuarios();
  });

  searchInput.addEventListener("input", () => {
    paginaAtual = 1;
    filtrarUsuarios();
  });

  async function carregarUsuarios() {
    const token = getToken();

    try {
      const response = await fetch("http://localhost:3000/api/users/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao carregar os usuários.");
      }

      const data = await response.json();
      usuarios = data.usuarios;
      usuarios = data.usuarios.sort((a, b) => {
        return new Date(b.updated_at) - new Date(a.updated_at);
      });
      filtrarUsuarios();
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar os usuários.");
    }
  }

  async function deletarUsuario(matricula) {
    const token = getToken();
    const confirmacao = confirm("Tem certeza que deseja deletar este usuário?");
    if (!confirmacao) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/users/deletar/${matricula}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao deletar o usuário.");
      }

      alert("Usuário deletado com sucesso!");
      carregarUsuarios();
    } catch (error) {
      console.error(error);
      alert("Erro ao deletar o usuário.");
    }
  }

  carregarUsuarios();
  window.deletarUsuario = deletarUsuario;
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

document.addEventListener("DOMContentLoaded", () => {
  const token = getToken();
  const podeEditarUsuarios = verificarPermissao(token, "Usuários", "Edição");

  const botaoCadastro = document.querySelector(".add-user-btn");
  const colunaAcoes = document.querySelector(".user-actions");
  const colunaPerfil = document.querySelector(".perfil-column");
  if (!podeEditarUsuarios) {
    botaoCadastro.style.display = "none";
    colunaAcoes.style.display = "none";
    colunaPerfil.style.borderTopRightRadius = "8px";
    colunaPerfil.style.borderBottomRightRadius = "8px";
  }
});
