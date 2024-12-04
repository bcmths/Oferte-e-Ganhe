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
    switch (status.toLowerCase()) {
      case "aceita":
        return "badge status-aceita";
      case "recusada":
        return "badge status-recusada";
      default:
        return "badge";
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
      console.log(solicitacoes);

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
      });
    } catch (error) {
      console.error("Erro ao carregar as solicitações:", error);
      alert("Erro ao carregar as solicitações.");
    }
  }

  carregarSolicitacoes();
});
