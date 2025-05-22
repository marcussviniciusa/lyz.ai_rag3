import React from 'react';
import { Box, Grid, TextField, Typography } from '@mui/material';

// Versão simplificada sem otimizações complexas
const PatientInfoForm = ({ data, onChange }) => {
  // Função de manipulação de mudanças simples
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Informau00e7u00f5es da Paciente
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Preencha os dados bsu00e1sicos da paciente para iniciar o plano de sau00fade.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            id="name"
            name="name"
            label="Nome Completo"
            fullWidth
            value={data.name || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="age"
            name="age"
            label="Idade"
            type="number"
            fullWidth
            value={data.age || ''}
            onChange={handleChange}
            InputProps={{ inputProps: { min: 0, max: 120 } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="birthdate"
            name="birthdate"
            label="Data de Nascimento"
            type="date"
            fullWidth
            value={data.birthdate || ''}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        {/* Campos de email e telefone removidos conforme solicitado */}
        <Grid item xs={12} sm={6}>
          <TextField
            id="height"
            name="height"
            label="Altura (cm)"
            type="number"
            fullWidth
            value={data.height || ''}
            onChange={handleChange}
            InputProps={{ inputProps: { min: 0 } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="weight"
            name="weight"
            label="Peso (kg)"
            type="number"
            fullWidth
            value={data.weight || ''}
            onChange={handleChange}
            InputProps={{ inputProps: { min: 0, step: 0.1 } }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientInfoForm;
