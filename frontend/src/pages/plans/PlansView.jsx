import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Avatar,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  Snackbar,
  Alert,
  CircularProgress,
  Pagination,
  useTheme
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
  Description as DescriptionIcon,
  CalendarMonth as CalendarIcon,
  FilterAlt as FilterAltIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

import PlanService from '../../services/plan.service';
import AuthService from '../../services/auth.service';

/**
 * Componente para visualizau00e7u00e3o e gerenciamento de planos
 */
const PlansView = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  // Estados para lista de planos
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('-created_at'); // Mais recentes primeiro

  // Estados para menu de filtros
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [sortMenuAnchor, setSortMenuAnchor] = useState(null);
  
  // Estados para menu de au00e7u00f5es do plano
  const [actionMenuState, setActionMenuState] = useState({
    anchor: null,
    planId: null
  });
  
  // Estados para alerta e confirmau00e7u00e3o
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, planId: null });

  // Estados para layout
  const [isGridView, setIsGridView] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // Verificar se u00e9 superadmin ao carregar
  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setIsSuperAdmin(currentUser.role === 'superadmin');
    }
  }, []);

  // Buscar planos ao carregar e quando os filtros mudarem
  useEffect(() => {
    fetchPlans();
  }, [page, statusFilter, sortOrder]);

  // Buscar lista de planos com filtros
  const fetchPlans = async () => {
    try {
      setLoading(true);
      
      const response = await PlanService.getPlans({
        page,
        limit: 8, // Itens por pu00e1gina
        search: searchTerm,
        status: statusFilter,
        sort: sortOrder
      });
      
      if (response.data.success) {
        setPlans(response.data.data.plans);
        setTotalPages(response.data.data.totalPages);
      }
    } catch (error) {
      console.error('Erro ao buscar planos:', error);
      showAlert('Erro ao buscar planos', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Exibir alerta
  const showAlert = (message, severity = 'success') => {
    setAlert({ open: true, message, severity });
  };

  // Fechar alerta
  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  // Executar busca
  const handleSearch = (event) => {
    if (event.key === 'Enter' || event.type === 'click') {
      setPage(1); // Resetar para a primeira pu00e1gina
      fetchPlans();
    }
  };

  // Manipular mudanu00e7a de pu00e1gina
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Manipular menu de filtro
  const handleFilterMenuOpen = (event) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterMenuAnchor(null);
  };

  const handleFilterChange = (filter) => {
    setStatusFilter(filter);
    setPage(1); // Resetar para a primeira pu00e1gina
    handleFilterMenuClose();
  };

  // Manipular menu de ordenau00e7u00e3o
  const handleSortMenuOpen = (event) => {
    setSortMenuAnchor(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setSortMenuAnchor(null);
  };

  const handleSortChange = (sort) => {
    setSortOrder(sort);
    setPage(1); // Resetar para a primeira pu00e1gina
    handleSortMenuClose();
  };

  // Manipular menu de au00e7u00f5es do plano
  const handleActionMenuOpen = (event, planId) => {
    event.stopPropagation();
    setActionMenuState({
      anchor: event.currentTarget,
      planId
    });
  };

  const handleActionMenuClose = () => {
    setActionMenuState({
      anchor: null,
      planId: null
    });
  };

  // Abrir diu00e1logo de confirmau00e7u00e3o de exclusu00e3o
  const handleOpenDeleteDialog = (planId) => {
    handleActionMenuClose();
    setDeleteDialog({ open: true, planId });
  };

  // Fechar diu00e1logo de exclusu00e3o
  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, planId: null });
  };

  // Excluir plano
  const handleDeletePlan = async () => {
    try {
      const response = await PlanService.deletePlan(deleteDialog.planId);
      
      if (response.data.success) {
        showAlert('Plano excluu00eddo com sucesso');
        fetchPlans();
      }
    } catch (error) {
      console.error('Erro ao excluir plano:', error);
      showAlert('Erro ao excluir plano', 'error');
    } finally {
      handleCloseDeleteDialog();
    }
  };

  // Navegar para a pu00e1gina de detalhes do plano
  const handleViewPlan = (planId) => {
    navigate(`/plans/${planId}`);
  };

  // Navegar para criar novo plano
  const handleCreatePlan = () => {
    navigate('/plans/new');
  };

  // Exportar plano como PDF
  const handleExportPDF = async (planId) => {
    try {
      handleActionMenuClose();
      showAlert('Gerando PDF, aguarde...', 'info');
      
      const response = await PlanService.exportPlanPDF(planId);
      
      // Criar URL para o blob e foru00e7ar download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `plano-${planId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showAlert('PDF gerado com sucesso');
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      showAlert('Erro ao exportar PDF', 'error');
    }
  };

  // Formatar data
  const formatDate = (dateString) => {
    if (!dateString) return 'Data nu00e3o definida';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Obter cor com base no status do plano
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return theme.palette.success.main;
      case 'in_progress':
        return theme.palette.info.main;
      case 'draft':
        return theme.palette.warning.main;
      default:
        return theme.palette.grey[500];
    }
  };

  // Obter label do status
  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Finalizado';
      case 'in_progress':
        return 'Em andamento';
      case 'draft':
        return 'Rascunho';
      default:
        return 'Desconhecido';
    }
  };

  // Renderizar card de plano
  const renderPlanCard = (plan, index) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} key={plan._id}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          whileHover={{ scale: 1.03 }}
          exit={{ opacity: 0, scale: 0.95 }}
        >
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              cursor: 'pointer',
              borderTop: `3px solid ${getStatusColor(plan.status)}`
            }}
            onClick={() => handleViewPlan(plan._id)}
          >
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: getStatusColor(plan.status) }}>
                  {plan.patient?.name?.charAt(0) || 'P'}
                </Avatar>
              }
              action={
                <IconButton 
                  aria-label="ações"
                  onClick={(e) => handleActionMenuOpen(e, plan._id)}
                >
                  <MoreVertIcon />
                </IconButton>
              }
              title={
                <Typography variant="subtitle1" noWrap>
                  {plan.title || 'Plano sem título'}
                </Typography>
              }
              subheader={
                <Chip 
                  size="small" 
                  label={getStatusLabel(plan.status)}
                  sx={{ 
                    backgroundColor: `${getStatusColor(plan.status)}20`,
                    color: getStatusColor(plan.status),
                    fontSize: '0.7rem'
                  }}
                />
              }
            />
            <CardContent sx={{ flexGrow: 1, pt: 0 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <b>Paciente:</b> {plan.patient?.name || 'Não definido'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <b>Idade:</b> {plan.patient?.age || 'N/A'} anos
              </Typography>
              {plan.symptoms && plan.symptoms.length > 0 && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <b>Sintomas principais:</b> {plan.symptoms.slice(0, 2).map(s => s.description).join(', ')}
                  {plan.symptoms.length > 2 ? '...' : ''}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                <b>Criado em:</b> {formatDate(plan.created_at)}
              </Typography>
              {plan.status === 'completed' && plan.final_plan && (
                <Typography variant="body2" color="text.secondary">
                  <b>Finalizado em:</b> {formatDate(plan.final_plan.created_at)}
                </Typography>
              )}
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Button 
                size="small" 
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewPlan(plan._id);
                }}
              >
                Ver Detalhes
              </Button>
              {plan.status === 'completed' && (
                <Button 
                  size="small" 
                  color="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExportPDF(plan._id);
                  }}
                >
                  PDF
                </Button>
              )}
            </CardActions>
          </Card>
        </motion.div>
      </Grid>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Cabeu00e7alho */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Meus Planos
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreatePlan}
          >
            Novo Plano
          </Button>
        </Box>
      </motion.div>

      {/* Barra de busca e filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Buscar planos"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleSearch}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleSearch}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterAltIcon />}
                onClick={handleFilterMenuOpen}
                color={statusFilter ? 'primary' : 'inherit'}
              >
                {statusFilter ? getStatusLabel(statusFilter) : 'Filtrar'}
              </Button>
              <Menu
                anchorEl={filterMenuAnchor}
                open={Boolean(filterMenuAnchor)}
                onClose={handleFilterMenuClose}
              >
                <MenuItem onClick={() => handleFilterChange('')}>Todos</MenuItem>
                <MenuItem onClick={() => handleFilterChange('draft')}>Rascunho</MenuItem>
                <MenuItem onClick={() => handleFilterChange('in_progress')}>Em andamento</MenuItem>
                <MenuItem onClick={() => handleFilterChange('completed')}>Finalizados</MenuItem>
              </Menu>
            </Grid>
            <Grid item xs={6} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<SortIcon />}
                onClick={handleSortMenuOpen}
              >
                Ordenar
              </Button>
              <Menu
                anchorEl={sortMenuAnchor}
                open={Boolean(sortMenuAnchor)}
                onClose={handleSortMenuClose}
              >
                <MenuItem onClick={() => handleSortChange('-created_at')}>Mais recentes</MenuItem>
                <MenuItem onClick={() => handleSortChange('created_at')}>Mais antigos</MenuItem>
                <MenuItem onClick={() => handleSortChange('patient.name')}>Nome da paciente</MenuItem>
                <MenuItem onClick={() => handleSortChange('status')}>Status</MenuItem>
              </Menu>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setSortOrder('-created_at');
                  setPage(1);
                  fetchPlans();
                }}
              >
                Limpar
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      {/* Lista de planos */}
      <Box sx={{ mt: 2, mb: 4 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : plans.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <AssignmentIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Nenhum plano encontrado
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {searchTerm || statusFilter 
                  ? 'Nenhum plano corresponde aos critérios de busca. Tente outros filtros.'
                  : 'Comece criando seu primeiro plano de saúde personalizado.'}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleCreatePlan}
                sx={{ mt: 2 }}
              >
                Criar Novo Plano
              </Button>
            </Paper>
          </motion.div>
        ) : (
          <>
            <AnimatePresence>
              <Grid container spacing={3}>
                {plans.map((plan, index) => renderPlanCard(plan, index))}
              </Grid>
            </AnimatePresence>
            
            {/* Paginau00e7u00e3o */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={handlePageChange} 
                  color="primary" 
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Menu de au00e7u00f5es de plano */}
      <Menu
        anchorEl={actionMenuState.anchor}
        open={Boolean(actionMenuState.anchor)}
        onClose={handleActionMenuClose}
      >
        <MenuItem onClick={() => {
          const planId = actionMenuState.planId;
          handleActionMenuClose();
          handleViewPlan(planId);
        }}>
          <DescriptionIcon fontSize="small" sx={{ mr: 1 }} />
          Ver detalhes
        </MenuItem>
        {plans.find(p => p._id === actionMenuState.planId)?.status === 'completed' && (
          <MenuItem onClick={() => handleExportPDF(actionMenuState.planId)}>
            <AssignmentIcon fontSize="small" sx={{ mr: 1 }} />
            Exportar PDF
          </MenuItem>
        )}
        <MenuItem onClick={() => handleOpenDeleteDialog(actionMenuState.planId)}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Excluir plano
        </MenuItem>
      </Menu>

      {/* Diu00e1logo de confirmau00e7u00e3o de exclusu00e3o */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirmar Exclusu00e3o</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este plano? Esta au00e7u00e3o nu00e3o pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleDeletePlan} color="error" autoFocus>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alerta de notificau00e7u00e3o */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PlansView;
