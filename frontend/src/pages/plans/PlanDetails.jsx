import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Paper, Box, Grid, Chip, Button,
  Tab, Tabs, Divider, CircularProgress, Alert
} from '@mui/material';
import { 
  Person as PersonIcon, 
  Event as EventIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import PlanService from '../../services/plan.service';

// Componentes simulados para as abas
const Summary = ({ data }) => (
  <Box sx={{ p: 2 }}>
    <Typography variant="h6" gutterBottom>Resumo do Plano</Typography>
    <Typography variant="body1" paragraph>{data?.summary || 'Resumo nu00e3o disponu00edvel'}</Typography>
    
    <Typography variant="h6" gutterBottom>Sintomas Principais</Typography>
    <Box sx={{ mb: 2 }}>
      {data?.symptoms?.length > 0 ? (
        data.symptoms.map((symptom, index) => (
          <Chip 
            key={index}
            label={`${symptom.description} (${symptom.intensity}/10)`}
            sx={{ mr: 1, mb: 1 }}
            color="primary"
            variant="outlined"
          />
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">Nenhum sintoma registrado</Typography>
      )}
    </Box>
  </Box>
);

const Recommendations = ({ data }) => (
  <Box sx={{ p: 2 }}>
    <Typography variant="h6" gutterBottom>Recomendau00e7u00f5es</Typography>
    
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1" gutterBottom>Nutriu00e7u00e3o</Typography>
      <Typography variant="body1" paragraph>{data?.recommendations?.nutrition || 'Nenhuma recomendau00e7u00e3o de nutriu00e7u00e3o'}</Typography>
    </Box>
    
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1" gutterBottom>Suplementau00e7u00e3o</Typography>
      <Typography variant="body1" paragraph>{data?.recommendations?.supplements || 'Nenhuma recomendau00e7u00e3o de suplementau00e7u00e3o'}</Typography>
    </Box>
    
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1" gutterBottom>Exercu00edcios</Typography>
      <Typography variant="body1" paragraph>{data?.recommendations?.exercise || 'Nenhuma recomendau00e7u00e3o de exercu00edcios'}</Typography>
    </Box>
    
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1" gutterBottom>Gerenciamento de Estresse</Typography>
      <Typography variant="body1" paragraph>{data?.recommendations?.stress_management || 'Nenhuma recomendau00e7u00e3o para gerenciamento de estresse'}</Typography>
    </Box>
  </Box>
);

const Analysis = ({ data }) => (
  <Box sx={{ p: 2 }}>
    <Typography variant="h6" gutterBottom>Anu00e1lise Funcional</Typography>
    <Typography variant="body1" paragraph>{data?.analysis?.ifm_matrix || 'Anu00e1lise nu00e3o disponu00edvel'}</Typography>
    
    <Typography variant="h6" gutterBottom>Anu00e1lise de Exames</Typography>
    <Typography variant="body1" paragraph>{data?.analysis?.exams || 'Nenhuma anu00e1lise de exames disponu00edvel'}</Typography>
    
    <Typography variant="h6" gutterBottom>Anu00e1lise de Medicina Tradicional Chinesa</Typography>
    <Typography variant="body1" paragraph>{data?.analysis?.tcm || 'Nenhuma anu00e1lise de MTC disponu00edvel'}</Typography>
  </Box>
);

const PatientData = ({ data }) => (
  <Box sx={{ p: 2 }}>
    <Typography variant="h6" gutterBottom>Dados da Paciente</Typography>
    
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Typography variant="subtitle2" color="text.secondary">Nome</Typography>
        <Typography variant="body1" gutterBottom>{data?.patient?.name || 'Nu00e3o informado'}</Typography>
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <Typography variant="subtitle2" color="text.secondary">Idade</Typography>
        <Typography variant="body1" gutterBottom>{data?.patient?.age ? `${data.patient.age} anos` : 'Nu00e3o informada'}</Typography>
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <Typography variant="subtitle2" color="text.secondary">Email</Typography>
        <Typography variant="body1" gutterBottom>{data?.patient?.email || 'Nu00e3o informado'}</Typography>
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <Typography variant="subtitle2" color="text.secondary">Telefone</Typography>
        <Typography variant="body1" gutterBottom>{data?.patient?.phone || 'Nu00e3o informado'}</Typography>
      </Grid>
    </Grid>
    
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>Histu00f3rico de Sau00fade</Typography>
      <Typography variant="body1" paragraph>{data?.healthHistory || 'Nenhum histu00f3rico de sau00fade registrado'}</Typography>
    </Box>
  </Box>
);

const PlanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true);
        const response = await PlanService.getPlanById(id);
        setPlan(response.data);
        setError('');
      } catch (err) {
        console.error('Erro ao buscar detalhes do plano:', err);
        setError('Falha ao carregar os detalhes do plano. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    // Verificau00e7u00e3o mais robusta para garantir que o ID u00e9 vu00e1lido
    if (id && id !== 'undefined' && id !== 'null' && id.trim() !== '') {
      fetchPlan();
    } else {
      // Se o ID nu00e3o for vu00e1lido, definir erro e parar o carregamento
      setError('ID do plano nu00e3o fornecido ou invu00e1lido. Volte para a lista de planos e tente novamente.');
      setLoading(false);
    }
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleBack = () => {
    navigate('/plans');
  };

  const handleEdit = () => {
    // Redirecionar para pu00e1gina de ediu00e7u00e3o
    console.log('Editar plano:', id);
  };

  const handlePrint = () => {
    // Lu00f3gica para imprimir o plano
    console.log('Imprimir plano:', id);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Data nu00e3o disponu00edvel';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getStatusColor = (status) => {
    const statusMap = {
      'draft': 'info',
      'in_progress': 'warning',
      'completed': 'success',
      'archived': 'default'
    };
    return statusMap[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      'draft': 'Rascunho',
      'in_progress': 'Em Progresso',
      'completed': 'Concluu00eddo',
      'archived': 'Arquivado'
    };
    return statusLabels[status] || 'Desconhecido';
  };

  const tabContent = [
    <Summary data={plan} key="summary" />,
    <Recommendations data={plan} key="recommendations" />,
    <Analysis data={plan} key="analysis" />,
    <PatientData data={plan} key="patient" />
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        sx={{ mb: 2 }}
      >
        Voltar para lista
      </Button>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/plans')}
            sx={{ mt: 2 }}
          >
            Voltar para Lista de Planos
          </Button>
        </Container>
      ) : plan ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12} sm={8}>
                  <Typography variant="h5" component="h1" gutterBottom>
                    Plano de Sau00fade: {plan.patient?.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Chip 
                      label={getStatusLabel(plan.status)} 
                      color={getStatusColor(plan.status)}
                      sx={{ color: 'white', fontWeight: 'medium' }}
                    />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        {plan.patient?.age ? `${plan.patient.age} anos` : 'Idade nu00e3o informada'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EventIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        Criado em: {formatDate(plan.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, mt: { xs: 2, sm: 0 } }}>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={handleEdit}
                    sx={{ mr: 1, color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
                  >
                    Editar
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<PrintIcon />}
                    onClick={handlePrint}
                    sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
                  >
                    Imprimir
                  </Button>
                </Grid>
              </Grid>
            </Box>
            
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Resumo" />
              <Tab label="Recomendau00e7u00f5es" />
              <Tab label="Anu00e1lises" />
              <Tab label="Dados da Paciente" />
            </Tabs>
            
            <Box sx={{ minHeight: '400px' }}>
              <motion.div
                key={tabValue}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {tabContent[tabValue]}
              </motion.div>
            </Box>
          </Paper>
        </motion.div>
      ) : (
        <Alert severity="info">Plano nu00e3o encontrado</Alert>
      )}
    </Container>
  );
};

export default PlanDetails;
