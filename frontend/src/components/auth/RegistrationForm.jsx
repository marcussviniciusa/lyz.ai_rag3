import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material';
import { motion } from 'framer-motion';
import { buttonAnimation, staggerItem, slideAnimation } from '../../animations/transitions';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

/**
 * Componente para a segunda etapa do registro: criação da senha após validação com Curseduca
 * Implementa animações modernas utilizando Framer Motion para uma experiência de usuário aprimorada
 */
const RegistrationForm = ({ validatedUser, onRegister, serverError, setServerError, onBack }) => {
  const [loading, setLoading] = useState(false);

  // Schema de validação
  const validationSchema = Yup.object({
    password: Yup.string()
      .required('Senha é obrigatória')
      .min(8, 'A senha deve ter pelo menos 8 caracteres')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
        'A senha deve conter pelo menos uma letra minúscula, uma maiúscula, um número e um caractere especial'
      ),
    confirmPassword: Yup.string()
      .required('Confirmação de senha é obrigatória')
      .oneOf([Yup.ref('password'), null], 'As senhas devem ser iguais')
  });

  // Valores iniciais
  const initialValues = {
    password: '',
    confirmPassword: ''
  };

  // Handler para submissão do formulário
  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    setServerError(null);
    
    try {
      // Preparar dados para registro
      const userData = {
        curseduca_id: validatedUser.id,
        name: validatedUser.name,
        email: validatedUser.email,
        password: values.password
      };
      
      // Chamar função de registro passada pelo componente pai
      await onRegister(userData);
    } catch (error) {
      // Erro tratado pelo componente pai
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <motion.div
        variants={staggerItem}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Typography variant="h5" component="h1" gutterBottom color="primary.main" fontWeight="500">
          Concluir Registro
        </Typography>
      </motion.div>
      
      <motion.div
        variants={staggerItem}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ delay: 0.1 }}
      >
        <Typography variant="body1" sx={{ mb: 3 }}>
          Seu email foi validado com sucesso. Complete seu registro criando uma senha.
        </Typography>
      </motion.div>
      
      {serverError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <Alert severity="error" sx={{ mb: 3 }}>
            {serverError}
          </Alert>
        </motion.div>
      )}
      
      <motion.div
        variants={staggerItem}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ delay: 0.2 }}
      >
        <Box mb={3}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome"
                value={validatedUser.name}
                disabled
                variant="outlined"
                sx={{
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: 'rgba(0, 0, 0, 0.7)',
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                value={validatedUser.email}
                disabled
                variant="outlined"
                sx={{
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: 'rgba(0, 0, 0, 0.7)',
                  }
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </motion.div>
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  fullWidth
                  id="password"
                  name="password"
                  label="Senha"
                  type="password"
                  variant="outlined"
                  error={touched.password && Boolean(errors.password)}
                  helperText={
                    <ErrorMessage name="password" component="span" />
                  }
                  disabled={loading}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  fullWidth
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirmar Senha"
                  type="password"
                  variant="outlined"
                  error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                  helperText={
                    <ErrorMessage name="confirmPassword" component="span" />
                  }
                  disabled={loading}
                />
              </Grid>
            </Grid>
            
            <Box mt={4} display="flex" justifyContent="space-between">
              <motion.div
                whileHover={buttonAnimation.whileHover}
                whileTap={buttonAnimation.whileTap}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={onBack}
                  disabled={loading}
                  sx={{
                    px: 3,
                    py: 1.2,
                    borderWidth: '2px',
                    '&:hover': {
                      borderWidth: '2px'
                    }
                  }}
                >
                  Voltar
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={buttonAnimation.whileHover}
                whileTap={buttonAnimation.whileTap}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting || loading}
                  startIcon={loading && <CircularProgress size={20} color="inherit" />}
                  sx={{
                    px: 3,
                    py: 1.2,
                    fontWeight: 600,
                    boxShadow: 3,
                    background: 'linear-gradient(45deg, #9C27B0 30%, #FF4081 90%)',
                    '&:hover': {
                      boxShadow: 4,
                    }
                  }}
                >
                  {loading ? 'Registrando...' : 'Registrar'}
                </Button>
              </motion.div>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default RegistrationForm;
