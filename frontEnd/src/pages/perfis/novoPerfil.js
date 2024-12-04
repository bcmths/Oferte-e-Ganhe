document.addEventListener("DOMContentLoaded", async () => {
  const permissoesContainer = document.getElementById("permissoes-container");
  const formNovoPerfil = document.getElementById("form-novo-perfil");

  async function carregarPermissoes() {
    const token = window.getToken();
    try {
      const response = await fetch(
        "http://localhost:3000/api/permissions/all",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao carregar permissões do backend.");
      }

      const permissoesData = await response.json();
      const permissoes = permissoesData.permissoes;

      return permissoes;
    } catch (error) {
      console.error("Erro ao carregar permissões:", error);
      alert("Erro ao carregar permissões.");
      return [];
    }
  }

  async function renderizarPermissoes() {
    permissoesContainer.innerHTML = "";

    const permissoes = await carregarPermissoes();

    const permissoesAgrupadas = permissoes.reduce((acc, permissao) => {
      if (!acc[permissao.modulo]) {
        acc[permissao.modulo] = {};
      }
      acc[permissao.modulo][permissao.tipo_permissao] = permissao.id_permissao;
      return acc;
    }, {});


    Object.keys(permissoesAgrupadas).forEach((modulo) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <label>
          <input type="checkbox" class="editar-checkbox" data-id="${permissoesAgrupadas[modulo].Edição}" />
          ${modulo} - Editar
        </label>
        <label>
          <input type="checkbox" class="visualizar-checkbox" data-id="${permissoesAgrupadas[modulo].Leitura}" />
          ${modulo} - Visualizar
        </label>
      `;
      permissoesContainer.appendChild(div);
    });
  }

  permissoesContainer.addEventListener("change", (event) => {
    if (event.target.classList.contains("editar-checkbox")) {
      const editarCheckbox = event.target;
      const visualizarCheckbox = editarCheckbox
        .closest("div")
        .querySelector(".visualizar-checkbox");

      if (editarCheckbox.checked) {
        visualizarCheckbox.checked = true;
        visualizarCheckbox.disabled = true;
      } else {
        visualizarCheckbox.disabled = false;
      }
    }
  });

  formNovoPerfil.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nomePerfil = document.getElementById("nome-perfil").value;
    const checkboxes = document.querySelectorAll(
      "#permissoes-container input[type='checkbox']:checked"
    );

    const permissoesSelecionadas = Array.from(checkboxes).map((checkbox) =>
      parseInt(checkbox.dataset.id)
    );

    const token = window.getToken();

    try {
      const responsePerfil = await fetch(
        "http://localhost:3000/api/profiles/cadastrar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ nome: nomePerfil }),
        }
      );

      if (!responsePerfil.ok) {
        throw new Error("Erro ao criar o perfil.");
      }

      const perfilCriado = await responsePerfil.json();
      console.log("Perfil criado:", perfilCriado);

      const responseAssociacao = await fetch(
        "http://localhost:3000/api/associations/cadastrar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id_perfil: perfilCriado.id_perfil,
            permissoes: permissoesSelecionadas,
          }),
        }
      );

      if (!responseAssociacao.ok) {
        throw new Error("Erro ao associar permissões ao perfil.");
      }

      alert("Perfil e permissões associados com sucesso!");
      window.location.href = "/frontEnd/src/pages/perfis/index.html";
    } catch (error) {
      console.error("Erro ao criar perfil ou associar permissões:", error);
      alert("Erro ao criar o perfil ou associar permissões.");
    }
  });
  renderizarPermissoes();
});
