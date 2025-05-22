/**
 * Função para criar o cabeçalho de autorização com o token JWT
 * para requisições autenticadas
 * @returns {Object} Cabeçalho de autorização
 */
export default function authHeader() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.token) {
    // Para API Express/Node.js
    return { Authorization: `Bearer ${user.token}` };
  } else {
    return {};
  }
}
