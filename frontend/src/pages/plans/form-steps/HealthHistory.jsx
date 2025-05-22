import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Divider,
  Chip,
  Button,
  IconButton,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Autocomplete,
  InputAdornment,
  Paper
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  MedicalServices as MedicalIcon,
  Medication as MedicationIcon,
  Supplements as SupplementsIcon,
  WarningAmber as AllergyIcon,
  FamilyRestroom as FamilyIcon,
  LocalHospital as SurgeryIcon
} from '@mui/icons-material';

// Lista de condiu00e7u00f5es mu00e9dicas comuns
const commonConditions = [
  'Hipertensu00e3o',
  'Diabetes tipo 1',
  'Diabetes tipo 2',
  'Asma',
  'Hipertireoidismo',
  'Hipotireoidismo',
  'Endometriose',
  'Su00edndrome do Ovu00e1rio Policstino (SOP)',
  'Depressu00e3o',
  'Ansiedade',
  'Enxaqueca',
  'Gastrite',
  'Refluxo gastroesfu00e1gico',
  'Artrite',
  'Osteoporose',
  'Fibromialgia',
  'Su00edndrome do intestino irritu00e1vel (SII)',
  'Doenu00e7a celaca',
  'Doenu00e7a de Crohn',
  'Colite ulcerativa',
  'Cu00e2ncer (especificar tipo)',
  'Insu00f4nia',
  'Apneia do sono',
  'Anemia',
  'Lputeso eerimatoso sistu00eamico (LES)',
  'Esclerose mu00faltipla',
  'Acne',
  'Psoru00edase',
  'Eczema',
  'Artrite reumatoide',
  'Doenu00e7a cardiovascular',
  'Obesidade',
  'Glaucoma',
  'Catarata',
  'Epilepsia',
  'Transtorno bipolar',
  'TDAH',
  'Autismo',
  'Doenu00e7a renal cru00f4nica',
  'Doenu00e7a heptica',
  'Anorexia',
  'Bulimia',
  'Hipercolesterolemia',
  'Gota',
  'Osteoartrite'
];

// Lista de medicamentos comuns
const commonMedications = [
  'Analgésicos',
  'Anti-inflamatórios',
  'Antibióticos',
  'Anticonvulsivantes',
  'Antidepressivos',
  'Ansiolíticos',
  'Anti-hipertensivos',
  'Antihistamínicos',
  'Estatinas',
  'Insulina',
  'Antidiabéticos orais',
  'Contraceptivos hormonais',
  'Terapia de reposição hormonal',
  'Corticosteroides',
  'Relaxantes musculares',
  'Broncodilatadores',
  'Imunomoduladores',
  'Antivirais',
  'Anticoagulantes',
  'Diuréticos'
];

// Lista de suplementos comuns
const commonSupplements = [
  'Vitamina D',
  'Vitamina C',
  'Complexo B',
  'Magnésio',
  'Cálcio',
  'Ferro',
  'Zinco',
  'Ômega 3',
  'Probióticos',
  'Colágeno',
  'Coenzima Q10',
  'Melatonina',
  'Selênio',
  'Vitamina E',
  'Ácido fólico',
  'Creatina',
  'Proteína (whey, vegana)',
  'Glutamina',
  'Fitoterápicos (especificar)',
  'Enzimas digestivas'
];

// Lista de alergias comuns
const commonAllergies = [
  'Penicilina',
  'Sulfas',
  'AINEs',
  'Látex',
  'Glúten',
  'Lactose',
  'Frutos do mar',
  'Amendoim',
  'Castanhas',
  'Ovo',
  'Soja',
  'Trigo',
  'Poeira',
  'Ácaros',
  'Pólen',
  'Picada de insetos',
  'Pelos de animais'
];

/**
 * Componente para registro do histu00f3rico de sau00fade da paciente
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.data - Dados atuais do histu00f3rico de sau00fade
 * @param {Function} props.onChange - Funu00e7u00e3o para atualizar os dados
 */
const HealthHistory = ({ data, onChange }) => {
  const initialData = {
    previous_conditions: [],
    current_conditions: [],
    surgeries: [],
    medications: [],
    supplements: [],
    allergies: [],
    family_history: []
  };

  const [formData, setFormData] = useState(data || initialData);
  const [dialogState, setDialogState] = useState({
    open: false,
    type: '',
    value: '',
    index: -1,
    isEdit: false
  });
  const [deleteDialogState, setDeleteDialogState] = useState({
    open: false,
    type: '',
    index: -1
  });

  // Atualizar formulu00e1rio quando os dados externos mudarem
  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  // Propagar mudanu00e7as para o componente pai
  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  // Abrir diu00e1logo para adicionar/editar item
  const handleOpenDialog = (type, value = '', index = -1) => {
    setDialogState({
      open: true,
      type,
      value: value || '',
      index,
      isEdit: index >= 0
    });
  };

  // Fechar diu00e1logo
  const handleCloseDialog = () => {
    setDialogState({
      ...dialogState,
      open: false
    });
  };

  // Abrir diu00e1logo de confirmau00e7u00e3o para exclusu00e3o
  const handleOpenDeleteDialog = (type, index) => {
    setDeleteDialogState({
      open: true,
      type,
      index
    });
  };

  // Fechar diu00e1logo de exclusu00e3o
  const handleCloseDeleteDialog = () => {
    setDeleteDialogState({
      ...deleteDialogState,
      open: false
    });
  };

  // Adicionar ou atualizar item
  const handleSaveItem = () => {
    const { type, value, index, isEdit } = dialogState;
    
    if (!value.trim()) {
      handleCloseDialog();
      return;
    }
    
    const updatedFormData = { ...formData };
    
    if (isEdit) {
      // Atualizar item existente
      updatedFormData[type][index] = value;
    } else {
      // Adicionar novo item
      updatedFormData[type] = [...updatedFormData[type], value];
    }
    
    setFormData(updatedFormData);
    handleCloseDialog();
  };

  // Excluir item
  const handleDeleteItem = () => {
    const { type, index } = deleteDialogState;
    
    const updatedFormData = { ...formData };
    updatedFormData[type] = updatedFormData[type].filter((_, i) => i !== index);
    
    setFormData(updatedFormData);
    handleCloseDeleteDialog();
  };

  // Obter ru00f3tulo para cada tipo de dado
  const getTypeLabel = (type) => {
    switch (type) {
      case 'previous_conditions':
        return 'Condiu00e7u00f5es Pru00e9vias';
      case 'current_conditions':
        return 'Condiu00e7u00f5es Atuais';
      case 'surgeries':
        return 'Cirurgias';
      case 'medications':
        return 'Medicau00e7u00f5es';
      case 'supplements':
        return 'Suplementos';
      case 'allergies':
        return 'Alergias';
      case 'family_history':
        return 'Histu00f3rico Familiar';
      default:
        return '';
    }
  };

  // Obter placeholder para o campo de entrada
  const getPlaceholder = (type) => {
    switch (type) {
      case 'previous_conditions':
        return 'Ex: Pneumonia (2018)';
      case 'current_conditions':
        return 'Ex: Hipertensu00e3o (desde 2015)';
      case 'surgeries':
        return 'Ex: Apendicectomia (2010)';
      case 'medications':
        return 'Ex: Losartana 50mg (1x/dia)';
      case 'supplements':
        return 'Ex: Vitamina D 2000UI (1x/dia)';
      case 'allergies':
        return 'Ex: Penicilina (urticária)';
      case 'family_history':
        return 'Ex: Mu00e3e - Diabetes tipo 2';
      default:
        return '';
    }
  };

  // Obter u00edcone para cada tipo de dado
  const getTypeIcon = (type) => {
    switch (type) {
      case 'previous_conditions':
        return <MedicalIcon />;
      case 'current_conditions':
        return <MedicalIcon />;
      case 'surgeries':
        return <SurgeryIcon />;
      case 'medications':
        return <MedicationIcon />;
      case 'supplements':
        return <SupplementsIcon />;
      case 'allergies':
        return <AllergyIcon />;
      case 'family_history':
        return <FamilyIcon />;
      default:
        return null;
    }
  };

  // Obter lista de sugeestu00f5es para autocompletar
  const getSuggestions = (type) => {
    switch (type) {
      case 'previous_conditions':
      case 'current_conditions':
        return commonConditions;
      case 'medications':
        return commonMedications;
      case 'supplements':
        return commonSupplements;
      case 'allergies':
        return commonAllergies;
      default:
        return [];
    }
  };

  // Renderizar seo com lista de itens
  const renderSection = (type, items) => (
    <Grid item xs={12} md={6}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Object.keys(formData).indexOf(type) * 0.1, duration: 0.3 }}
      >
        <Card variant="outlined" sx={{ height: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getTypeIcon(type)}
                {getTypeLabel(type)}
              </Typography>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog(type)}
              >
                Adicionar
              </Button>
            </Box>
            
            {items.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                Nenhum registro. Clique em "Adicionar" para incluir informau00e7u00f5es.
              </Typography>
            ) : (
              <List dense>
                {items.map((item, index) => (
                  <ListItem key={index} divider={index < items.length - 1}>
                    <ListItemText primary={item} />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleOpenDialog(type, item, index)} size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton edge="end" onClick={() => handleOpenDeleteDialog(type, index)} size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Grid>
  );

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h5" gutterBottom color="primary">
          Histu00f3rico de Sau00fade
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          Registre informau00e7u00f5es sobre o histu00f3rico mu00e9dico da paciente, incluindo condiu00e7u00f5es pru00e9vias e atuais, cirurgias, medicau00e7u00f5es, suplementos, alergias e histu00f3rico familiar.
        </Typography>
      </motion.div>

      <Grid container spacing={3}>
        {/* Condiu00e7u00f5es Pru00e9vias */}
        {renderSection('previous_conditions', formData.previous_conditions)}
        
        {/* Condiu00e7u00f5es Atuais */}
        {renderSection('current_conditions', formData.current_conditions)}
        
        {/* Cirurgias */}
        {renderSection('surgeries', formData.surgeries)}
        
        {/* Medicau00e7u00f5es */}
        {renderSection('medications', formData.medications)}
        
        {/* Suplementos */}
        {renderSection('supplements', formData.supplements)}
        
        {/* Alergias */}
        {renderSection('allergies', formData.allergies)}
        
        {/* Histu00f3rico Familiar */}
        {renderSection('family_history', formData.family_history)}
      </Grid>

      {/* Diu00e1logo para adicionar/editar item */}
      <Dialog open={dialogState.open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {dialogState.isEdit ? `Editar ${getTypeLabel(dialogState.type)}` : `Adicionar ${getTypeLabel(dialogState.type)}`}
        </DialogTitle>
        <DialogContent>
          <Autocomplete
            freeSolo
            options={getSuggestions(dialogState.type)}
            value={dialogState.value}
            onChange={(event, newValue) => {
              setDialogState({
                ...dialogState,
                value: newValue || ''
              });
            }}
            inputValue={dialogState.value}
            onInputChange={(event, newInputValue) => {
              setDialogState({
                ...dialogState,
                value: newInputValue
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                autoFocus
                margin="dense"
                label={getTypeLabel(dialogState.type)}
                fullWidth
                placeholder={getPlaceholder(dialogState.type)}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      {getTypeIcon(dialogState.type)}
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Inclua detalhes relevantes como datas, dosagens ou sintomas especu00edficos, quando aplicu00e1vel.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSaveItem} variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diu00e1logo de confirmau00e7u00e3o para exclusu00e3o */}
      <Dialog open={deleteDialogState.open} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Exclusu00e3o</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este item? Esta au00e7u00e3o nu00e3o pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleDeleteItem} color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HealthHistory;
