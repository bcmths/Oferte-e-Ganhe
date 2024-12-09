document.addEventListener("DOMContentLoaded", () => {
  const tabelaLojas = document.getElementById("tabela-lojas");

  function getToken() {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];
  }

  async function carregarLojas() {
    const token = getToken();
    try {
      const response = await fetch("http://localhost:3000/api/stores/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Erro ao carregar as lojas");
      }

      const data = await response.json();
      const lojas = data.lojas;

      tabelaLojas.innerHTML = "";
      lojas.forEach((loja) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${loja.cod_loja}</td>
            <td>${loja.nome}</td>
            <td>${loja.cidade}</td>
            <td>
              <button
                class="edit-btn"
                onclick="window.location.href='editarLoja.html?id=${loja.id_loja}'">
                ✏️
              </button>
              <button
                class="delete-btn"
                onclick="deletarLoja('${loja.id_loja}')">
                🗑️
              </button>
            </td>
          `;
        tabelaLojas.appendChild(tr);
      });
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar as lojas.");
    }
  }

  async function deletarLoja(id_loja) {
    const confirmacao = confirm("Tem certeza que deseja deletar esta loja?");
    if (!confirmacao) return;

    const token = window.getToken();
    try {
      const response = await fetch(
        `http://localhost:3000/api/stores/deletar/${id_loja}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao deletar a loja");
      }

      alert("Loja deletada com sucesso!");
      carregarLojas();
    } catch (error) {
      console.error(error);
      alert("Erro ao deletar a loja.");
    }
  }
  window.deletarLoja = deletarLoja;
  carregarLojas();
});
