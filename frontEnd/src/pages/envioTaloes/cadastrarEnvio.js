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
  .getElementById("novo-envio-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const remessa = document.getElementById("remessa").value;
    const solicitacao = document.getElementById("solicitacao").value;
    const data = document.getElementById("data-prevista").value;
    const quantidade = document.getElementById("quantidade").value;

    try {
      const token = getToken();

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
            tipo_movimentacao: "Envio",
            id_solicitacao: solicitacao,
            data_movimentacao: Date.now(),
            data_prevista: data,
            quantidade: quantidade,
            id_status: 1,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao cadastrar envio.");
      }

      alert("Envio cadastrado com sucesso!");
      fecharModal("modal-novo-envio");
      document.getElementById("novo-envio-form").reset();
      location.reload();
    } catch (error) {
      console.error("Erro ao cadastrar envio:", error);
      alert("Erro ao cadastrar envio.");
    }
  });

async function carregarSolicitacao() {
  const token = getToken();
  const solicitacaoSelect = document.getElementById("solicitacao");
  solicitacaoSelect.innerHTML =
    '<option value="" disabled selected>Selecione uma solicitação</option>';

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
      solicitacaoSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao carregar solicitações:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  carregarSolicitacao();
});

function fecharModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}
