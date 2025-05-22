import React from 'react';
import {
  Box, Typography, TextField, Button, Grid, Chip, Paper,
  Divider, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const HealthHistoryForm = ({ data, onChange }) => {
  // Manter estado local para cada seção de histórico
  const [newCondition, setNewCondition] = React.useState('');
  const [newMedication, setNewMedication] = React.useState({ name: '', dosage: '', frequency: '' });
  const [newSurgery, setNewSurgery] = React.useState({ procedure: '', year: '', notes: '' });
  const [newAllergy, setNewAllergy] = React.useState({ allergen: '', reaction: '', severity: '' });

  // Manipuladores para condições médicas
  const handleAddCondition = () => {
    if (!newCondition.trim()) return;
    const updatedData = {
      ...data,
      conditions: [...(data.conditions || []), newCondition]
    };
    onChange(updatedData);
    setNewCondition('');
  };

  const handleRemoveCondition = (index) => {
    const updatedConditions = [...data.conditions];
    updatedConditions.splice(index, 1);
    onChange({ ...data, conditions: updatedConditions });
  };

  // Manipuladores para medicações
  const handleMedicationChange = (e) => {
    const { name, value } = e.target;
    setNewMedication(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMedication = () => {
    if (!newMedication.name.trim()) return;
    const updatedData = {
      ...data,
      medications: [...(data.medications || []), { ...newMedication, id: Date.now() }]
    };
    onChange(updatedData);
    setNewMedication({ name: '', dosage: '', frequency: '' });
  };

  const handleRemoveMedication = (id) => {
    const updatedMedications = data.medications.filter(med => med.id !== id);
    onChange({ ...data, medications: updatedMedications });
  };

  // Manipuladores para cirurgias
  const handleSurgeryChange = (e) => {
    const { name, value } = e.target;
    setNewSurgery(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSurgery = () => {
    if (!newSurgery.procedure.trim()) return;
    const updatedData = {
      ...data,
      surgeries: [...(data.surgeries || []), { ...newSurgery, id: Date.now() }]
    };
    onChange(updatedData);
    setNewSurgery({ procedure: '', year: '', notes: '' });
  };

  const handleRemoveSurgery = (id) => {
    const updatedSurgeries = data.surgeries.filter(surgery => surgery.id !== id);
    onChange({ ...data, surgeries: updatedSurgeries });
  };

  // Manipuladores para alergias
  const handleAllergyChange = (e) => {
    const { name, value } = e.target;
    setNewAllergy(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAllergy = () => {
    if (!newAllergy.allergen.trim()) return;
    const updatedData = {
      ...data,
      allergies: [...(data.allergies || []), { ...newAllergy, id: Date.now() }]
    };
    onChange(updatedData);
    setNewAllergy({ allergen: '', reaction: '', severity: '' });
  };

  const handleRemoveAllergy = (id) => {
    const updatedAllergies = data.allergies.filter(allergy => allergy.id !== id);
    onChange({ ...data, allergies: updatedAllergies });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Histórico de Saúde
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Informe o histórico médico da paciente, incluindo condições existentes, medicações, cirurgias e alergias.
      </Typography>

      {/* Seção de Condições Médicas */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Condições Médicas Existentes
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={9}>
            <TextField
              fullWidth
              label="Condição Médica"
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
              placeholder="Ex: Hipotireoidismo, Hipertensão, Diabetes"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddCondition}
              disabled={!newCondition.trim()}
              sx={{ height: '100%' }}
            >
              Adicionar
            </Button>
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {data.conditions?.length > 0 ? (
            data.conditions.map((condition, index) => (
              <Chip
                key={index}
                label={condition}
                onDelete={() => handleRemoveCondition(index)}
                color="primary"
                variant="outlined"
              />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              Nenhuma condição médica adicionada.
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Seção de Medicações */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Medicações Atuais
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Nome da Medicação"
              name="name"
              value={newMedication.name}
              onChange={handleMedicationChange}
              placeholder="Ex: Levotiroxina"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Dosagem"
              name="dosage"
              value={newMedication.dosage}
              onChange={handleMedicationChange}
              placeholder="Ex: 50mcg"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Frequência"
              name="frequency"
              value={newMedication.frequency}
              onChange={handleMedicationChange}
              placeholder="Ex: 1x ao dia"
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddMedication}
              disabled={!newMedication.name.trim()}
              sx={{ height: '100%' }}
            >
              Adicionar
            </Button>
          </Grid>
        </Grid>
        
        <List>
          {data.medications?.length > 0 ? (
            data.medications.map((medication) => (
              <React.Fragment key={medication.id}>
                <ListItem>
                  <ListItemText
                    primary={medication.name}
                    secondary={
                      <>
                        {medication.dosage && `Dosagem: ${medication.dosage}`}
                        {medication.dosage && medication.frequency && ' | '}
                        {medication.frequency && `Frequência: ${medication.frequency}`}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => handleRemoveMedication(medication.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              Nenhuma medicação adicionada.
            </Typography>
          )}
        </List>
      </Paper>

      {/* Seção de Cirurgias */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Cirurgias Anteriores
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              label="Procedimento"
              name="procedure"
              value={newSurgery.procedure}
              onChange={handleSurgeryChange}
              placeholder="Ex: Apendicectomia"
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Ano"
              name="year"
              value={newSurgery.year}
              onChange={handleSurgeryChange}
              placeholder="Ex: 2018"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Observações"
              name="notes"
              value={newSurgery.notes}
              onChange={handleSurgeryChange}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddSurgery}
              disabled={!newSurgery.procedure.trim()}
              sx={{ height: '100%' }}
            >
              Adicionar
            </Button>
          </Grid>
        </Grid>
        
        <List>
          {data.surgeries?.length > 0 ? (
            data.surgeries.map((surgery) => (
              <React.Fragment key={surgery.id}>
                <ListItem>
                  <ListItemText
                    primary={surgery.procedure}
                    secondary={
                      <>
                        {surgery.year && `Ano: ${surgery.year}`}
                        {surgery.year && surgery.notes && ' | '}
                        {surgery.notes && `Observações: ${surgery.notes}`}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => handleRemoveSurgery(surgery.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              Nenhuma cirurgia adicionada.
            </Typography>
          )}
        </List>
      </Paper>

      {/* Seção de Alergias */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Alergias
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Alérgeno"
              name="allergen"
              value={newAllergy.allergen}
              onChange={handleAllergyChange}
              placeholder="Ex: Penicilina, Látex"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Reação"
              name="reaction"
              value={newAllergy.reaction}
              onChange={handleAllergyChange}
              placeholder="Ex: Urticária"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Severidade"
              name="severity"
              value={newAllergy.severity}
              onChange={handleAllergyChange}
              placeholder="Ex: Moderada"
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddAllergy}
              disabled={!newAllergy.allergen.trim()}
              sx={{ height: '100%' }}
            >
              Adicionar
            </Button>
          </Grid>
        </Grid>
        
        <List>
          {data.allergies?.length > 0 ? (
            data.allergies.map((allergy) => (
              <React.Fragment key={allergy.id}>
                <ListItem>
                  <ListItemText
                    primary={allergy.allergen}
                    secondary={
                      <>
                        {allergy.reaction && `Reação: ${allergy.reaction}`}
                        {allergy.reaction && allergy.severity && ' | '}
                        {allergy.severity && `Severidade: ${allergy.severity}`}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => handleRemoveAllergy(allergy.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              Nenhuma alergia adicionada.
            </Typography>
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default HealthHistoryForm;
