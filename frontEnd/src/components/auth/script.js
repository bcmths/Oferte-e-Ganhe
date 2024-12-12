document.addEventListener("DOMContentLoaded", () => {
  function getToken() {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];
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

  function verificarAutenticacao() {
    const token = getToken();

    if (!token) {
      console.log("Token não encontrado. Redirecionando...");
      window.location.href = "/frontEnd/src/pages/login/index.html";
      return;
    }

    const decodedToken = parseJwt(token);

    if (!decodedToken || !decodedToken.exp) {
      console.log("Token inválido. Redirecionando...");
      window.location.href = "/frontEnd/src/pages/login/index.html";
      return;
    }

    const agora = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < agora) {
      console.log("Token expirado. Redirecionando...");
      window.location.href = "/frontEnd/src/pages/login/index.html";
      return;
    }

    console.log("Autenticação verificada: Token válido.");
  }

  verificarAutenticacao();
});
