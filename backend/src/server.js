const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const companyRoutes = require('./routes/company.routes');
const planRoutes = require('./routes/plan.routes');

// Configurau00e7u00e3o do logger
const logger = require('./utils/logger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Log de requisiu00e7u00f5es
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/plans', planRoutes);

// Rota de verificau00e7u00e3o de sau00fade
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Lyz API is running' });
});

// Comentu00e1rio removido: rota de diagnu00f3stico para administrador

// Tratamento de erros
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Conectar ao MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    logger.info('Conectado ao MongoDB');
    
    // Iniciar servidor
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      logger.info(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    logger.error('Erro ao conectar ao MongoDB:', err.message);
    process.exit(1);
  });
