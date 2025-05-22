import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save as SaveIcon,
  NavigateNext as NextIcon,
  NavigateBefore as BackIcon,
  Check as CheckIcon,
  Home as HomeIcon,
  Healing as HealingIcon
} from '@mui/icons-material';

import PlanService from '../../services/plan.service';

// Etapas do formulário
import PatientInfo from './form-steps/PatientInfo';
import MenstrualHistory from './form-steps/MenstrualHistory';
import SymptomsForm from './form-steps/SymptomsForm';
import HealthHistory from './form-steps/HealthHistory';
import LifestyleForm from './form-steps/LifestyleForm';
import LabResults from './form-steps/LabResults';
import TraditionalChineseMedicine from './form-steps/TraditionalChineseMedicine';
import IFMMatrix from './form-steps/IFMMatrix';
import FunctionalTimeline from './form-steps/FunctionalTimeline';
import FinalReview from './form-steps/FinalReview';

// Nomes das etapas
const steps = [
  'Dados da Paciente',
  'Histórico Menstrual',
  'Sintomas',
  'Histórico de Saúde',
  'Estilo de Vida',
  'Resultados de Exames',
  'Medicina Tradicional Chinesa',
  'Matriz IFM',
  'Linha do Tempo Funcional',
  'Revisão Final'
];

// Componentes de cada etapa
const stepComponents = [
  PatientInfo,
  MenstrualHistory,
  SymptomsForm,
  HealthHistory,
  LifestyleForm,
  LabResults,
  TraditionalChineseMedicine,
  IFMMatrix,
  FunctionalTimeline,
  FinalReview
];

/**
 * Componente para criação e edição de planos
 */
const PlanForm = () => {
  const { id } = useParams(); // id do plano para edição
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Estado para controle do formulário
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(id ? true : false);
  const [saving, setSaving] = useState(false);
  const [planData, setPlanData] = useState({
    title: '',
    status: 'draft',
    patient: {
      name: '',
      age: '',
      height: '',
      weight: '',
      birth_date: null,
      occupation: '',
      contact: '',
      email: '',
      address: '',
      emergency_contact: ''
    },
    menstrual_history: {
      cycle_length: '',
      period_length: '',
      cycle_regularity: 'regular',
      last_period_date: null,
      flow_intensity: 'moderate',
      pms_symptoms: [],
      contraceptive_use: false,
      contraceptive_type: '',
      menarche_age: '',
      cycle_changes: [],
      menopause_status: 'not_applicable',
      menopause_age: '',
      hrt_use: false,
      hrt_details: '',
      notes: ''
    },
    symptoms: [],
    health_history: {
      previous_conditions: [],
      current_conditions: [],
      surgeries: [],
      medications: [],
      supplements: [],
      allergies: [],
      family_history: [],
      autoimmune_conditions: [],
      chronic_infections: [],
      hospitalizations: [],
      blood_type: '',
      vaccinations: [],
      dental_history: '',
      childhood_illnesses: []
    },
    lifestyle: {
      diet_type: '',
      diet_restrictions: [],
      meal_frequency: '',
      water_intake: '',
      alcohol_consumption: '',
      caffeine_consumption: '',
      tobacco_use: '',
      recreational_drugs: '',
      exercise_frequency: '',
      exercise_types: [],
      exercise_duration: '',
      exercise_intensity: '',
      sleep_quality: '',
      sleep_hours: '',
      sleep_issues: [],
      stress_level: '',
      stress_management: [],
      occupation_details: '',
      work_environment: '',
      hobbies: [],
      screen_time: '',
      nature_time: '',
      travel_frequency: '',
      environmental_factors: []
    },
    lab_results: [],
    traditional_chinese_medicine: {
      constitution: '',
      pulse_diagnosis: {
        rate: '',
        rhythm: '',
        strength: '',
        quality: ''
      },
      tongue_diagnosis: {
        color: '',
        coating: '',
        shape: '',
        moisture: ''
      },
      five_elements: {
        wood: '',
        fire: '',
        earth: '',
        metal: '',
        water: ''
      },
      yin_yang_balance: '',
      meridian_analysis: [],
      pattern_diagnosis: [],
      notes: ''
    },
    ifm_matrix: {
      nodes: {
        assimilation: { score: 0, notes: '', interventions: '' },
        defense: { score: 0, notes: '', interventions: '' },
        energy: { score: 0, notes: '', interventions: '' },
        biotransformation: { score: 0, notes: '', interventions: '' },
        transport: { score: 0, notes: '', interventions: '' },
        communication: { score: 0, notes: '', interventions: '' },
        structural_integrity: { score: 0, notes: '', interventions: '' },
        mental_emotional: { score: 0, notes: '', interventions: '' },
        nutrition: { score: 0, notes: '', interventions: '' },
        movement: { score: 0, notes: '', interventions: '' },
        sleep_relaxation: { score: 0, notes: '', interventions: '' },
        relationships: { score: 0, notes: '', interventions: '' },
        exposome: { score: 0, notes: '', interventions: '' },
        spiritual: { score: 0, notes: '', interventions: '' },
        inflammation: { score: 0, notes: '', interventions: '' },
        infection: { score: 0, notes: '', interventions: '' }
      }
    },
    functional_timeline: [],
    notes: '',
    ai_recommendations: null,
    created_at: null,
    updated_at: null
  });
  
  // Estados para alertas e diálogos
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [exitDialog, setExitDialog] = useState(false);
  const [generateDialog, setGenerateDialog] = useState(false);
  const [generatingPlan, setGeneratingPlan] = useState(false);

  // Buscar dados do plano para edição
  useEffect(() => {
    if (id) {
      fetchPlanData();
    }
  }, [id]);

  // Buscar dados do plano existente
  const fetchPlanData = async () => {
    try {
      setLoading(true);
      const response = await PlanService.getPlan(id);
      
      if (response.data.success) {
        setPlanData(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao buscar dados do plano:', error);
      showAlert('Erro ao carregar o plano', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Exibir alerta
  const showAlert = (message, severity = 'success') => {
    setAlert({ open: true, message, severity });
  };

  // Fechar alerta
  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  // Avançar para a próxima etapa
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    window.scrollTo(0, 0);
  };

  // Voltar para a etapa anterior
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    window.scrollTo(0, 0);
  };

  // Abrir diálogo de confirmação ao sair
  const handleOpenExitDialog = () => {
    setExitDialog(true);
  };

  // Fechar diálogo de saída
  const handleCloseExitDialog = () => {
    setExitDialog(false);
  };

  // Confirmar saída sem salvar
  const handleConfirmExit = () => {
    navigate('/plans');
  };

  // Abrir diálogo de confirmação para gerar plano
  const handleOpenGenerateDialog = () => {
    setGenerateDialog(true);
  };

  // Fechar diálogo de geração
  const handleCloseGenerateDialog = () => {
    setGenerateDialog(false);
  };

  // Atualizar dados do plano
  const updatePlanData = (step, data) => {
    setPlanData(prevData => {
      // Determinar qual parte do estado atualizar com base na etapa atual
      switch (step) {
        case 0: // Dados da Paciente
          return { ...prevData, patient: { ...prevData.patient, ...data }, title: data.title || prevData.title };
        case 1: // Histórico Menstrual
          return { ...prevData, menstrual_history: { ...prevData.menstrual_history, ...data } };
        case 2: // Sintomas
          return { ...prevData, symptoms: data };
        case 3: // Histórico de Saúde
          return { ...prevData, health_history: { ...prevData.health_history, ...data } };
        case 4: // Estilo de Vida
          return { ...prevData, lifestyle: { ...prevData.lifestyle, ...data } };
        case 5: // Resultados de Exames
          return { ...prevData, lab_results: data };
        case 6: // Medicina Tradicional Chinesa
          return { ...prevData, traditional_chinese_medicine: { ...prevData.traditional_chinese_medicine, ...data } };
        case 7: // Matriz IFM
          return { ...prevData, ifm_matrix: data };
        case 8: // Linha do Tempo Funcional
          return { ...prevData, functional_timeline: data };
        case 9: // Revisão Final
          return { ...prevData, notes: data.notes || prevData.notes };
        default:
          return prevData;
      }
    });
  };

  // Salvar o plano (criar ou atualizar)
  const handleSavePlan = async (generateFinal = false) => {
    try {
      setSaving(true);
      
      // Se estiver gerando o plano final, atualizar o status
      const dataToSave = generateFinal 
        ? { ...planData, status: 'in_progress' } 
        : planData;
      
      let response;
      if (id) {
        // Atualizar plano existente
        response = await PlanService.updatePlan(id, dataToSave);
      } else {
        // Criar novo plano
        response = await PlanService.createPlan(dataToSave);
      }
      
      if (response.data.success) {
        showAlert(id ? 'Plano atualizado com sucesso' : 'Plano criado com sucesso');
        
        // Se estivermos gerando o plano final
        if (generateFinal) {
          handleGenerateFinalPlan(response.data.data._id || id);
        } else if (!id) {
          // Se foi criação de novo plano, atualizar URL para incluir o ID
          navigate(`/plans/${response.data.data._id}/edit`, { replace: true });
        }
      }
    } catch (error) {
      console.error('Erro ao salvar plano:', error);
      showAlert('Erro ao salvar o plano', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Gerar plano final usando IA
  const handleGenerateFinalPlan = async (planId) => {
    try {
      setGeneratingPlan(true);
      handleCloseGenerateDialog();
      
      showAlert('Gerando plano personalizado com IA. Isso pode levar alguns minutos...', 'info');
      
      const response = await PlanService.generatePlan(planId || id);
      
      if (response.data.success) {
        showAlert('Plano gerado com sucesso!', 'success');
        navigate(`/plans/${planId || id}`);
      }
    } catch (error) {
      console.error('Erro ao gerar plano:', error);
      showAlert('Erro ao gerar plano com IA', 'error');
      setGeneratingPlan(false);
    }
  };

  // Verificar dados válidos para a etapa atual
  const isStepValid = (step) => {
    switch (step) {
      case 0: // Dados da Paciente
        // Campos obrigatórios: nome e idade
        return planData.patient.name && planData.patient.age;
      case 1: // Histórico Menstrual
        // Campos recomendados mas não obrigatórios
        return true;
      case 2: // Sintomas
        // Requer pelo menos um sintoma registrado
        return planData.symptoms && planData.symptoms.length > 0;
      case 3: // Histórico de Saúde
        // Recomendado ter pelo menos uma condição atual ou prévia, mas não obrigatório
        return true;
      case 4: // Estilo de Vida
        // Recomendado preencher informações de dieta e exercício, mas não obrigatório
        return true;
      case 5: // Resultados de Exames
        // O upload de exames é opcional
        return true;
      case 6: // Medicina Tradicional Chinesa
        // A avaliação de MTC é opcional
        return true;
      case 7: // Matriz IFM
        // A matriz IFM é recomendada, mas não obrigatória
        return true;
      case 8: // Linha do Tempo Funcional
        // O registro da linha do tempo é opcional
        return true;
      case 9: // Revisão Final
        // Validar se os dados mínimos foram preenchidos para gerar o plano
        return planData.patient.name && planData.patient.age && planData.symptoms && planData.symptoms.length > 0;
      default:
        return true;
    }
  };

  // Renderizar conteúdo da etapa atual
  const renderStepContent = (step) => {
    const StepComponent = stepComponents[step];
    return (
      <StepComponent 
        data={getStepData(step)} 
        onChange={(data) => updatePlanData(step, data)} 
        planId={id}
      />
    );
  };

  // Obter dados relevantes para a etapa atual
  const getStepData = (step) => {
    switch (step) {
      case 0: // Dados da Paciente
        return { ...planData.patient, title: planData.title };
      case 1: // Histórico Menstrual
        return planData.menstrual_history;
      case 2: // Sintomas
        return planData.symptoms;
      case 3: // Histórico de Saúde
        return planData.health_history;
      case 4: // Estilo de Vida
        return planData.lifestyle;
      case 5: // Resultados de Exames
        return planData.lab_results;
      case 6: // Medicina Tradicional Chinesa
        return planData.traditional_chinese_medicine;
      case 7: // Matriz IFM
        return planData.ifm_matrix;
      case 8: // Linha do Tempo Funcional
        return planData.functional_timeline;
      case 9: // Revisão Final
        return { notes: planData.notes, fullPlan: planData };
      default:
        return {};
    }
  };

  // Exibir indicador de carregamento enquanto busca dados do plano
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: '1200px', mx: 'auto' }}>
      {/* Cabeçalho */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          {id ? 'Editar Plano' : 'Novo Plano'}
        </Typography>
      </motion.div>

      {/* Stepper */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label} completed={index < activeStep}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Conteúdo do formulário */}
      <Paper sx={{ p: 3, mb: 3, minHeight: '400px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent(activeStep)}
          </motion.div>
        </AnimatePresence>
      </Paper>

      {/* Botões de navegação */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          variant="outlined"
          onClick={handleOpenExitDialog}
          startIcon={<HomeIcon />}
        >
          Sair
        </Button>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            disabled={activeStep === 0 || saving || generatingPlan}
            onClick={handleBack}
            startIcon={<BackIcon />}
            variant="outlined"
          >
            Voltar
          </Button>

          <Button
            variant="outlined"
            onClick={() => handleSavePlan(false)}
            disabled={saving || generatingPlan || !isStepValid(activeStep)}
            startIcon={<SaveIcon />}
          >
            {saving ? <CircularProgress size={24} /> : 'Salvar'}
          </Button>

          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenGenerateDialog}
              disabled={saving || generatingPlan || !isStepValid(activeStep)}
              startIcon={<HealingIcon />}
            >
              {generatingPlan ? <CircularProgress size={24} color="inherit" /> : 'Gerar Plano'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={saving || !isStepValid(activeStep)}
              endIcon={<NextIcon />}
            >
              Próximo
            </Button>
          )}
        </Box>
      </Box>

      {/* Diálogo de confirmação ao sair */}
      <Dialog
        open={exitDialog}
        onClose={handleCloseExitDialog}
      >
        <DialogTitle>Confirmar Saída</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja sair? Alterações não salvas serão perdidas.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseExitDialog}>Cancelar</Button>
          <Button onClick={handleConfirmExit} color="error">
            Sair sem Salvar
          </Button>
          <Button 
            onClick={() => {
              handleSavePlan();
              handleCloseExitDialog();
            }} 
            variant="contained" 
            color="primary"
            disabled={saving}
          >
            {saving ? <CircularProgress size={24} /> : 'Salvar e Sair'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmação para gerar plano */}
      <Dialog
        open={generateDialog}
        onClose={handleCloseGenerateDialog}
      >
        <DialogTitle>Gerar Plano Personalizado</DialogTitle>
        <DialogContent>
          <DialogContentText>
            A geração do plano personalizado utilizará inteligência artificial para processar todos os dados informados e criar recomendações específicas para a paciente.
            <br /><br />
            Este processo pode levar alguns minutos. Deseja continuar?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseGenerateDialog}>Cancelar</Button>
          <Button 
            onClick={() => handleSavePlan(true)} 
            variant="contained" 
            color="primary"
            disabled={saving || generatingPlan}
          >
            {saving || generatingPlan ? <CircularProgress size={24} /> : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alerta de notificação */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PlanForm;
