function getToken() {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1];
}

document
  .getElementById("cadastrar-loja-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const codigo = document.getElementById("codigo-cadastrar").value;
    const nome = document.getElementById("nome-cadastrar").value;
    const cidade = document.getElementById("cidade-cadastrar").value;

    try {
      const token = getToken();

      const response = await fetch(
        "http://localhost:3000/api/stores/cadastrar",
        {
          method: "POST",
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
        throw new Error(data.error || "Erro ao cadastrar loja.");
      }

      alert("Loja cadastrada com sucesso!");
      fecharModal("modal-cadastrar-loja");
      document.getElementById("cadastrar-loja-form").reset();
      carregarLojas();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  });

async function carregarLojas() {
  const token = getToken();
  const tabelaLojas = document.getElementById("tabela-lojas");

  try {
    const response = await fetch("http://localhost:3000/api/stores/all", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao carregar as lojas.");
    }

    const { lojas } = await response.json();
    lojas.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    tabelaLojas.innerHTML = "";

    lojas.forEach((loja) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
            <td>${loja.cod_loja}</td>
            <td>${loja.nome}</td>
            <td>${loja.cidade}</td>
            <td>
              <button class="edit-btn" onclick="abrirModalEdicao(${loja.id_loja})">✏️</button>
              <button class="delete-btn" onclick="deletarLoja(${loja.id_loja})">🗑️</button>
            </td>
          `;
      tabelaLojas.appendChild(tr);
    });
  } catch (error) {
    console.error("Erro ao carregar as lojas:", error);
  }
}

function fecharModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}
