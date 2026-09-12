import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Category from "./pages/Category";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import Users from "./pages/Users";
import Payment from "./pages/Payment";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import Register from "./pages/Register";
import OrderTracking from "./pages/OrderTracking";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />
         <Route path="/" element={<Home />}/>
        <Route path="/dashboard" element={ <PrivateRoute> <Layout><Dashboard /></Layout> </PrivateRoute> } />
        <Route path="/products" element={ <PrivateRoute> <Layout><Products /></Layout> </PrivateRoute> } />
        <Route path="/register" element={<Register />} />
        <Route path="/orders/:orderId/track" element={<OrderTracking />} />
        <Route path="/orders" element={ <PrivateRoute> <Layout><Orders /></Layout> </PrivateRoute> } />
        <Route path="/category" element={ <PrivateRoute> <Layout><Category /></Layout> </PrivateRoute> } />
        <Route path="/users" element={ <PrivateRoute> <Layout><Users /></Layout> </PrivateRoute> } />
        <Route path="/payment/:id" element={ <PrivateRoute> <Layout><Payment /></Layout> </PrivateRoute> } />
        <Route path="/checkout/:id" element={ <PrivateRoute> <Layout> <Checkout /> </Layout> </PrivateRoute> } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;



