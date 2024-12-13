function getToken() {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1];
}

document
  .getElementById("editar-perfil-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome-editar").value;
    const idPerfil = document.getElementById("id-perfil-editar").value;

    const checkboxes = document.querySelectorAll(
      "#permissoes-editar-container input[type='checkbox']:checked"
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
        `http://localhost:3000/api/profiles/editar/${idPerfil}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ nome: nome }),
        }
      );

      const data = await responsePerfil.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar perfil.");
      }

      const responsePermissoes = await fetch(
        `http://localhost:3000/api/associations/editar/${idPerfil}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ permissoes: permissoesSelecionadas }),
        }
      );

      const dataPermissoes = await responsePermissoes.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar perfil.");
      }
      alert("Perfil editado com sucesso!");
      fecharModal("modal-editar-perfil");
      document.getElementById("editar-perfil-form").reset();
      carregarPerfis();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  });

async function carregarPerfilParaEdicao(idPerfil) {
  const token = getToken();

  try {
    const responseAssociacao = await fetch(
      "http://localhost:3000/api/associations/all",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!responseAssociacao.ok) {
      throw new Error("Erro ao carregar associações de permissões.");
    }

    const associacoesData = await responseAssociacao.json();
    const associacoes = associacoesData.associacoes;

    const permissoesAssociadas = associacoes.filter(
      (associacao) => associacao.id_perfil == idPerfil
    );

    document.getElementById("id-perfil-editar").value = idPerfil;
    document.getElementById("nome-editar").value =
      permissoesAssociadas.length > 0
        ? permissoesAssociadas[0].perfil.nome
        : "Sem permissões";

    await carregarPermissoesEditar(permissoesAssociadas);

    abrirModal("modal-editar-perfil", idPerfil);
  } catch (error) {
    console.error("Erro ao carregar perfil para edição:", error);
    alert("Erro ao carregar perfil.");
  }
}

async function carregarPermissoesEditar(permissoesAssociadas) {
  const token = getToken();
  const permissoesContainer = document.getElementById(
    "permissoes-editar-container"
  );

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

    const permissoesAgrupadas = permissoes.reduce((acc, permissao) => {
      if (!acc[permissao.modulo]) {
        acc[permissao.modulo] = {};
      }
      acc[permissao.modulo][permissao.tipo_permissao] = permissao.id_permissao;
      return acc;
    }, {});

    permissoesContainer.innerHTML = "<div class='permission-container'></div>";
    const permissionContainer = permissoesContainer.querySelector(
      ".permission-container"
    );

    Object.keys(permissoesAgrupadas).forEach((modulo) => {
      const div = document.createElement("div");

      const editarId = permissoesAgrupadas[modulo].Edição;
      const visualizarId = permissoesAgrupadas[modulo].Leitura;

      div.innerHTML = `
        <div class="permission-group">
          <span>${modulo}</span>
          <label>
            <input type="checkbox" class="editar-checkbox" data-id="${editarId}" />
            Editar
          </label>
          <label>
            <input type="checkbox" class="visualizar-checkbox" data-id="${visualizarId}" />
            Visualizar
          </label>
        </div>
      `;

      permissionContainer.appendChild(div);
    });

    const permissoesIds = permissoesAssociadas.map(
      (associacao) => associacao.id_permissao
    );
    const checkboxes = permissoesContainer.querySelectorAll(
      "input[type='checkbox']"
    );

    checkboxes.forEach((checkbox) => {
      const idPermissao = parseInt(checkbox.dataset.id, 10);
      checkbox.checked = permissoesIds.includes(idPermissao);
    });

    permissoesContainer
      .querySelectorAll(".editar-checkbox")
      .forEach((editarCheckbox) => {
        const visualizarCheckbox = editarCheckbox
          .closest(".permission-group")
          .querySelector(".visualizar-checkbox");

        if (editarCheckbox.checked) {
          visualizarCheckbox.checked = true;
          visualizarCheckbox.disabled = true;
        }

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

function abrirModal(modalId, idPerfil) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "block";
    modal.setAttribute("id-perfil-editar", idPerfil);
  }
}

function fecharModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
  }
}

window.abrirModal = abrirModal;
window.fecharModal = fecharModal;
window.carregarPerfilParaEdicao = carregarPerfilParaEdicao;
