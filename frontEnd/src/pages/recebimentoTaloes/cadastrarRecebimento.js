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
  const horas = String(data.getHours()).padStart(2, "0");
  const minutos = String(data.getMinutes()).padStart(2, "0");
  return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
}

document
  .getElementById("novo-recebimento-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const remessa = document.getElementById("remessa").value;
    const solicitacao = document.getElementById("solicitacao").value;
    const quantidade = document.getElementById("quantidade").value;

    try {
      const token = getToken();
      
      const fetchMovResponse = await fetch(
        `http://localhost:3000/api/talons/all`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { movimentacoes } = await fetchMovResponse.json();

      if (!fetchMovResponse.ok) {
        throw new Error("Erro ao buscar movimentações.");
      }

      const movimentacaoEnvio = movimentacoes.find(
        (mov) => mov.remessa === remessa && mov.tipo_movimentacao === "Envio"
      );

      if (!movimentacaoEnvio) {
        throw new Error(
          "Não foi possível encontrar o envio correspondente à remessa."
        );
      }

      const idMovimentacao = movimentacaoEnvio.id_movimentacao;

      const response = await fetch(
        "http://localhost:3000/api/talons/cadastrar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            remessa,
            tipo_movimentacao: "Recebimento",
            id_solicitacao: solicitacao,
            data_movimentacao: Date.now(),
            data_prevista: movimentacaoEnvio.data_prevista,
            quantidade: quantidade,
            id_status: 7,
          }),
        }
      );

      const dataRecebimento = await response.json();

      if (!response.ok) {
        throw new Error(
          dataRecebimento.error || "Erro ao cadastrar recebimento."
        );
      }

      const updateResponse = await fetch(
        `http://localhost:3000/api/talons/editar/${idMovimentacao}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id_status: 6 }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error("Erro ao atualizar o status do envio para 'Entregue'.");
      }

      alert("Recebimento cadastrado com sucesso!");
      fecharModal("modal-novo-recebimento");
      document.getElementById("novo-recebimento-form").reset();
      window.location.href = "/frontEnd/src/pages/recebimentoTaloes/index.html";
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  });

async function carregarSolicitacao() {
  const token = getToken();
  const solicitacaoSelect = document.getElementById("solicitacao");
  solicitacaoSelect.innerHTML =
    '<option value="" disabled selected>Selecione um envio</option>';

  try {
    const response = await fetch("http://localhost:3000/api/talons/all", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { movimentacoes } = await response.json();

    const envioSemRecebimento = movimentacoes.filter((movimentacao) => {
      const remessaMovimentacoes = movimentacoes.filter(
        (m) => m.remessa === movimentacao.remessa
      );

      return (
        remessaMovimentacoes.some((m) => m.tipo_movimentacao === "Envio") &&
        !remessaMovimentacoes.some((m) => m.tipo_movimentacao === "Recebimento")
      );
    });

    envioSemRecebimento.forEach((envio) => {
      const option = document.createElement("option");
      option.value = envio.id_solicitacao;
      option.setAttribute("data-remessa", envio.remessa);
      option.textContent = `Remessa: ${envio.remessa} - ${envio.solicitacao.usuario.nome} - ${envio.quantidade} talões`;
      solicitacaoSelect.appendChild(option);
    });

    solicitacaoSelect.addEventListener("change", (e) => {
      const selectedOption = e.target.selectedOptions[0];
      const remessaValue = selectedOption.getAttribute("data-remessa");
      document.getElementById("remessa").value = remessaValue;
    });
  } catch (error) {
    console.error("Erro ao carregar envios:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  carregarSolicitacao();
});

function fecharModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}
