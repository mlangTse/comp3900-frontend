import React from 'react';
import '../../static/styles/reset.css';
import '../../static/styles/footer.css';
import logo from '../../static/logo.png'

function Footer() {
  return (
    <footer className='page_container'>
      <div className='footer_container'>
        <div style={{ width: 260, padding: '8px 0' }}>
          <img src={logo} alt='logo' />
        </div>
        <div>
          <span style={{ paddingLeft: 0 }}>About Us</span>
          <a href='/aboutvalueeat'>About ValueEat</a>
          <a href='/aboutvalueeat'>Managment Team</a>
          <a href='/career'>Jobs</a>
        </div>
        <div>
          <span>Contact Us</span>
          <a href="https://www.facebook.com/jinning.liu.79">Online Service</a>
          <a href="https://www.facebook.com/jinning.liu.79">Business Cooperation</a>
        </div>
        <div>
          <span>More</span>
          <a href="https://www.facebook.com/jinning.liu.79">Customer Support</a>
          <a href='/faq'>Refund Policies</a>
          <a href='/faq'>FAQ</a>
        </div>
        <div>
          <span>Follow Us</span>
          <a href="https://www.facebook.com/jinning.liu.79">Facebook</a>
          <a href="https://www.instagram.com/kyahahale">Instagram</a>
          <a href="https://www.twitter.com/GANGKN11">Twitter</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;