import axios from 'axios';
import React from 'react';
import AuthContext from '../../AuthContext';
import { extractUId } from '../../utils/token';

function Wishlist() {
  const token = React.useContext(AuthContext);
  const u_id = extractUId(token);
  console.log(token, u_id)

  return (
    <>

    </>
  );
}

export default Wishlist;