import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Paper, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

import EmailValidationForm from '../../components/auth/EmailValidationForm';
import RegistrationForm from '../../components/auth/RegistrationForm';
import AuthService from '../../services/auth.service';
import { AnimatedContainer, StaggerContainer, StaggerItem } from '../../animations/AnimatedComponents';
import { slideAnimation } from '../../animations/transitions';

/**
 * Pu00e1gina de registro com processo em duas etapas para integrau00e7u00e3o com Curseduca
 * Utiliza animau00e7u00f5es modernas com Framer Motion para uma experiu00eancia fluida
 */
const Register = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [step, setStep] = useState(1); // 1: Validau00e7u00e3o de email, 2: Registro final
  const [serverError, setServerError] = useState(null);
  const [validatedUser, setValidatedUser] = useState(null);

  /**
   * Valida o email do usuu00e1rio com o Curseduca
   * @param {string} email - Email a ser validado
   */
  const handleEmailValidation = async (email) => {
    setServerError(null);
    try {
      const response = await AuthService.validateEmail(email);
      
      if (response.success) {
        // Armazena os dados do usuu00e1rio validado
        setValidatedUser({
          ...response.userData,
          email
        });
        setStep(2); // Avanu00e7a para a pru00f3xima etapa
      } else {
        setServerError(response.message || 'Erro ao validar email');
      }
    } catch (error) {
      setServerError(
        error.message || 
        'Falha na validau00e7u00e3o do email. Verifique se estu00e1 cadastrado no Curseduca.'
      );
    }
  };

  /**
   * Registra o usuu00e1rio apu00f3s a validau00e7u00e3o
   * @param {Object} userData - Dados do usuu00e1rio para registro
   */
  const handleRegistration = async (userData) => {
    setServerError(null);
    try {
      // Verificar se temos os dados do usuu00e1rio validado
      if (!validatedUser || !validatedUser.id) {
        throw new Error('Dados de usuu00e1rio invu00e1lidos. Por favor, volte e valide seu email novamente.');
      }
      
      const response = await AuthService.register(userData);
      
      if (response.success) {
        // Registro bem-sucedido, redirecionar para o dashboard
        navigate('/dashboard');
      } else {
        setServerError(response.message || 'Erro ao registrar usuu00e1rio');
      }
    } catch (error) {
      setServerError(
        error.message || 
        'Erro ao registrar usuu00e1rio. Por favor, tente novamente.'
      );
    }
  };

  /**
   * Volta para a etapa de validau00e7u00e3o de email
   */
  const handleBack = () => {
    setStep(1);
    setServerError(null);
  };

  // Definiu00e7u00e3o da animau00e7u00e3o baseada na etapa atual
  const currentAnimation = slideAnimation(step === 1 ? 'left' : 'right');

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'background.default',
        py: 4,
        backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(216, 180, 254, 0.3) 0%, rgba(129, 140, 248, 0.2) 100%)',
      }}
    >
      <Container maxWidth="md">
        <StaggerContainer>
          <StaggerItem>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <Typography 
                  variant="h3" 
                  component="h1" 
                  gutterBottom
                  sx={{ 
                    color: 'primary.main',
                    fontWeight: 700,
                    mb: 1,
                    textShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  Sistema Lyz
                </Typography>
              </motion.div>
              
              <Typography 
                variant="h6" 
                color="text.secondary"
                sx={{ 
                  maxWidth: '600px', 
                  mx: 'auto',
                  opacity: 0.9,
                  mb: 2 
                }}
              >
                Planos personalizados baseados na ciclicidade feminina
              </Typography>
            </Box>
          </StaggerItem>
          
          <AnimatedContainer animation={currentAnimation}>
            <Paper 
              elevation={6} 
              sx={{ 
                borderRadius: 4, 
                overflow: 'hidden',
                backgroundColor: 'background.paper',
                boxShadow: theme.shadows[8],
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '6px',
                  background: 'linear-gradient(to right, #9C27B0, #FF4081)',
                  borderTopLeftRadius: '16px',
                  borderTopRightRadius: '16px'
                }
              }}
            >
              <Box p={4}>
                {step === 1 && (
                  <EmailValidationForm
                    onEmailValidated={handleEmailValidation}
                    serverError={serverError}
                    setServerError={setServerError}
                  />
                )}
                
                {step === 2 && validatedUser && (
                  <RegistrationForm
                    validatedUser={validatedUser}
                    onRegister={handleRegistration}
                    serverError={serverError}
                    setServerError={setServerError}
                    onBack={handleBack}
                  />
                )}
              </Box>
            </Paper>
          </AnimatedContainer>
          
          <StaggerItem>
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Exclusivo para usuários cadastrados no Curseduca
              </Typography>
            </Box>
          </StaggerItem>
        </StaggerContainer>
      </Container>
    </Box>
  );
};

export default Register;
