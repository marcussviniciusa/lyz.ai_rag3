/**
 * Script para criar o primeiro usuu00e1rio administrador e empresa no sistema Lyz
 * 
 * Execuu00e7u00e3o: node scripts/create-admin-user.js
 */

require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');

// Configurar mongoose para logs e timeout estendido
mongoose.set('debug', true); // Habilita logs de debug para queries


// Definir os modelos diretamente no script
// Modelo de Company
const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  active: {
    type: Boolean,
    default: true
  },
  token_limit: {
    type: Number,
    default: 100000
  },
  tokens_used: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Modelo de User
const userSchema = new mongoose.Schema({
  curseduca_id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['superadmin', 'user'],
    default: 'user'
  },
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  last_login: {
    type: Date
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Criar os modelos
const Company = mongoose.model('Company', companySchema);
const User = mongoose.model('User', userSchema);

// Interface para leitura da linha de comando
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Funu00e7u00e3o para perguntar ao usuu00e1rio
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Funu00e7u00e3o principal
async function createAdminUser() {
  try {
    // Conectar ao MongoDB
    console.log('\n\n=== CRIADOR DE USUu00c1RIO ADMINISTRADOR LYZ ===\n');
    console.log('Conectando ao banco de dados...');
    console.log(`URL MongoDB: ${process.env.MONGODB_URI.replace(/\/\/(.*?)@/, '//******@')}`); // Oculta credenciais nos logs
    
    // Configurar opções de conexão com timeout aumentado
    const mongooseOptions = {
      serverSelectionTimeoutMS: 30000, // Aumenta o timeout para 30 segundos
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      heartbeatFrequencyMS: 10000
    };
    
    await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
    console.log('Conectado ao MongoDB com sucesso!');
    
    // Verifica se há conexão funcionando tentando uma operação simples
    console.log('Testando conexão com uma operação simples...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`Coleções disponíveis: ${collections.map(c => c.name).join(', ') || 'nenhuma'}`);
    
    // Coletar informau00e7u00f5es da empresa
    console.log('\n== INFORMAu00c7u00d5ES DA EMPRESA ==');
    const companyName = await question('Nome da empresa: ');
    const tokenLimit = await question('Limite de tokens (padru00e3o: 100000): ');
    
    // Criar a empresa
    const company = new Company({
      name: companyName,
      token_limit: tokenLimit || 100000,
      active: true
    });
    
    await company.save();
    console.log(`\nEmpresa "${companyName}" criada com sucesso!`);
    
    // Coletar informau00e7u00f5es do usuu00e1rio administrador
    console.log('\n== INFORMAu00c7u00d5ES DO ADMINISTRADOR ==');
    const adminName = await question('Nome completo: ');
    const adminEmail = await question('Email: ');
    let adminPassword = await question('Senha (min. 8 caracteres): ');
    
    // Validar senha
    while (adminPassword.length < 8) {
      console.log('\nA senha deve ter no mu00ednimo 8 caracteres!');
      adminPassword = await question('Senha (min. 8 caracteres): ');
    }
    
    // Gerar um ID Curseduca u00fanico
    const curseduca_id = `admin_${Date.now()}`;
    
    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    
    // Criar o usuu00e1rio administrador
    const admin = new User({
      curseduca_id,
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'superadmin',
      company_id: company._id,
      active: true
    });
    
    await admin.save();
    console.log(`\nUsuu00e1rio administrador "${adminName}" criado com sucesso!`);
    console.log(`\nDetalhes do login:\nEmail: ${adminEmail}\nSenha: ******** (a senha que vocu00ea digitou)\n`);
    
    console.log('\n=== PROCESSO CONCLUu00cdDO COM SUCESSO ===');
    console.log('Vocu00ea ju00e1 pode acessar o sistema com as credenciais do administrador.\n');
    
  } catch (error) {
    console.error('\nErro ao criar usuu00e1rio administrador:', error.message);
    
    if (error.code === 11000) {
      console.error('\nJu00e1 existe um usuu00e1rio com este email ou uma empresa com este nome!');
    }
  } finally {
    // Fechar conexu00e3o e interface de linha de comando
    rl.close();
    await mongoose.connection.close();
    console.log('Conexu00e3o com o MongoDB encerrada.');
  }
}

// Executar a funu00e7u00e3o principal
createAdminUser();
