import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Stepper, Step, StepLabel, Button, Box,
  Paper, Alert, CircularProgress
} from '@mui/material';

// Serviço de planos
import PlanService from '../../services/plan.service';

// Importação normal dos componentes (sem lazy loading)
import PatientInfoForm from '../../components/forms/PatientInfoForm';
import SymptomForm from '../../components/forms/SymptomForm';
import HealthHistoryForm from '../../components/forms/HealthHistoryForm';
import LifestyleForm from '../../components/forms/LifestyleForm';
import ReviewForm from '../../components/forms/ReviewForm';

const steps = [
  'Informações da Paciente',
  'Sintomas',
  'Histórico de Saúde',
  'Estilo de Vida',
  'Revisão'
];

const NewPlanSimple = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  
  // Estado inicial sem campos removidos
  const [patient, setPatient] = useState({ 
    name: '', 
    age: '', 
    height: '', 
    weight: '', 
    birthdate: '' 
  });
  
  const [symptoms, setSymptoms] = useState([]);
  const [healthHistory, setHealthHistory] = useState({ 
    conditions: [], 
    medications: [], 
    surgeries: [], 
    allergies: [] 
  });
  const [lifestyle, setLifestyle] = useState({ 
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
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Funções para mudar etapas
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Funções simples e diretas para atualizar cada parte do formulário
  const handlePatientChange = (updatedPatient) => {
    setPatient(updatedPatient);
  };
  
  const handleSymptomsChange = (updatedSymptoms) => {
    setSymptoms(updatedSymptoms);
  };
  
  const handleHealthHistoryChange = (updatedHistory) => {
    setHealthHistory(updatedHistory);
  };
  
  const handleLifestyleChange = (updatedLifestyle) => {
    setLifestyle(updatedLifestyle);
  };

  // Função para enviar o formulário completo
  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Reunir todos os dados em um único objeto
      const formData = {
        patient,
        symptoms,
        healthHistory,
        lifestyle
      };
      
      console.log('Enviando dados:', formData);
      const response = await PlanService.createPlan(formData);
      navigate(`/plans/${response.data.id}`);
    } catch (err) {
      console.error('Erro ao criar plano:', err);
      setError('Falha ao criar o plano. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  // Renderizar a etapa atual do formulário
  const renderCurrentStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <PatientInfoForm 
            data={patient} 
            onChange={handlePatientChange} 
          />
        );
      case 1:
        return (
          <SymptomForm 
            data={symptoms} 
            onChange={handleSymptomsChange} 
          />
        );
      case 2:
        return (
          <HealthHistoryForm 
            data={healthHistory} 
            onChange={handleHealthHistoryChange} 
          />
        );
      case 3:
        return (
          <LifestyleForm 
            data={lifestyle} 
            onChange={handleLifestyleChange} 
          />
        );
      case 4:
        return (
          <ReviewForm data={{ patient, symptoms, healthHistory, lifestyle }} />
        );
      default:
        return 'Passo desconhecido';
    }
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mb: 6 }}>
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Novo Plano de Saúde
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box>
          {renderCurrentStep()}
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
              Próximo
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default NewPlanSimple;
