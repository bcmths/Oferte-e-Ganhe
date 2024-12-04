document.addEventListener("DOMContentLoaded", async () => {
  const permissoesContainer = document.getElementById("permissoes-container");
  const formEditarPerfil = document.getElementById("form-editar-perfil");
  const nomePerfilInput = document.getElementById("nome-perfil");

  const urlParams = new URLSearchParams(window.location.search);
  const idPerfil = urlParams.get("id");

  if (!idPerfil) {
    alert("ID do perfil não fornecido.");
    window.location.href = "/frontEnd/src/pages/perfis/index.html";
    return;
  }

  async function carregarPerfil() {
    const token = window.getToken();

    try {
      const response = await fetch("http://localhost:3000/api/profiles/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao carregar os perfis.");
      }

      const perfisData = await response.json();
      const perfis = perfisData.perfis;

      const perfil = perfis.find(
        (perfil) => parseInt(perfil.id_perfil) === parseInt(idPerfil)
      );

      if (!perfil) {
        throw new Error("Perfil não encontrado.");
      }

      nomePerfilInput.value = perfil.nome;

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
      const associacoesData = await responseAssociacao.json();
      const associacoes = associacoesData.associacoes;

      const permissoesAssociadas = associacoes.filter(
        (associacao) => associacao.id_perfil === perfil.id_perfil
      );

      await carregarPermissoes(permissoesAssociadas);
    } catch (error) {
      console.error("Erro ao carregar o perfil:", error);
      alert("Erro ao carregar o perfil.");
    }
  }

  async function carregarPermissoes(permissoesAssociadas) {
    const token = window.getToken();

    try {
      const responsePermissoes = await fetch(
        "http://localhost:3000/api/permissions/all",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!responsePermissoes.ok) {
        throw new Error("Erro ao carregar permissões do backend.");
      }

      const permissoesData = await responsePermissoes.json();
      const permissoes = permissoesData.permissoes;

      const permissoesAgrupadas = permissoes.reduce((acc, permissao) => {
        if (!acc[permissao.modulo]) {
          acc[permissao.modulo] = {};
        }
        acc[permissao.modulo][permissao.tipo_permissao] =
          permissao.id_permissao;
        return acc;
      }, {});

      permissoesContainer.innerHTML = "";

      Object.keys(permissoesAgrupadas).forEach((modulo) => {
        const div = document.createElement("div");

        const editarChecked = permissoesAssociadas.some(
          (assoc) => assoc.id_permissao === permissoesAgrupadas[modulo].Edição
        );

        const visualizarChecked = editarChecked
          ? true
          : permissoesAssociadas.some(
              (assoc) =>
                assoc.id_permissao === permissoesAgrupadas[modulo].Leitura
            );

        div.innerHTML = `
            <label>
              <input type="checkbox" class="editar-checkbox" data-id="${
                permissoesAgrupadas[modulo].Edição
              }" ${editarChecked ? "checked" : ""} />
              ${modulo} - Editar
            </label>
            <label>
              <input type="checkbox" class="visualizar-checkbox" data-id="${
                permissoesAgrupadas[modulo].Leitura
              }" ${visualizarChecked ? "checked" : ""} ${
          editarChecked ? "disabled" : ""
        } />
              ${modulo} - Visualizar
            </label>
          `;
        permissoesContainer.appendChild(div);
      });
    } catch (error) {
      console.error("Erro ao carregar permissões:", error);
      alert("Erro ao carregar permissões.");
    }
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

  formEditarPerfil.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nomePerfil = nomePerfilInput.value;
    const checkboxes = document.querySelectorAll(
      "#permissoes-container input[type='checkbox']:checked"
    );

    const permissoesSelecionadas = Array.from(checkboxes).map((checkbox) =>
      parseInt(checkbox.dataset.id)
    );

    const token = window.getToken();

    try {
      const responsePerfil = await fetch(
        `http://localhost:3000/api/profiles/editar/${idPerfil}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ nome: nomePerfil }),
        }
      );

      if (!responsePerfil.ok) {
        throw new Error("Erro ao salvar alterações do perfil.");
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

      if (!responsePermissoes.ok) {
        throw new Error("Erro ao salvar alterações das permissões.");
      }

      alert("Perfil e permissões atualizados com sucesso!");
      window.location.href = "/frontEnd/src/pages/perfis/index.html";
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      alert("Erro ao salvar alterações do perfil ou permissões.");
    }
  });

  await carregarPerfil();
});
