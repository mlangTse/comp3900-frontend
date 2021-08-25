import React from 'react';
import Layout from '../components/Layout';
import EateryReserved from '../components/EateryReserved';
import { extractEId } from '../utils/token';
import AuthContext from '../AuthContext';

function EateryReservedPage({location}) {
  const token = React.useContext(AuthContext);
  const e_id = extractEId(token)
  const urlParams = new URLSearchParams(location.search);
  var page = urlParams.get('page')
  if (page == null) page = 1
  console.log('eatery reserved Npage: ', page)
  console.log('eatery reserved page: ', e_id)
  return (
    <Layout
      body={<EateryReserved  e_id={e_id} page={page} />}
    />
  );
}

export default EateryReservedPage;