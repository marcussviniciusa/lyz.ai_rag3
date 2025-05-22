import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, TextField, Button, Link, Box, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Falha ao realizar login. Verifique suas credenciais.');
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
            Login - Lyz Healthcare
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
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
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Link component={RouterLink} to="/auth/forgot-password" variant="body2">
                Esqueceu a senha?
              </Link>
              <Link component={RouterLink} to="/auth/register" variant="body2">
                Não tem uma conta? Cadastre-se
              </Link>
            </Box>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Login;
