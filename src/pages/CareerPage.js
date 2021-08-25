import Layout from '../components/Layout';
import career from '../../src/static/career.png';

function CareerValueEat() {
    return (
        <>
            <Layout
                body={
                  <div style={{width: 1128, margin: '0 auto'}}>
                    <img src={career} style={{ width: 1128 }}/>
                  </div>
                }
            />
        </>
    );
}
export default CareerValueEat;