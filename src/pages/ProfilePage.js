import Layout from '../components/Layout';
import Profile from '../components/Profile';

function ProfilePage({ match }) {
  const { profile } = match.params;
  return (
    <Layout
      body={<Profile profile={profile} />}
    />
  );
}

export default ProfilePage;