document.addEventListener("DOMContentLoaded", () => {
  const formCadastrarLoja = document.getElementById("form-cadastrar-loja");

  function getToken() {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];
  }

  formCadastrarLoja.addEventListener("submit", async (event) => {
    event.preventDefault();

    const codigo = document.getElementById("codigo").value;
    const nome = document.getElementById("nome").value;
    const cidade = document.getElementById("cidade").value;

    const token = getToken();

    try {
      const response = await fetch(
        "http://localhost:3000/api/stores/cadastrar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            cod_loja: codigo,
            nome,
            cidade,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao cadastrar a loja.");
      }

      alert("Loja cadastrada com sucesso!");
      window.location.href = "/frontEnd/src/pages/lojas/index.html";
    } catch (error) {
      console.error("Erro ao cadastrar a loja:", error);
      alert("Erro ao cadastrar a loja.");
    }
  });
});
