import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AnimatePresence } from 'framer-motion';

// Tema personalizado
import theme from './theme';

// Context providers
import { AuthProvider } from './context/AuthContext';

// Páginas de autenticação
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Páginas do dashboard
import Dashboard from './pages/dashboard/Dashboard';
import PlansList from './pages/plans/PlansList';
import NewPlan from './pages/plans/NewPlan';
import PlanDetails from './pages/plans/PlanDetails';

// Componentes de layout
import Layout from './components/layout/Layout';
import AuthLayout from './components/layout/AuthLayout';

// Utility de autenticação
import AuthGuard from './components/auth/AuthGuard';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Rotas de autenticação */}
              <Route element={<AuthLayout />}>
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              </Route>
              
              {/* Rotas protegidas - exigem autenticação */}
              <Route element={<AuthGuard><Layout /></AuthGuard>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/plans" element={<PlansList />} />
                <Route path="/plans/new" element={<NewPlan />} />
                <Route path="/plans/:id" element={<PlanDetails />} />
              </Route>
              
              {/* Rota padrão - redireciona para login */}
              <Route path="/" element={<Navigate to="/auth/login" replace />} />
              
              {/* Rota para qualquer outra URL não mapeada */}
              <Route path="*" element={<Navigate to="/auth/login" replace />} />
            </Routes>
          </AnimatePresence>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
