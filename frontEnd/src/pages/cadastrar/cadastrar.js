document
  .getElementById("novo-usuario-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const matricula = document.getElementById("matricula").value;
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmar-senha").value;

    const perfil = 16;
    const loja = 9;

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem. Por favor, verifique.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/cadastrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          matricula,
          email,
          senha,
          id_perfil: perfil,
          id_loja: loja,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar usuário");
      }

      alert("Usuário cadastrado com sucesso!");
      window.location.href = "/frontEnd/src/pages/login/index.html";
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar o usuário.");
    }
  });
