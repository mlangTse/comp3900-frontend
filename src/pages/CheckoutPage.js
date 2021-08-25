import Layout from '../components/Layout';
import Checkout from '../components/Checkout';

function CheckoutPage() {
  return (
    <Layout
      body={<Checkout />}
    />
  );
}

export default CheckoutPage;