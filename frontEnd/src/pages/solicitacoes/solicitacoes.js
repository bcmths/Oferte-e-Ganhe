document.addEventListener("DOMContentLoaded", () => {
  const tabelaSolicitacoes = document.querySelector("tbody");

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
    console.log(status.toLowerCase());
    
    switch (status.toLowerCase()) {
      case "solicitação aceita":
        return "badge status-aceita";
      case "solicitação recusada":
        return "badge status-recusada";
      default:
        return "badge";
    }
  }

  async function atualizarStatusSolicitacao(solicitacao, novoStatus) {
    const token = getToken();

    try {
      const response = await fetch(
        `http://localhost:3000/api/solicitations/editar/${solicitacao.id_solicitacao}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data_solicitacao: solicitacao.data_solicitacao,
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
      const solicitacoes = solicitacoesData.solicitacoes;

      tabelaSolicitacoes.innerHTML = "";

      solicitacoes.forEach((solicitacao) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
              <td>${solicitacao.usuario.loja.nome}</td>
              <td>${solicitacao.quantidade_taloes}</td>
              <td>${formatarDataHora(solicitacao.created_at)}</td>
              <td>${solicitacao.usuario.nome || "N/A"}</td>
              <td>
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
              </td>
              <td>
                <button class="edit-btn" onclick="editarSolicitacao(${
                  solicitacao.id_solicitacao
                })">✏️</button>
                <button class="delete-btn" onclick="deletarSolicitacao(${
                  solicitacao.id_solicitacao
                })">🗑️</button>
              </td>
            `;
        tabelaSolicitacoes.appendChild(tr);

        if (solicitacao.status.status === "Pendente") {
          tr.querySelector(".btn-status.aceitar").addEventListener(
            "click",
            () => atualizarStatusSolicitacao(solicitacao, 2)
          );
          tr.querySelector(".btn-status.recusar").addEventListener(
            "click",
            () => atualizarStatusSolicitacao(solicitacao, 3)
          );
        }
      });
    } catch (error) {
      console.error("Erro ao carregar as solicitações:", error);
      alert("Erro ao carregar as solicitações.");
    }
  }

  function editarSolicitacao(id_solicitacao) {
    window.location.href = `/frontEnd/src/pages/solicitacoes/editarSolicitacao.html?id=${id_solicitacao}`;
  }

  async function deletarSolicitacao(id_solicitacao) {
    const confirmacao = confirm(
      "Tem certeza que deseja deletar esta solicitação?"
    );
    if (!confirmacao) return;

    const token = getToken();

    try {
      const response = await fetch(
        `http://localhost:3000/api/solicitations/deletar/${id_solicitacao}`,
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
  window.editarSolicitacao = editarSolicitacao;
  window.deletarSolicitacao = deletarSolicitacao;
});
