document.addEventListener("DOMContentLoaded", () => {
  const tabelaUsuarios = document.getElementById("tabela-usuarios");

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
    const segundos = String(data.getSeconds()).padStart(2, "0");

    return `${dia}/${mes}/${ano} ${hora}:${minutos}:${segundos}`;
  }

  async function carregarUsuarios() {
    const token = getToken();

    try {
      const response = await fetch("http://localhost:3000/api/users/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Erro ao carregar os usuários");
      }

      const usuarios = await response.json();
      const listaUsuarios = usuarios.usuarios;

      tabelaUsuarios.innerHTML = "";
      listaUsuarios.forEach((usuario) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>#${usuario.matricula}</td>
            <td>${usuario.nome}</td>
            <td>${usuario.loja.nome}</td>
            <td>${formatarDataHora(usuario.created_at)}</td>
            <td>${usuario.perfil.nome}</td>
            <td>
              <button
                class="edit-btn"
                onclick="window.location.href='editarUsuario.html?id=${
                  usuario.id
                }'">
                ✏️
              </button>
              <button
                class="delete-btn"
                onclick="deletarUsuario('${usuario.id}')">
                🗑️
              </button>
            </td>
          `;
        tabelaUsuarios.appendChild(tr);
      });
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar os usuários.");
    }
  }

  async function deletarUsuario(id) {
    const confirmacao = confirm("Tem certeza que deseja deletar este usuário?");
    if (!confirmacao) return;

    try {
      const response = await fetch(
        `http://localhost:3000/usuarios/deletar/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao deletar o usuário");
      }

      alert("Usuário deletado com sucesso!");
      carregarUsuarios();
    } catch (error) {
      console.error(error);
      alert("Erro ao deletar o usuário.");
    }
  }

  carregarUsuarios();
});
