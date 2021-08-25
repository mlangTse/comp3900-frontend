import axios from 'axios';
import React from 'react';

import { showRating } from '../showRating';
import { Buynow } from '../Buy';
import { Carthandle } from '../AddtoCart';
import { message,notification} from 'antd';
import AuthContext from '../../AuthContext';
import logo from '../../static/valueEat.jpg'
import '../../static/styles/deal.css'

function Deal({ e_id, v_id }) {
  const [voucherDetails, setVoucherDetails] = React.useState({});
  const [cart, setCart] = React.useState([]);
  const token = React.useContext(AuthContext);

  React.useEffect(() => {
    axios
      .get(`/get/deal`, { params: { token, e_id: e_id, v_id: v_id } })
      .then(({ data }) => {
        const eatery_title = document.getElementById('eatery_title')
        const voucher_image = document.getElementById('deal_image_list')
        var addcartbtn = document.getElementById('addcartbtn')
        if (data['flag']) addcartbtn.innerHTML = 'Remove from Cart'
        setVoucherDetails(data);
        let img = new Image()
        img.src = data['image']
        voucher_image.appendChild(img)
        eatery_title.appendChild(showRating(data['rating'], data['n_rating']))
      })
      .catch((err) => {
        console.error(err);
      });
  }, [])

  React.useEffect(() => {
    axios
    .get(`/user/getcart`, { params: { token }})
      .then(({ data }) => {
        setCart(data['cart_list'])
      })
      .catch((err) => {
      });
  }, [])

  const openNotificationWithIcon = (type,description) => {
    notification[type]({
      message: 'Oops!',
      description:description,
      style: {
        'background-color': '#fff2f0',
        border: '1px solid #ffccc7'
      }
    });
  };

  function Bookvoucher(){
      var flag = true
      Array.from(cart).forEach(elm => {
        console.log(elm['v_id'],v_id)
        if(elm['v_id'] == v_id){
          flag = false
          let errormessage = 'This voucher is already in your cart! Please use checkout in cart, or book now after remove from cart!'
          openNotificationWithIcon('error',errormessage)
        }
      })
      if(flag){
        axios
        .post(`/user/myvouchers/addvouchers`, { token:token, v_id:v_id})
          .then(() => {
            message.success({content:'Book success! Checkout your Voucher!'});
          })
          .catch((err) => {
          });
      }
  }

  return (
    <div style={{ maxWidth: '1228px' }} className='page_container'>
      <div className='deal_title'>
        <div id='eatery_title'>
          <h1>{voucherDetails.e_name}</h1>
        </div>
        <h2>{voucherDetails.address}</h2>
        <h2>{voucherDetails.title}</h2>
      </div>

      <div id='deal_body' className='deal_body'>
        <div className='deal_image_list' id='deal_image_list'>
        </div>

        <div className='deal_vouchers'>
          <ul>
            <li>
              <input type="radio" id={v_id} checked />
              <label for={v_id}>
                <div>
                  <div>
                    <span style={{ fontSize: 'medium', fontWeight: 'bold' }}>{voucherDetails.title}</span>
                  </div>
                  <div style={{ fontSize: 'large' }}>
                    <span style={{ textDecoration: 'line-through', paddingRight: 3 }}>{voucherDetails.price}</span>
                    <span style={{ color: '#318200', paddingRight: 3 }}>{voucherDetails.discount}</span>
                    <span style={{ fontSize: 'medium', backgroundColor: "#eafcde", color: '#318200' }}>{voucherDetails.discount_ratio}%&nbsp;Off</span>
                  </div>
                  <div>
                    <span >{(voucherDetails.n_bought % 100) * 100}+&nbsp;bought</span>
                  </div>
                </div>
              </label>
            </li>
          </ul>

          <div className='deal_status'>
            {/*<p sty+

            0.
            +364521e={{color: 'red'}}>Sale ends in:</p>*/}
            <p>Want more vouchers?&nbsp; <a href={`/eatery/${e_id}`}>CILCK ME!!</a></p>
          </div>

          <button style={{ backgroundColor: '#2999f5', marginTop: '10px' }} onClick={Bookvoucher}>
            Book Now
          </button>
          <button style={{ color: '#2999f5' }} onClick={() => Carthandle(token, v_id)} id="addcartbtn">
            Add to Cart
          </button>
        </div>
      </div>

      <div className='deal_info'>
        <h1 style={{ fontSize: 'x-large' }}>Deal Details</h1>
        <p>{voucherDetails.description}</p>
      </div>

    </div>
  )
}

export default Deal