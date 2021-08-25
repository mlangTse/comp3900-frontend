import Layout from '../components/Layout';
import Deal from '../components/Deal';

function DealsPage({ location }) {
  const { e_id, v_id } = location.state;
  console.log('deal v_id: ', v_id)
  console.log('deal e_id: ', e_id)
  return (
    <Layout
      body={<Deal e_id={e_id} v_id={v_id}/>}
    />
  );
}

export default DealsPage;