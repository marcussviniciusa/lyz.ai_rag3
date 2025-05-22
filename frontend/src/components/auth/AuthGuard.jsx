import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

/**
 * Componente que protege rotas que requerem autenticau00e7u00e3o
 * Redireciona para a pu00e1gina de login caso o usuu00e1rio nu00e3o esteja autenticado
 * 
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Componentes filhos a serem renderizados se autenticado
 */
const AuthGuard = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Exibir indicador de carregamento enquanto verifica autenticau00e7u00e3o
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: 'background.default'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CircularProgress color="primary" size={60} thickness={4} />
        </motion.div>
      </Box>
    );
  }

  // Redirecionar para login se nu00e3o estiver autenticado
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Renderizar componentes filhos se estiver autenticado
  return children;
};

export default AuthGuard;
