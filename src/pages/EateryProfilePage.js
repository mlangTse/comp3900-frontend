import React from 'react';
import Layout from '../components/Layout';
import EateryProfile from '../components/EateryProfile';
import { extractEId } from '../utils/token';
import AuthContext from '../AuthContext';

function EateryProfilePage() {
  const token = React.useContext(AuthContext);
  const e_id = extractEId(token)
  console.log('eatery profile page: ', e_id)
  return (
    <Layout
      body={<EateryProfile  e_id={e_id} />}
    />
  );
}

export default EateryProfilePage;