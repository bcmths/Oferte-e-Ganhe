function getToken() {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1];
}

function deleteToken() {
  document.cookie =
    "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
function logout() {
  const token = getToken();
  if (token) {
    deleteToken();
  }
  window.location.href = "/frontEnd/src/pages/login/index.html";
}

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
    return null;
  }
}

async function abrirModalEdicao(matricula) {
  const token = getToken();

  try {
    const response = await fetch("http://localhost:3000/api/users/all", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao carregar a lista de usuários.");
    }

    const { usuarios } = await response.json();

    const usuario = usuarios.find((u) => u.matricula === matricula);
    if (!usuario) {
      throw new Error("Usuário não encontrado.");
    }

    document.getElementById("matricula-editar").value = usuario.matricula;
    document.getElementById("nome-editar").value = usuario.nome;
    document.getElementById("email-editar").value = usuario.email;

    carregarLojasEdicao(usuario.loja.id_loja);
    carregarPerfisEdicao(usuario.perfil.id_perfil);

    abrirModal("modal-editar-usuario");
  } catch (error) {
    console.error(error);
    alert("Erro ao carregar os dados do usuário.");
  }
}

async function carregarLojasEdicao(idLojaAtual) {
  const token = getToken();
  const lojaSelect = document.getElementById("loja-editar");
  lojaSelect.innerHTML = "";

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
      if (loja.id_loja === idLojaAtual) option.selected = true;
      lojaSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao carregar lojas:", error);
  }
}

async function carregarPerfisEdicao(idPerfilAtual) {
  const token = getToken();
  const perfilSelect = document.getElementById("perfil-editar");
  perfilSelect.innerHTML = "";

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
      if (perfil.id_perfil === idPerfilAtual) option.selected = true;
      perfilSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao carregar perfis:", error);
  }
}

function abrirModal(modalId) {
  document.getElementById(modalId).style.display = "block";
}

function fecharModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

document
  .getElementById("editar-usuario-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = getToken();
    const usuarioAtual = parseJwt(token);
    const matricula = document.getElementById("matricula-editar").value;
    const nome = document.getElementById("nome-editar").value;
    const email = document.getElementById("email-editar").value;
    const loja = document.getElementById("loja-editar").value;
    const perfil = document.getElementById("perfil-editar").value;
    const novaMatricula = document.getElementById(
      "nova-matricula-editar"
    ).value;

    try {
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
            email,
            id_loja: loja,
            id_perfil: perfil,
            novaMatricula: novaMatricula || undefined,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erro ao atualizar o usuário.");
      }

      if (usuarioAtual.matricula === matricula) {
        alert("Você editou seu usuário. Faça login novamente para continuar.");
        logout();
        return;
      }

      alert("Usuário atualizado com sucesso!");
      window.location.href = "/frontEnd/src/pages/usuarios/index.html";
      fecharModal("modal-editar-usuario");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  });

window.abrirModalEdicao = abrirModalEdicao;
window.fecharModal = fecharModal;
