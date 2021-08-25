import Layout from '../components/Layout';
import valueeat from '../../src/static/aboutvalueeat.jpg';

function AboutValueEat() {
    return (
        <>
            <Layout
                body={
                  <div style={{width: 1128, margin: '0 auto'}}>
                    <img style={{width: 1128}} src={valueeat} />
                  </div>
                }
            />
        </>
    );
}
export default AboutValueEat;