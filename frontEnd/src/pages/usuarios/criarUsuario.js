function getToken() {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1];
}

document
  .getElementById("novo-usuario-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const loja = document.getElementById("loja").value;
    const matricula = document.getElementById("matricula").value;
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmar-senha").value;
    const perfil = document.getElementById("perfil").value;

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    try {
      const token = getToken();

      const response = await fetch(
        "http://localhost:3000/api/users/cadastrar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nome,
            email,
            matricula,
            senha,
            id_loja: loja,
            id_perfil: perfil,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar usuário.");
      }

      alert("Usuário cadastrado com sucesso!");
      fecharModal("modal-novo-usuario");
      document.getElementById("novo-usuario-form").reset();
      carregarUsuarios();
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  });

async function carregarUsuarios() {
  const token = getToken();
  const tabelaUsuarios = document.getElementById("tabela-usuarios");

  try {
    const response = await fetch("http://localhost:3000/api/users/all", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao carregar os usuários.");
    }

    const { usuarios } = await response.json();
    usuarios.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    tabelaUsuarios.innerHTML = "";

    usuarios.forEach((usuario) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${usuario.matricula}</td>
        <td>${usuario.nome}</td>
        <td>${usuario.loja.nome}</td>
        <td>${new Date(usuario.created_at).toLocaleDateString()}</td>
        <td>${usuario.perfil.nome}</td>
        <td>
          <button class="edit-btn" onclick="abrirModalEdicao('${
            usuario.matricula
          }')">✏️</button>
          <button class="delete-btn" onclick="deletarUsuario('${
            usuario.matricula
          }')">🗑️</button>
        </td>
      `;
      tabelaUsuarios.appendChild(tr);
    });
  } catch (error) {
    console.error("Erro ao carregar os usuários:", error);
  }
}

async function carregarLojas() {
  const token = getToken();
  const lojaSelect = document.getElementById("loja");
  lojaSelect.innerHTML =
    '<option value="" disabled selected>Selecione uma loja</option>';
  try {
    const response = await fetch("http://localhost:3000/api/stores/all", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { lojas } = await response.json();
    lojas.forEach((loja) => {
      const option = document.createElement("option");
      option.value = loja.id_loja;
      option.textContent = loja.nome;
      lojaSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao carregar lojas:", error);
  }
}

async function carregarPerfis() {
  const token = getToken();
  const perfilSelect = document.getElementById("perfil");
  perfilSelect.innerHTML =
    '<option value="" disabled selected>Selecione um perfil</option>';

  try {
    const response = await fetch("http://localhost:3000/api/profiles/all", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { perfis } = await response.json();
    perfis.forEach((perfil) => {
      const option = document.createElement("option");
      option.value = perfil.id_perfil;
      option.textContent = perfil.nome;
      perfilSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao carregar perfis:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  carregarLojas();
  carregarPerfis();
});

function fecharModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}
