import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  InputAdornment,
  Switch,
  FormControlLabel,
  LinearProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Business as BusinessIcon,
  Token as TokenIcon
} from '@mui/icons-material';

import CompanyService from '../../services/company.service';

/**
 * Componente para gerenciamento de empresas (apenas para superadmin)
 */
const CompanyManagement = () => {
  // Estados para lista de empresas
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Estados para alertas e confirmau00e7u00f5es
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, companyId: null });
  
  // Estados para diu00e1logo de tokens
  const [tokenDialog, setTokenDialog] = useState({ open: false, company: null });
  const [tokenLimit, setTokenLimit] = useState(0);
  
  // Estados para formulu00e1rio de empresa
  const [companyDialog, setCompanyDialog] = useState({ open: false, isEdit: false, company: null });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    email: '',
    phone: '',
    token_limit: 1000,
    active: true
  });

  // Buscar empresas ao carregar o componente e quando os filtros mudarem
  useEffect(() => {
    fetchCompanies();
  }, [page, rowsPerPage, statusFilter]);

  // Buscar lista de empresas com filtros
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      
      const response = await CompanyService.getCompanies({
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
        status: statusFilter
      });
      
      if (response.data.success) {
        setCompanies(response.data.data.companies);
        setTotalCompanies(response.data.data.total);
      }
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
      showAlert('Erro ao buscar empresas', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Executar busca quando o usuu00e1rio pressionar Enter ou clicar no botu00e3o de busca
  const handleSearch = (event) => {
    if (event.key === 'Enter' || event.type === 'click') {
      fetchCompanies();
    }
  };

  // Manipular alterau00e7u00f5es de pu00e1gina
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Manipular alterau00e7u00f5es de linhas por pu00e1gina
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Exibir alerta com mensagem e severidade
  const showAlert = (message, severity = 'success') => {
    setAlert({ open: true, message, severity });
  };

  // Fechar alerta
  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  // Abrir diu00e1logo para confirmar exclusu00e3o de empresa
  const handleOpenDeleteDialog = (companyId) => {
    setDeleteDialog({ open: true, companyId });
  };

  // Fechar diu00e1logo de exclusu00e3o
  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, companyId: null });
  };

  // Excluir empresa
  const handleDeleteCompany = async () => {
    try {
      const response = await CompanyService.deleteCompany(deleteDialog.companyId);
      
      if (response.data.success) {
        showAlert('Empresa excluu00edda com sucesso');
        fetchCompanies();
      }
    } catch (error) {
      console.error('Erro ao excluir empresa:', error);
      showAlert(error.response?.data?.message || 'Erro ao excluir empresa', 'error');
    } finally {
      handleCloseDeleteDialog();
    }
  };

  // Abrir diu00e1logo de tokens
  const handleOpenTokenDialog = (company) => {
    setTokenDialog({ open: true, company });
    setTokenLimit(company.token_limit);
  };

  // Fechar diu00e1logo de tokens
  const handleCloseTokenDialog = () => {
    setTokenDialog({ open: false, company: null });
  };

  // Atualizar limite de tokens
  const handleUpdateTokenLimit = async () => {
    try {
      const response = await CompanyService.updateTokenLimit(
        tokenDialog.company._id, 
        tokenLimit
      );
      
      if (response.data.success) {
        showAlert('Limite de tokens atualizado com sucesso');
        fetchCompanies();
      }
    } catch (error) {
      console.error('Erro ao atualizar limite de tokens:', error);
      showAlert('Erro ao atualizar limite de tokens', 'error');
    } finally {
      handleCloseTokenDialog();
    }
  };

  // Abrir diu00e1logo para criar/editar empresa
  const handleOpenCompanyDialog = (company = null) => {
    if (company) {
      // Modo ediu00e7u00e3o
      setFormData({
        name: company.name,
        description: company.description || '',
        email: company.email || '',
        phone: company.phone || '',
        token_limit: company.token_limit,
        active: company.active
      });
      setCompanyDialog({ open: true, isEdit: true, company });
    } else {
      // Modo criau00e7u00e3o
      setFormData({
        name: '',
        description: '',
        email: '',
        phone: '',
        token_limit: 1000,
        active: true
      });
      setCompanyDialog({ open: true, isEdit: false, company: null });
    }
  };

  // Fechar diu00e1logo de empresa
  const handleCloseCompanyDialog = () => {
    setCompanyDialog({ open: false, isEdit: false, company: null });
  };

  // Manipular alterau00e7u00f5es no formulu00e1rio
  const handleFormChange = (event) => {
    const { name, value, checked, type } = event.target;
    
    // Tratar campos especu00edficos
    if (name === 'active') {
      setFormData({ ...formData, active: checked });
    } else if (name === 'token_limit') {
      const numValue = parseInt(value, 10) || 0;
      setFormData({ ...formData, token_limit: numValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Salvar empresa (criar ou atualizar)
  const handleSaveCompany = async () => {
    try {
      if (!formData.name) {
        showAlert('Nome da empresa u00e9 obrigatu00f3rio', 'error');
        return;
      }
      
      if (companyDialog.isEdit) {
        // Atualizar empresa existente
        const response = await CompanyService.updateCompany(
          companyDialog.company._id,
          formData
        );
        
        if (response.data.success) {
          showAlert('Empresa atualizada com sucesso');
          fetchCompanies();
        }
      } else {
        // Criar nova empresa
        const response = await CompanyService.createCompany(formData);
        
        if (response.data.success) {
          showAlert('Empresa criada com sucesso');
          fetchCompanies();
        }
      }
      
      handleCloseCompanyDialog();
    } catch (error) {
      console.error('Erro ao salvar empresa:', error);
      showAlert(error.response?.data?.message || 'Erro ao salvar empresa', 'error');
    }
  };

  // Calcular porcentagem de uso de tokens
  const calculateTokenUsage = (company) => {
    if (!company.token_limit) return 0;
    return Math.min(100, Math.round((company.tokens_used / company.token_limit) * 100));
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
            Gerenciamento de Empresas
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenCompanyDialog()}
          >
            Nova Empresa
          </Button>
        </Box>
      </motion.div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Buscar empresas"
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
            <Grid item xs={12} sm={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={statusFilter === 'active'}
                      onChange={(e) => {
                        setStatusFilter(e.target.checked ? 'active' : '');
                      }}
                      color="primary"
                    />
                  }
                  label="Apenas ativas"
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  fetchCompanies();
                }}
              >
                Limpar filtros
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      {/* Tabela de empresas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Descriu00e7u00e3o</TableCell>
                  <TableCell>Contato</TableCell>
                  <TableCell>Tokens</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Au00e7u00f5es</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <CircularProgress size={30} />
                    </TableCell>
                  </TableRow>
                ) : companies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Nenhuma empresa encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  companies.map((company) => (
                    <TableRow key={company._id} hover>
                      <TableCell>{company.name}</TableCell>
                      <TableCell>{company.description || '-'}</TableCell>
                      <TableCell>
                        {company.email ? (
                          <Typography variant="body2" component="div">
                            {company.email}
                          </Typography>
                        ) : null}
                        {company.phone ? (
                          <Typography variant="body2" color="textSecondary" component="div">
                            {company.phone}
                          </Typography>
                        ) : null}
                        {!company.email && !company.phone && '-'}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ minWidth: 35 }}>
                            <Typography variant="body2">
                              {calculateTokenUsage(company)}%
                            </Typography>
                          </Box>
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={calculateTokenUsage(company)}
                              color={calculateTokenUsage(company) > 80 ? 'error' : 'primary'}
                              sx={{ height: 8, borderRadius: 5 }}
                            />
                          </Box>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleOpenTokenDialog(company)}
                          >
                            <TokenIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        <Typography variant="caption" color="textSecondary">
                          {company.tokens_used || 0} / {company.token_limit || 0}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={company.active ? 'Ativa' : 'Inativa'}
                          color={company.active ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenCompanyDialog(company)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleOpenDeleteDialog(company._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalCompanies}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Linhas por pu00e1gina:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </Paper>
      </motion.div>

      {/* Diu00e1logo de confirmau00e7u00e3o de exclusu00e3o */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirmar Exclusu00e3o</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir esta empresa? Todos os usuu00e1rios e planos vinculados a ela seru00e3o afetados. Esta au00e7u00e3o nu00e3o pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleDeleteCompany} color="error" autoFocus>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diu00e1logo de criau00e7u00e3o/ediu00e7u00e3o de empresa */}
      <Dialog 
        open={companyDialog.open} 
        onClose={handleCloseCompanyDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {companyDialog.isEdit ? 'Editar Empresa' : 'Nova Empresa'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Nome"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descriu00e7u00e3o"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Telefone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Limite de Tokens"
                  name="token_limit"
                  type="number"
                  value={formData.token_limit}
                  onChange={handleFormChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TokenIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.active}
                      onChange={handleFormChange}
                      name="active"
                      color="primary"
                    />
                  }
                  label="Empresa ativa"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCompanyDialog}>Cancelar</Button>
          <Button onClick={handleSaveCompany} variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diu00e1logo de gerenciamento de tokens */}
      <Dialog
        open={tokenDialog.open}
        onClose={handleCloseTokenDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Gerenciar Tokens</DialogTitle>
        <DialogContent>
          {tokenDialog.company && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                {tokenDialog.company.name}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ minWidth: 35 }}>
                  <Typography variant="body2">
                    {calculateTokenUsage(tokenDialog.company)}%
                  </Typography>
                </Box>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={calculateTokenUsage(tokenDialog.company)}
                    color={calculateTokenUsage(tokenDialog.company) > 80 ? 'error' : 'primary'}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
              </Box>
              
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Tokens utilizados: {tokenDialog.company.tokens_used || 0}
              </Typography>
              
              <TextField
                fullWidth
                label="Limite de Tokens"
                type="number"
                value={tokenLimit}
                onChange={(e) => setTokenLimit(parseInt(e.target.value, 10) || 0)}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TokenIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTokenDialog}>Cancelar</Button>
          <Button onClick={handleUpdateTokenLimit} variant="contained" color="primary">
            Atualizar
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

export default CompanyManagement;
