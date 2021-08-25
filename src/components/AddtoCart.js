import axios from 'axios';
import { message } from 'antd';

export function Carthandle(token, v_id) {
  console.log('vid: ', v_id)
  var addcartbtn = document.getElementById('addcartbtn')
  if (addcartbtn.innerHTML == 'Add to Cart') {
    console.log('added')
    AddtoCart(token, v_id)
    
  }
  else if (addcartbtn.innerHTML == 'Remove from Cart') {
    RemovefromCart(token, v_id)
    
  }
}

function AddtoCart(token, v_id) {
    axios
        .post('/user/addcart', { token, v_id: v_id })
        .then(() => {
          window.location.reload()
          // message.success({content:'The voucher you selected has been added from cart!'});
        })
        .catch((err) => {
            console.error(err);
        });
}

function RemovefromCart(token, v_id) {
    axios
        .post('/user/removevoucher', { token, v_id: v_id })
        .then(() => {
          window.location.reload()
          // message.success({content:'The voucher you selected has been removed from cart!'});
        })
        .catch((err) => {
            console.error(err);
        });
}
