import axios from 'axios';
import React from 'react'
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { useHistory } from "react-router-dom";
import AuthContext from '../../AuthContext';
import { extractUId, extractEId } from '../../utils/token';

import '../../static/styles/reset.css';
import '../../static/styles/header.css';
import '../../static/styles/home.css';

import cart from '../../static/./cart.png'
import alert from "../../static/alert.png"
import logo from '../../static/logo.png'

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -3,
    top: 10,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}))(Badge);

function Header() {
  const [name, setName] = React.useState('');
  const [nitemInCart, setNitemInCart] = React.useState(0);
  const [nalert, setNalert] = React.useState(0);
  const token = React.useContext(AuthContext);
  const u_id = extractUId(token);
  console.log('Header')

  // differnet home page for login state
  React.useEffect(() => {
    console.log('Header useEffect')
    if (u_id == -1) return;
    axios
      .get('/user/profile', {
        params: {
          token,
          u_id,
        },
      })
      .then(({ data }) => {
        setName(data['name']);
        setNitemInCart(data['num_in_cart'])
      })
      .catch((err) => { });

    var profile_btn = document.getElementById('profile');
    var sign_in_btn = document.getElementById('sign_in');
    var sign_up_btn = document.getElementById('sign_up');
    if (!token) {
      console.log('no user');
      profile_btn.style.display = 'none';
      sign_in_btn.style.display = 'block';
    } else {
      console.log('user: ', token, u_id);
      profile_btn.style.display = 'block';
      sign_in_btn.style.display = 'none';
      sign_up_btn.style.display = 'none';
    }
  }, [u_id, token]);

  // user menu
  function show_user_menu(e) {
    e.preventDefault();
    var menu = document.getElementById('dropdown_menu')
    if (menu.style.display === "block") {
      menu.style.display = "none";
    } else {
      menu.style.display = "block";
    }
  }

  const handleClickAway = () => {
    const menu = document.getElementById('dropdown_menu')
    menu.style.display = "none";
  }

  // user login
  const history = useHistory();
  const sign_in = () => {
    console.log('login ing');
    history.push('/login')
  }

  // eatery register/login
  function eatery(e) {
    const e_id = extractEId(token);
    e.preventDefault();

    console.log('token:', token, 'e_id', e_id, `/eateryprofile`);
    if (e_id > -1) {
      history.push('/eateryprofile', { e_id: e_id })
    } else {
      history.push('/eatery/register')
    }
  }

  //search bar
  const [query_str, setQueryStr] = React.useState("");

  const onSearchSubmit = (e) => {
    e.preventDefault()
    window.location.href = `/search?query_str=${query_str}`;
  }

  // sign out
  const [loggedOut, setLoggedOut] = React.useState(false);

  if (loggedOut) {
    console.log('logout ing, token: ', token);
    axios.post(`/auth/logout`, { token })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => { });
    localStorage.removeItem('token');
    localStorage.removeItem('u_id');
    localStorage.clear();
    window.location.reload()
  }

  return (
    <>
      <header>
        <div className='header_wrapper'>
          <div className="wrapper page_container">
            <nav>
              <a href="/recentlyviewed"> Recently Viewed </a>
              <a href="/wishlist"> My Wishlist </a>
              <a href='#' onClick={eatery}> Sell </a>
              <a href='/faq'> Help </a>
              <a href="/register" id='sign_up'> Sign up </a>
            </nav>
          </div>

          <div className="header_top page_container">
            <a href="/home" className='logo'><img src={logo} alt='logo' /></a>
            <form action="" className="parent" onSubmit={onSearchSubmit}>
              <input type="text" className="search" placeholder="Search ValueEat" value={query_str} onChange={e => setQueryStr(e.target.value)} />
              <a className="search_btn" href={`/search?query_str=${query_str}`} />
            </form>
            <div className="user_menu">
              <a href="/cart" className='cart'>
                <StyledBadge badgeContent={nitemInCart} color="secondary">
                  <img src={cart} alt="cart" />
                </StyledBadge>
              </a>
              <a href="/home" className='alert'>
                <StyledBadge badgeContent={nalert} color="secondary">
                  <img src={alert} alt="alert" />
                </StyledBadge>
              </a>
              <ClickAwayListener onClickAway={handleClickAway}>
                <div id="user_profile" className="user_profile">
                  <button onClick={sign_in} className='sign_in' id='sign_in'> sign in </button>
                  <button onClick={show_user_menu} className='profile' id='profile'> {name} </button>
                  <div id='dropdown_menu' className="dropdown_menu">
                    <a href="/myvalueeat">
                      <span>My ValueEat</span>
                    </a>
                    <a href="/wishlist">
                      <span>My Wishlist</span>
                    </a>
                    <a href={`/account`}>
                      <span>Account</span>
                    </a>
                    <a href={`/profile`}>
                      <span>Profile</span>
                    </a>
                    <a href="/" onClick={() => { setLoggedOut(true); }}>
                      <span>Sign Out</span>
                    </a>
                  </div>
                </div>
              </ClickAwayListener>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;