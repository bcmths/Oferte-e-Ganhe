function getToken() {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1];
}

async function abrirModalEdicao(idLoja) {
  const token = getToken();

  try {
    const response = await fetch("http://localhost:3000/api/stores/all", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao carregar a lista de lojas.");
    }

    const { lojas } = await response.json();

    const loja = lojas.find((l) => l.id_loja === idLoja);
    if (!loja) {
      throw new Error("Loja não encontrada.");
    }

    document.getElementById("id-loja-editar").value = loja.id_loja;
    document.getElementById("codigo-editar").value = loja.cod_loja;
    document.getElementById("nome-editar").value = loja.nome;
    document.getElementById("cidade-editar").value = loja.cidade;

    abrirModal("modal-editar-loja");
  } catch (error) {
    console.error(error);
    alert("Erro ao carregar os dados da loja.");
  }
}

function abrirModal(modalId, idLoja) {
  const modal = document.getElementById(modalId);
  if (modal) {
    document.getElementById(modalId).style.display = "block";
    modal.setAttribute("id-loja-editar", idLoja);
  }
}

function fecharModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

document
  .getElementById("editar-loja-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = getToken();

    const idLoja = document.getElementById("id-loja-editar").value;
    const codigo = document.getElementById("codigo-editar").value;
    const nome = document.getElementById("nome-editar").value;
    const cidade = document.getElementById("cidade-editar").value;

    try {
      const response = await fetch(
        `http://localhost:3000/api/stores/editar/${idLoja}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            cod_loja: codigo,
            nome: nome,
            cidade: cidade,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erro ao atualizar o loja.");
      }

      alert("Loja atualizada com sucesso!");
      fecharModal("modal-editar-loja");
      window.location.href = "/frontEnd/src/pages/lojas/index.html";
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  });

window.abrirModalEdicao = abrirModalEdicao;
window.fecharModal = fecharModal;
window.abrirModal = abrirModal;
