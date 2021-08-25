import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './App.css';

import HomePage from './pages/HomePage';
import VoucherPage from './pages/VoucherPage';
import DealsPage from './pages/DealsPage'
import ProfilePage from './pages/ProfilePage';
import AccountPage from './pages/AccountPage';
import EateryProfilePage from './pages/EateryProfilePage';
import EateryVoucherPage from './pages/EateryVoucherPage';
import EateryAccountPage from './pages/EateryAccountPage';
import EateryReservedPage from './pages/EateryReservedPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EateryRegisterPage from './pages/EateryRegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SearchPage from './pages/SearchPage'
import RecentlyviewPage from './pages/RecentlyviewPage'
import WishlistPage from './pages/WishlistPage'
import CartPage from './pages/CartPage'
import BalancePage from './pages/BalancePage'
import CreditcardPage from './pages/CreditcardPage'
import DishPage from './pages/DishPage'
import CheckoutPage from './pages/CheckoutPage'
import ProtectedRoute from './components/Layout/ProtectedRoute';
import MyvalueeatPage from './pages/MyvalueeatPage'
import AboutValueEatPage from './pages/AboutValueEatPage'
import CareerPage from './pages/CareerPage'
import FAQPage from './pages/FAQPage'
import { AuthProvider } from './AuthContext';
import './axios';
import CoverPage from './pages/CoverPage';

function App() {
  const [authDetails, setAuthDetails] = React.useState(
    localStorage.getItem('token')
  );

  function setAuth(token, u_id, e_id) {
    localStorage.setItem('token', token);
    localStorage.setItem('u_id', u_id);
    localStorage.setItem('e_id', e_id);
    setAuthDetails(token);
  }

  return (
    <AuthProvider value={authDetails}>
      <Router>
        <Switch>
          <Route
            exact
            path="/login"
            render={(props) => {
              return <LoginPage {...props} setAuth={setAuth} />;
            }}
          />
          <Route
            exact
            path="/register"
            render={(props) => {
              return <RegisterPage {...props} setAuth={setAuth} />;
            }}
          />
          <ProtectedRoute
            exact
            path="/eatery/register"
            render={(props) => {
              return <EateryRegisterPage {...props} setAuth={setAuth} />;
            }}
          />
          <Route exact path="/forgot_password" component={ForgotPasswordPage} />
          <Route exact path="/reset_password" component={ResetPasswordPage} />
          <Route exact path="/home" component={HomePage} />
          <Route exact path="/" component={CoverPage} />
          <Route path="/voucher" component={HomePage} />
          <Route path="/deals/:v_id" component={DealsPage} />
          <Route path="/eatery/:e_id" component={VoucherPage} />
          <Route path="/profile" component={ProfilePage} />
          <ProtectedRoute path="/account" component={AccountPage} />
          <Route path="/eateryprofile" component={EateryProfilePage} />
          <Route path="/eateryvoucher" component={EateryVoucherPage} />
          <Route path="/eateryreserved" component={EateryReservedPage} />
          <Route path="/eateryaccount" component={EateryAccountPage} />
          <ProtectedRoute path="/wishlist" component={WishlistPage} />
          <ProtectedRoute path="/recentlyviewed" component={RecentlyviewPage} />
          <Route path="/search" component={SearchPage} />
          <Route path="/cart" component={CartPage} />
          <Route path="/balance" component={BalancePage} />
          <Route path="/creditcard" component={CreditcardPage} />
          <Route path="/eaterydish" component={DishPage} />
          <Route path="/checkout" component={CheckoutPage} />
          <Route path="/myvalueeat" component={MyvalueeatPage} />
          <Route path="/aboutvalueeat" component={AboutValueEatPage} />
          <Route path="/career" component={CareerPage} />
          <Route path="/faq" component={FAQPage} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
