import React from 'react';
import {
  Box, Typography, Paper, Grid, Divider, Chip, List,
  ListItem, ListItemText, ListSubheader
} from '@mui/material';

const ReviewForm = ({ data }) => {
  // Função para formatar os dados de forma legível
  const formatData = (key, value) => {
    if (!value || (Array.isArray(value) && value.length === 0) || (typeof value === 'object' && Object.keys(value).length === 0)) {
      return 'Não informado';
    }
    
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    
    return value.toString();
  };

  // Formatadores específicos para cada seção
  const renderPatientInfo = () => {
    const { patient } = data;
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="text.secondary">Nome</Typography>
          <Typography variant="body1" gutterBottom>{patient?.name || 'Não informado'}</Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="text.secondary">Idade</Typography>
          <Typography variant="body1" gutterBottom>{patient?.age ? `${patient.age} anos` : 'Não informada'}</Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="text.secondary">Email</Typography>
          <Typography variant="body1" gutterBottom>{patient?.email || 'Não informado'}</Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="text.secondary">Telefone</Typography>
          <Typography variant="body1" gutterBottom>{patient?.phone || 'Não informado'}</Typography>
        </Grid>
      </Grid>
    );
  };

  const renderSymptoms = () => {
    if (!data.symptoms || data.symptoms.length === 0) {
      return <Typography variant="body2" color="text.secondary">Nenhum sintoma registrado</Typography>;
    }

    return (
      <Box>
        {data.symptoms.map((symptom, index) => (
          <Paper key={index} variant="outlined" sx={{ p: 2, mb: 1 }}>
            <Typography variant="subtitle2">{symptom.description}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              <Chip 
                label={`Intensidade: ${symptom.intensity}/10`} 
                size="small" 
                color="primary" 
                variant="outlined" 
              />
              <Chip 
                label={`Frequência: ${symptom.frequency}`}
                size="small"
                color="secondary"
                variant="outlined"
              />
              {symptom.duration && (
                <Chip 
                  label={`Duração: ${symptom.duration}`} 
                  size="small" 
                  variant="outlined" 
                />
              )}
            </Box>
            {symptom.triggers && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Gatilhos:</strong> {symptom.triggers}
              </Typography>
            )}
          </Paper>
        ))}
      </Box>
    );
  };

  const renderHealthHistory = () => {
    const { healthHistory } = data;
    if (!healthHistory) return <Typography variant="body2" color="text.secondary">Nenhum histórico de saúde registrado</Typography>;

    return (
      <List
        sx={{ width: '100%', bgcolor: 'background.paper' }}
        subheader={<li />}
      >
        {/* Condições Médicas */}
        <li key="conditions">
          <ul style={{ padding: 0 }}>
            <ListSubheader>Condições Médicas</ListSubheader>
            {healthHistory.conditions && healthHistory.conditions.length > 0 ? (
              healthHistory.conditions.map((condition, index) => (
                <ListItem key={index}>
                  <ListItemText primary={condition} />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="Nenhuma condição médica registrada" sx={{ color: 'text.secondary' }} />
              </ListItem>
            )}
          </ul>
        </li>

        {/* Medicações */}
        <li key="medications">
          <ul style={{ padding: 0 }}>
            <ListSubheader>Medicações</ListSubheader>
            {healthHistory.medications && healthHistory.medications.length > 0 ? (
              healthHistory.medications.map((med, index) => (
                <ListItem key={index}>
                  <ListItemText 
                    primary={med.name} 
                    secondary={`${med.dosage ? 'Dosagem: ' + med.dosage : ''} ${med.dosage && med.frequency ? '|' : ''} ${med.frequency ? 'Frequência: ' + med.frequency : ''}`} 
                  />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="Nenhuma medicação registrada" sx={{ color: 'text.secondary' }} />
              </ListItem>
            )}
          </ul>
        </li>

        {/* Cirurgias */}
        <li key="surgeries">
          <ul style={{ padding: 0 }}>
            <ListSubheader>Cirurgias</ListSubheader>
            {healthHistory.surgeries && healthHistory.surgeries.length > 0 ? (
              healthHistory.surgeries.map((surgery, index) => (
                <ListItem key={index}>
                  <ListItemText 
                    primary={surgery.procedure} 
                    secondary={`${surgery.year ? 'Ano: ' + surgery.year : ''} ${surgery.year && surgery.notes ? '|' : ''} ${surgery.notes ? 'Observações: ' + surgery.notes : ''}`} 
                  />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="Nenhuma cirurgia registrada" sx={{ color: 'text.secondary' }} />
              </ListItem>
            )}
          </ul>
        </li>

        {/* Alergias */}
        <li key="allergies">
          <ul style={{ padding: 0 }}>
            <ListSubheader>Alergias</ListSubheader>
            {healthHistory.allergies && healthHistory.allergies.length > 0 ? (
              healthHistory.allergies.map((allergy, index) => (
                <ListItem key={index}>
                  <ListItemText 
                    primary={allergy.allergen} 
                    secondary={`${allergy.reaction ? 'Reação: ' + allergy.reaction : ''} ${allergy.reaction && allergy.severity ? '|' : ''} ${allergy.severity ? 'Severidade: ' + allergy.severity : ''}`} 
                  />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="Nenhuma alergia registrada" sx={{ color: 'text.secondary' }} />
              </ListItem>
            )}
          </ul>
        </li>
      </List>
    );
  };

  const renderLifestyle = () => {
    const { lifestyle } = data;
    if (!lifestyle || Object.keys(lifestyle).length === 0) {
      return <Typography variant="body2" color="text.secondary">Nenhuma informação de estilo de vida registrada</Typography>;
    }

    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle2" color="text.secondary">Alimentação</Typography>
          <Typography variant="body1" gutterBottom>
            {lifestyle.dietPattern ? `Padrão: ${lifestyle.dietPattern}` : ''}
            {lifestyle.dietDescription ? (lifestyle.dietPattern ? ' - ' : '') + lifestyle.dietDescription : ''}
            {!lifestyle.dietPattern && !lifestyle.dietDescription ? 'Não informado' : ''}
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle2" color="text.secondary">Atividade Física</Typography>
          <Typography variant="body1" gutterBottom>
            {lifestyle.exerciseFrequency ? `Frequência: ${lifestyle.exerciseFrequency}` : ''}
            {lifestyle.exerciseTypes ? (lifestyle.exerciseFrequency ? ' | ' : '') + `Tipos: ${lifestyle.exerciseTypes}` : ''}
            {!lifestyle.exerciseFrequency && !lifestyle.exerciseTypes ? 'Não informado' : ''}
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle2" color="text.secondary">Sono</Typography>
          <Typography variant="body1" gutterBottom>
            {lifestyle.sleepHours ? `${lifestyle.sleepHours} horas por noite` : ''}
            {lifestyle.sleepQuality ? (lifestyle.sleepHours ? ' | ' : '') + `Qualidade: ${lifestyle.sleepQuality}` : ''}
            {!lifestyle.sleepHours && !lifestyle.sleepQuality ? 'Não informado' : ''}
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle2" color="text.secondary">Estresse</Typography>
          <Typography variant="body1" gutterBottom>
            {lifestyle.stressLevel ? `Nível: ${lifestyle.stressLevel}/10` : ''}
            {lifestyle.stressSources ? (lifestyle.stressLevel ? ' | ' : '') + `Fontes: ${lifestyle.stressSources}` : ''}
            {!lifestyle.stressLevel && !lifestyle.stressSources ? 'Não informado' : ''}
          </Typography>
        </Grid>
      </Grid>
    );
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Revisão do Plano de Saúde
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Revise as informações do plano antes de finalizar. Verifique se todos os dados estão corretos e completos.
      </Typography>
      
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>Informações da Paciente</Typography>
        {renderPatientInfo()}
      </Paper>
      
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>Sintomas ({data.symptoms?.length || 0})</Typography>
        <Divider sx={{ mb: 2 }} />
        {renderSymptoms()}
      </Paper>
      
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>Histórico de Saúde</Typography>
        <Divider sx={{ mb: 2 }} />
        {renderHealthHistory()}
      </Paper>
      
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>Estilo de Vida</Typography>
        <Divider sx={{ mb: 2 }} />
        {renderLifestyle()}
      </Paper>
    </Box>
  );
};

export default ReviewForm;
