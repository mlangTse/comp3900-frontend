import React from 'react';
import Layout from '../components/Layout';
import EateryVoucher from '../components/EateryVoucher';
import { extractEId } from '../utils/token';
import AuthContext from '../AuthContext';

function EateryVoucherPage({location}) {
  const token = React.useContext(AuthContext);
  const e_id = extractEId(token)
  const urlParams = new URLSearchParams(location.search);
  var page = urlParams.get('page');
  if (page == null) page = 1
  console.log('eatery voucher Npage: ', page)
  console.log('eatery voucher page: ', e_id)
  return (
    <Layout
      body={<EateryVoucher  e_id={e_id} page={page} />}
    />
  );
}

export default EateryVoucherPage;