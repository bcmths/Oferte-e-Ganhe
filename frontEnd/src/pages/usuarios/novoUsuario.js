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
      alert("As senhas não coincidem. Por favor, verifique.");
      return;
    }

    if (!perfil || !loja) {
      alert("Por favor, selecione um perfil e uma loja válidos.");
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
            matricula,
            email,
            senha,
            id_perfil: perfil,
            id_loja: loja,
          }),
        }
      );
      console.log(response.body);

      if (!response.ok) {
        throw new Error("Erro ao cadastrar usuário");
      }

      alert("Usuário cadastrado com sucesso!");
      window.location.href = "/frontEnd/src/pages/usuarios/index.html";
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar o usuário.");
    }
  });

async function carregarLojasEPerfis() {
  const token = getToken();

  try {
    const lojasResponse = await fetch("http://localhost:3000/api/stores/all", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (lojasResponse.ok) {
      const lojasData = await lojasResponse.json();
      const lojas = lojasData.lojas;
      console.log("Lojas:", lojas);

      if (Array.isArray(lojas)) {
        const lojaSelect = document.getElementById("loja");
        lojas.forEach((loja) => {
          const option = document.createElement("option");
          option.value = loja.id_loja;
          option.textContent = loja.nome;
          lojaSelect.appendChild(option);
        });
      } else {
        throw new Error("A resposta de lojas não é um array.");
      }
    } else {
      throw new Error("Erro ao carregar lojas");
    }

    const perfisResponse = await fetch(
      "http://localhost:3000/api/profiles/all",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );

    if (perfisResponse.ok) {
      const perfisData = await perfisResponse.json();
      const perfis = perfisData.perfis;
      console.log("Perfis:", perfis);

      if (Array.isArray(perfis)) {
        const perfilSelect = document.getElementById("perfil");
        perfis.forEach((perfil) => {
          const option = document.createElement("option");
          option.value = perfil.id_perfil;
          option.textContent = perfil.nome;
          perfilSelect.appendChild(option);
        });
      } else {
        throw new Error("A resposta de perfis não é um array.");
      }
    } else {
      throw new Error("Erro ao carregar perfis");
    }
  } catch (error) {
    console.error(error);
    alert("Erro ao carregar lojas e perfis.");
  }
}

document.addEventListener("DOMContentLoaded", carregarLojasEPerfis);
