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
    console.log("Token excluído com sucesso.");
  } else {
    console.log("Nenhum token encontrado.");
  }

  window.location.href = "/frontEnd/src/pages/login/index.html";
}
