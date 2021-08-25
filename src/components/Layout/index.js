import React from 'react';
import Header from './Header';
import Body from './Body';
import Footer from './Footer';

function Layout({ body }) {

    return (
      <div style={{minHeight: '100vh', position: 'relative'}}>
        <Header/>
        <Body>{body}</Body>
        <Footer/>
      </div>
    );
}

export default Layout;