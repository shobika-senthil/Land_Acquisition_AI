import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { LandingPage } from '../../pages/Landing/LandingPage';
import { LoginPage } from '../../pages/Auth/LoginPage';
import { SignupPage } from '../../pages/Auth/SignupPage';

import { DashboardPage } from '../../pages/Dashboard/DashboardPage';
import { StateAnalysisPage } from '../../pages/StateAnalysis/StateAnalysisPage';
import { DistrictAnalysisPage } from '../../pages/DistrictAnalysis/DistrictAnalysisPage';

import { ProjectsPage } from '../../pages/Projects/ProjectsPage';
import { AddProjectPage } from '../../pages/Projects/AddProjectPage';
import { ProjectDetailsPage } from '../../pages/ProjectDetails/ProjectDetailsPage';

import { GISRiskMapPage } from '../../pages/GISRiskMap/GISRiskMapPage';
import { ParcelDetailsPage } from '../../pages/ParcelDetails/ParcelDetailsPage';

import { AIInsightsPage } from '../../pages/AIInsights/AIInsightsPage';

import { AlertsPage } from '../../pages/Alerts/AlertsPage';

import { ReportsPage } from '../../pages/Reports/ReportsPage';
import { ReportViewPage } from '../../pages/Reports/ReportViewPage';

import { AdminPage } from '../../pages/Admin/AdminPage';
import { SettingsPage } from '../../pages/Settings/SettingsPage';

import { NotFoundPage } from '../../pages/NotFound/NotFoundPage';

import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { PublicRoute } from '../../components/auth/PublicRoute';

export const AppRouter: React.FC = () => {
  return (
    <Routes>

      {/* =====================================================
          PUBLIC ROUTES
      ===================================================== */}

      {/* Landing */}
      <Route path="/" element={<LandingPage />} />

      {/* Authentication */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>


      {/* =====================================================
          PROTECTED APPLICATION ROUTES
      ===================================================== */}

      <Route element={<ProtectedRoute />}>

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />


        {/* =================================================
            STATE & DISTRICT ANALYSIS
        ================================================= */}

        <Route
          path="/state-analysis"
          element={<StateAnalysisPage />}
        />

        <Route
          path="/states"
          element={<StateAnalysisPage />}
        />

        <Route
          path="/district-analysis"
          element={<DistrictAnalysisPage />}
        />

        <Route
          path="/districts"
          element={<DistrictAnalysisPage />}
        />


        {/* =================================================
            PROJECTS
        ================================================= */}

        {/* Project directory */}
        <Route
          path="/projects"
          element={<ProjectsPage />}
        />

        {/* Add new project */}
        <Route
          path="/projects/new"
          element={<AddProjectPage />}
        />

        {/* Project details
            Example:
            /projects/P00001
        */}
        <Route
          path="/projects/:id"
          element={<ProjectDetailsPage />}
        />


        {/* =================================================
            GIS
        ================================================= */}

        <Route
          path="/gis-risk-map"
          element={<GISRiskMapPage />}
        />

        {/* Short alias */}
        <Route
          path="/risk-map"
          element={<GISRiskMapPage />}
        />


        {/* =================================================
            PARCEL DETAILS
        ================================================= */}

        {/* Example:
            /parcels/PL-2048
        */}
        <Route
          path="/parcels/:id"
          element={<ParcelDetailsPage />}
        />


        {/* =================================================
            AI INSIGHTS
        ================================================= */}

        {/* Main URL */}
        <Route
          path="/insights"
          element={<AIInsightsPage />}
        />

        {/* Existing URL kept for compatibility */}
        <Route
          path="/ai-insights"
          element={<AIInsightsPage />}
        />


        {/* =================================================
            ALERTS
        ================================================= */}

        <Route
          path="/alerts"
          element={<AlertsPage />}
        />


        {/* =================================================
            REPORTS
        ================================================= */}

        <Route
          path="/reports"
          element={<ReportsPage />}
        />

        <Route
          path="/reports/:id"
          element={<ReportViewPage />}
        />


        {/* =================================================
            ADMIN
        ================================================= */}

        <Route
          path="/admin"
          element={<AdminPage />}
        />

        <Route
          path="/admin/users"
          element={<AdminPage />}
        />

        <Route
          path="/admin/roles"
          element={<AdminPage />}
        />

        <Route
          path="/admin/audit-logs"
          element={<AdminPage />}
        />

        <Route
          path="/admin/system-status"
          element={<AdminPage />}
        />


        {/* =================================================
            SETTINGS
        ================================================= */}

        <Route
          path="/settings"
          element={<SettingsPage />}
        />

      </Route>


      {/* =====================================================
          404
      ===================================================== */}

      <Route
        path="/404"
        element={<NotFoundPage />}
      />

      <Route
        path="*"
        element={<NotFoundPage />}
      />

    </Routes>
  );
};