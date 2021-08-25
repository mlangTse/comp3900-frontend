import Layout from '../components/Layout';
import Voucher from '../components/Voucher';

function VoucherPage({ match }) {
  const { e_id } = match.params;
  return (
    <Layout
      body={<Voucher e_id={e_id}/>}
    />
  );
}

export default VoucherPage;