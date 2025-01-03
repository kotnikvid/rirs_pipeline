import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage/LandingPage';
import InvoicesPage from './pages/InvoicesPage/InvoicesPage';
import {AuthPage} from "./pages/AuthPage";
import InvoiceFormPage from './pages/InvoiceFormPage/InvoiceFormPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/invoices/:id" element={<InvoiceFormPage isReadOnly={true} />} />
          <Route path="/invoices/add" element={<InvoiceFormPage isReadOnly={false} />} />
          <Route path="/invoices/edit/:id" element={<InvoiceFormPage isReadOnly={false} />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
