import React from 'react';
import Layout from '../components/Layout';
import Uservoucher from '../components/Uservoucher';
import AuthContext from '../AuthContext';

function MyvalueeatPage() {
  const token = React.useContext(AuthContext);
  return (
    <Layout
      body={<Uservoucher  token={token} />}
    />
  );
}

export default MyvalueeatPage;