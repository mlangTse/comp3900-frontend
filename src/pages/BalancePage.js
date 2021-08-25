import Layout from '../components/Layout';
import Balance from '../components/Payment/balance';

function BalancePage() {
  const balance = 0
    return (
        <Layout
            body={<Balance  balance={balance} />}
        />
    );
}

export default BalancePage;