import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./client/pages/Home";
import Menu from "./client/pages/Menu";
import Checkout from "./client/pages/Checkout";
import Orders from "./client/pages/Orders";
import OrderSuccess from "./client/pages/OrderSuccess";
import Review from "./client/pages/Review";

import Login from "./owner/pages/Login";
import Dashboard from "./owner/pages/Dashboard";
import MenuManagement from "./owner/pages/MenuManagement";
import OwnerOrders from "./owner/pages/Orders";
import OwnerReviews from "./owner/pages/Review";
import Settings from "./owner/pages/Settings";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./owner/components/AdminLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =====================================================
            CLIENT
        ====================================================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/menu"
          element={<Menu />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/orders"
          element={<Orders />}
        />

        <Route
          path="/order-success/:id"
          element={<OrderSuccess />}
        />

        <Route
          path="/review/:id"
          element={<Review />}
        />

        {/* =====================================================
            OWNER LOGIN
        ====================================================== */}

        <Route
          path="/owner/login"
          element={<Login />}
        />

        {/* =====================================================
            OWNER PROTECTED AREA
        ====================================================== */}

        <Route
          element={<ProtectedRoute />}
        >
          <Route
            element={<AdminLayout />}
          >
            {/* Dashboard */}

            <Route
              path="/owner/dashboard"
              element={<Dashboard />}
            />

            {/* Orders */}

            <Route
              path="/owner/orders"
              element={<OwnerOrders />}
            />

            {/* Menu */}

            <Route
              path="/owner/menu"
              element={<MenuManagement />}
            />

            {/* Reviews */}

            <Route
              path="/owner/reviews"
              element={<OwnerReviews />}
            />

            {/* Settings */}

            <Route
              path="/owner/settings"
              element={<Settings />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;