import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Avatar,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  CircularProgress,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Add as AddIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  MoreVert as MoreVertIcon,
  CalendarMonth as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  Business as BusinessIcon
} from '@mui/icons-material';

import PlanService from '../../services/plan.service';
import UserService from '../../services/user.service';
import AuthService from '../../services/auth.service';

// Componente de estatísticas animado
const StatCard = ({ icon: Icon, title, value, color, delay }) => {
  const theme = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.03 }}
      style={{ height: '100%' }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          height: '100%',
          borderTop: `4px solid ${color}`,
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
          <Avatar sx={{ bgcolor: color, width: 40, height: 40 }}>
            <Icon />
          </Avatar>
        </Box>
        
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
          {value || '0'}
        </Typography>
      </Paper>
    </motion.div>
  );
};

// Componente de card de plano com animação
const PlanCard = ({ plan, index, onView }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Data não definida';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '12px' }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: plan.status === 'completed' ? 'success.main' : 'info.main' }}>
              {plan.patient?.name?.charAt(0) || 'P'}
            </Avatar>
          }
          action={
            <IconButton aria-label="configurações">
              <MoreVertIcon />
            </IconButton>
          }
          title={plan.title || 'Plano sem título'}
          subheader={`Criado em: ${formatDate(plan.created_at)}`}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <b>Paciente:</b> {plan.patient?.name || 'Não definido'}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <b>Idade:</b> {plan.patient?.age || 'N/A'} anos
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <b>Status:</b> {plan.status === 'completed' ? 'Finalizado' : 'Em andamento'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <b>Última atualização:</b> {formatDate(plan.updated_at)}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" color="primary" onClick={() => onView(plan._id)}>
            Ver Detalhes
          </Button>
          {plan.status === 'completed' && (
            <Button size="small" color="secondary">
              Exportar PDF
            </Button>
          )}
        </CardActions>
      </Card>
    </motion.div>
  );
};

// Componente de atividade recente
const RecentActivity = ({ activities }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <Paper elevation={3} sx={{ p: 2, borderRadius: '12px', height: '100%' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Atividade Recente
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
          {activities.length > 0 ? (
            activities.map((activity, index) => (
              <ListItem key={index} alignItems="flex-start" divider={index < activities.length - 1}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: activity.color }}>
                    {activity.icon}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={activity.title}
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {activity.description}
                      </Typography>
                      {` — ${activity.time}`}
                    </React.Fragment>
                  }
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="Nenhuma atividade recente" />
            </ListItem>
          )}
        </List>
      </Paper>
    </motion.div>
  );
};

// Componente principal do Dashboard
const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ plans: 0, completed: 0, patients: 0 });
  const [recentPlans, setRecentPlans] = useState([]);
  const [activities, setActivities] = useState([]);
  const [user, setUser] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // Carregar dados do usuário e verificar se é superadmin
  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsSuperAdmin(currentUser.role === 'superadmin');
    }
  }, []);

  // Buscar dados do dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Buscar estatísticas
        const statsResponse = await PlanService.getStats();
        if (statsResponse.data && statsResponse.data.success) {
          setStats(statsResponse.data.data);
        }
        
        // Buscar planos recentes
        const plansResponse = await PlanService.getPlans({ limit: 5, sort: '-created_at' });
        if (plansResponse.data && plansResponse.data.success) {
          setRecentPlans(plansResponse.data.data.plans || []);
        }
        
        // Gerar atividades recentes baseadas nos planos
        generateActivities(plansResponse.data.data.plans || []);
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Gerar dados de atividade com base nos planos recentes
  const generateActivities = (plans) => {
    const activities = [];
    
    plans.forEach(plan => {
      // Atividade de criação de plano
      activities.push({
        title: `Plano criado: ${plan.title}`,
        description: `Paciente: ${plan.patient?.name || 'Não definido'}`,
        time: new Date(plan.created_at).toLocaleString('pt-BR'),
        icon: <DescriptionIcon />,
        color: theme.palette.primary.main
      });
      
      // Se o plano foi finalizado, adicionar atividade de finalização
      if (plan.status === 'completed' && plan.final_plan && plan.final_plan.created_at) {
        activities.push({
          title: `Plano finalizado: ${plan.title}`,
          description: `Foram geradas recomendações personalizadas para ${plan.patient?.name || 'a paciente'}.`,
          time: new Date(plan.final_plan.created_at).toLocaleString('pt-BR'),
          icon: <TrendingUpIcon />,
          color: theme.palette.success.main
        });
      }
    });
    
    // Ordenar atividades por data (mais recentes primeiro)
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    
    setActivities(activities);
  };

  // Função para navegar para a página de detalhes do plano
  const handleViewPlan = (planId) => {
    navigate(`/plans/${planId}`);
  };

  // Função para criar um novo plano
  const handleCreatePlan = () => {
    navigate('/plans/new');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Cabeçalho do Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreatePlan}
            sx={{ borderRadius: '8px' }}
          >
            Novo Plano
          </Button>
        </Box>
      </motion.div>

      {/* Cards de estatísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={DescriptionIcon}
            title="Total de Planos"
            value={stats.plans}
            color={theme.palette.primary.main}
            delay={0.1}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={TrendingUpIcon}
            title="Planos Finalizados"
            value={stats.completed}
            color={theme.palette.success.main}
            delay={0.2}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={PersonIcon}
            title="Pacientes"
            value={stats.patients}
            color={theme.palette.info.main}
            delay={0.3}
          />
        </Grid>
      </Grid>

      {/* Seção de administração para superadmin */}
      {isSuperAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Paper
            elevation={3}
            sx={{ p: 3, mb: 4, borderRadius: '12px', borderLeft: `4px solid ${theme.palette.warning.main}` }}
          >
            <Typography variant="h6" gutterBottom>
              Administração do Sistema
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Como superadministrador, você tem acesso a funcionalidades exclusivas de gestão do sistema Lyz.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<BusinessIcon />}
                onClick={() => navigate('/admin/companies')}
              >
                Gerenciar Empresas
              </Button>
              <Button
                variant="outlined"
                startIcon={<PersonIcon />}
                onClick={() => navigate('/admin/users')}
              >
                Gerenciar Usuários
              </Button>
            </Box>
          </Paper>
        </motion.div>
      )}

      {/* Seção principal - Planos recentes e atividades */}
      <Grid container spacing={3}>
        {/* Planos recentes */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6">Planos Recentes</Typography>
            </Box>
          </motion.div>
          
          <Grid container spacing={2}>
            {recentPlans.length > 0 ? (
              recentPlans.map((plan, index) => (
                <Grid item xs={12} sm={6} key={plan._id}>
                  <PlanCard 
                    plan={plan} 
                    index={index} 
                    onView={handleViewPlan} 
                  />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Paper sx={{ p: 3, borderRadius: '12px' }}>
                  <Typography align="center">
                    Nenhum plano encontrado. Comece criando seu primeiro plano!
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
          
          {recentPlans.length > 0 && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button color="primary" onClick={() => navigate('/plans')}>
                Ver todos os planos
              </Button>
            </Box>
          )}
        </Grid>
        
        {/* Atividades recentes */}
        <Grid item xs={12} md={4}>
          <RecentActivity activities={activities} />
        </Grid>
      </Grid>
      
      {/* Calendário de consultas - Futuro recurso */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        style={{ marginTop: '24px' }}
      >
        <Paper elevation={3} sx={{ p: 3, borderRadius: '12px', borderLeft: `4px solid ${theme.palette.secondary.main}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CalendarIcon color="secondary" sx={{ mr: 1 }} />
            <Typography variant="h6">Calendário de Consultas</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Este recurso estará disponível em uma atualização futura do sistema.
            Você poderá agendar consultas e receber lembretes para acompanhamento das pacientes.
          </Typography>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default Dashboard;
