document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("usuario").value;

    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/redefinir-senha",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erro ao enviar o e-mail de redefinição."
        );
      }

      const data = await response.json();
      alert(data.message || "E-mail de redefinição enviado com sucesso!");
      window.location.href = "/frontEnd/src/pages/login/index.html";
    } catch (error) {
      console.error("Erro ao solicitar redefinição de senha:", error);
      alert("Erro ao solicitar redefinição de senha: " + error.message);
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const novaSenha = document.getElementById("novaSenha").value;
    const confirmaSenha = document.getElementById("confirmaSenha").value;

    if (novaSenha !== confirmaSenha) {
      alert("As senhas não coincidem. Por favor, verifique.");
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      alert("Token de redefinição inválido ou ausente.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/auth/redefinir-senha/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ senha: novaSenha }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao redefinir senha.");
      }

      const data = await response.json();
      alert(data.message || "Senha redefinida com sucesso!");
      window.location.href = "/frontEnd/src/pages/login/index.html";
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      alert("Erro ao redefinir senha: " + error.message);
    }
  });
});
