function getToken() {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1];
}

document
  .getElementById("novo-perfil-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome-perfil").value;
    const checkboxes = document.querySelectorAll(
      "#permissoes-cadastrar-container input[type='checkbox']:checked"
    );
    const permissoesSelecionadas = Array.from(checkboxes).map((checkbox) =>
      parseInt(checkbox.dataset.id)
    );

    if (!nome.trim()) {
      alert("O nome do perfil é obrigatório.");
      return;
    }

    if (permissoesSelecionadas.length === 0) {
      alert("Selecione ao menos uma permissão para o perfil.");
      return;
    }

    try {
      const token = getToken();

      const responsePerfil = await fetch(
        "http://localhost:3000/api/profiles/cadastrar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ nome: nome }),
        }
      );

      if (!responsePerfil.ok) {
        throw new Error("Erro ao criar o perfil.");
      }

      const perfilCriado = await responsePerfil.json();

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
      alert("Perfil cadastrado com sucesso!");
      fecharModal("modal-cadastrar-perfil");
      document.getElementById("novo-perfil-form").reset();
      carregarPerfis();
    } catch (error) {
      console.error("Erro ao cadastrar perfil:", error);
      alert("Erro ao cadastrar perfil.");
    }
  });

  async function carregarPermissoes() {
    const token = getToken();
    const permissoesContainer = document.getElementById("permissoes-cadastrar-container");
  
    try {
      const response = await fetch("http://localhost:3000/api/permissions/all", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Erro ao carregar permissões.");
      }
  
      const permissoesData = await response.json();
      const permissoes = permissoesData.permissoes;
  
      // Agrupar as permissões por módulo e tipo
      const permissoesAgrupadas = permissoes.reduce((acc, permissao) => {
        if (!acc[permissao.modulo]) {
          acc[permissao.modulo] = {};
        }
        acc[permissao.modulo][permissao.tipo_permissao] = permissao.id_permissao;
        return acc;
      }, {});
  
      // Adicionar a classe "permission-container" para exibir os itens lado a lado
      permissoesContainer.innerHTML = "<div class='permission-container'></div>";
      const permissionContainer = permissoesContainer.querySelector('.permission-container');
  
      Object.keys(permissoesAgrupadas).forEach((modulo) => {
        const div = document.createElement("div");
  
        div.innerHTML = `
          <div class="permission-group">
            <span>${modulo}</span>
            <label>
              <input type="checkbox" class="editar-checkbox" data-id="${permissoesAgrupadas[modulo].Edição}" />
              Editar
            </label>
            <label>
              <input type="checkbox" class="visualizar-checkbox" data-id="${permissoesAgrupadas[modulo].Leitura}" />
              Visualizar
            </label>
          </div>
        `;
  
        permissionContainer.appendChild(div);
      });
  
      permissoesContainer
        .querySelectorAll(".editar-checkbox")
        .forEach((editarCheckbox) => {
          const visualizarCheckbox = editarCheckbox
            .closest(".permission-group")
            .querySelector(".visualizar-checkbox");
  
          editarCheckbox.addEventListener("change", () => {
            if (editarCheckbox.checked) {
              visualizarCheckbox.checked = true;
              visualizarCheckbox.disabled = true;
            } else {
              visualizarCheckbox.disabled = false;
            }
          });
        });
    } catch (error) {
      console.error("Erro ao carregar permissões:", error);
      alert("Erro ao carregar permissões.");
    }
  }
  

document.addEventListener("DOMContentLoaded", () => {
  carregarPermissoes();
});

function abrirModal(modalId) {
  document.getElementById(modalId).style.display = "block";
}

function fecharModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

window.abrirModal = abrirModal;
window.fecharModal = fecharModal;

document.addEventListener("DOMContentLoaded", () => {
  carregarPermissoes();
});

window.abrirModal = abrirModal;
window.fecharModal = fecharModal;
