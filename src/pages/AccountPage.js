import Layout from '../components/Layout';
import Account from '../components/Account';

function AccountPage({ match }) {
  const { profile } = match.params;
  return (
    <Layout
      body={<Account profile={profile}/>}
    />
  );
}

export default AccountPage;