import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import SearchScreen from './screens/SearchScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import AdminProductListScreen from './screens/AdminProductListScreen';
import OrderListScreen from './screens/OrderListScreen';
import CouponCreateScreen from './screens/CouponCreateScreen';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { requestPermissionAndToken, onMessageListener } from './firebase';
import { useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

function App() {
  const userInfo = useSelector((state) => state.userLogin.userInfo);

  useEffect(() => {
    const saveFcmToken = async (fcmToken) => {
      try {
        if (!userInfo?.token) return;

        await axios.post(
          '/api/users/save-token/', // ✅ correct path
          { token: fcmToken },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        console.log('✅ FCM Token saved successfully');
      } catch (error) {
        console.error('❌ Error saving FCM token:', error.response?.data || error.message);
      }
    };

    requestPermissionAndToken().then((token) => {
      if (token && userInfo) {
        console.log('FCM Token:', token);
        saveFcmToken(token);
      }
    });

    onMessageListener().then((payload) => {
      console.log('🔔 Notification received in foreground:', payload);
      alert(`${payload.notification.title}: ${payload.notification.body}`);
    });
  }, [userInfo]);

  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/shipping" element={<ShippingScreen />} />
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
            <Route path="/search" element={<SearchScreen />} />
            <Route path="/order/:id" element={<OrderScreen />} />
            <Route path="/payment" element={<PaymentScreen />} />
            <Route path="/product/:id" element={<ProductScreen />} />
            <Route path="/cart/:id?" element={<CartScreen />} />
            <Route path="/admin/userlist" element={<UserListScreen />} />
            <Route path="/admin/user/:id/edit" element={<UserEditScreen />} />
            <Route path="/admin/productlist" element={<AdminProductListScreen />} />
            <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
            <Route path="/admin/orderlist" element={<OrderListScreen />} />
            <Route path="/admin/couponcreate" element={<CouponCreateScreen />} />
          </Routes>
        </Container>
      </main>
      <Footer />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </Router>
  );
}

export default App;
