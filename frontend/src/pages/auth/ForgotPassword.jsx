import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Paper, Typography, TextField, Button, Link, Box, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import AuthService from '../../services/auth.service';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Simulando chamada para API - implementação real iria conectar ao backend
      await AuthService.requestPasswordReset(email);
      setMessage({
        type: 'success',
        text: 'Instruções para redefinição de senha foram enviadas para seu email.'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Não foi possível processar sua solicitação.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
          <Typography variant="h5" component="h1" gutterBottom align="center">
            Recuperação de Senha
          </Typography>
          <Typography variant="body2" align="center" sx={{ mb: 3 }}>
            Informe seu email cadastrado e enviaremos instruções para redefinir sua senha.
          </Typography>
          
          {message.text && (
            <Alert severity={message.type} sx={{ mb: 2 }}>
              {message.text}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading || !email}
            >
              {loading ? 'Enviando...' : 'Enviar Instruções'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/auth/login" variant="body2">
                Voltar para o login
              </Link>
            </Box>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default ForgotPassword;
