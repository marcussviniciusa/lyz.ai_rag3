import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Stepper, Step, StepLabel, Button, Box,
  Paper, Alert, CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';

// Componentes de formulário (simulados para o exemplo)
import PatientInfoForm from '../../components/forms/PatientInfoForm';
import SymptomForm from '../../components/forms/SymptomForm';
import HealthHistoryForm from '../../components/forms/HealthHistoryForm';
import LifestyleForm from '../../components/forms/LifestyleForm';
import ReviewForm from '../../components/forms/ReviewForm';

// Serviço de planos
import PlanService from '../../services/plan.service';

const steps = [
  'Informações da Paciente',
  'Sintomas',
  'Histórico de Saúde',
  'Estilo de Vida',
  'Revisão'
];

const NewPlan = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    patient: { name: '', age: '', email: '', phone: '', height: '', weight: '', birthdate: '' },
    symptoms: [],
    healthHistory: { conditions: [], medications: [], surgeries: [], allergies: [] },
    lifestyle: { diet: '', exercise: '', sleep: '', stress: '' }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFormChange = (step, data) => {
    setFormData(prevData => {
      const newData = { ...prevData };
      
      switch(step) {
        case 0:
          newData.patient = { ...data };
          break;
        case 1:
          newData.symptoms = [...data];
          break;
        case 2:
          newData.healthHistory = { ...data };
          break;
        case 3:
          newData.lifestyle = { ...data };
          break;
        default:
          break;
      }
      
      return newData;
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await PlanService.createPlan(formData);
      navigate(`/plans/${response.data.id}`);
    } catch (err) {
      console.error('Erro ao criar plano:', err);
      setError('Falha ao criar o plano. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <PatientInfoForm 
            data={formData.patient} 
            onChange={(data) => handleFormChange(0, data)} 
          />
        );
      case 1:
        return (
          <SymptomForm 
            data={formData.symptoms} 
            onChange={(data) => handleFormChange(1, data)} 
          />
        );
      case 2:
        return (
          <HealthHistoryForm 
            data={formData.healthHistory} 
            onChange={(data) => handleFormChange(2, data)} 
          />
        );
      case 3:
        return (
          <LifestyleForm 
            data={formData.lifestyle} 
            onChange={(data) => handleFormChange(3, data)} 
          />
        );
      case 4:
        return (
          <ReviewForm data={formData} />
        );
      default:
        return 'Passo desconhecido';
    }
  };

  // Esta função simularia a validação de cada etapa
  const isStepValid = (step) => {
    // Em uma implementação real, você validaria os dados de cada etapa
    // Por simplicidade, retornaremos true
    return true;
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
          {/* Removendo temporariamente o motion para evitar problemas de renderizau00e7u00e3o */}
          <div key={activeStep}>
            {(() => {
              try {
                return getStepContent(activeStep);
              } catch (error) {
                console.error('Erro ao renderizar etapa do formulu00e1rio:', error);
                return (
                  <Alert severity="error">
                    Erro ao carregar esta etapa do formulu00e1rio. Detalhes: {error.message}
                  </Alert>
                );
              }
            })()}
          </div>
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
              disabled={loading || !isStepValid(activeStep)}
            >
              {loading ? <CircularProgress size={24} /> : 'Finalizar'}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={!isStepValid(activeStep)}
            >
              Próximo
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default NewPlan;
