import Layout from '../components/Layout';
import CreditCard from '../components/Payment/creditcard';

function CreditcardPage() {
  const creditcard = 0
  return (
      <Layout
          body={<CreditCard creditcard={creditcard} />}
      />
  );
}

export default CreditcardPage;