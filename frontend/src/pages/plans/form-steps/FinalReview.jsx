import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Button,
  Alert,
  Snackbar
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  Spa as MenstrualIcon,
  LocalHospital as SymptomsIcon,
  Healing as HealthIcon,
  Restaurant as LifestyleIcon,
  Description as LabIcon,
  Brightness4 as TCMIcon,
  Apps as IFMIcon,
  Timeline as TimelineIcon,
  Note as NotesIcon,
  Send as SendIcon
} from '@mui/icons-material';
import ProgressTracker from '../../../components/common/ProgressTracker';
import planService from '../../../services/plan.service';
import notificationService from '../../../services/notification.service';

/**
 * Componente para a revisão final dos dados do plano antes da geração
 */
const FinalReview = ({ data, onChange, onGeneratePlan }) => {
  const { notes, fullPlan } = data;
  const [additionalNotes, setAdditionalNotes] = useState(notes || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [operationId, setOperationId] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [generatedPlan, setGeneratedPlan] = useState(null);

  // Estágios da geração do plano para o tracker
  const planGenerationStages = [
    'Preparando dados da paciente',
    'Analisando exames laboratoriais',
    'Analisando matriz IFM',
    'Analisando observações de MTC',
    'Analisando linha do tempo funcional',
    'Integrando análises',
    'Gerando recomendações personalizadas',
    'Finalizando plano'
  ];

  // Efeito para receber notificações
  useEffect(() => {
    const notificationSubscription = notificationService.notification$.subscribe(notification => {
      setNotification({
        open: true,
        message: notification.message,
        severity: notification.type
      });
      
      // Se a notificação for de conclusão do plano, atualizar estado
      if (notification.type === 'success' && notification.message.includes('Plano de saúde gerado')) {
        setIsGenerating(false);
      }
    });
    
    const errorSubscription = notificationService.error$.subscribe(error => {
      setNotification({
        open: true,
        message: error.message,
        severity: 'error'
      });
      setIsGenerating(false);
    });
    
    return () => {
      notificationSubscription.unsubscribe();
      errorSubscription.unsubscribe();
    };
  }, []);
  
  // Iniciar processo de geração do plano
  const handleGeneratePlan = async () => {
    try {
      // Certificar-se de que temos um ID de plano
      if (!fullPlan._id) {
        setNotification({
          open: true,
          message: 'Não foi possível identificar o plano. Salve as informações antes de gerar.',
          severity: 'error'
        });
        return;
      }
      
      // Atualizar estado
      setIsGenerating(true);
      setOperationId(`generate-plan-${fullPlan._id}-${Date.now()}`);
      
      // Chamar serviço para gerar plano
      const response = await planService.generatePlan(fullPlan._id);
      
      // Processar resposta
      setGeneratedPlan(response.data);
      
      // Notificar componente pai (opcional)
      if (onGeneratePlan && typeof onGeneratePlan === 'function') {
        onGeneratePlan(response.data);
      }
    } catch (error) {
      console.error('Erro ao gerar plano:', error);
      setNotification({
        open: true,
        message: error.response?.data?.message || 'Ocorreu um erro ao gerar o plano',
        severity: 'error'
      });
      setIsGenerating(false);
    }
  };

  // Fechar notificação
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Atualizar as notas adicionais
  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setAdditionalNotes(newNotes);
    onChange({ notes: newNotes });
  };

  // Função para formatar datas para exibição
  const formatDate = (dateString) => {
    if (!dateString) return 'Não informado';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Animações com Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Typography variant="h5" component="h2" gutterBottom>
            Revisão Final do Plano
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Revise todas as informações coletadas antes de gerar o plano personalizado. 
            Você pode adicionar notas adicionais que serão consideradas na geração do plano.
          </Typography>
        </motion.div>

        {/* Resumo dos dados da paciente */}
        <motion.div variants={itemVariants}>
          <Card sx={{ mb: 3, mt: 3 }}>
            <CardHeader
              avatar={<Avatar><PersonIcon /></Avatar>}
              title="Dados da Paciente"
              subheader={`${fullPlan.patient.name}, ${fullPlan.patient.age} anos`}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Informações Básicas</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Altura" 
                        secondary={fullPlan.patient.height ? `${fullPlan.patient.height} cm` : 'Não informado'} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Peso" 
                        secondary={fullPlan.patient.weight ? `${fullPlan.patient.weight} kg` : 'Não informado'} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Data de Nascimento" 
                        secondary={formatDate(fullPlan.patient.birth_date)} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Ocupação" 
                        secondary={fullPlan.patient.occupation || 'Não informado'} 
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Contato</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Telefone" 
                        secondary={fullPlan.patient.contact || 'Não informado'} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Email" 
                        secondary={fullPlan.patient.email || 'Não informado'} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Endereço" 
                        secondary={fullPlan.patient.address || 'Não informado'} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Contato de Emergência" 
                        secondary={fullPlan.patient.emergency_contact || 'Não informado'} 
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </motion.div>

        {/* Resumo das informações de saúde */}
        <motion.div variants={itemVariants}>
          <Grid container spacing={3}>
            {/* Coluna 1 */}
            <Grid item xs={12} md={6}>
              {/* Histórico Menstrual */}
              <Accordion defaultExpanded sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MenstrualIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="subtitle1">Histórico Menstrual</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Duração do ciclo: {fullPlan.menstrual_history.cycle_length || 'Não informado'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Duração da menstruação: {fullPlan.menstrual_history.period_length || 'Não informado'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Regularidade: {fullPlan.menstrual_history.cycle_regularity || 'Não informado'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Último período: {formatDate(fullPlan.menstrual_history.last_period_date)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Status de menopausa: {fullPlan.menstrual_history.menopause_status || 'Não informado'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Sintomas de TPM:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {fullPlan.menstrual_history.pms_symptoms && fullPlan.menstrual_history.pms_symptoms.length > 0 ? 
                          fullPlan.menstrual_history.pms_symptoms.map((symptom, index) => (
                            <Chip key={index} label={symptom} size="small" sx={{ m: 0.5 }} />
                          )) : 
                          <Typography variant="body2">Nenhum sintoma informado</Typography>
                        }
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* Sintomas */}
              <Accordion defaultExpanded sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SymptomsIcon sx={{ mr: 1, color: 'error.main' }} />
                    <Typography variant="subtitle1">Sintomas</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {fullPlan.symptoms && fullPlan.symptoms.length > 0 ? (
                    <List dense>
                      {fullPlan.symptoms.slice(0, 5).map((symptom, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Avatar sx={{ width: 24, height: 24, bgcolor: 
                              symptom.priority === 'high' ? 'error.main' : 
                              symptom.priority === 'medium' ? 'warning.main' : 'success.main' 
                            }}>
                              {index + 1}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText 
                            primary={symptom.description} 
                            secondary={`${symptom.duration || 'Duração não informada'} | Prioridade: ${symptom.priority || 'Não definida'}`} 
                          />
                        </ListItem>
                      ))}
                      {fullPlan.symptoms.length > 5 && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          + {fullPlan.symptoms.length - 5} outros sintomas
                        </Typography>
                      )}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Nenhum sintoma registrado
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>

              {/* Histórico de Saúde */}
              <Accordion defaultExpanded sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <HealthIcon sx={{ mr: 1, color: 'info.main' }} />
                    <Typography variant="subtitle1">Histórico de Saúde</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Condições atuais:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {fullPlan.health_history.current_conditions && fullPlan.health_history.current_conditions.length > 0 ? 
                          fullPlan.health_history.current_conditions.map((condition, index) => (
                            <Chip key={index} label={condition} size="small" sx={{ m: 0.5 }} />
                          )) : 
                          <Typography variant="body2">Nenhuma condição informada</Typography>
                        }
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Medicações:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {fullPlan.health_history.medications && fullPlan.health_history.medications.length > 0 ? 
                          fullPlan.health_history.medications.map((med, index) => (
                            <Chip key={index} label={med} size="small" sx={{ m: 0.5 }} />
                          )) : 
                          <Typography variant="body2">Nenhuma medicação informada</Typography>
                        }
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Suplementos:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {fullPlan.health_history.supplements && fullPlan.health_history.supplements.length > 0 ? 
                          fullPlan.health_history.supplements.map((supp, index) => (
                            <Chip key={index} label={supp} size="small" sx={{ m: 0.5 }} />
                          )) : 
                          <Typography variant="body2">Nenhum suplemento informado</Typography>
                        }
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>

            {/* Coluna 2 */}
            <Grid item xs={12} md={6}>
              {/* Estilo de Vida */}
              <Accordion defaultExpanded sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LifestyleIcon sx={{ mr: 1, color: 'success.main' }} />
                    <Typography variant="subtitle1">Estilo de Vida</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Tipo de dieta: {fullPlan.lifestyle.diet_type || 'Não informado'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Consumo de água: {fullPlan.lifestyle.water_intake || 'Não informado'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Frequência de exercícios: {fullPlan.lifestyle.exercise_frequency || 'Não informado'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Qualidade do sono: {fullPlan.lifestyle.sleep_quality || 'Não informado'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Horas de sono: {fullPlan.lifestyle.sleep_hours || 'Não informado'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Nível de estresse: {fullPlan.lifestyle.stress_level || 'Não informado'}
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* Exames */}
              <Accordion defaultExpanded sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LabIcon sx={{ mr: 1, color: 'warning.main' }} />
                    <Typography variant="subtitle1">Resultados de Exames</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {fullPlan.lab_results && fullPlan.lab_results.length > 0 ? (
                    <List dense>
                      {fullPlan.lab_results.map((exam, index) => (
                        <ListItem key={index}>
                          <ListItemText 
                            primary={exam.name || 'Exame sem nome'} 
                            secondary={`${formatDate(exam.date)} | ${exam.category || 'Categoria não definida'}`} 
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Nenhum exame registrado
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>

              {/* Medicina Tradicional Chinesa */}
              <Accordion defaultExpanded sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TCMIcon sx={{ mr: 1, color: 'secondary.main' }} />
                    <Typography variant="subtitle1">Medicina Tradicional Chinesa</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Constituição: {fullPlan.traditional_chinese_medicine.constitution || 'Não avaliado'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Equilíbrio Yin-Yang: {fullPlan.traditional_chinese_medicine.yin_yang_balance || 'Não avaliado'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Diagnóstico de Língua:
                      </Typography>
                      <Typography variant="body2">
                        {fullPlan.traditional_chinese_medicine.tongue_diagnosis ? 
                          `Cor: ${fullPlan.traditional_chinese_medicine.tongue_diagnosis.color || 'N/A'}, 
                           Revestimento: ${fullPlan.traditional_chinese_medicine.tongue_diagnosis.coating || 'N/A'}` : 
                          'Não avaliado'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Diagnóstico de Pulso:
                      </Typography>
                      <Typography variant="body2">
                        {fullPlan.traditional_chinese_medicine.pulse_diagnosis ? 
                          `Ritmo: ${fullPlan.traditional_chinese_medicine.pulse_diagnosis.rhythm || 'N/A'}, 
                           Força: ${fullPlan.traditional_chinese_medicine.pulse_diagnosis.strength || 'N/A'}` : 
                          'Não avaliado'}
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </motion.div>

        {/* Matriz IFM e Linha do Tempo */}
        <motion.div variants={itemVariants}>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IFMIcon sx={{ mr: 1, color: 'primary.dark' }} />
                    <Typography variant="subtitle1">Matriz IFM</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {fullPlan.ifm_matrix && fullPlan.ifm_matrix.nodes ? (
                    <Grid container spacing={1}>
                      {Object.entries(fullPlan.ifm_matrix.nodes)
                        .filter(([_, nodeData]) => nodeData.score > 0)
                        .slice(0, 6)
                        .map(([nodeId, nodeData]) => (
                          <Grid item xs={12} sm={6} key={nodeId}>
                            <Paper 
                              elevation={1} 
                              sx={{ 
                                p: 1, 
                                bgcolor: nodeData.score > 7 ? 'error.light' : 
                                        nodeData.score > 4 ? 'warning.light' : 'success.light',
                                borderRadius: 1
                              }}
                            >
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {nodeId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </Typography>
                              <Typography variant="body2">
                                Pontuação: {nodeData.score}/10
                              </Typography>
                            </Paper>
                          </Grid>
                        ))
                      }
                      {Object.values(fullPlan.ifm_matrix.nodes).filter(node => node.score > 0).length === 0 && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">
                            Nenhuma área da matriz foi avaliada
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Matriz IFM não preenchida
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            </Grid>

            <Grid item xs={12} md={6}>
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TimelineIcon sx={{ mr: 1, color: 'info.dark' }} />
                    <Typography variant="subtitle1">Linha do Tempo Funcional</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {fullPlan.functional_timeline && fullPlan.functional_timeline.length > 0 ? (
                    <List dense>
                      {fullPlan.functional_timeline
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .slice(0, 4)
                        .map((event, index) => (
                          <ListItem key={index}>
                            <ListItemText 
                              primary={event.title || 'Evento sem título'} 
                              secondary={`${formatDate(event.date)} | ${event.category || 'Sem categoria'} | Impacto: ${event.impact || 'Não avaliado'}`} 
                            />
                          </ListItem>
                        ))
                      }
                      {fullPlan.functional_timeline.length > 4 && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          + {fullPlan.functional_timeline.length - 4} outros eventos
                        </Typography>
                      )}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Nenhum evento registrado na linha do tempo
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </motion.div>

        {/* Notas adicionais */}
        <motion.div variants={itemVariants}>
          <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <NotesIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Notas Adicionais</Typography>
            </Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Adicione notas ou observações adicionais para considerar na geração do plano..."
              value={additionalNotes}
              onChange={handleNotesChange}
              variant="outlined"
            />
          </Paper>
        </motion.div>
        
        {/* Botão de geração de plano */}
        <motion.div variants={itemVariants}>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              endIcon={<SendIcon />}
              onClick={handleGeneratePlan}
              disabled={isGenerating}
              sx={{ py: 1.5, px: 4, borderRadius: 2 }}
            >
              {isGenerating ? 'Gerando Plano...' : 'Gerar Plano de Saúde Personalizado'}
            </Button>
          </Box>
        </motion.div>
        
        {/* Progresso da geração do plano */}
        {isGenerating && operationId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{ mt: 4 }}
          >
            <ProgressTracker
              operationId={operationId}
              title="Gerando plano de saúde personalizado"
              steps={planGenerationStages}
              showDetails={true}
              onComplete={() => setIsGenerating(false)}
            />
          </motion.div>
        )}
        
        {/* Notificações */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </motion.div>
    </Box>
  );
};

export default FinalReview;
