document.addEventListener("DOMContentLoaded", () => {
  const formCadastrarSolicitacao = document.getElementById(
    "form-cadastrar-solicitacao"
  );
  const lojaSelect = document.getElementById("loja");

  function getToken() {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];
  }

  async function carregarUsuarios() {
    const token = getToken();
    try {
      const response = await fetch("http://localhost:3000/api/users/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao carregar as lojas.");
      }

      const usuariosData = await response.json();
      const usuarios = usuariosData.lojas;

      usuarios.forEach((usuario) => {
        const option = document.createElement("option");
        option.value = usuario.id_usuario;
        option.textContent = usuario.nome;
        usuarioSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Erro ao carregar as lojas:", error);
      alert("Erro ao carregar as lojas.");
    }
  }

  formCadastrarSolicitacao.addEventListener("submit", async (event) => {
    event.preventDefault();

    const usuarioID = usuarioSelect.value;
    const quantidade = parseInt(document.getElementById("quantidade").value);
    const token = getToken();

    try {
      const response = await fetch(
        "http://localhost:3000/api/solicitations/cadastrar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quantidade_taloes: quantidade,
            id_status_solicitacao,
            id_usuario: usuarioID,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao cadastrar a solicitação.");
      }

      alert("Solicitação cadastrada com sucesso!");
      window.location.href = "/frontEnd/src/pages/envioTaloes/index.html";
    } catch (error) {
      console.error("Erro ao cadastrar a solicitação:", error);
      alert("Erro ao cadastrar a solicitação.");
    }
  });

  carregarUsuarios();
});
