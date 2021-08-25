import axios from 'axios';
import React from 'react';

import AuthContext from '../../AuthContext';
import { showRating } from '../showRating';
import { Buynow } from '../Buy';
import { ShowReview } from '../ShowReview/index.js';
import { Carthandle } from '../AddtoCart';
import EateryInfo from './EateryInfo.js'
import {notification,message } from 'antd';
import location from '../../static/locationIron.png'
import avatar from '../../static/logo.png'
import '../../static/styles/voucher.css'

function Voucher({ e_id }) {
  const token = React.useContext(AuthContext);
  const [eateryDetails, setEateryDetails] = React.useState({});
  const [selectedVoucher, setVoucher] = React.useState('');
  const [cart, setCart] = React.useState([]);
  var pos = 0

  React.useEffect(() => {
    axios.get(`/get/eatery`, { params: { token, e_id } })
      .then(({ data }) => {
        setEateryDetails(data)
        addImage(data['photowall'])
        const list = document.getElementById('eatery_vouchers_list')

        Array.from(data['voucher_list']).forEach(elm => {
          addVoucher(list, elm)
        })

        const setRating = document.getElementById('eatery_title_name_rating')
        setRating.appendChild(showRating(data['rating'], data['n_rating']))
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

  function addImage(image_list) {
    if (image_list.length == 0) return
    const eatery_images = document.getElementById('eatery_image_list')
    for (const img of image_list) {
      let image = new Image()
      image.src = img['img_src']
      eatery_images.appendChild(image)
    }

    setTimeout(() => {
      const img_list = eatery_images.getElementsByTagName('img')
      let positions = []
      let last_img = img_list[img_list.length - 1]

      const firstImgPadding = (eatery_images.clientWidth - img_list[0].getBoundingClientRect().width) / 2

      if (img_list.length == 2) {
        positions.push(-firstImgPadding)
        positions.push(last_img.getBoundingClientRect().left - firstImgPadding/2 - ((eatery_images.clientWidth - last_img.getBoundingClientRect().width) / 2))
      } else {
        for (let img of img_list) {
          var p = (eatery_images.clientWidth - img.getBoundingClientRect().width) / 2
          if (img == img_list[0]) {
            positions.push(-p)
          } else {
            positions.push(img.getBoundingClientRect().left + firstImgPadding/2 - p)
          }

          if (last_img.getBoundingClientRect().right - img.getBoundingClientRect().left < img_list.clientWidth) break
        }
      }

      // last image padding
      last_img.style.cssText = `margin-right: ${(eatery_images.clientWidth - last_img.getBoundingClientRect().width) / 2}px;`
      // first image padding
      img_list[0].style.cssText =  `margin-left: ${firstImgPadding}px;`

      const right_btn = document.getElementById('right_btn')
      right_btn.onclick = () => {
        if (pos < positions.length - 1) pos += 1
        eatery_images.scroll(positions[pos], 0)
      }
      const left_btn = document.getElementById('left_btn')
      left_btn.onclick = () => {
        if (pos > 0) pos -= 1
        eatery_images.scroll(positions[pos], 0)
      }
    }, 100);

  }

  function addVoucher(list, data) {
    const div = document.createElement('div')
    div.className = 'aVoucher'
    div.id = `${data['v_id']}`
    div.onclick = () => {
      setVoucher(div.id)
      const allVoucher = document.getElementById('eatery_vouchers_list').getElementsByClassName('aVoucher')
      Array.from(allVoucher).forEach((v) => {
        v.style.cssText = `#${v.id} { border: none } .eatery_vouchers_list > div:hover { border: 1px solid #1890ff; }`
      }
    )
      div.style.cssText = 'border: 1px solid #1890ff;'
      const addcartbtn = document.getElementById('addcartbtn')
      if (data['is_in_cart']) {
        addcartbtn.innerHTML = "Remove from Cart"

      } else {
        addcartbtn.innerHTML = "Add to Cart"

      }
    }

    const title_div = document.createElement('div')
    addDetail(title_div, [{ 'class': 'title', 'value': data.title }])

    const price_div = document.createElement('div')
    price_div.className = 'price_container'
    addDetail(price_div, [{ 'class': 'price', 'value': data.price },
    { 'class': 'discount', 'value': data.discount },
    { 'class': 'off', 'value': `${data.discount_ratio}%&nbsp;Off` }
    ])

    const extra_div = document.createElement('div')
    addDetail(price_div, [{ 'class': 'bought', 'value': `${data.n_bought}+&nbsp;bought` }])

    div.append(title_div)
    div.append(price_div)
    div.append(extra_div)

    list.appendChild(div)
  }

  function addDetail(div, data) {
    for (let i of data) {
      const elm = document.createElement('span')
      elm.innerHTML = i['value']
      elm.className = i['class']

      div.appendChild(elm)
    }
  }

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
    if (selectedVoucher == ''){
      message.error({content:'You have not choose any voucher'});
    }else{
      var flag = true
      Array.from(cart).forEach(elm => {
        console.log(elm['v_id'],selectedVoucher)
        if(elm['v_id'] == selectedVoucher){
          flag = false
          let errormessage = 'This voucher is already in your cart! Please use checkout in cart, or book now after remove from cart!'
          openNotificationWithIcon('error',errormessage)
        }
      })
      if(flag){
        axios
        .post(`/user/myvouchers/addvouchers`, { token:token, v_id:selectedVoucher})
          .then(() => {
            message.success({content:'Book success! Checkout your Voucher!'});
          })
          .catch((err) => {
          });
      }
    }
  }

  function addvoucher(){
    if (selectedVoucher == ''){
      message.error({content:'You have not choose any voucher'});
    }else{
      Carthandle(token, selectedVoucher)
    }

  }

  return (
    <div style={{ maxWidth: '1228px' }} className='page_container'>

      <div id='eatery_body' className='eatery_body'>
        <button id='right_btn' className='right_btn'></button>
        <button id='left_btn' className='left_btn'></button>
        <div className='eatery_image_list' id='eatery_image_list'>
        </div>
      </div>

      <div className='eatery_body'>
        <div className='eatery_info'>
          <div id='eatery_title'>
            <div id='eatery_title_name_rating'>
              <img style={{height: 50, transform: 'translate(0, -10px)', borderRadius: '50%', marginRight: 20}} src={(eateryDetails.image_src == null || eateryDetails.image_src == '') ? avatar:eateryDetails.image_src}/>
              <h1>{eateryDetails.e_name}</h1>
            </div>
            <img src={location} style={{height: 20, width: 20, transform: 'translate(0, -15%)'}}/>
            <a href='#viewMap' style={{ color:'#1890ff', fontSize: 'large'}}>{eateryDetails.address}</a>

            <div style={{ wordBreak: 'break-word', fontSize: 'large', marginTop: 20}} >
              {(eateryDetails.description == '' || eateryDetails.description == null) ? 'This guy is lazy and left nothing':eateryDetails.description}
            </div>

            <div id='viewMap'>
              {
                (Object.keys(eateryDetails).length === 0) ?
                <></>:<EateryInfo eatery={eateryDetails} e_id = {e_id}/>
              }
            </div>
          </div>
          <div id='Rating' style={{fontSize: '2.4rem', fontWeight: '700'}}>
            Customer Review
          </div>
          {/* show rating */}
          {
            (eateryDetails.n_rating == null || eateryDetails.n_rating <= 5) ? <></>:
            <div style={{ display: 'flex' }}>
              <span style={{fontSize: '2.6rem', fontWeight: '700'}}>{eateryDetails.rating}</span>
              <div style={{marginLeft: 10, transform: 'translate(0, 10%)'}}>
                <span className='Stars' style={{ display: 'block', '--star-size':'30px', '--rating': `${eateryDetails.rating}`}}></span>
                <span style={{fontSize: 'large', fontWeight: 'lighter'}}>{eateryDetails.n_rating}Ratings</span>
              </div>
            </div>
          }
          <ShowReview e_id={e_id} reply={false} />
        </div>

        <div className='eatery_vouchers_bar'>
          <div className='eatery_vouchers'>
            <div className='eatery_vouchers_list' id='eatery_vouchers_list'>
            </div>
            <button style={{ backgroundColor: '#2999f5', marginTop: '10px' }} onClick={Bookvoucher}>
              Book Now
            </button>
            <button style={{ color: '#2999f5' }} onClick={addvoucher} id='addcartbtn'>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Voucher;