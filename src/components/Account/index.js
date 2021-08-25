import axios from 'axios';
import React from 'react';
import AuthContext from '../../AuthContext';
import { extractUId } from '../../utils/token';
import ProfileHeader from '../Layout/ProfileHeader';
import '../../static/styles/account.css';

import cash from '../../static/./cash.png'
import creditcard from "../../static/creditcard.png"

function Account() {
  const token = React.useContext(AuthContext);
  const u_id = extractUId(token);
  console.log(token, u_id)

  return (
    <div>
      <ProfileHeader/>
      <div style={{ maxWidth: '1228px' }} className='page_container'>
        <form class="payment">
          <h2>My Payment Methods</h2>
          <div class="payment_method">
            <div class="payment_balance">
              <img src={cash} alt='cash' />
              <a href="/balance">
                <span>Balance</span>
              </a>
            </div>
            <div class="payment_card">
              <img src={creditcard} alt='creditcard' />
              <a href="/creditcard">
                <span>Credit Cards/Debit Cards</span>
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Account;