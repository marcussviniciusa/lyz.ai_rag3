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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

import UserService from '../../services/user.service';
import CompanyService from '../../services/company.service';

/**
 * Componente para gerenciamento de usuu00e1rios (apenas para superadmin)
 */
const UserManagement = () => {
  // Estados para lista de usuu00e1rios
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [companies, setCompanies] = useState([]);
  
  // Estados para alertas e confirmau00e7u00f5es
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, userId: null });
  
  // Estados para formulu00e1rio de usuu00e1rio
  const [userDialog, setUserDialog] = useState({ open: false, isEdit: false, user: null });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    company_id: '',
    active: true
  });

  // Buscar usuu00e1rios ao carregar o componente e quando os filtros mudarem
  useEffect(() => {
    fetchUsers();
    fetchCompanies();
  }, [page, rowsPerPage, statusFilter, companyFilter]);

  // Buscar lista de empresas para o filtro
  const fetchCompanies = async () => {
    try {
      const response = await CompanyService.getCompanies();
      if (response.data.success) {
        setCompanies(response.data.data.companies);
      }
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
      showAlert('Erro ao buscar empresas', 'error');
    }
  };

  // Buscar lista de usuu00e1rios com filtros
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const response = await UserService.getUsers({
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
        status: statusFilter,
        company_id: companyFilter
      });
      
      if (response.data.success) {
        setUsers(response.data.data.users);
        setTotalUsers(response.data.data.total);
      }
    } catch (error) {
      console.error('Erro ao buscar usuu00e1rios:', error);
      showAlert('Erro ao buscar usuu00e1rios', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Executar busca quando o usuu00e1rio pressionar Enter ou clicar no botu00e3o de busca
  const handleSearch = (event) => {
    if (event.key === 'Enter' || event.type === 'click') {
      fetchUsers();
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

  // Abrir diu00e1logo para confirmar exclusu00e3o de usuu00e1rio
  const handleOpenDeleteDialog = (userId) => {
    setDeleteDialog({ open: true, userId });
  };

  // Fechar diu00e1logo de exclusu00e3o
  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, userId: null });
  };

  // Excluir usuu00e1rio
  const handleDeleteUser = async () => {
    try {
      const response = await UserService.deleteUser(deleteDialog.userId);
      
      if (response.data.success) {
        showAlert('Usuu00e1rio excluu00eddo com sucesso');
        fetchUsers();
      }
    } catch (error) {
      console.error('Erro ao excluir usuu00e1rio:', error);
      showAlert('Erro ao excluir usuu00e1rio', 'error');
    } finally {
      handleCloseDeleteDialog();
    }
  };

  // Abrir diu00e1logo para criar/editar usuu00e1rio
  const handleOpenUserDialog = (user = null) => {
    if (user) {
      // Modo ediu00e7u00e3o
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        company_id: user.company_id._id || user.company_id,
        active: user.active
      });
      setUserDialog({ open: true, isEdit: true, user });
    } else {
      // Modo criau00e7u00e3o
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'user',
        company_id: '',
        active: true
      });
      setUserDialog({ open: true, isEdit: false, user: null });
    }
  };

  // Fechar diu00e1logo de usuu00e1rio
  const handleCloseUserDialog = () => {
    setUserDialog({ open: false, isEdit: false, user: null });
  };

  // Manipular alterau00e7u00f5es no formulu00e1rio
  const handleFormChange = (event) => {
    const { name, value, checked } = event.target;
    setFormData({
      ...formData,
      [name]: name === 'active' ? checked : value
    });
  };

  // Salvar usuu00e1rio (criar ou atualizar)
  const handleSaveUser = async () => {
    try {
      if (!formData.name || !formData.email || (!userDialog.isEdit && !formData.password) || !formData.company_id) {
        showAlert('Preencha todos os campos obrigatu00f3rios', 'error');
        return;
      }
      
      if (userDialog.isEdit) {
        // Atualizar usuu00e1rio existente
        const response = await UserService.updateUser(
          userDialog.user._id,
          formData
        );
        
        if (response.data.success) {
          showAlert('Usuu00e1rio atualizado com sucesso');
          fetchUsers();
        }
      } else {
        // Criar novo usuu00e1rio
        const response = await UserService.createUser(formData);
        
        if (response.data.success) {
          showAlert('Usuu00e1rio criado com sucesso');
          fetchUsers();
        }
      }
      
      handleCloseUserDialog();
    } catch (error) {
      console.error('Erro ao salvar usuu00e1rio:', error);
      showAlert(error.response?.data?.message || 'Erro ao salvar usuu00e1rio', 'error');
    }
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
            Gerenciamento de Usuu00e1rios
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenUserDialog()}
          >
            Novo Usuu00e1rio
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
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Buscar usuu00e1rios"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleSearch}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={handleSearch}>
                      <SearchIcon />
                    </IconButton>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="active">Ativos</MenuItem>
                  <MenuItem value="inactive">Inativos</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="company-filter-label">Empresa</InputLabel>
                <Select
                  labelId="company-filter-label"
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                  label="Empresa"
                >
                  <MenuItem value="">Todas</MenuItem>
                  {companies.map((company) => (
                    <MenuItem key={company._id} value={company._id}>
                      {company.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setCompanyFilter('');
                  fetchUsers();
                }}
              >
                Limpar
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      {/* Tabela de usuu00e1rios */}
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
                  <TableCell>Email</TableCell>
                  <TableCell>Empresa</TableCell>
                  <TableCell>Funu00e7u00e3o</TableCell>
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
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Nenhum usuu00e1rio encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user._id} hover>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.company_id?.name || 'Nu00e3o definida'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.role === 'superadmin' ? 'Superadmin' : 'Usuu00e1rio'}
                          color={user.role === 'superadmin' ? 'secondary' : 'primary'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.active ? 'Ativo' : 'Inativo'}
                          color={user.active ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenUserDialog(user)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleOpenDeleteDialog(user._id)}
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
            count={totalUsers}
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
            Tem certeza que deseja excluir este usuu00e1rio? Esta au00e7u00e3o nu00e3o pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleDeleteUser} color="error" autoFocus>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diu00e1logo de criau00e7u00e3o/ediu00e7u00e3o de usuu00e1rio */}
      <Dialog 
        open={userDialog.open} 
        onClose={handleCloseUserDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {userDialog.isEdit ? 'Editar Usuu00e1rio' : 'Novo Usuu00e1rio'}
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
                  required
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required={!userDialog.isEdit}
                  label={userDialog.isEdit ? 'Nova Senha (opcional)' : 'Senha'}
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  helperText={userDialog.isEdit ? 'Deixe em branco para manter a senha atual' : ''}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel id="role-label">Funu00e7u00e3o</InputLabel>
                  <Select
                    labelId="role-label"
                    name="role"
                    value={formData.role}
                    onChange={handleFormChange}
                    label="Funu00e7u00e3o"
                  >
                    <MenuItem value="user">Usuu00e1rio</MenuItem>
                    <MenuItem value="superadmin">Superadmin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel id="company-label">Empresa</InputLabel>
                  <Select
                    labelId="company-label"
                    name="company_id"
                    value={formData.company_id}
                    onChange={handleFormChange}
                    label="Empresa"
                  >
                    {companies.map((company) => (
                      <MenuItem key={company._id} value={company._id}>
                        {company.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ mr: 2 }}>
                    Status:
                  </Typography>
                  <Select
                    name="active"
                    value={formData.active}
                    onChange={handleFormChange}
                  >
                    <MenuItem value={true}>Ativo</MenuItem>
                    <MenuItem value={false}>Inativo</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUserDialog}>Cancelar</Button>
          <Button onClick={handleSaveUser} variant="contained" color="primary">
            Salvar
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

export default UserManagement;
