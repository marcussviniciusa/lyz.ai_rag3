import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { buttonAnimation, staggerItem } from '../../animations/transitions';

/**
 * Componente para a primeira etapa do registro: validau00e7u00e3o de email com Curseduca
 * Inclui animau00e7u00f5es modernas com Framer Motion para melhor experiu00eancia do usuu00e1rio
 */
const EmailValidationForm = ({ onEmailValidated, serverError, setServerError }) => {
  const [loading, setLoading] = useState(false);

  // Schema de validau00e7u00e3o
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Email invu00e1lido')
      .required('Email u00e9 obrigatu00f3rio')
  });

  // Valores iniciais
  const initialValues = {
    email: ''
  };

  // Handler para submissu00e3o do formulu00e1rio
  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    setServerError(null);
    
    try {
      // Chama a funu00e7u00e3o de callback passada pelo componente pai
      await onEmailValidated(values.email);
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
          Registro no Sistema Lyz
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
          Informe seu email cadastrado no Curseduca para iniciar o processo de registro.
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
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <Box mb={3}>
              <Field
                as={TextField}
                fullWidth
                id="email"
                name="email"
                label="Email"
                variant="outlined"
                error={touched.email && Boolean(errors.email)}
                helperText={
                  <ErrorMessage name="email" component="span" />
                }
                disabled={loading}
              />
            </Box>
            
            <motion.div
              whileHover={buttonAnimation.whileHover}
              whileTap={buttonAnimation.whileTap}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting || loading}
                startIcon={loading && <CircularProgress size={20} color="inherit" />}
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontWeight: 600,
                  boxShadow: 3,
                  background: 'linear-gradient(45deg, #9C27B0 30%, #FF4081 90%)',
                  '&:hover': {
                    boxShadow: 4,
                  }
                }}
              >
                {loading ? 'Validando...' : 'Validar Email'}
              </Button>
            </motion.div>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default EmailValidationForm;
