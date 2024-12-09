document.addEventListener("DOMContentLoaded", () => {
  const tabelaEnvios = document.getElementById("tabela-envios");

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

  function getBadgeClass(status) {
    switch (status.toLowerCase()) {
      case "atrasado":
        return "badge atrasado";
      case "enviado":
        return "badge enviado";
      case "entregue":
        return "badge entregue";
      default:
        return "badge-default";
    }
  }

  async function carregarEnvios() {
    const token = getToken();
    try {
      const response = await fetch("http://localhost:3000/api/talons/all", {
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

      const envios = movimentacoes.filter(
        (mov) => mov.tipo_movimentacao === "Envio"
      );

      tabelaEnvios.innerHTML = "";

      envios.forEach((envio) => {
        console.log(envio.status.status);
        
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${envio.remessa}</td>
            <td>${formatarDataHora(envio.data_movimentacao)}</td>
            <td>${formatarDataHora(envio.data_prevista)}</td>
            <td>${envio.quantidade}</td>
            <td>
              <span class="badge ${getBadgeClass(envio.status.status)}">${
          envio.status.status
        }</span>
            </td>

            <td>
              <button
                class="edit-btn"
                onclick="window.location.href='editarEnvio.html?id=${
                  envio.id_movimentacao
                }'">
                ✏️
              </button>
              <button
                class="delete-btn"
                onclick="deletarEnvio('${envio.id_movimentacao}')">
                🗑️
              </button>
            </td>

          `;
        tabelaEnvios.appendChild(tr);
      });
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar os envios.");
    }
  }

  async function deletarEnvio(id_movimentacao) {
    const confirmacao = confirm(
      "Tem certeza que deseja deletar esta movimentação?"
    );
    if (!confirmacao) return;

    const token = getToken();
    try {
      const response = await fetch(
        `http://localhost:3000/api/talons/deletar/${id_movimentacao}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao deletar a movimentação");
      }

      alert("Movimentação deletada com sucesso!");
      carregarEnvios();
    } catch (error) {
      console.error(error);
      alert("Erro ao deletar a movimentação.");
    }
  }

  carregarEnvios();
  window.deletarEnvio = deletarEnvio;
});
