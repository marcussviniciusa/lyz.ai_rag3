/**
 * Função para criar o cabeçalho de autorização com o token JWT
 * para requisições autenticadas
 * @returns {Object} Cabeçalho de autorização
 */
export default function authHeader() {
  // Obter o token de acesso diretamente do localStorage
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken) {
    // Para API Express/Node.js
    return { Authorization: `Bearer ${accessToken}` };
  } else {
    return {};
  }
}
