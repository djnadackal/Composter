import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

//Pages
import LandingPage from "../pages/LandingPage.jsx";
import Docs from "../pages/Docs.jsx";

import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import DashboardHome from "../pages/Dashboard/DashboardHome.jsx";
import ComponentsList from "../pages/Dashboard/ComponentsList.jsx";
import ComponentDetail from "../pages/Dashboard/ComponentDetail.jsx";
import UploadComponent from "../pages/Dashboard/UploadComponent.jsx";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/*Public Routes*/}
        <Route path="/" element={<LandingPage />} />
        <Route path="/docs" element={<Docs />} />

        {/*Dashboard Routes*/}
        <Route path="/app" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="components" element={<ComponentsList />} />
          <Route path="components/:id" element={<ComponentDetail />} />
          <Route path="upload" element={<UploadComponent />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
