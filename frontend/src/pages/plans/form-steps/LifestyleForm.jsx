import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Autocomplete,
  Slider,
  Divider,
  Paper,
  InputAdornment,
  Card,
  CardContent,
  Rating
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Restaurant as DietIcon,
  NoFood as RestrictionsIcon,
  LocalDining as MealIcon,
  WaterDrop as WaterIcon,
  LocalBar as AlcoholIcon,
  FitnessCenter as ExerciseIcon,
  Bedtime as SleepIcon,
  Psychology as StressIcon,
  Work as WorkIcon,
  Air as EnvironmentIcon
} from '@mui/icons-material';

// Tipos de dieta comuns
const dietTypes = [
  'Onvora',
  'Vegetariana',
  'Vegana',
  'Pescetariana',
  'Paleo',
  'Cetognica',
  'Low-carb',
  'Mediterru00e2nea',
  'Dash',
  'Sem glutu00e9n',
  'Sem lactose',
  'Plant-based',
  'Flexitariana',
  'Macrobiu00f3tica',
  'Alimentau00e7u00e3o intuitiva',
  'Outra'
];

// Restriu00e7u00f5es alimentares comuns
const dietaryRestrictions = [
  'Glutu00e9n',
  'Lactose',
  'Caseina',
  'Ovo',
  'Amendoim',
  'Castanhas',
  'Soja',
  'Frutos do mar',
  'Trigo',
  'Milho',
  'Adu00e7u00facar refinado',
  'Au00e7u00facar artificial',
  'Conservantes',
  'Corantes artificiais',
  'Carne vermelha',
  'Alimentos ultraprocessados',
  'Cafeina',
  'u00c1lcool',
  'FODMAP'
];

// Tipos de exercu00edcio comuns
const exerciseTypes = [
  'Caminhada',
  'Corrida',
  'Ciclismo',
  'Natau00e7u00e3o',
  'Musculau00e7u00e3o',
  'Pilates',
  'Yoga',
  'Crossfit',
  'HIIT',
  'Danu00e7a',
  'Artes marciais',
  'Funcional',
  'Esportes coletivos',
  'Alongamento',
  'Escalada',
  'Hidroginastica'
];

// Estratu00e9gias de gestu00e3o de estresse
const stressManagementOptions = [
  'Meditau00e7u00e3o',
  'Mindfulness',
  'Yoga',
  'Respirau00e7u00e3o',
  'Terapia',
  'Journaling',
  'Contato com a natureza',
  'Atividade fu00edsica',
  'Hobbies',
  'Leitura',
  'Mu00fasica',
  'Banhos relaxantes',
  'Massagem',
  'Acupuntura',
  'Reduu00e7u00e3o de carga de trabalho',
  'Limites de horrios'
];

// Fatores ambientais comuns
const environmentalFactors = [
  'Exposiu00e7u00e3o a poluiu00e7u00e3o',
  'Poluiu00e7u00e3o sonora',
  'Exposiu00e7u00e3o a radiau00e7u00e3o',
  'Produtos quu00edmicos domu00e9sticos',
  'Cosmu00e9ticos com parabenos',
  'Cosmu00e9ticos com ftalatos',
  'Bisfenol A (BPA)',
  'Metais pesados',
  'Pesticidas',
  'Agrotu00f3xicos',
  'Mofo',
  'Qualidade do ar inadequada',
  'u00c1gua contaminada',
  'Dispositivos eletru00f4nicos (luz azul)',
  'Campos eletromagnu00e9ticos',
  'Trabalho com produtos quu00edmicos',
  'Tabagismo passivo'
];

/**
 * Componente para coleta de informau00e7u00f5es sobre estilo de vida
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.data - Dados atuais do estilo de vida
 * @param {Function} props.onChange - Funu00e7u00e3o para atualizar os dados
 */
const LifestyleForm = ({ data, onChange }) => {
  const initialData = {
    diet_type: '',
    diet_restrictions: [],
    meal_frequency: '',
    water_intake: '',
    alcohol_consumption: '',
    exercise_frequency: '',
    exercise_types: [],
    sleep_quality: '',
    sleep_hours: '',
    stress_level: '',
    stress_management: [],
    occupation_details: '',
    environmental_factors: []
  };

  const [formData, setFormData] = useState(data || initialData);

  // Atualizar formulu00e1rio quando os dados externos mudarem
  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  // Propagar mudanu00e7as para o componente pai
  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  // Manipular mudanu00e7as nos campos de texto e select
  const handleChange = (event) => {
    const { name, value } = event.target;
    
    // Validar campos numu00e9ricos
    if (name === 'sleep_hours') {
      // Permitir apenas nu00fameros e campo vazio
      if (value === '' || /^\d+$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Manipular mudanu00e7as em campos de autocomplete mu00faltiplo
  const handleMultipleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h5" gutterBottom color="primary">
          Estilo de Vida
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          Colete informau00e7u00f5es sobre alimentau00e7u00e3o, exercu00edcios, sono, estresse e fatores ambientais que podem influenciar a sau00fade da paciente.
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Grid container spacing={3}>
          {/* Alimentau00e7u00e3o */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DietIcon color="primary" />
                  Alimentau00e7u00e3o
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="diet-type-label">Tipo de Alimentau00e7u00e3o</InputLabel>
                      <Select
                        labelId="diet-type-label"
                        name="diet_type"
                        value={formData.diet_type}
                        onChange={handleChange}
                        label="Tipo de Alimentau00e7u00e3o"
                      >
                        <MenuItem value=""><em>Selecione</em></MenuItem>
                        {dietTypes.map((type) => (
                          <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="meal-frequency-label">Frequu00eancia de Refeiu00e7u00f5es</InputLabel>
                      <Select
                        labelId="meal-frequency-label"
                        name="meal_frequency"
                        value={formData.meal_frequency}
                        onChange={handleChange}
                        label="Frequu00eancia de Refeiu00e7u00f5es"
                        startAdornment={
                          <InputAdornment position="start">
                            <MealIcon />
                          </InputAdornment>
                        }
                      >
                        <MenuItem value=""><em>Selecione</em></MenuItem>
                        <MenuItem value="1-2">1-2 refeiu00e7u00f5es por dia</MenuItem>
                        <MenuItem value="3">3 refeiu00e7u00f5es por dia</MenuItem>
                        <MenuItem value="4-5">4-5 refeiu00e7u00f5es por dia</MenuItem>
                        <MenuItem value="6+">6 ou mais refeiu00e7u00f5es por dia</MenuItem>
                        <MenuItem value="irregular">Irregular/Variu00e1vel</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      multiple
                      options={dietaryRestrictions}
                      value={formData.diet_restrictions}
                      onChange={(event, newValue) => handleMultipleChange('diet_restrictions', newValue)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            variant="outlined"
                            label={option}
                            {...getTagProps({ index })}
                            key={index}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Restriu00e7u00f5es Alimentares"
                          placeholder="Selecione ou adicione"
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                <InputAdornment position="start">
                                  <RestrictionsIcon />
                                </InputAdornment>
                                {params.InputProps.startAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="water-intake-label">Consumo de u00c1gua</InputLabel>
                      <Select
                        labelId="water-intake-label"
                        name="water_intake"
                        value={formData.water_intake}
                        onChange={handleChange}
                        label="Consumo de u00c1gua"
                        startAdornment={
                          <InputAdornment position="start">
                            <WaterIcon />
                          </InputAdornment>
                        }
                      >
                        <MenuItem value=""><em>Selecione</em></MenuItem>
                        <MenuItem value="low">Baixo (menos de 1L/dia)</MenuItem>
                        <MenuItem value="moderate">Moderado (1-2L/dia)</MenuItem>
                        <MenuItem value="adequate">Adequado (2-3L/dia)</MenuItem>
                        <MenuItem value="high">Alto (mais de 3L/dia)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="alcohol-consumption-label">Consumo de u00c1lcool</InputLabel>
                      <Select
                        labelId="alcohol-consumption-label"
                        name="alcohol_consumption"
                        value={formData.alcohol_consumption}
                        onChange={handleChange}
                        label="Consumo de u00c1lcool"
                        startAdornment={
                          <InputAdornment position="start">
                            <AlcoholIcon />
                          </InputAdornment>
                        }
                      >
                        <MenuItem value=""><em>Selecione</em></MenuItem>
                        <MenuItem value="none">Nu00e3o consome</MenuItem>
                        <MenuItem value="occasional">Ocasional (eventos sociais)</MenuItem>
                        <MenuItem value="weekly">Semanal (1-2 vezes por semana)</MenuItem>
                        <MenuItem value="frequent">Frequente (3+ vezes por semana)</MenuItem>
                        <MenuItem value="daily">Diu00e1rio</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Atividade Fu00edsica */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ExerciseIcon color="primary" />
                  Atividade Fu00edsica
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="exercise-frequency-label">Frequu00eancia de Exercu00edcios</InputLabel>
                      <Select
                        labelId="exercise-frequency-label"
                        name="exercise_frequency"
                        value={formData.exercise_frequency}
                        onChange={handleChange}
                        label="Frequu00eancia de Exercu00edcios"
                      >
                        <MenuItem value=""><em>Selecione</em></MenuItem>
                        <MenuItem value="sedentary">Sedentrio (nenhum exercu00edcio)</MenuItem>
                        <MenuItem value="light">Leve (1-2 vezes por semana)</MenuItem>
                        <MenuItem value="moderate">Moderado (3-4 vezes por semana)</MenuItem>
                        <MenuItem value="active">Ativo (5+ vezes por semana)</MenuItem>
                        <MenuItem value="very_active">Muito ativo (exercu00edcio diu00e1rio intenso)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      multiple
                      options={exerciseTypes}
                      value={formData.exercise_types}
                      onChange={(event, newValue) => handleMultipleChange('exercise_types', newValue)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            variant="outlined"
                            label={option}
                            {...getTagProps({ index })}
                            key={index}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Tipos de Exercu00edcio"
                          placeholder="Selecione ou adicione"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Sono */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SleepIcon color="primary" />
                  Sono
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Horas de Sono (mu00e9dia por noite)"
                      name="sleep_hours"
                      value={formData.sleep_hours}
                      onChange={handleChange}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">horas</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="sleep-quality-label">Qualidade do Sono</InputLabel>
                      <Select
                        labelId="sleep-quality-label"
                        name="sleep_quality"
                        value={formData.sleep_quality}
                        onChange={handleChange}
                        label="Qualidade do Sono"
                      >
                        <MenuItem value=""><em>Selecione</em></MenuItem>
                        <MenuItem value="poor">Ruim (dificuldade para dormir, despertares frequentes)</MenuItem>
                        <MenuItem value="fair">Razovel (alguns problemas de sono)</MenuItem>
                        <MenuItem value="good">Boa (geralmente descansa bem)</MenuItem>
                        <MenuItem value="excellent">Excelente (sono reparador constantemente)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Estresse */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StressIcon color="primary" />
                  Estresse
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box sx={{ px: 2, pb: 2 }}>
                      <Typography gutterBottom>Nu00edvel de Estresse</Typography>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs>
                          <Slider
                            value={formData.stress_level ? parseInt(formData.stress_level) : 0}
                            onChange={(e, newValue) => setFormData({ ...formData, stress_level: newValue.toString() })}
                            step={1}
                            marks
                            min={0}
                            max={10}
                            valueLabelDisplay="auto"
                          />
                        </Grid>
                        <Grid item>
                          <Typography>
                            {formData.stress_level ? formData.stress_level : '0'}/10
                          </Typography>
                        </Grid>
                      </Grid>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="caption">Baixo</Typography>
                        <Typography variant="caption">Moderado</Typography>
                        <Typography variant="caption">Alto</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      multiple
                      options={stressManagementOptions}
                      value={formData.stress_management}
                      onChange={(event, newValue) => handleMultipleChange('stress_management', newValue)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            variant="outlined"
                            label={option}
                            {...getTagProps({ index })}
                            key={index}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Estratu00e9gias de Gestu00e3o de Estresse"
                          placeholder="Selecione ou adicione"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Ocupau00e7u00e3o e Fatores Ambientais */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WorkIcon color="primary" />
                  Ocupau00e7u00e3o e Ambiente
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Detalhes da Ocupau00e7u00e3o"
                      name="occupation_details"
                      value={formData.occupation_details}
                      onChange={handleChange}
                      placeholder="Descreva o trabalho, horu00e1rio, nvel de sedentarismo, exposiu00e7u00e3o a fatores de risco, etc."
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <WorkIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      multiple
                      options={environmentalFactors}
                      value={formData.environmental_factors}
                      onChange={(event, newValue) => handleMultipleChange('environmental_factors', newValue)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            variant="outlined"
                            label={option}
                            {...getTagProps({ index })}
                            key={index}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Fatores Ambientais"
                          placeholder="Selecione ou adicione"
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                <InputAdornment position="start">
                                  <EnvironmentIcon />
                                </InputAdornment>
                                {params.InputProps.startAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default LifestyleForm;
