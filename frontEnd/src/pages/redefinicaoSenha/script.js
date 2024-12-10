document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;
    const confirmaSenha = document.getElementById("confirmaSenha").value;

    if (senha !== confirmaSenha) {
      alert("As senhas não coincidem. Por favor, verifique.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/trocar-senha", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao redefinir senha.");
      }

      const data = await response.json();
      alert(data.message || "Senha redefinida com sucesso!");
      window.location.href = "/frontEnd/src/pages/login/index.html"; // Redireciona para a página de login
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      alert("Erro ao redefinir senha: " + error.message);
    }
  });
});
