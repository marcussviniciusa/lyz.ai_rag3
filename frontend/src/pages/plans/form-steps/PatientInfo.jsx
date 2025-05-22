import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  InputAdornment,
  Divider,
  FormHelperText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';
import {
  Person as PersonIcon,
  CalendarMonth as CalendarIcon,
  Height as HeightIcon,
  Scale as ScaleIcon,
  Work as WorkIcon,
  Phone as PhoneIcon,
  Title as TitleIcon
} from '@mui/icons-material';

/**
 * Componente para preenchimento dos dados bu00e1sicos da paciente
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.data - Dados atuais da paciente
 * @param {Function} props.onChange - Funu00e7u00e3o para atualizar os dados
 */
const PatientInfo = ({ data, onChange }) => {
  const [formData, setFormData] = useState({
    title: data?.title || '',
    name: data?.name || '',
    age: data?.age || '',
    height: data?.height || '',
    weight: data?.weight || '',
    birth_date: data?.birth_date ? new Date(data.birth_date) : null,
    occupation: data?.occupation || '',
    contact: data?.contact || ''
  });
  
  const [errors, setErrors] = useState({});

  // Atualizar formulu00e1rio quando os dados externos mudarem
  useEffect(() => {
    if (data) {
      setFormData({
        title: data.title || '',
        name: data.name || '',
        age: data.age || '',
        height: data.height || '',
        weight: data.weight || '',
        birth_date: data.birth_date ? new Date(data.birth_date) : null,
        occupation: data.occupation || '',
        contact: data.contact || ''
      });
    }
  }, [data]);

  // Propagar mudanu00e7as para o componente pai
  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  // Manipular mudanu00e7as nos campos
  const handleChange = (event) => {
    const { name, value } = event.target;
    
    // Validar campos numu00e9ricos
    if (name === 'age' || name === 'height' || name === 'weight') {
      // Permitir apenas nu00fameros e campo vazio
      if (value === '' || /^\d+$/.test(value)) {
        setFormData({ ...formData, [name]: value });
        
        // Limpar erro se o campo for vu00e1lido
        if (errors[name]) {
          setErrors({ ...errors, [name]: null });
        }
      }
    } else {
      setFormData({ ...formData, [name]: value });
      
      // Limpar erro se o campo for vu00e1lido
      if (name === 'name' && value.trim() && errors.name) {
        setErrors({ ...errors, name: null });
      }
    }
    
    // Validar campos obrigatu00f3rios
    validateField(name, value);
  };

  // Manipular mudanu00e7a na data de nascimento
  const handleDateChange = (newDate) => {
    setFormData({ ...formData, birth_date: newDate });
  };

  // Validar um campo especu00edfico
  const validateField = (name, value) => {
    let newErrors = { ...errors };
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Nome da paciente u00e9 obrigatu00f3rio';
        } else {
          delete newErrors.name;
        }
        break;
      case 'age':
        if (!value) {
          newErrors.age = 'Idade u00e9 obrigatu00f3ria';
        } else if (parseInt(value) < 1 || parseInt(value) > 120) {
          newErrors.age = 'Idade deve estar entre 1 e 120 anos';
        } else {
          delete newErrors.age;
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  // Calcular IMC se altura e peso estiverem preenchidos
  const calculateBMI = () => {
    if (formData.height && formData.weight) {
      const heightInMeters = parseInt(formData.height) / 100;
      const weightInKg = parseInt(formData.weight);
      const bmi = weightInKg / (heightInMeters * heightInMeters);
      return bmi.toFixed(1);
    }
    return null;
  };

  // Classificar IMC
  const getBMICategory = (bmi) => {
    if (!bmi) return '';
    
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return 'Abaixo do peso';
    if (bmiValue < 25) return 'Peso normal';
    if (bmiValue < 30) return 'Sobrepeso';
    if (bmiValue < 35) return 'Obesidade Grau I';
    if (bmiValue < 40) return 'Obesidade Grau II';
    return 'Obesidade Grau III';
  };

  const bmi = calculateBMI();
  const bmiCategory = getBMICategory(bmi);

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h5" gutterBottom color="primary">
          Informau00e7u00f5es da Paciente
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          Preencha os dados bu00e1sicos da paciente para iniciar o plano personalizado.
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Grid container spacing={3}>
          {/* Tu00edtulo do plano */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tu00edtulo do Plano"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Plano Personalizado - Maria Silva"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TitleIcon />
                  </InputAdornment>
                ),
              }}
              helperText="Um tu00edtulo descritivo para identificar este plano"
            />
          </Grid>

          {/* Dados pessoais */}
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Nome da Paciente"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name || ''}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Idade"
              name="age"
              value={formData.age}
              onChange={handleChange}
              error={!!errors.age}
              helperText={errors.age || ''}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarIcon />
                  </InputAdornment>
                ),
                endAdornment: <InputAdornment position="end">anos</InputAdornment>,
              }}
            />
          </Grid>

          {/* Informau00e7u00f5es fu00edsicas */}
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1" gutterBottom>
              Informau00e7u00f5es Fu00edsicas
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Altura"
              name="height"
              value={formData.height}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HeightIcon />
                  </InputAdornment>
                ),
                endAdornment: <InputAdornment position="end">cm</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Peso"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ScaleIcon />
                  </InputAdornment>
                ),
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
            />
          </Grid>

          {/* IMC calculado */}
          {bmi && (
            <Grid item xs={12}>
              <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, border: '1px solid #e0e0e0' }}>
                <Typography variant="subtitle2" gutterBottom>
                  IMC: {bmi} - {bmiCategory}
                </Typography>
                <FormHelperText>
                  u00cdndice de Massa Corporal calculado automaticamente
                </FormHelperText>
              </Box>
            </Grid>
          )}

          {/* Informau00e7u00f5es adicionais */}
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1" gutterBottom>
              Informau00e7u00f5es Adicionais
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DatePicker
                label="Data de Nascimento"
                value={formData.birth_date}
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
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Profissu00e3o"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
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
            <TextField
              fullWidth
              label="Contato"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Telefone, email ou outra forma de contato"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon />
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

export default PatientInfo;
