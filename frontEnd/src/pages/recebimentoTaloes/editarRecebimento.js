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

async function abrirModalEdicao(idRecebimento) {
  const token = getToken();

  try {
    const response = await fetch("http://localhost:3000/api/talons/all", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao carregar a lista de recebimentos.");
    }

    const data = await response.json();
    const recebimentos = data.movimentacoes;

    const recebimento = recebimentos.find(
      (r) => r.id_movimentacao == idRecebimento
    );

    if (!recebimento) {
      throw new Error("Recebimento não encontrado.");
    }

    document.getElementById("id-recebimento-editar").value = idRecebimento;
    document.getElementById("remessa-editar").value = recebimento.remessa;
    document.getElementById("quantidade-editar").value = recebimento.quantidade;
    document.getElementById("data-editar").value = formatarDataHora(
      recebimento.data_prevista
    );

    carregarSolicitacaoEdicao(recebimento.solicitacao.id_solicitacao);

    abrirModal("modal-editar-recebimento");
  } catch (error) {
    console.error(error);
    alert("Erro ao carregar os dados do recebimento.");
  }
}

async function carregarSolicitacaoEdicao(idRecebimento) {
  const token = getToken();
  const solicitacaoSelect = document.getElementById("solicitacao-editar");
  solicitacaoSelect.innerHTML = "";

  try {
    const response = await fetch(
      "http://localhost:3000/api/solicitations/all",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { solicitacoes } = await response.json();
    solicitacoes.forEach((solicitacao) => {
      const option = document.createElement("option");
      option.value = solicitacao.id_solicitacao;
      option.textContent = `ID: ${solicitacao.id_solicitacao} - ${solicitacao.usuario.nome} - ${solicitacao.quantidade_taloes} talões`;
      if (solicitacao.id_solicitacao === idRecebimento) option.selected = true;
      solicitacaoSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao carregar recebimentos:", error);
  }
}

function abrirModal(modalId, idRecebimento) {
  const modal = document.getElementById(modalId);
  if (modal) {
    document.getElementById(modalId).style.display = "block";
    modal.setAttribute("id-recebimento-editar", idRecebimento);
  }
}

function fecharModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("editar-recebimento-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const token = getToken();

      const remessa = document.getElementById("remessa-editar").value;
      const quantidade = document.getElementById("quantidade-editar").value;
      const data = document.getElementById("data-editar").value;
      const solicitacao = document.getElementById("solicitacao-editar").value;
      const idRecebimento = document.getElementById("id-recebimento-editar").value;      

      try {
        const response = await fetch(
          `http://localhost:3000/api/talons/editar/${idRecebimento}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              remessa,
              quantidade,
              data_prevista: data,
              data_movimentação: Date.now(),
              id_solicitacao: solicitacao,
              id_status: 7,
            }),
          }
        );
        console.log(await response.json());

        if (!response.ok) {
          throw new Error("Erro ao atualizar o recebimento.");
        }

        alert("Recebimento atualizado com sucesso!");
        fecharModal("modal-editar-recebimento");

        window.location.href =
          "/frontEnd/src/pages/recebimentoTaloes/index.html";
      } catch (error) {
        console.error(error);
        alert("Erro ao atualizar o recebimento.");
      }
    });
  }
});

window.abrirModalEdicao = abrirModalEdicao;
window.fecharModal = fecharModal;
