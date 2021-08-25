import { Result, Button } from 'antd';

function Checkout() {
    return (
        <Result
            status="success"
            title="Successfully Purchased !"
            subTitle="Thank you for your payment. Please check your code in Myvalueeat"
            extra={[
                <Button href='/home' type="primary" key="console">
                    Back to home
                </Button>,
                <Button href='/myvalueeat' key="buy">Check code</Button>,
            ]}
        />
    );
}
export default Checkout;