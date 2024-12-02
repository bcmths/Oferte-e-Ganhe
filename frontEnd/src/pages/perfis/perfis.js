document.addEventListener("DOMContentLoaded", () => {
  const tabelaPerfis = document.getElementById("tabela-perfis");

  async function carregarPerfis() {
    const token = window.getToken();
    try {
      const response = await fetch("http://localhost:3000/api/profiles/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Erro ao carregar os perfis");
      }

      const data = await response.json();
      const perfis = data.perfis;

      tabelaPerfis.innerHTML = "";
      perfis.forEach((perfil) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${perfil.nome}</td>
          <td>
            <button class="permissions-btn" onclick="gerenciarPermissoes('${perfil.id_perfil}')">
              Gerenciar Permissões
            </button>
          </td>
          <td>
            <button
              class="edit-btn"
              onclick="window.location.href='editarPerfil.html?id=${perfil.id_perfil}'">
              ✏️
            </button>
            <button
              class="delete-btn"
              onclick="deletarPerfil('${perfil.id_perfil}')">
              🗑️
            </button>
          </td>
        `;
        tabelaPerfis.appendChild(tr);
      });
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar os perfis.");
    }
  }

  async function deletarPerfil(id_perfil) {
    const confirmacao = confirm("Tem certeza que deseja deletar este perfil?");
    if (!confirmacao) return;

    const token = window.getToken();
    try {
      const response = await fetch(
        `http://localhost:3000/api/profiles/${id_perfil}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao deletar o perfil");
      }

      alert("Perfil deletado com sucesso!");
      carregarPerfis();
    } catch (error) {
      console.error(error);
      alert("Erro ao deletar o perfil.");
    }
  }

  function gerenciarPermissoes(id_perfil) {
    window.location.href = `gerenciarPermissoes.html?id=${id_perfil}`;
  }

  carregarPerfis();
});
