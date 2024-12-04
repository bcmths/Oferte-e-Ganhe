document.addEventListener("DOMContentLoaded", () => {
  const tabelaRecebimentos = document.getElementById("tabela-recebimentos");

  function formatarDataHora(dataISO) {
    const data = new Date(dataISO);

    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();

    const hora = String(data.getHours()).padStart(2, "0");
    const minutos = String(data.getMinutes()).padStart(2, "0");

    return `${dia}/${mes}/${ano} ${hora}:${minutos}`;
  }

  async function carregarRecebimentos() {
    const token = window.getToken();
    try {
      const response = await fetch("http://localhost:3000/api/movements", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Erro ao carregar as movimentações");
      }

      const data = await response.json();
      const movimentacoes = data.movimentacoes;

      const recebimentos = movimentacoes.filter(
        (mov) => mov.tipo_movimentacao === "Recebimento"
      );

      tabelaRecebimentos.innerHTML = "";

      recebimentos.forEach((recebimento) => {
        const statusClass = recebimento.status.status
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/\s+/g, "")
          .toLowerCase();

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${recebimento.remessa}</td>
            <td>${recebimento.quantidade}</td>
            <td>${recebimento.solicitacao.loja.nome}</td>
            <td>${formatarDataHora(recebimento.data_movimentacao)}</td>
            <td>${formatarDataHora(recebimento.data_prevista)}</td>
            <td>${recebimento.usuario.nome}</td>
            <td>
              <span class="badge ${statusClass}">
                ${recebimento.status.status}
              </span>
            </td>
            <td>
              <button
                class="edit-btn"
                onclick="window.location.href='editarRecebimento.html?id=${
                  recebimento.id_movimentacao
                }'">
                ✏️
              </button>
              <button
                class="delete-btn"
                onclick="deletarRecebimento('${recebimento.id_movimentacao}')">
                🗑️
              </button>
            </td>
          `;
        tabelaRecebimentos.appendChild(tr);
      });
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar os recebimentos.");
    }
  }

  async function deletarRecebimento(id_movimentacao) {
    const confirmacao = confirm(
      "Tem certeza que deseja deletar este recebimento?"
    );
    if (!confirmacao) return;

    const token = window.getToken();
    try {
      const response = await fetch(
        `http://localhost:3000/api/movements/${id_movimentacao}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao deletar o recebimento");
      }

      alert("Recebimento deletado com sucesso!");
      carregarRecebimentos();
    } catch (error) {
      console.error(error);
      alert("Erro ao deletar o recebimento.");
    }
  }

  carregarRecebimentos();
});
