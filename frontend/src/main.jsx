import { createRoot } from "react-dom/client";
import "./index.css";
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Profile from "./pages/Profile.jsx";
import NotFound from "./pages/not-found.jsx";
import AllAccounts from "./pages/AllAccounts.jsx";
import LevelWrapper from "./components/LevelWrapper";
import UserManagement from "./pages/UserManagement";
import Config from "./pages/Config";
import InventoryManagement from "./pages/InventoryManagement";
import RequestPage from "./pages/RequestPage";
import FlowManagement from "./pages/FlowManagement";
import RequestStartCreatePage from "./pages/RequestStartCreatePage";
import RequestSuccessPage from "./pages/RequestSuccessPage";
import FlowDesignEdit from "./pages/FlowDesignEdit";
import FlowDesignCreate from "./pages/FlowDesignCreate";
import SourceDataOption from "./pages/SourceDataOption";
import ProcessPage from "./pages/ProcessPage";
import StatusFullfillmentPage from "./components/StatusFullfillmentPage";
import RequestEditPage from "./pages/RequestEditPage";
import OnlyPreview from "./pages/OnlyPreview";
import SuperTenantPage from "./pages/SuperTenantPage";
import DepartmentManagement from "./pages/DepartmentManagement";
import LibraryManagement from "./pages/LibraryManagement";
import DownloadProcessPage from "./pages/DownloadProcessPage";
import DepartmentStatistics from "./pages/DepartmentStatistics";
import LandingPage from "./pages/LandingPage";
import UpdateLogsPage from "./pages/UpdateLogsPage";
import DocumentationPage from "./pages/DocumentationPage";
// import RegisterPage from "./pages/RegisterPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route
        path="/request/create/:id" //templateId
        element={<RequestStartCreatePage />}
      />
      <Route path="/request/success" element={<RequestSuccessPage />} />
      <Route path="/" element={<LevelWrapper />}>
        <Route path="/home" element={<Home />} />
        <Route
          path="/pengelolaan/inventory"
          element={<InventoryManagement />}
        />

        {/* menu User awam */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/process/:instanceId?" element={<ProcessPage />} />
        <Route path="/request" element={<RequestPage />} />
        <Route
          path="/request/edit/:instanceId" //instanceId
          element={<RequestEditPage />}
        />

        <Route
          path="/status/fulfillment/:instanceId"
          element={<StatusFullfillmentPage />}
        />

        <Route
          index={true}
          path="/status/isOnlyPreview/:instanceId"
          element={<OnlyPreview />}
        />
        <Route
          index={true}
          path="/process/download"
          element={<DownloadProcessPage />}
        />

        {/* menu IT and admin */}
        <Route path="/management/user" element={<UserManagement />} />
        <Route path="/management/config/app" element={<Config />} />
        <Route path="/management/flow" element={<FlowManagement />} />
        <Route
          path="/management/department"
          element={<DepartmentManagement />}
        />
        <Route path="/superadmin/management" element={<SuperTenantPage />} />
        <Route
          path="/superadmin/department-stats"
          element={<DepartmentStatistics />}
        />
        <Route
          path="/management/sourceData/options"
          element={<SourceDataOption />}
        />
        <Route path="/management/flow/edit/:id" element={<FlowDesignEdit />} />
        <Route
          path="/management/flow/create/design"
          element={<FlowDesignCreate />}
        />
        <Route
          path="/management/LibraryManagement"
          element={<LibraryManagement />}
        />
        <Route path="/all_account" element={<AllAccounts />} />
      </Route>
      <Route index={true} path="/login" element={<Login />} />
      <Route index={true} path="/update-logs" element={<UpdateLogsPage />} />
      <Route
        index={true}
        path="/documentation"
        element={<DocumentationPage />}
      />

      <Route index={true} element={<LandingPage />} />
      {/* <Route index={true} path="/register" element={<RegisterPage />} /> */}

      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>,
);
