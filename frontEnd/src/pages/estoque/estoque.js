document.addEventListener("DOMContentLoaded", () => {
  const tabelaEstoques = document.querySelector("tbody");

  function getToken() {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];
  }

  async function carregarEstoques() {
    const token = getToken();

    try {
      const response = await fetch("http://localhost:3000/api/stocks/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao carregar estoques.");
      }

      const data = await response.json();
      const estoques = data.estoques;

      tabelaEstoques.innerHTML = "";

      estoques.forEach((estoque) => {
        const statusClass =
          estoque.estoque_atual < estoque.estoque_minimo
            ? "warning red"
            : estoque.estoque_atual < estoque.estoque_recomendado
            ? "warning"
            : "";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${estoque.loja.nome}</td>
            <td>
              <span class="${statusClass}">${estoque.estoque_atual}${
          statusClass ? " ⚠️" : ""
        }</span>
            </td>
            <td>${estoque.estoque_minimo}</td>
            <td>${estoque.estoque_recomendado}</td>
            <td>
              <button class="edit-btn" onclick="editarEstoque(${
                estoque.id_estoque
              })">✏️</button>
              <button class="delete-btn" onclick="deletarEstoque(${
                estoque.id_estoque
              })">🗑️</button>
            </td>
          `;
        tabelaEstoques.appendChild(tr);
      });
    } catch (error) {
      console.error("Erro ao carregar estoques:", error);
      alert("Erro ao carregar estoques.");
    }
  }

  async function deletarEstoque(id_estoque) {
    const confirmacao = confirm("Tem certeza que deseja deletar este estoque?");
    if (!confirmacao) return;

    const token = getToken();
    try {
      const response = await fetch(
        `http://localhost:3000/api/stocks/${id_estoque}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao deletar estoque.");
      }

      alert("Estoque deletado com sucesso!");
      carregarEstoques();
    } catch (error) {
      console.error("Erro ao deletar estoque:", error);
      alert("Erro ao deletar estoque.");
    }
  }

  function editarEstoque(id_estoque) {
    window.location.href = `/frontEnd/src/pages/estoque/editarEstoque.html?id=${id_estoque}`;
  }

  carregarEstoques();
  window.deletarEstoque = deletarEstoque;
  window.editarEstoque = editarEstoque;
});
