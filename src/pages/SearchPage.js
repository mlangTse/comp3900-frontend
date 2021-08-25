import Layout from '../components/Layout';
import Search from '../components/Search';

function SearchPage({ location }) {
  return (
    <Layout
      body={<Search location={location}/>}
    />
  );
}

export default SearchPage;