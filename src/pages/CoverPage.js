import { Button } from '@material-ui/core';
import Layout from '../components/Layout';
import coverImg from '../static/valueEat.jpg'
import coverImg2 from '../static/Cover.jpg'

function CoverPage() {
    return (
        <Layout
            body={
            <div className='page_container' style={{ maxWidth: 1428}}>
              {/* cover div */}
              <div style={{backgroundImage: `url(${coverImg})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', height: 700, position: 'relative', backgroundPosition: 'center'}}>
                <div style={{textAlign: 'center', position: 'absolute', top: '75%', left:'50%', transform: 'translate(-50%, -50%)'}}>
                  <h1 style={{fontSize: '50px'}}>Welcome to ValueEat</h1>
                  <Button href='/home' variant='contained' size='large' style={{backgroundColor: '#fff'}} >
                    SHOP NOW
                  </Button>
                </div>
              </div>

              <div style={{padding: '10px 10px', position: 'relative', display: 'flex'}}>
                <div style={{marginTop: '20%'}}>
                  <div style={{width: '50%', top: '50%', left:'50%'}}>
                    <h3 style={{fontSize: '30px', padding: '10px 10px'}}>{`Attractive & Reasonable price. We are here.`}</h3>
                    <h3 style={{fontSize: '15px', padding: '10px 10px'}}>{`Discount vouchers up to 60%, come in and find out more!`}</h3>
                    <span style={{padding: '10px 10px'}}>
                      <Button href='/home' variant='contained' size='large' color='primary'>
                        SHOP NOW
                      </Button>
                    </span>
                  </div>
                </div>
                <div style={{width: '50%'}}>
                  <img style={{width: '100%', height: 700}} src={coverImg2}/>
                </div>
              </div>
            </div>
            }
        />
    );
}

export default CoverPage;