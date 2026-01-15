import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import { ClientsPage } from "./pages/ClientsPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { EmployeesPage } from "./pages/EmployeesPage";
import { PaymentsPage } from "./pages/PaymentsPage";
import { CommissionsPage } from "./pages/CommissionsPage";
import { ReportsPage } from "./pages/ReportsPage";
// HR Module Pages
import { CEODashboard } from "./pages/CEODashboard";
import { RecruitmentPlanPage } from "./pages/RecruitmentPlanPage";
import { TargetVsActualPage } from "./pages/TargetVsActualPage";
import { SalaryCostPage } from "./pages/SalaryCostPage";
import { PreviousEmployeesPage } from "./pages/PreviousEmployeesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/commissions" element={<CommissionsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            {/* HR Module Routes */}
            <Route path="/ceo-dashboard" element={<CEODashboard />} />
            <Route path="/recruitment-plan" element={<RecruitmentPlanPage />} />
            <Route path="/target-vs-actual" element={<TargetVsActualPage />} />
            <Route path="/salary-cost" element={<SalaryCostPage />} />
            <Route path="/previous-employees" element={<PreviousEmployeesPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
