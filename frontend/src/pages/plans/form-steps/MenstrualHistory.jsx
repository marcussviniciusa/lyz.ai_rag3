import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  InputAdornment,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  Select,
  MenuItem,
  InputLabel,
  Switch,
  Autocomplete
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';
import {
  CalendarMonth as CalendarIcon,
  Timeline as TimelineIcon,
  WaterDrop as WaterDropIcon,
  AccessTime as AccessTimeIcon,
  Notes as NotesIcon
} from '@mui/icons-material';

// Lista comum de sintomas de TPM
const commonPMSSymptoms = [
  'Dor de cabeça',
  'Cólicas',
  'Inchaço',
  'Irritabilidade',
  'Alterações de humor',
  'Ansiedade',
  'Cansaço',
  'Dor nos seios',
  'Acne',
  'Insônia',
  'Alterações no apetite',
  'Dores nas costas',
  'Náuseas',
  'Diarreia',
  'Constipação',
  'Sensibilidade à luz ou som',
  'Tontura',
  'Retenção de líquidos',
  'Dores musculares'
];

// Tipos comuns de contraceptivos
const contraceptiveTypes = [
  'Pílula anticoncepcional combinada',
  'Minipílula (progestágeno)',
  'Adesivo',
  'Anel vaginal',
  'DIU hormonal',
  'DIU de cobre',
  'Implante subdérmico',
  'Injeção contraceptiva',
  'Contraceptivos de emergência',
  'Método natural (tabelinha)',
  'Preservativo',
  'Outro'
];

/**
 * Componente para coleta de informações sobre o histórico menstrual
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.data - Dados atuais do histórico menstrual
 * @param {Function} props.onChange - Função para atualizar os dados
 */
const MenstrualHistory = ({ data, onChange }) => {
  const [formData, setFormData] = useState({
    cycle_length: data?.cycle_length || '',
    period_length: data?.period_length || '',
    cycle_regularity: data?.cycle_regularity || 'regular',
    last_period_date: data?.last_period_date ? new Date(data.last_period_date) : null,
    flow_intensity: data?.flow_intensity || 'moderate',
    pms_symptoms: data?.pms_symptoms || [],
    contraceptive_use: data?.contraceptive_use ?? false,
    contraceptive_type: data?.contraceptive_type || '',
    notes: data?.notes || ''
  });

  // Atualizar formulário quando os dados externos mudarem
  useEffect(() => {
    if (data) {
      setFormData({
        cycle_length: data.cycle_length || '',
        period_length: data.period_length || '',
        cycle_regularity: data.cycle_regularity || 'regular',
        last_period_date: data.last_period_date ? new Date(data.last_period_date) : null,
        flow_intensity: data.flow_intensity || 'moderate',
        pms_symptoms: data.pms_symptoms || [],
        contraceptive_use: data.contraceptive_use ?? false,
        contraceptive_type: data.contraceptive_type || '',
        notes: data.notes || ''
      });
    }
  }, [data]);

  // Propagar mudanças para o componente pai
  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  // Manipular mudanças nos campos de texto e número
  const handleChange = (event) => {
    const { name, value } = event.target;
    
    // Validar campos numéricos
    if (name === 'cycle_length' || name === 'period_length') {
      // Permitir apenas números e campo vazio
      if (value === '' || /^\d+$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Manipular mudança na data da última menstruação
  const handleDateChange = (newDate) => {
    setFormData({ ...formData, last_period_date: newDate });
  };

  // Manipular mudança na regularidade do ciclo
  const handleRegularityChange = (event) => {
    setFormData({ ...formData, cycle_regularity: event.target.value });
  };

  // Manipular mudança na intensidade do fluxo
  const handleFlowChange = (event) => {
    setFormData({ ...formData, flow_intensity: event.target.value });
  };

  // Manipular mudança nos sintomas de TPM
  const handlePMSChange = (event, newValue) => {
    setFormData({ ...formData, pms_symptoms: newValue });
  };

  // Manipular mudança no uso de contraceptivos
  const handleContraceptiveUseChange = (event) => {
    const isUsingContraceptive = event.target.checked;
    setFormData({ 
      ...formData, 
      contraceptive_use: isUsingContraceptive,
      // Limpar o tipo se não estiver usando
      contraceptive_type: isUsingContraceptive ? formData.contraceptive_type : ''
    });
  };

  // Manipular mudança no tipo de contraceptivo
  const handleContraceptiveTypeChange = (event) => {
    setFormData({ ...formData, contraceptive_type: event.target.value });
  };

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h5" gutterBottom color="primary">
          Histórico Menstrual
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          Informe detalhes sobre o ciclo menstrual da paciente para auxiliar na personalização do plano.
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Grid container spacing={3}>
          {/* Ciclo menstrual */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Duração do Ciclo"
              name="cycle_length"
              value={formData.cycle_length}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TimelineIcon />
                  </InputAdornment>
                ),
                endAdornment: <InputAdornment position="end">dias</InputAdornment>,
              }}
              helperText="Tempo médio entre o início de uma menstruação e o início da próxima (geralmente 28 dias)"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Duração da Menstruação"
              name="period_length"
              value={formData.period_length}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccessTimeIcon />
                  </InputAdornment>
                ),
                endAdornment: <InputAdornment position="end">dias</InputAdornment>,
              }}
              helperText="Tempo médio de duração do sangramento menstrual"
            />
          </Grid>

          {/* Regularidade e data da última menstruação */}
          <Grid item xs={12} sm={6}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Regularidade do Ciclo</FormLabel>
              <RadioGroup
                row
                name="cycle_regularity"
                value={formData.cycle_regularity}
                onChange={handleRegularityChange}
              >
                <FormControlLabel value="regular" control={<Radio />} label="Regular" />
                <FormControlLabel value="irregular" control={<Radio />} label="Irregular" />
                <FormControlLabel value="very_irregular" control={<Radio />} label="Muito Irregular" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DatePicker
                label="Data da Última Menstruação"
                value={formData.last_period_date}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarIcon />
                        </InputAdornment>
                      ),
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          {/* Intensidade do fluxo */}
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1" gutterBottom>
              Características do Fluxo Menstrual
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="flow-intensity-label">Intensidade do Fluxo</InputLabel>
              <Select
                labelId="flow-intensity-label"
                name="flow_intensity"
                value={formData.flow_intensity}
                onChange={handleFlowChange}
                startAdornment={
                  <InputAdornment position="start">
                    <WaterDropIcon />
                  </InputAdornment>
                }
              >
                <MenuItem value="light">Leve</MenuItem>
                <MenuItem value="moderate">Moderado</MenuItem>
                <MenuItem value="heavy">Intenso</MenuItem>
                <MenuItem value="very_heavy">Muito Intenso</MenuItem>
                <MenuItem value="variable">Variável</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Sintomas de TPM */}
          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={commonPMSSymptoms}
              value={formData.pms_symptoms}
              onChange={handlePMSChange}
              freeSolo
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
                  label="Sintomas de TPM"
                  placeholder="Adicione os sintomas"
                  helperText="Selecione da lista ou adicione outros sintomas"
                />
              )}
            />
          </Grid>

          {/* Uso de contraceptivos */}
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1" gutterBottom>
              Métodos Contraceptivos
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.contraceptive_use}
                  onChange={handleContraceptiveUseChange}
                  name="contraceptive_use"
                  color="primary"
                />
              }
              label="Utiliza método contraceptivo"
            />
          </Grid>
          {formData.contraceptive_use && (
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="contraceptive-type-label">Tipo de Contraceptivo</InputLabel>
                <Select
                  labelId="contraceptive-type-label"
                  name="contraceptive_type"
                  value={formData.contraceptive_type}
                  onChange={handleContraceptiveTypeChange}
                >
                  <MenuItem value=""><em>Selecione</em></MenuItem>
                  {contraceptiveTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {/* Observações adicionais */}
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1" gutterBottom>
              Observações Adicionais
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Notas sobre o ciclo menstrual"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Informações adicionais relevantes sobre o ciclo menstrual, alterações recentes, etc."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <NotesIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default MenstrualHistory;
