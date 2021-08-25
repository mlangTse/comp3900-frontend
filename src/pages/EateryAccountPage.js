import React from 'react';
import Layout from '../components/Layout';
import EateryAccount from '../components/EateryAccount';
import { extractEId } from '../utils/token';
import AuthContext from '../AuthContext';

function EateryAccountPage() {
  const token = React.useContext(AuthContext);
  const e_id = extractEId(token)
  console.log('eatery account page: ', e_id)
  return (
    <Layout
      body={<EateryAccount  e_id={e_id} />}
    />
  );
}

export default EateryAccountPage;