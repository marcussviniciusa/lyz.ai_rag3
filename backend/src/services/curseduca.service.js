const axios = require('axios');

/**
 * Valida um usuu00e1rio no Curseduca pelo email
 * @param {string} email - Email do usuu00e1rio a ser validado
 * @returns {Promise<Object>} Resultado da validau00e7u00e3o
 */
exports.validateCursEducaUser = async (email) => {
  try {
    const response = await axios.get(`${process.env.CURSEDUCA_API_URL}/members/by`, {
      params: { email },
      headers: { 'api_key': process.env.CURSEDUCA_API_KEY }
    });

    if (response.status === 200) {
      return {
        success: true,
        data: response.data
      };
    }
    
    return {
      success: false,
      message: 'Usuu00e1rio nu00e3o encontrado no Curseduca'
    };
  } catch (error) {
    const status = error.response?.status;
    let message = 'Erro ao validar usuu00e1rio no Curseduca';
    
    if (status === 400) {
      message = 'Requisiu00e7u00e3o invu00e1lida para API do Curseduca';
    } else if (status === 401) {
      message = 'Acesso nu00e3o autorizado u00e0 API do Curseduca';
    } else if (status === 404) {
      message = 'Usuu00e1rio nu00e3o encontrado no Curseduca';
    }
    
    return {
      success: false,
      message
    };
  }
};
