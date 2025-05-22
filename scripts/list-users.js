/**
 * Script para listar todos os usuu00e1rios cadastrados no banco de dados
 */

require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');

// Definir o esquema de Usuu00e1rio
const userSchema = new mongoose.Schema({
  curseduca_id: String,
  name: String,
  email: String,
  password: String,
  role: String,
  company_id: mongoose.Schema.Types.ObjectId,
  active: Boolean,
  last_login: Date,
  created_at: Date,
  updated_at: Date
});

const User = mongoose.model('User', userSchema);

async function listUsers() {
  try {
    console.log('\n=== USUU00c1RIOS CADASTRADOS NO BANCO DE DADOS ===\n');
    
    // Conectar ao MongoDB
    console.log(`Conectando ao MongoDB: ${process.env.MONGODB_URI.replace(/\/\/(.*?)@/, '//******@')}`);
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000
    });
    console.log('Conectado ao MongoDB com sucesso!\n');
    
    // Listar usuários
    const users = await User.find({}).lean();
    
    if (users.length === 0) {
      console.log('Nenhum usuu00e1rio encontrado no banco de dados.\n');
    } else {
      console.log(`Total de usuu00e1rios: ${users.length}\n`);
      
      users.forEach((user, index) => {
        console.log(`--- Usuu00e1rio #${index + 1} ---`);
        console.log(`ID: ${user._id}`);
        console.log(`Nome: ${user.name}`);
        console.log(`Email: ${user.email}`);
        console.log(`Funu00e7u00e3o: ${user.role}`);
        console.log(`ID da Empresa: ${user.company_id}`);
        console.log(`Ativo: ${user.active ? 'Sim' : 'Nu00e3o'}`);
        console.log(`u00daltimo login: ${user.last_login || 'Nunca'}`);
        console.log(`Criado em: ${user.created_at}`);
        console.log('-------------------\n');
      });
    }
  } catch (error) {
    console.error('Erro ao listar usuu00e1rios:', error.message);
  } finally {
    // Desconectar do MongoDB
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('Conexu00e3o com o MongoDB encerrada.');
    }
  }
}

// Executar a funu00e7u00e3o
listUsers();
