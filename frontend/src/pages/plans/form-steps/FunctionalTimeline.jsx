import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
  Card,
  CardContent,
  Divider,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Timeline as TimelineIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  HealthAndSafety as HealthIcon,
  LocalHospital as MedicalIcon,
  School as EducationIcon,
  EmojiEvents as AchievementIcon,
  Favorite as RelationshipIcon,
  Work as WorkIcon,
  ChildCare as ChildbirthIcon,
  FitnessCenter as ExerciseIcon,
  Spa as WellnessIcon,
  RestaurantMenu as NutritionIcon,
  NightsStay as SleepIcon,
  WbSunny as StressIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

// Categorias de eventos
const eventCategories = [
  { value: 'health_condition', label: 'Condiu00e7u00e3o de Sau00fade', icon: <HealthIcon /> },
  { value: 'diagnosis', label: 'Diagnu00f3stico', icon: <MedicalIcon /> },
  { value: 'treatment', label: 'Tratamento/Intervenção', icon: <MedicalIcon /> },
  { value: 'medication', label: 'Medicação', icon: <MedicalIcon /> },
  { value: 'surgery', label: 'Cirurgia', icon: <MedicalIcon /> },
  { value: 'childbirth', label: 'Gravidez/Parto', icon: <ChildbirthIcon /> },
  { value: 'menstrual', label: 'Alteração Menstrual', icon: <HealthIcon /> },
  { value: 'trauma', label: 'Trauma Físico', icon: <ErrorIcon /> },
  { value: 'emotional', label: 'Evento Emocional', icon: <StressIcon /> },
  { value: 'lifestyle', label: 'Mudança de Estilo de Vida', icon: <WellnessIcon /> },
  { value: 'nutrition', label: 'Mudança Alimentar', icon: <NutritionIcon /> },
  { value: 'exercise', label: 'Atividade Física', icon: <ExerciseIcon /> },
  { value: 'sleep', label: 'Padrão de Sono', icon: <SleepIcon /> },
  { value: 'stress', label: 'Estresse', icon: <StressIcon /> },
  { value: 'relationship', label: 'Relacionamento', icon: <RelationshipIcon /> },
  { value: 'education', label: 'Educação', icon: <EducationIcon /> },
  { value: 'career', label: 'Carreira', icon: <WorkIcon /> },
  { value: 'achievement', label: 'Conquista', icon: <AchievementIcon /> },
  { value: 'environment', label: 'Mudança Ambiental', icon: <InfoIcon /> },
  { value: 'other', label: 'Outro', icon: <InfoIcon /> }
];

// Níveis de impacto
const impactLevels = [
  { value: 'critical', label: 'Crítico', color: '#d32f2f' },
  { value: 'major', label: 'Significativo', color: '#f57c00' },
  { value: 'moderate', label: 'Moderado', color: '#fbc02d' },
  { value: 'minor', label: 'Leve', color: '#7cb342' },
  { value: 'positive', label: 'Positivo', color: '#00acc1' }
];

/**
 * Componente para criação de linha do tempo funcional da paciente
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.data - Dados atuais da linha do tempo
 * @param {Function} props.onChange - Função para atualizar os dados
 */
const FunctionalTimeline = ({ data, onChange }) => {
  const theme = useTheme();
  const initialData = {
    events: []
  };

  const [formData, setFormData] = useState(data || initialData);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [errors, setErrors] = useState({});

  // Atualizar formulário quando os dados externos mudarem
  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  // Propagar mudanças para o componente pai
  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  // Abrir diálogo para adicionar novo evento
  const handleAddEvent = () => {
    setCurrentEvent({
      id: Date.now().toString(),
      date: format(new Date(), 'yyyy-MM-dd'),
      age: '',
      category: '',
      title: '',
      description: '',
      impact: 'moderate',
      duration: '',
      ongoing: false
    });
    setErrors({});
    setIsDialogOpen(true);
  };

  // Abrir diálogo para editar evento existente
  const handleEditEvent = (event) => {
    setCurrentEvent({ ...event });
    setErrors({});
    setIsDialogOpen(true);
  };

  // Fechar diálogo de edição
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentEvent(null);
    setErrors({});
  };

  // Validar campos do evento
  const validateEvent = (event) => {
    const newErrors = {};
    
    if (!event.date) newErrors.date = 'A data é obrigatória';
    if (!event.category) newErrors.category = 'A categoria é obrigatória';
    if (!event.title) newErrors.title = 'O título é obrigatório';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Salvar evento (novo ou editado)
  const handleSaveEvent = () => {
    if (!validateEvent(currentEvent)) return;
    
    // Atualizar estado do formulário
    setFormData(prevData => {
      const updatedEvents = [...prevData.events];
      const existingIndex = updatedEvents.findIndex(event => event.id === currentEvent.id);
      
      if (existingIndex >= 0) {
        // Atualizar evento existente
        updatedEvents[existingIndex] = currentEvent;
      } else {
        // Adicionar novo evento
        updatedEvents.push(currentEvent);
      }
      
      // Ordenar eventos por data (do mais antigo ao mais recente)
      updatedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      return {
        ...prevData,
        events: updatedEvents
      };
    });
    
    handleCloseDialog();
  };

  // Confirmar exclusão de evento
  const handleConfirmDelete = (event) => {
    setEventToDelete(event);
    setDeleteConfirmOpen(true);
  };

  // Excluir evento
  const handleDeleteEvent = () => {
    // Atualizar estado removendo o evento
    setFormData(prevData => ({
      ...prevData,
      events: prevData.events.filter(event => event.id !== eventToDelete.id)
    }));
    
    setDeleteConfirmOpen(false);
    setEventToDelete(null);
  };

  // Função auxiliar para formatar a data
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      return dateString;
    }
  };

  // Obter ícone e cor para categoria
  const getCategoryInfo = (categoryValue) => {
    const category = eventCategories.find(cat => cat.value === categoryValue);
    return category || { label: 'Outro', icon: <InfoIcon /> };
  };

  // Obter cor para nível de impacto
  const getImpactColor = (impactValue) => {
    const impact = impactLevels.find(imp => imp.value === impactValue);
    return impact ? impact.color : theme.palette.text.secondary;
  };

  // Ordenar eventos por data
  const sortedEvents = [...formData.events].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h5" gutterBottom color="primary">
          Linha do Tempo Funcional
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          Registre eventos significativos na vida da paciente que possam ter impacto em sua saúde física, emocional e hormonal. A linha do tempo ajuda a identificar padrões, gatilhos e correlações.
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddEvent}
          >
            Adicionar Evento
          </Button>
        </Box>
        
        {formData.events.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
            <TimelineIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              Nenhum evento registrado
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Clique em "Adicionar Evento" para incluir marcos importantes na linha do tempo da paciente
            </Typography>
          </Paper>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Box 
              sx={{
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: { xs: '20px', md: '50%' },
                  transform: { xs: 'none', md: 'translateX(-50%)' },
                  top: 0,
                  bottom: 0,
                  width: '2px',
                  bgcolor: 'divider',
                  zIndex: 1
                }
              }}
            >
              {sortedEvents.map((event, index) => {
                const categoryInfo = getCategoryInfo(event.category);
                const impactColor = getImpactColor(event.impact);
                const isEven = index % 2 === 0;
                
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: isEven ? 'row' : 'row-reverse' },
                        mb: 4,
                        position: 'relative'
                      }}
                    >
                      {/* Marcador de linha do tempo */}
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: 'background.paper',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `2px solid ${impactColor}`,
                          color: impactColor,
                          position: 'absolute',
                          left: { xs: '0px', md: '50%' },
                          transform: { xs: 'none', md: 'translateX(-50%)' },
                          top: { xs: '0', md: '20px' },
                          zIndex: 2
                        }}
                      >
                        {React.cloneElement(categoryInfo.icon, { fontSize: 'small' })}
                      </Box>
                      
                      {/* Conteúdo do evento */}
                      <Card 
                        variant="outlined" 
                        sx={{
                          width: { xs: 'calc(100% - 50px)', md: '45%' },
                          ml: { xs: '50px', md: isEven ? 0 : 'auto' },
                          mr: { xs: 0, md: isEven ? 'auto' : 0 },
                          borderLeft: `4px solid ${impactColor}`
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Typography variant="h6" gutterBottom>
                              {event.title}
                            </Typography>
                            <Box>
                              <IconButton 
                                size="small" 
                                color="primary" 
                                onClick={() => handleEditEvent(event)}
                                title="Editar evento"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                color="error" 
                                onClick={() => handleConfirmDelete(event)}
                                title="Excluir evento"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                            <Chip 
                              size="small" 
                              label={formatDate(event.date)} 
                              variant="outlined" 
                            />
                            {event.age && (
                              <Chip 
                                size="small" 
                                label={`${event.age} anos`} 
                                variant="outlined" 
                              />
                            )}
                            <Chip 
                              size="small" 
                              icon={React.cloneElement(categoryInfo.icon, { fontSize: 'small' })}
                              label={categoryInfo.label} 
                              variant="outlined" 
                            />
                            <Chip 
                              size="small" 
                              sx={{ bgcolor: impactColor, color: '#fff' }}
                              label={impactLevels.find(imp => imp.value === event.impact)?.label || 'Moderado'} 
                            />
                          </Box>
                          
                          {event.description && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              {event.description}
                            </Typography>
                          )}
                          
                          {event.duration && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.875rem' }}>
                              Duração: {event.duration}
                              {event.ongoing && ' (Em andamento)'}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Box>
                  </motion.div>
                );
              })}
            </Box>
          </motion.div>
        )}
      </motion.div>
      
      {/* Diálogo para adicionar/editar evento */}
      <Dialog 
        open={isDialogOpen} 
        onClose={handleCloseDialog} 
        fullWidth 
        maxWidth="md"
      >
        <DialogTitle>
          {currentEvent?.id ? (formData.events.find(e => e.id === currentEvent.id) ? 'Editar Evento' : 'Adicionar Evento') : 'Novo Evento'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data do Evento"
                type="date"
                value={currentEvent?.date || ''}
                onChange={(e) => setCurrentEvent({ ...currentEvent, date: e.target.value })}
                required
                error={!!errors.date}
                helperText={errors.date}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Idade da Paciente (quando ocorreu)"
                type="number"
                value={currentEvent?.age || ''}
                onChange={(e) => setCurrentEvent({ ...currentEvent, age: e.target.value })}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.category}>
                <InputLabel id="event-category-label">Categoria</InputLabel>
                <Select
                  labelId="event-category-label"
                  value={currentEvent?.category || ''}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, category: e.target.value })}
                  label="Categoria"
                >
                  <MenuItem value=""><em>Selecione</em></MenuItem>
                  {eventCategories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ mr: 1 }}>{category.icon}</Box>
                        {category.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="event-impact-label">Nível de Impacto</InputLabel>
                <Select
                  labelId="event-impact-label"
                  value={currentEvent?.impact || 'moderate'}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, impact: e.target.value })}
                  label="Nível de Impacto"
                >
                  {impactLevels.map((impact) => (
                    <MenuItem key={impact.value} value={impact.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box 
                          sx={{ 
                            width: 16, 
                            height: 16, 
                            borderRadius: '50%', 
                            bgcolor: impact.color,
                            mr: 1 
                          }} 
                        />
                        {impact.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título do Evento"
                value={currentEvent?.title || ''}
                onChange={(e) => setCurrentEvent({ ...currentEvent, title: e.target.value })}
                required
                error={!!errors.title}
                helperText={errors.title}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                multiline
                rows={3}
                value={currentEvent?.description || ''}
                onChange={(e) => setCurrentEvent({ ...currentEvent, description: e.target.value })}
                placeholder="Descreva detalhes relevantes sobre este evento..."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duração"
                value={currentEvent?.duration || ''}
                onChange={(e) => setCurrentEvent({ ...currentEvent, duration: e.target.value })}
                placeholder="Ex: 2 semanas, 6 meses, etc."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="event-ongoing-label">Status</InputLabel>
                <Select
                  labelId="event-ongoing-label"
                  value={currentEvent?.ongoing ? 'true' : 'false'}
                  onChange={(e) => setCurrentEvent({ 
                    ...currentEvent, 
                    ongoing: e.target.value === 'true' 
                  })}
                  label="Status"
                >
                  <MenuItem value="false">Concluído/Passado</MenuItem>
                  <MenuItem value="true">Em andamento</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          {currentEvent?.category === 'health_condition' && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Para condições de saúde, inclua informações sobre diagnóstico, sintomas principais e tratamentos realizados.
            </Alert>
          )}
          
          {currentEvent?.category === 'emotional' && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Para eventos emocionais, descreva o impacto psicológico e quaisquer manifestações físicas relacionadas.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button 
            onClick={handleSaveEvent} 
            variant="contained" 
            color="primary"
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmação para exclusão */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir este evento da linha do tempo? Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteEvent} color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FunctionalTimeline;
