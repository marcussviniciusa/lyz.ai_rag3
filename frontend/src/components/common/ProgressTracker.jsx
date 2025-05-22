import React, { useState, useEffect } from 'react';
import { Box, LinearProgress, Typography, Paper, Stepper, Step, StepLabel, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import notificationService from '../../services/notification.service';

/**
 * Componente para exibir o progresso de operações assíncronas como geração de planos
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} props.operationId - ID da operação a ser monitorada
 * @param {string} props.title - Título da operação
 * @param {Array} props.steps - Lista de etapas da operação
 * @param {boolean} props.showDetails - Se deve mostrar detalhes expandidos
 * @param {function} props.onComplete - Função chamada quando a operação for concluída
 */
const ProgressTracker = ({ operationId, title, steps = [], showDetails = true, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Iniciando operação...');
  const [activeStep, setActiveStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(null);
  const [startTime] = useState(new Date());

  useEffect(() => {
    // Estimar tempo com base no progresso atual
    if (progress > 0 && progress < 100) {
      const elapsedMs = new Date() - startTime;
      const estimatedTotalMs = (elapsedMs / progress) * 100;
      const remainingMs = estimatedTotalMs - elapsedMs;
      
      // Converter para segundos ou minutos para exibição
      if (remainingMs > 60000) {
        setEstimatedTimeRemaining(`~${Math.ceil(remainingMs / 60000)} minutos restantes`);
      } else {
        setEstimatedTimeRemaining(`~${Math.ceil(remainingMs / 1000)} segundos restantes`);
      }
    } else if (progress >= 100) {
      setEstimatedTimeRemaining(null);
    }
  }, [progress, startTime]);

  useEffect(() => {
    // Inscrever-se para receber atualizações de progresso
    const progressSubscription = notificationService.progress$.subscribe(update => {
      if (update.operationId === operationId) {
        setProgress(update.percentComplete);
        setMessage(update.message);
        
        if (update.data?.stageIndex !== undefined) {
          setActiveStep(update.data.stageIndex);
        }
        
        if (update.percentComplete >= 100) {
          setIsComplete(true);
          if (onComplete && typeof onComplete === 'function') {
            onComplete();
          }
        }
      }
    });
    
    // Inscrever-se para receber notificações de erro
    const errorSubscription = notificationService.error$.subscribe(error => {
      if (error.operationId === operationId) {
        setIsError(true);
        setErrorMessage(error.message);
      }
    });
    
    return () => {
      progressSubscription.unsubscribe();
      errorSubscription.unsubscribe();
    };
  }, [operationId, onComplete]);

  // Animações para o componente
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Cores com base no status
  const getStatusColor = () => {
    if (isError) return 'error.main';
    if (isComplete) return 'success.main';
    return 'primary.main';
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 3, 
          borderLeft: 4, 
          borderColor: getStatusColor(),
          borderRadius: '4px',
          transition: 'border-color 0.3s ease'
        }}
      >
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color={getStatusColor()}>
            {title || 'Processamento em andamento'}
          </Typography>
          
          {!isComplete && !isError && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CircularProgress 
                size={24} 
                thickness={5} 
                sx={{ mr: 1 }} 
                color="primary" 
                variant="determinate" 
                value={progress} 
              />
              <Typography variant="body2" color="text.secondary">
                {progress}%
              </Typography>
            </Box>
          )}
        </Box>

        <LinearProgress 
          variant="determinate" 
          value={progress} 
          color={isError ? 'error' : isComplete ? 'success' : 'primary'}
          sx={{ height: 8, borderRadius: 4, mb: 2 }}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: isError ? 'bold' : 'normal', color: isError ? 'error.main' : 'text.primary' }}>
            {isError ? errorMessage : message}
          </Typography>
          
          {estimatedTimeRemaining && !isComplete && !isError && (
            <Typography variant="body2" color="text.secondary">
              {estimatedTimeRemaining}
            </Typography>
          )}
        </Box>

        {showDetails && steps.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label} completed={index < activeStep}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        )}
      </Paper>
    </motion.div>
  );
};

export default ProgressTracker;
