import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

/**
 * Layout para pu00e1ginas de autenticau00e7u00e3o
 * Inclui um fundo estilizado e animau00e7u00f5es suaves
 */
const AuthLayout = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default',
        backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(216, 180, 254, 0.3) 0%, rgba(129, 140, 248, 0.2) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Elementos decorativos animados */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        {/* Formas decorativas animadas */}
        <motion.div
          style={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${theme.palette.primary.light}20, ${theme.palette.primary.main}10)`,
            opacity: 0.4
          }}
          animate={{
            y: [0, 30, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        />
        
        <motion.div
          style={{
            position: 'absolute',
            bottom: '15%',
            right: '10%',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${theme.palette.secondary.light}15, ${theme.palette.secondary.main}05)`,
            opacity: 0.5
          }}
          animate={{
            y: [0, -40, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        />
      </Box>

      {/* Header */}
      <Box
        component="header"
        sx={{
          p: 3,
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ 
              fontWeight: 700,
              color: 'primary.main',
              letterSpacing: '0.5px',
              textShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
            }}
          >
            Lyz
          </Typography>
        </motion.div>
      </Box>

      {/* Conteu00fado principal */}
      <Container 
        component="main" 
        maxWidth="md"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
          py: 4
        }}
      >
        <Outlet />
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          p: 2,
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <Typography variant="body2" color="text.secondary">
            &copy; {new Date().getFullYear()} Lyz | Planos de Sau00fade Feminina
          </Typography>
        </motion.div>
      </Box>
    </Box>
  );
};

export default AuthLayout;
