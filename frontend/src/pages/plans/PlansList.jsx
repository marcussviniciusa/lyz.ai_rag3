import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Button, Grid, Card, CardContent, 
  CardActions, Box, Chip, TextField, InputAdornment, CircularProgress
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, Person as PersonIcon, Event as EventIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import PlanService from '../../services/plan.service';

const PlansList = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await PlanService.getAllPlans();
        setPlans(response.data);
        setError('');
      } catch (err) {
        console.error('Erro ao buscar planos:', err);
        setError('Falha ao carregar os planos. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleNewPlan = () => {
    navigate('/plans/new');
  };

  const handleViewPlan = (id) => {
    navigate(`/plans/${id}`);
  };

  const filteredPlans = plans.filter(plan => 
    plan.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    plan.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const formatDate = (dateString) => {
    if (!dateString) return 'Data nu00e3o disponu00edvel';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Planos de Sau00fade
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleNewPlan}
        >
          Novo Plano
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar por nome da paciente ou ID do plano"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center" sx={{ my: 4 }}>
          {error}
        </Typography>
      ) : filteredPlans.length === 0 ? (
        <Typography align="center" sx={{ my: 4 }}>
          {searchTerm ? 'Nenhum plano encontrado para a busca realizada.' : 'Nenhum plano disponu00edvel. Crie seu primeiro plano!'}
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredPlans.map((plan) => (
            <Grid item xs={12} sm={6} md={4} key={plan.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card 
                  elevation={2} 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom noWrap>
                      {plan.patient?.name || 'Paciente sem nome'}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Chip 
                        label={getStatusLabel(plan.status)} 
                        color={getStatusColor(plan.status)}
                        size="small"
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {plan.patient?.age ? `${plan.patient.age} anos` : 'Idade nu00e3o informada'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EventIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Criado em: {formatDate(plan.createdAt)}
                      </Typography>
                    </Box>
                  </CardContent>
                  
                  <CardActions>
                    <Button 
                      size="small" 
                      color="primary" 
                      onClick={() => handleViewPlan(plan.id)}
                      fullWidth
                    >
                      Ver Detalhes
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default PlansList;
