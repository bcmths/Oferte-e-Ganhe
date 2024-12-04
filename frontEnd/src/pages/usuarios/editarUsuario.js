function getToken() {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1];
}

document.addEventListener("DOMContentLoaded", carregarUsuario);

async function carregarUsuario() {
  const token = getToken();
  const matricula = new URLSearchParams(window.location.search).get("id");

  if (!matricula) {
    alert("Matrícula de usuário não fornecida.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/users/all`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao carregar dados do usuário.");
    }

    const usuariosData = await response.json();
    const usuarios = usuariosData.usuarios;
    const usuario = usuarios.find((user) => user.matricula === matricula);

    if (!usuario) {
      throw new Error("Usuário não encontrado.");
    }

    document.getElementById("matricula").value = usuario.matricula;
    document.getElementById("nome").value = usuario.nome;
    document.getElementById("email").value = usuario.email;

    await carregarLojas(usuario.id_loja);

    await carregarPerfis(usuario.id_perfil);
  } catch (error) {
    console.error(error);
    alert("Erro ao carregar dados do usuário.");
  }
}

async function carregarLojas(selectedLojaId) {
  const token = getToken();

  try {
    const lojasResponse = await fetch("http://localhost:3000/api/stores/all", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!lojasResponse.ok) {
      throw new Error("Erro ao carregar lojas.");
    }

    const lojasData = await lojasResponse.json();
    const lojas = lojasData.lojas;

    const lojaSelect = document.getElementById("loja");
    lojas.forEach((loja) => {
      const option = document.createElement("option");
      option.value = loja.id_loja;
      option.textContent = loja.nome;
      if (loja.id === selectedLojaId) {
        option.selected = true;
      }
      lojaSelect.appendChild(option);
    });
  } catch (error) {
    console.error(error);
    alert("Erro ao carregar lojas.");
  }
}

async function carregarPerfis(selectedPerfilId) {
  const token = getToken();

  try {
    const perfisResponse = await fetch(
      "http://localhost:3000/api/profiles/all",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!perfisResponse.ok) {
      throw new Error("Erro ao carregar perfis.");
    }

    const perfisData = await perfisResponse.json();
    const perfis = perfisData.perfis;

    const perfilSelect = document.getElementById("perfil");
    perfis.forEach((perfil) => {
      const option = document.createElement("option");
      option.value = perfil.id_perfil;
      option.textContent = perfil.nome;
      if (perfil.id === selectedPerfilId) {
        option.selected = true;
      }
      perfilSelect.appendChild(option);
    });
  } catch (error) {
    console.error(error);
    alert("Erro ao carregar perfis.");
  }
}

document
  .getElementById("editar-usuario-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const matricula = new URLSearchParams(window.location.search).get("id");
    const novaMatricula = document.getElementById("matricula").value;
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const loja = document.getElementById("loja").value;
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmar-senha").value;
    const perfil = document.getElementById("perfil").value;

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem. Por favor, verifique.");
      return;
    }

    try {
      const token = getToken();
      const response = await fetch(
        `http://localhost:3000/api/users/editar/${matricula}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nome,
            novaMatricula,
            email,
            senha,
            id_perfil: perfil,
            id_loja: loja,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar usuário.");
      }

      alert("Usuário atualizado com sucesso!");
      window.location.href = "/frontEnd/src/pages/usuarios/index.html";
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar o usuário.");
    }
  });
