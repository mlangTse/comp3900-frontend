import faq from '../../src/static/faq.png';
import Layout from '../components/Layout';

function FAQ() {
    return (
        <>
            <Layout
                body={<img src={faq} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }} />}
            />
        </>
    );
}
export default FAQ;