/**
 * Script para testar a conexu00e3o com o MongoDB e permissu00f5es de escrita
 */

require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');

async function testMongoDBConnection() {
  try {
    console.log('Conectando ao MongoDB...');
    console.log(`URL MongoDB: ${process.env.MONGODB_URI.replace(/\/\/(.*?)@/, '//******@')}`);
    
    // Configurar opu00e7u00f5es de conexu00e3o
    const mongooseOptions = {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      heartbeatFrequencyMS: 10000
    };
    
    await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
    console.log('Conectado ao MongoDB com sucesso!');
    
    // Testar listagem de coleu00e7u00f5es
    console.log('\nListando coleu00e7u00f5es:');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(collections.length ? collections.map(c => ` - ${c.name}`).join('\n') : ' - Nenhuma coleu00e7u00e3o encontrada');
    
    // Criar um modelo simples para teste
    console.log('\nCriando um modelo de teste...');
    const TestSchema = new mongoose.Schema({
      name: String,
      createdAt: { type: Date, default: Date.now }
    });
    
    // Verificar se a coleu00e7u00e3o de teste existe
    const testCollectionExists = collections.some(c => c.name === 'tests');
    console.log(`A coleu00e7u00e3o 'tests' ${testCollectionExists ? 'existe' : 'nu00e3o existe'}.`);
    
    // Criar o modelo e tentar inserir um documento
    const Test = mongoose.model('Test', TestSchema);
    console.log('\nTentando inserir um documento...');
    
    // Definir um timeout para a operau00e7u00e3o
    const insertTimeout = setTimeout(() => {
      console.log('AVISO: A operau00e7u00e3o de inseru00e7u00e3o estu00e1 demorando mais do que o esperado.');
    }, 5000); // Avisa depois de 5 segundos
    
    // Tenta inserir um documento
    const testDoc = new Test({ name: 'Teste de escrita ' + new Date().toISOString() });
    const result = await testDoc.save();
    clearTimeout(insertTimeout);
    
    console.log('Documento inserido com sucesso!', result);
    
    // Tentar encontrar o documento inserido
    console.log('\nTentando buscar o documento inserido...');
    const foundDoc = await Test.findById(result._id);
    console.log(foundDoc ? 'Documento encontrado!' : 'Documento nu00e3o encontrado.');
    
    console.log('\nTeste concluu00eddo com sucesso!');
  } catch (error) {
    console.error('\nErro durante o teste:', error.message);
    
    if (error.name === 'MongoServerSelectionError') {
      console.error('\nErro de conexu00e3o com o servidor MongoDB. Verifique se o servidor estu00e1 acessu00edvel e se as credenciais estu00e3o corretas.');
    }
    
    if (error.code === 13) {
      console.error('\nErro de permissu00e3o. O usuu00e1rio nu00e3o tem autorização para executar operau00e7u00f5es de escrita.');
    }
  } finally {
    if (mongoose.connection.readyState !== 0) {
      console.log('\nFechando conexu00e3o com o MongoDB...');
      await mongoose.connection.close();
      console.log('Conexu00e3o fechada.');
    }
  }
}

testMongoDBConnection();
