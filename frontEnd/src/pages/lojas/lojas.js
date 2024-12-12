document.addEventListener("DOMContentLoaded", () => {
  const tabelaLojas = document.getElementById("tabela-lojas");
  const formCadastrar = document.getElementById("cadastrar-loja-form");
  const formEditar = document.getElementById("editar-loja-form");
  const closeBtns = document.querySelectorAll(".close-btn");
  const paginationContainer = document.querySelector(".pagination");
  const searchInput = document.getElementById("search");
  const rowsPerPageSelect = document.getElementById("rows-per-page");

  let lojas = [];
  let paginaAtual = 1;
  let rowsPerPage = 5;
  
  function getToken() {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];
  }

  function abrirModal(modal) {
    document.getElementById(modal).style.display = "block";
  }

  function fecharModal(modal) {
    document.getElementById(modal).style.display = "none";
  }

  closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      fecharModal('modal-cadastrar-loja');
      fecharModal('modal-editar-loja');
    });
  });

  async function carregarLojas() {
    const token = getToken();

    try {
      const response = await fetch("http://localhost:3000/api/stores/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao carregar as lojas.");
      }

      const data = await response.json();
      lojas = data.lojas;
      renderizarTabela(lojas);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar as lojas.");
    }
  }

  function renderizarTabela(lojas) {
    tabelaLojas.innerHTML = "";

    const inicio = (paginaAtual - 1) * rowsPerPage;
    const fim = inicio + rowsPerPage;

    const lojasPaginadas = lojas.slice(inicio, fim);

    lojasPaginadas.forEach((loja) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${loja.cod_loja}</td>
        <td>${loja.nome}</td>
        <td>${loja.cidade}</td>
        <td>
          <button class="edit-btn" onclick="abrirModalEdicaoLoja(${loja.id_loja})">✏️</button>
          <button class="delete-btn" onclick="deletarLoja(${loja.id_loja})">🗑️</button>
        </td>
      `;
      tabelaLojas.appendChild(tr);
    });
    renderizarPaginacao(lojas.length);
  }

  function renderizarPaginacao(totalLojas) {
    const totalPaginas = Math.ceil(totalLojas / rowsPerPage);
    paginationContainer.innerHTML = "";

    for (let i = 1; i <= totalPaginas; i++) {
      const button = document.createElement("button");
      button.classList.add("page-btn");
      if (i === paginaAtual) {
        button.classList.add("active");
      }
      button.textContent = i;
      button.addEventListener("click", () => {
        paginaAtual = i;
        filtrarLojas();
      });
      paginationContainer.appendChild(button);
    }
  }

  function filtrarLojas() {
    const termoPesquisa = searchInput.value.toLowerCase();

    const lojasFiltradas = lojas.filter((loja) => {
      return loja.nome.toLowerCase().includes(termoPesquisa);
    });

    renderizarTabela(lojasFiltradas);
  }

  rowsPerPageSelect.addEventListener("change", () => {
    rowsPerPage = parseInt(rowsPerPageSelect.value);
    paginaAtual = 1;
    filtrarLojas();
  });

  searchInput.addEventListener("input", () => {
    paginaAtual = 1;
    filtrarLojas();
  });

  async function cadastrarLoja(e) {
    e.preventDefault();

    const token = getToken();
    const codigo = document.getElementById("codigo-cadastrar").value;
    const nome = document.getElementById("nome-cadastrar").value;
    const cidade = document.getElementById("cidade-cadastrar").value;

    try {
      const response = await fetch(
        "http://localhost:3000/api/stores/cadastrar",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cod_loja: codigo, nome, cidade }),
        }
      );

      if (!response.ok) throw new Error("Erro ao criar loja.");

      alert("Loja cadastrada com sucesso!");
      fecharModal('modal-cadastrar-loja');
      formCadastrar.reset();
      carregarLojas();
    } catch (error) {
      console.error(error);
      alert("Erro ao criar loja.");
    }
  }

  async function abrirModalEdicaoLoja(idLoja) {

    try {
      const loja = lojas.find((l) => l.id_loja === idLoja);
      if (!loja) throw new Error("Loja não encontrada.");

      document.getElementById("codigo-editar").value = loja.cod_loja;
      document.getElementById("nome-editar").value = loja.nome;
      document.getElementById("cidade-editar").value = loja.cidade;
      document.getElementById("codigo-editar").dataset.id = loja.id_loja;

      abrirModal('modal-editar-loja');
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar os dados da loja.");
    }
  }

  async function editarLoja(e) {
    e.preventDefault();

    const token = getToken();
    const idLoja = document.getElementById("codigo-editar").dataset.id;
    const nome = document.getElementById("nome-editar").value;
    const cidade = document.getElementById("cidade-editar").value;
    const codigo = document.getElementById("codigo-editar").value;

    try {
      const response = await fetch(
        `http://localhost:3000/api/stores/editar/${idLoja}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cod_loja: codigo, nome, cidade }),
        }
      );

      if (!response.ok) throw new Error("Erro ao atualizar a loja.");

      alert("Loja atualizada com sucesso!");
      fecharModal('modal-editar-loja');
      carregarLojas();
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar a loja.");
    }
  }

  async function deletarLoja(idLoja) {
    const token = getToken();
    const confirmacao = confirm("Tem certeza que deseja deletar esta loja?");
    if (!confirmacao) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/stores/deletar/${idLoja}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Erro ao deletar a loja.");

      alert("Loja deletada com sucesso!");
      carregarLojas();
    } catch (error) {
      console.error(error);
      alert("Erro ao deletar a loja.");
    }
  }

  formCadastrar.addEventListener("submit", cadastrarLoja);
  formEditar.addEventListener("submit", editarLoja);

  carregarLojas();
  window.abrirModalEdicaoLoja = abrirModalEdicaoLoja;
  window.deletarLoja = deletarLoja;
  window.abrirModal = abrirModal;
  window.fecharModal = fecharModal;
});

document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");
  const toggleButton = document.getElementById("sidebar-toggle");

  toggleButton.addEventListener("click", (event) => {
    event.stopPropagation();
    sidebar.classList.toggle("active");
  });

  document.addEventListener("click", (event) => {
    if (
      !sidebar.contains(event.target) &&
      !toggleButton.contains(event.target)
    ) {
      sidebar.classList.remove("active");
    }
  });
});

