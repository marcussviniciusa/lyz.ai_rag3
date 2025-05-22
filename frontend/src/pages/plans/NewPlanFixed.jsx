import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Stepper, Step, StepLabel, Button, Box,
  Paper, Alert, CircularProgress
} from '@mui/material';

// Serviu00e7o de planos
import PlanService from '../../services/plan.service';

// Componentes de formulu00e1rio - importando de forma mais segura com tratamento de erro
const PatientInfoForm = React.lazy(() => import('../../components/forms/PatientInfoForm'));
const SymptomForm = React.lazy(() => import('../../components/forms/SymptomForm'));
const HealthHistoryForm = React.lazy(() => import('../../components/forms/HealthHistoryForm'));
const LifestyleForm = React.lazy(() => import('../../components/forms/LifestyleForm'));
const ReviewForm = React.lazy(() => import('../../components/forms/ReviewForm'));

const steps = [
  'Informau00e7u00f5es da Paciente',
  'Sintomas',
  'Histu00f3rico de Sau00fade',
  'Estilo de Vida',
  'Revisu00e3o'
];

const NewPlanFixed = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    patient: { 
      name: '', 
      age: '', 
      height: '', 
      weight: '', 
      birthdate: '' 
    },
    symptoms: [],
    healthHistory: { 
      conditions: [], 
      medications: [], 
      surgeries: [], 
      allergies: [] 
    },
    lifestyle: { 
      diet: '', 
      exercise: '', 
      sleep: '', 
      stress: '',
      occupation: '',
      environment: '',
      alcohol: '',
      tobacco: '',
      stress_level: 5,
      sleep_quality: 5
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [componentError, setComponentError] = useState('');

  // Efeito para detectar e corrigir erros
  useEffect(() => {
    // Limpar erros quando a etapa mudar
    setComponentError('');
  }, [activeStep]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Manter referências estáveis para callbacks para evitar re-renderizações desnecessárias
  const handleFormChange = React.useCallback((step, data) => {
    try {
      setFormData(prevData => {
        const newData = { ...prevData };
        
        switch(step) {
          case 0:
            newData.patient = { ...prevData.patient, ...data };
            break;
          case 1:
            newData.symptoms = Array.isArray(data) ? [...data] : [];
            break;
          case 2:
            newData.healthHistory = { ...prevData.healthHistory, ...data };
            break;
          case 3:
            newData.lifestyle = { ...prevData.lifestyle, ...data };
            break;
          default:
            break;
        }
        
        return newData;
      });
    } catch (err) {
      console.error('Erro ao atualizar dados do formulu00e1rio:', err);
      setComponentError(`Erro ao atualizar dados: ${err.message}`);
    }
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('Enviando dados:', formData);
      const response = await PlanService.createPlan(formData);
      navigate(`/plans/${response.data.id}`);
    } catch (err) {
      console.error('Erro ao criar plano:', err);
      setError('Falha ao criar o plano. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  // Componente para renderizar cada etapa com Suspense e ErrorBoundary
  const FormStepComponent = React.memo(({ step }) => {
    // Criar handlers memorizados para cada etapa para manter referências estáveis
    const handlePatientChange = React.useCallback((data) => handleFormChange(0, data), [handleFormChange]);
    const handleSymptomsChange = React.useCallback((data) => handleFormChange(1, data), [handleFormChange]);
    const handleHistoryChange = React.useCallback((data) => handleFormChange(2, data), [handleFormChange]);
    const handleLifestyleChange = React.useCallback((data) => handleFormChange(3, data), [handleFormChange]);
    
    try {
      switch (step) {
        case 0:
          return (
            <PatientInfoForm 
              data={formData.patient} 
              onChange={handlePatientChange} 
            />
          );
        case 1:
          return (
            <SymptomForm 
              data={formData.symptoms || []} 
              onChange={handleSymptomsChange} 
            />
          );
        case 2:
          return (
            <HealthHistoryForm 
              data={formData.healthHistory} 
              onChange={handleHistoryChange} 
            />
          );
        case 3:
          return (
            <LifestyleForm 
              data={formData.lifestyle} 
              onChange={handleLifestyleChange} 
            />
          );
        case 4:
          return (
            <ReviewForm data={formData} />
          );
        default:
          return 'Passo desconhecido';
      }
    } catch (error) {
      console.error(`Erro ao renderizar etapa ${step}:`, error);
      return (
        <Alert severity="error" sx={{ my: 2 }}>
          Ocorreu um erro ao carregar esta etapa do formulu00e1rio. Por favor, tente novamente ou contate o suporte.
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Detalhes: {error.message}
          </Typography>
        </Alert>
      );
    }
  });

  return (
    <Container component="main" maxWidth="md" sx={{ mb: 6 }}>
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Novo Plano de Sau00fade
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {componentError && <Alert severity="warning" sx={{ mb: 3 }}>{componentError}</Alert>}
        
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box>
          <React.Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>}>
            <FormStepComponent step={activeStep} />
          </React.Suspense>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            color="inherit"
            disabled={activeStep === 0 || loading}
            onClick={handleBack}
          >
            Voltar
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Finalizar'}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
            >
              Pru00f3ximo
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default NewPlanFixed;
