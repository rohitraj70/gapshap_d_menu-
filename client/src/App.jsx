import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FavoritesProvider } from "./context/FavoritesContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import FoodDetails from "./pages/FoodDetails";
import Favorites from "./pages/Favorites";
import FavoritesList from "./pages/FavoritesList";
import OrderCheckout from "./pages/OrderCheckout";
import OrderStatus from "./pages/OrderStatus";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Orders";
import Categories from "./pages/admin/Categories";
import MenuItems from "./pages/admin/MenuItems";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <FavoritesProvider>
          <BrowserRouter>
            <Routes>
            {/* Customer routes */}
            <Route path="/" element={<Home />} />
            <Route path="/food/:id" element={<FoodDetails />} />
            <Route path="/favorites" element={<FavoritesList />} />
            <Route path="/orders" element={<Favorites />} />
            <Route path="/checkout" element={<OrderCheckout />} />
            <Route path="/order-status" element={<OrderStatus />} />
            <Route path="*" element={<Navigate to="/" replace />} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/orders" element={<Orders />} />
              <Route path="/admin/categories" element={<Categories />} />
              <Route path="/admin/menu" element={<MenuItems />} />
            </Route>
            </Routes>
          </BrowserRouter>
        </FavoritesProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
