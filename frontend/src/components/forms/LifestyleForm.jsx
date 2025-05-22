import React from 'react';
import {
  Box, Typography, TextField, Grid, FormControl,
  InputLabel, Select, MenuItem, Slider, Rating,
  FormLabel, RadioGroup, FormControlLabel, Radio, Paper
} from '@mui/material';

const LifestyleForm = ({ data, onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const handleSliderChange = (name) => (e, value) => {
    onChange({ ...data, [name]: value });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Estilo de Vida
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Informau00e7u00f5es sobre o estilo de vida da paciente, incluindo alimentau00e7u00e3o, atividade fu00edsica, sono e nu00edveis de estresse.
      </Typography>

      {/* Seu00e7u00e3o de Alimentau00e7u00e3o */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Alimentau00e7u00e3o
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Padru00e3o Alimentar</InputLabel>
              <Select
                name="dietPattern"
                value={data.dietPattern || ''}
                label="Padru00e3o Alimentar"
                onChange={handleChange}
              >
                <MenuItem value="omnivore">Onu00edvora</MenuItem>
                <MenuItem value="vegetarian">Vegetariana</MenuItem>
                <MenuItem value="vegan">Vegana</MenuItem>
                <MenuItem value="pescatarian">Pescetariana</MenuItem>
                <MenuItem value="paleo">Paleo</MenuItem>
                <MenuItem value="keto">Cetogu00eanica</MenuItem>
                <MenuItem value="gluten-free">Sem Glu00faten</MenuItem>
                <MenuItem value="dairy-free">Sem Lactu00edcinio</MenuItem>
                <MenuItem value="other">Outro</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Descriu00e7u00e3o da Dieta"
              name="dietDescription"
              value={data.dietDescription || ''}
              onChange={handleChange}
              placeholder="Descreva detalhes sobre a alimentau00e7u00e3o habitual, restriu00e7u00f5es e preferu00eancias"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography gutterBottom>Qualidade da Dieta</Typography>
            <Slider
              value={data.dietQuality || 5}
              min={1}
              max={10}
              step={1}
              marks
              name="dietQuality"
              onChange={handleSliderChange('dietQuality')}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => {
                const labels = {
                  1: 'Muito Pobre',
                  3: 'Pobre',
                  5: 'Regular',
                  7: 'Boa',
                  10: 'Excelente'
                };
                return labels[value] || value;
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Seu00e7u00e3o de Atividade Fu00edsica */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Atividade Fu00edsica
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Frequu00eancia de Exercu00edcios</InputLabel>
              <Select
                name="exerciseFrequency"
                value={data.exerciseFrequency || ''}
                label="Frequu00eancia de Exercu00edcios"
                onChange={handleChange}
              >
                <MenuItem value="sedentary">Sedentu00e1ria (quase nenhuma atividade)</MenuItem>
                <MenuItem value="light">Leve (1-2 dias por semana)</MenuItem>
                <MenuItem value="moderate">Moderada (3-4 dias por semana)</MenuItem>
                <MenuItem value="active">Ativa (5+ dias por semana)</MenuItem>
                <MenuItem value="very-active">Muito Ativa (exercu00edcios intensos diariamente)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tipos de Exercu00edcios"
              name="exerciseTypes"
              value={data.exerciseTypes || ''}
              onChange={handleChange}
              placeholder="Ex: caminhada, musculau00e7u00e3o, yoga"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Detalhes da Atividade Fu00edsica"
              name="exerciseDetails"
              value={data.exerciseDetails || ''}
              onChange={handleChange}
              placeholder="Descreva detalhes sobre sua rotina de exercu00edcios"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Seu00e7u00e3o de Sono */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Padru00f5es de Sono
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Horas de Sono por Noite"
              name="sleepHours"
              value={data.sleepHours || ''}
              onChange={handleChange}
              InputProps={{ inputProps: { min: 0, max: 24 } }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel component="legend">Qualidade do Sono</FormLabel>
              <RadioGroup
                row
                name="sleepQuality"
                value={data.sleepQuality || ''}
                onChange={handleChange}
              >
                <FormControlLabel value="poor" control={<Radio />} label="Ruim" />
                <FormControlLabel value="fair" control={<Radio />} label="Regular" />
                <FormControlLabel value="good" control={<Radio />} label="Boa" />
                <FormControlLabel value="excellent" control={<Radio />} label="Excelente" />
              </RadioGroup>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Dificuldades de Sono"
              name="sleepIssues"
              value={data.sleepIssues || ''}
              onChange={handleChange}
              placeholder="Descreva qualquer dificuldade para dormir, acordar durante a noite, etc."
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Seu00e7u00e3o de Estresse */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Estresse e Bem-estar Mental
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography gutterBottom>Nu00edvel de Estresse Percebido</Typography>
            <Slider
              value={data.stressLevel || 5}
              min={1}
              max={10}
              step={1}
              marks
              name="stressLevel"
              onChange={handleSliderChange('stressLevel')}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => {
                const labels = {
                  1: 'Mu00ednimo',
                  3: 'Baixo',
                  5: 'Moderado',
                  7: 'Alto',
                  10: 'Severo'
                };
                return labels[value] || value;
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Fontes de Estresse"
              name="stressSources"
              value={data.stressSources || ''}
              onChange={handleChange}
              placeholder="Descreva as principais fontes de estresse na sua vida"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography component="legend">Satisfau00e7u00e3o com Equilu00edbrio Vida-Trabalho</Typography>
            <Rating
              name="workLifeBalance"
              value={parseInt(data.workLifeBalance) || 0}
              onChange={(event, newValue) => {
                onChange({ ...data, workLifeBalance: newValue });
              }}
              max={5}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Pru00e1ticas de Manejo de Estresse"
              name="stressManagement"
              value={data.stressManagement || ''}
              onChange={handleChange}
              placeholder="Descreva qualquer pru00e1tica que vocu00ea utiliza para gerenciar o estresse (meditau00e7u00e3o, hobby, etc.)"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Seu00e7u00e3o de Exposiu00e7u00e3o Ambiental */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Exposiu00e7u00e3o Ambiental
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Ocupau00e7u00e3o/Profissu00e3o"
              name="occupation"
              value={data.occupation || ''}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Exposiu00e7u00f5es Ambientais"
              name="environmentalExposures"
              value={data.environmentalExposures || ''}
              onChange={handleChange}
              placeholder="Descreva qualquer exposiu00e7u00e3o a quu00edmicos, poluentes, mofo, etc."
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default LifestyleForm;
