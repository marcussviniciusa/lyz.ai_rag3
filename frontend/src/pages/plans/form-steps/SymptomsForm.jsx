import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  InputAdornment
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  ErrorOutline as ErrorIcon,
  AccessTime as TimeIcon,
  PriorityHigh as PriorityIcon,
  Search as SearchIcon
} from '@mui/icons-material';

// Opu00e7u00f5es para durau00e7u00e3o de sintomas
const durationOptions = [
  { value: 'recent', label: 'Recente (< 1 mu00eas)' },
  { value: 'short', label: 'Curta (1-3 meses)' },
  { value: 'medium', label: 'Mu00e9dia (3-12 meses)' },
  { value: 'long', label: 'Longa (1-5 anos)' },
  { value: 'chronic', label: 'Cru00f4nica (> 5 anos)' },
  { value: 'variable', label: 'Variu00e1vel/Intermitente' }
];

// Opu00e7u00f5es para frequu00eancia de sintomas
const frequencyOptions = [
  { value: 'constant', label: 'Constante (todos os dias)' },
  { value: 'frequent', label: 'Frequente (4-6 dias por semana)' },
  { value: 'occasional', label: 'Ocasional (1-3 dias por semana)' },
  { value: 'rare', label: 'Raro (algumas vezes por mu00eas)' },
  { value: 'cyclical', label: 'Cu00edclico (relacionado ao ciclo menstrual)' },
  { value: 'situational', label: 'Situacional (gatilhos especu00edficos)' }
];

// Opu00e7u00f5es para intensidade de sintomas
const intensityOptions = [
  { value: 1, label: 'Leve - Perceptu00edvel, mas nu00e3o interfere nas atividades' },
  { value: 2, label: 'Moderada - Causa algum desconforto ou limitau00e7u00e3o' },
  { value: 3, label: 'Significativa - Interfere na rotina diu00e1ria' },
  { value: 4, label: 'Intensa - Limita fortemente as atividades diu00e1rias' },
  { value: 5, label: 'Severa - Incapacitante' }
];

/**
 * Componente para registro de sintomas da paciente
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.data - Lista atual de sintomas
 * @param {Function} props.onChange - Funu00e7u00e3o para atualizar os dados
 */
const SymptomsForm = ({ data = [], onChange }) => {
  const [symptoms, setSymptoms] = useState(data || []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentSymptom, setCurrentSymptom] = useState(null);
  const [editIndex, setEditIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Modelo para novo sintoma
  const emptySymptom = {
    description: '',
    duration: '',
    frequency: '',
    intensity: '',
    triggers: [],
    notes: '',
    priority: symptoms.length + 1 // A prioridade padrão é o próximo número na sequência
  };

  // Atualizar sintomas quando os dados externos mudarem
  useEffect(() => {
    if (data && Array.isArray(data)) {
      setSymptoms(data);
    }
  }, [data]);

  // Propagar mudanu00e7as para o componente pai
  useEffect(() => {
    onChange(symptoms);
  }, [symptoms, onChange]);

  // Abrir diu00e1logo para adicionar ou editar sintoma
  const handleOpenDialog = (symptom = null, index = -1) => {
    if (symptom) {
      setCurrentSymptom({ ...symptom });
      setEditIndex(index);
    } else {
      setCurrentSymptom({ ...emptySymptom });
      setEditIndex(-1);
    }
    setValidationErrors({});
    setDialogOpen(true);
  };

  // Fechar diu00e1logo
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentSymptom(null);
    setEditIndex(-1);
  };

  // Abrir diu00e1logo de confirmau00e7u00e3o para excluir sintoma
  const handleOpenDeleteDialog = (index) => {
    setEditIndex(index);
    setDeleteDialogOpen(true);
  };

  // Fechar diu00e1logo de exclusu00e3o
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setEditIndex(-1);
  };

  // Atualizar campo do sintoma atual
  const handleSymptomChange = (field, value) => {
    setCurrentSymptom(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpar erro de validau00e7u00e3o quando o campo for preenchido
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // Adicionar ou atualizar gatilho
  const handleTriggerChange = (event) => {
    if (event.key === 'Enter' && event.target.value.trim()) {
      const newTrigger = event.target.value.trim();
      
      // Verificar se o gatilho ju00e1 existe
      if (!currentSymptom.triggers.includes(newTrigger)) {
        setCurrentSymptom(prev => ({
          ...prev,
          triggers: [...prev.triggers, newTrigger]
        }));
      }
      
      // Limpar o campo
      event.target.value = '';
    }
  };

  // Remover gatilho
  const handleDeleteTrigger = (triggerToDelete) => {
    setCurrentSymptom(prev => ({
      ...prev,
      triggers: prev.triggers.filter(trigger => trigger !== triggerToDelete)
    }));
  };

  // Validar formulário de sintoma
  const validateSymptomForm = () => {
    const errors = {};
    
    if (!currentSymptom.description.trim()) {
      errors.description = 'A descrição do sintoma é obrigatória';
    }
    
    if (!currentSymptom.intensity) {
      errors.intensity = 'A intensidade é obrigatória';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Salvar sintoma (adicionar novo ou atualizar existente)
  const handleSaveSymptom = () => {
    if (!validateSymptomForm()) {
      return;
    }
    
    let updatedSymptoms = [...symptoms];
    
    if (editIndex >= 0) {
      // Atualizar existente
      updatedSymptoms[editIndex] = currentSymptom;
    } else {
      // Adicionar novo
      updatedSymptoms.push(currentSymptom);
    }
    
    // Reordenar por prioridade
    updatedSymptoms.sort((a, b) => a.priority - b.priority);
    
    setSymptoms(updatedSymptoms);
    handleCloseDialog();
  };

  // Excluir sintoma
  const handleDeleteSymptom = () => {
    if (editIndex >= 0) {
      // Remover o sintoma
      const newSymptoms = symptoms.filter((_, index) => index !== editIndex);
      
      // Reajustar prioridades
      const updatedSymptoms = newSymptoms.map((symptom, index) => ({
        ...symptom,
        priority: index + 1
      }));
      
      setSymptoms(updatedSymptoms);
    }
    handleCloseDeleteDialog();
  };

  // Aumentar prioridade (mover para cima na lista)
  const handleIncreasePriority = (index) => {
    if (index > 0) {
      const updatedSymptoms = [...symptoms];
      
      // Trocar as prioridades dos sintomas
      const temp = updatedSymptoms[index].priority;
      updatedSymptoms[index].priority = updatedSymptoms[index - 1].priority;
      updatedSymptoms[index - 1].priority = temp;
      
      // Reordenar por prioridade
      updatedSymptoms.sort((a, b) => a.priority - b.priority);
      
      setSymptoms(updatedSymptoms);
    }
  };

  // Diminuir prioridade (mover para baixo na lista)
  const handleDecreasePriority = (index) => {
    if (index < symptoms.length - 1) {
      const updatedSymptoms = [...symptoms];
      
      // Trocar as prioridades dos sintomas
      const temp = updatedSymptoms[index].priority;
      updatedSymptoms[index].priority = updatedSymptoms[index + 1].priority;
      updatedSymptoms[index + 1].priority = temp;
      
      // Reordenar por prioridade
      updatedSymptoms.sort((a, b) => a.priority - b.priority);
      
      setSymptoms(updatedSymptoms);
    }
  };

  // Filtrar sintomas baseado na busca
  const filteredSymptoms = symptoms.filter(symptom => 
    symptom.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Obter label para opu00e7u00f5es baseado no valor
  const getOptionLabel = (options, value) => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : '';
  };

  // Obter cor baseada na intensidade
  const getIntensityColor = (intensity) => {
    switch (intensity) {
      case 1: return '#4caf50'; // Verde
      case 2: return '#8bc34a'; // Verde claro
      case 3: return '#ffc107'; // Amarelo
      case 4: return '#ff9800'; // Laranja
      case 5: return '#f44336'; // Vermelho
      default: return '#9e9e9e'; // Cinza
    }
  };

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h5" gutterBottom color="primary">
          Sintomas
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          Registre os sintomas principais da paciente, ordenados por prioridade. Estes sintomas serão considerados na elaboração do plano personalizado.
        </Typography>
      </motion.div>

      {/* Barra de ferramentas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextField
            placeholder="Buscar sintomas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ width: '50%' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Adicionar Sintoma
          </Button>
        </Paper>
      </motion.div>

      {/* Lista de sintomas */}
      {symptoms.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper' }}>
            <ErrorIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Nenhum sintoma registrado
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Adicione os sintomas principais relatados pela paciente para uma análise mais precisa.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{ mt: 2 }}
            >
              Adicionar Primeiro Sintoma
            </Button>
          </Paper>
        </motion.div>
      ) : (
        <AnimatePresence>
          <Grid container spacing={2}>
            {filteredSymptoms.map((symptom, index) => (
              <Grid item xs={12} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card sx={{ position: 'relative', borderLeft: `4px solid ${getIntensityColor(symptom.intensity)}` }}>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={9}>
                          <Typography variant="h6" component="div">
                            {symptom.description}
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                            <Chip 
                              icon={<PriorityIcon />} 
                              label={`Prioridade ${symptom.priority}`} 
                              size="small" 
                              color="primary" 
                            />
                            {symptom.intensity && (
                              <Chip 
                                label={`Intensidade: ${getOptionLabel(intensityOptions, symptom.intensity)}`} 
                                size="small" 
                                sx={{ bgcolor: getIntensityColor(symptom.intensity), color: 'white' }}
                              />
                            )}
                            {symptom.duration && (
                              <Chip 
                                icon={<TimeIcon />} 
                                label={getOptionLabel(durationOptions, symptom.duration)} 
                                size="small" 
                                variant="outlined" 
                              />
                            )}
                            {symptom.frequency && (
                              <Chip 
                                label={getOptionLabel(frequencyOptions, symptom.frequency)} 
                                size="small" 
                                variant="outlined" 
                              />
                            )}
                          </Box>
                          {symptom.triggers && symptom.triggers.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                <strong>Gatilhos:</strong> {symptom.triggers.join(', ')}
                              </Typography>
                            </Box>
                          )}
                          {symptom.notes && (
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                <strong>Observações:</strong> {symptom.notes}
                              </Typography>
                            </Box>
                          )}
                        </Grid>
                        <Grid item xs={12} sm={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                          <Box>
                            <IconButton 
                              size="small" 
                              onClick={() => handleOpenDialog(symptom, index)}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => handleOpenDeleteDialog(index)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <IconButton 
                              size="small" 
                              onClick={() => handleIncreasePriority(index)}
                              disabled={index === 0}
                            >
                              <ArrowUpIcon />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => handleDecreasePriority(index)}
                              disabled={index === symptoms.length - 1}
                            >
                              <ArrowDownIcon />
                            </IconButton>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </AnimatePresence>
      )}

      {/* Diu00e1logo para adicionar/editar sintoma */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {editIndex >= 0 ? 'Editar Sintoma' : 'Adicionar Novo Sintoma'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            {/* Descriu00e7u00e3o do sintoma */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Descrição do Sintoma"
                value={currentSymptom?.description || ''}
                onChange={(e) => handleSymptomChange('description', e.target.value)}
                error={!!validationErrors.description}
                helperText={validationErrors.description}
                placeholder="Ex: Dor de cabeça, Fadiga, Insônia..."
              />
            </Grid>

            {/* Intensidade e duração */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!validationErrors.intensity}>
                <InputLabel id="intensity-label">Intensidade</InputLabel>
                <Select
                  labelId="intensity-label"
                  value={currentSymptom?.intensity || ''}
                  onChange={(e) => handleSymptomChange('intensity', e.target.value)}
                  label="Intensidade"
                >
                  <MenuItem value=""><em>Selecione</em></MenuItem>
                  {intensityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {validationErrors.intensity && (
                  <Typography variant="caption" color="error">
                    {validationErrors.intensity}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="duration-label">Duração</InputLabel>
                <Select
                  labelId="duration-label"
                  value={currentSymptom?.duration || ''}
                  onChange={(e) => handleSymptomChange('duration', e.target.value)}
                  label="Duração"
                >
                  <MenuItem value=""><em>Selecione</em></MenuItem>
                  {durationOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Frequu00eancia e prioridade */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="frequency-label">Frequência</InputLabel>
                <Select
                  labelId="frequency-label"
                  value={currentSymptom?.frequency || ''}
                  onChange={(e) => handleSymptomChange('frequency', e.target.value)}
                  label="Frequência"
                >
                  <MenuItem value=""><em>Selecione</em></MenuItem>
                  {frequencyOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Prioridade"
                value={currentSymptom?.priority || ''}
                onChange={(e) => handleSymptomChange('priority', parseInt(e.target.value) || '')}
                InputProps={{ inputProps: { min: 1 } }}
                helperText="1 = Mais importante, números maiores = Menos importantes"
              />
            </Grid>

            {/* Gatilhos */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle1" gutterBottom>
                Gatilhos
              </Typography>
              <TextField
                fullWidth
                label="Adicionar gatilho"
                placeholder="Digite e pressione Enter"
                onKeyPress={handleTriggerChange}
                helperText="Fatores que desencadeiam ou pioram o sintoma"
              />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 1, gap: 1 }}>
                {currentSymptom?.triggers && currentSymptom.triggers.map((trigger, i) => (
                  <Chip
                    key={i}
                    label={trigger}
                    onDelete={() => handleDeleteTrigger(trigger)}
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>

            {/* Observau00e7u00f5es */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Observações"
                value={currentSymptom?.notes || ''}
                onChange={(e) => handleSymptomChange('notes', e.target.value)}
                placeholder="Informações adicionais relevantes sobre este sintoma"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSaveSymptom} variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diu00e1logo de confirmau00e7u00e3o para exclusu00e3o */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este sintoma? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleDeleteSymptom} color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SymptomsForm;
