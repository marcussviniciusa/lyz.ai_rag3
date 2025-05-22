import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button, Grid, Card, 
  CardContent, IconButton, Slider, FormControl, 
  InputLabel, Select, MenuItem, Chip
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const SymptomForm = ({ data = [], onChange }) => {
  const [newSymptom, setNewSymptom] = useState({
    description: '',
    intensity: 5,
    frequency: 'occasional',
    duration: '',
    triggers: ''
  });

  const handleAddSymptom = () => {
    if (newSymptom.description.trim() === '') return;
    
    const updatedSymptoms = [...data, { ...newSymptom, id: Date.now() }];
    onChange(updatedSymptoms);
    
    // Reset form
    setNewSymptom({
      description: '',
      intensity: 5,
      frequency: 'occasional',
      duration: '',
      triggers: ''
    });
  };

  const handleRemoveSymptom = (id) => {
    const updatedSymptoms = data.filter(symptom => symptom.id !== id);
    onChange(updatedSymptoms);
  };

  const handleSymptomChange = (e) => {
    const { name, value } = e.target;
    setNewSymptom(prev => ({ ...prev, [name]: value }));
  };

  const frequencyOptions = [
    { value: 'rare', label: 'Raro (menos de uma vez por mu00eas)' },
    { value: 'occasional', label: 'Ocasional (algumas vezes por mu00eas)' },
    { value: 'frequent', label: 'Frequente (vau00e1rias vezes por semana)' },
    { value: 'constant', label: 'Constante (diau00e1rio)' }
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Sintomas
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Adicione os sintomas experimentados pela paciente, incluindo intensidade e frequ00eancia.
      </Typography>
      
      <Box sx={{ mb: 4, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
        <Typography variant="subtitle1" gutterBottom>
          Adicionar Novo Sintoma
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descriu00e7u00e3o do Sintoma"
              name="description"
              value={newSymptom.description}
              onChange={handleSymptomChange}
              placeholder="Ex: Dor de cabeu00e7a, Fadu00edga, Insu00f4nia"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography gutterBottom>Intensidade ({newSymptom.intensity}/10)</Typography>
            <Slider
              value={newSymptom.intensity}
              min={1}
              max={10}
              step={1}
              marks
              name="intensity"
              onChange={(e, value) => setNewSymptom(prev => ({ ...prev, intensity: value }))}
              valueLabelDisplay="auto"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Frequ00eancia</InputLabel>
              <Select
                name="frequency"
                value={newSymptom.frequency}
                label="Frequ00eancia"
                onChange={handleSymptomChange}
              >
                {frequencyOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Durau00e7u00e3o"
              name="duration"
              value={newSymptom.duration}
              onChange={handleSymptomChange}
              placeholder="Ex: 2 horas, 3 dias"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Gatilhos"
              name="triggers"
              value={newSymptom.triggers}
              onChange={handleSymptomChange}
              placeholder="Ex: Estresse, Alimentos, Hormu00f4nios"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddSymptom}
              disabled={!newSymptom.description.trim()}
            >
              Adicionar Sintoma
            </Button>
          </Grid>
        </Grid>
      </Box>
      
      <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
        Sintomas Adicionados ({data.length})
      </Typography>
      
      {data.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Nenhum sintoma adicionado ainda.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {data.map(symptom => (
            <Grid item xs={12} key={symptom.id}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="subtitle1">{symptom.description}</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        <Chip 
                          label={`Intensidade: ${symptom.intensity}/10`} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                        />
                        <Chip 
                          label={`Frequ00eancia: ${frequencyOptions.find(o => o.value === symptom.frequency)?.label || symptom.frequency}`}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                        {symptom.duration && (
                          <Chip 
                            label={`Durau00e7u00e3o: ${symptom.duration}`} 
                            size="small" 
                            variant="outlined" 
                          />
                        )}
                      </Box>
                      {symptom.triggers && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <strong>Gatilhos:</strong> {symptom.triggers}
                        </Typography>
                      )}
                    </Box>
                    <IconButton 
                      aria-label="remover" 
                      onClick={() => handleRemoveSymptom(symptom.id)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default SymptomForm;
