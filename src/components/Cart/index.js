import axios from 'axios';
import React from 'react';
import AuthContext from '../../AuthContext';
import { extractUId } from '../../utils/token';
import '../../static/styles/cart.css';
import Button from '@material-ui/core/Button';
import { List } from 'antd';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
function Cart() {
  // const [totalprice, setTotalPrice] = React.useState(0);
  const history = useHistory();
  const [cartdetail, setCartDetail] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const token = React.useContext(AuthContext);
  const u_id = extractUId(token);
  const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
  }));
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  // const cart = document.getElementById('cart_list')
  // const urlParams = new URLSearchParams(location.search);
  // var page = urlParams.get('page');
  // if (page == null) page = 1


  React.useEffect(() => {
    axios
      .get('/user/getcart', { params: { token } })
      .then(({ data }) => {
        setLoading(false)
        setCartDetail(data)
        const cart = document.getElementById('cart_list')
        if (data['cart_list'].length > 0) {
          Array.from(data['cart_list']).forEach(elm => {
            cart.appendChild(showVoucher(elm))
          })
        }
        const checkbtn = document.getElementById('check_outbtn')
        checkbtn.onclick = () => {
          if (data['cart_list'].length == 0) {
            setOpen(true);
          } else {
            setLoading(true)
            Array.from(data['cart_list']).forEach(elm => {
              checkoutvoucher(token, elm['v_id'])
            })
            setTimeout(function () {
              while (cart.firstChild) {
                cart.removeChild(cart.lastChild)
              }
              setLoading(false)
              history.push(`/checkout`)
            }, 2000);
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  function checkoutvoucher(token, v_id) {
    axios
      .post('/user/removevoucher', { token, v_id })
      .then(() => {
        axios
          .post(`/user/myvouchers/addvouchers`, { token: token, v_id: v_id })
          .then(() => {

            // message.success({ content: 'Book success! Checkout your Voucher!' });
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function showVoucher(data) {
    const item_card = document.createElement('div')
    item_card.className = 'item_container'
    item_card.id = data['v_id']

    // const v_id = setVid(data['cart_list']['v_id'])
    const v_id = document.createElement('span')
    v_id.value = data['v_id']

    const eatery_area = document.createElement('div')
    eatery_area.className = 'eatery_area'
    const eateryname = document.createElement('span')
    eateryname.textContent = data['e_name']
    eateryname.className = 'item_eatery_name'
    eatery_area.appendChild(eateryname)
    item_card.appendChild(eatery_area)

    const image_area = document.createElement('div')
    image_area.className = 'item_image_area'
    const img = new Image()
    img.src = data['img']

    img.className = 'item_image'
    image_area.appendChild(img)
    item_card.appendChild(image_area)

    const info_area = document.createElement('div')
    info_area.className = 'info_area'

    const title = document.createElement('span')
    title.textContent = data['title']
    title.className = 'item_title'
    info_area.appendChild(title)

    const date = document.createElement('span')
    date.textContent = data['date']
    date.className = 'item_date'
    info_area.appendChild(date)

    const available_time = document.createElement('span')
    available_time.textContent = data['available_time']
    available_time.className = 'item_available_time'
    info_area.appendChild(available_time)

    item_card.appendChild(info_area)

    const price_area = document.createElement('div')
    price_area.className = 'price_area'
    const price_zoom = document.createElement('div')
    price_zoom.className = 'price_zoom'

    const price = document.createElement('span')
    price.textContent = `$ ${data['price']}`
    price.className = 'item_price'
    price_zoom.appendChild(price)

    const newprice = document.createElement('span')
    newprice.textContent = data['newprice']
    newprice.className = 'item_newprice'
    newprice.value = data['newprice']
    price_zoom.appendChild(newprice)
    price_area.appendChild(price_zoom)

    const act_zoom = document.createElement('div')
    act_zoom.className = 'act_zoom'

    const amount_rest = document.createElement('span')
    amount_rest.innerHTML = `${data['quantity']} rests`
    amount_rest.value = parseInt(data['quantity'])
    amount_rest.className = 'item_rest'

    // const addcartbtn = document.createElement('button')
    // addcartbtn.innerHTML = '+'
    // addcartbtn.id = 'num-add'
    // addcartbtn.className = 'item_add'


    // const number_ofitem = document.createElement('input')
    // number_ofitem.id = 'input-num'
    // number_ofitem.value = 1
    // number_ofitem.type = 'text'
    // number_ofitem.maxLength = '3'
    // number_ofitem.className = 'input_num'
    // number_ofitem.onkeypress = `return ${isNumberKey(event)}`

    // console.log(`totalprice: ${totalprice}`)
    // console.log(`newprice: ${parseInt(data['newprice'])}`)
    //<li><input type="text" class="input-num" id="input-num" value="0" /></li>

    // const minuscartbtn = document.createElement('button')
    // minuscartbtn.innerHTML = '-'
    // minuscartbtn.id = 'num-minus'
    // minuscartbtn.className = 'item_minus'


    const item_act_area = document.createElement('div')
    item_act_area.className = 'item_act_area'

    // var itemprice = document.createElement('span')
    // itemprice.className = 'item_totalprice'
    // itemprice.value = parseInt(number_ofitem.value) * parseInt(newprice.value)
    // itemprice.innerHTML = `$&nbsp;${itemprice.value}`
    // setTotalPrice(totalprice => totalprice + itemprice.value)
    // console.log(`itemprice: ${itemprice.value}`)
    // console.log(`totalprice: ${totalprice}`)

    const deletebtn = document.createElement('Button')
    deletebtn.innerHTML = 'Remove'
    deletebtn.className = 'item_remove'
    deletebtn.variant = "contained"
    deletebtn.color = "secondary"


    // const addbtn = document.createElement('button')
    // addbtn.innerHTML = 'Add to wish'
    // addbtn.onClick = addtowish()
    // addbtn.className = 'item_add_wish'

    // console.log(data)
    // addcartbtn.onclick = () => {
    //   console.log("pressed add")
    //   console.log(amount_rest.value)
    //   console.log(number_ofitem.value)
    //   if (number_ofitem.value < amount_rest.value) {
    //     number_ofitem.value = parseInt(number_ofitem.value) + 1;
    //     setTotalPrice(totalprice => totalprice + parseInt(newprice.value))
    //     itemprice.value = number_ofitem.value * parseInt(newprice.value)
    //     itemprice.innerHTML = `$&nbsp;${itemprice.value}`
    //     console.log(`itemprice: ${itemprice.value}`)
    //     console.log(`totalprice: ${totalprice}`)
    //   }
    //   else {
    //     return
    //   }
    // }

    // number_ofitem.onclick = () => {
    //   setTotalPrice(totalprice => totalprice - parseInt(itemprice.value))
    //   if (number_ofitem.value <= 0) {
    //     number_ofitem.value = 0;
    //     itemprice.value = 0
    //   }
    //   else if (number_ofitem.value > amount_rest.value) {
    //     number_ofitem.value = parseInt(amount_rest.value);
    //     itemprice.value = number_ofitem.value * parseInt(newprice.value)
    //     setTotalPrice(totalprice => totalprice + parseInt(itemprice.value))
    //   }
    //   else {
    //     itemprice.value = number_ofitem.value * parseInt(newprice.value)
    //     setTotalPrice(totalprice => totalprice + parseInt(itemprice.value))
    //   }
    // }


    // minuscartbtn.onclick = () => {
    //   console.log("pressed minus")
    //   console.log(number_ofitem.value)
    //   if (number_ofitem.value <= 0) {
    //     number_ofitem.value = 0;
    //   } else {
    //     number_ofitem.value = parseInt(number_ofitem.value) - 1;
    //     setTotalPrice(totalprice => totalprice - parseInt(newprice.value))
    //     itemprice.value = number_ofitem.value * parseInt(newprice.value)
    //     itemprice.innerHTML = `$&nbsp;${itemprice.value}`
    //     console.log(`itemprice: ${itemprice.value}`)
    //     console.log(`totalprice: ${totalprice}`)
    //   }
    // }

    deletebtn.onclick = () => {
      axios
        .post('/user/removevoucher', { token, v_id: data['v_id'] })
        .then(() => {
          const cart = document.getElementById('cart_list')
          // setTotalPrice(totalprice => totalprice - parseInt(itemprice.value))
          cart.removeChild(item_card)
          window.location.reload()
        })
        .catch((err) => {
          console.error(err);
        });
    }

    // act_zoom.appendChild(addcartbtn)
    // act_zoom.appendChild(number_ofitem)
    // act_zoom.appendChild(minuscartbtn)
    act_zoom.appendChild(amount_rest)
    price_area.appendChild(act_zoom)
    item_card.appendChild(price_area)

    // item_act_area.appendChild(itemprice)
    item_act_area.appendChild(deletebtn)
    // item_act_area.appendChild(addbtn)
    item_card.appendChild(v_id)
    item_card.appendChild(item_act_area)
    return item_card
  }

  // React.useEffect(() => {
  //   const checkbtn = document.getElementById('check_outbtn')
  //   checkbtn.onclick = () => {
  //     Array.from(cartdetail['cart_list']).forEach(elm => {
  //       console.log(elm)
  //       const item_card = document.getElementById(elm['v_id'])
  //       checkoutvoucher(token, elm['v_id'], item_card)
  //     })
  //   }
  // }, [])

  // function isNumberKey(evt) {
  //   // Only ASCII character in that range allowed
  //   var ASCIICode = (evt.which) ? evt.which : evt.keyCode
  //   if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
  //     return false;
  //   return true;
  // }

  // function addtowish() {

  // }

  // function groupVouchers() {
  //   let grouped = false;

  // }



  return (

    <>
      <div className='page_container' style={{ maxWidth: '920px' }}>

        <div className={classes.root}>
          <Collapse in={open}>
            <Alert
              severity="warning"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              <AlertTitle>Warning</AlertTitle>
              Your cart is empty — <strong>check it out!</strong>
            </Alert>
          </Collapse>
        </div>

        <List
          loading={loading}
        >
          <div style={{ marginLeft: '0%' }} id='cart_list'>
            {/* <div className='item_container' >
              <div className='item_image_area' >
                <img className='item_image' src={chicken} alt=''></img>
              </div>
              <div className='eatery_area'>
                <span className='item_eatery_name'>My Chicken</span>
              </div>
              <div className='info_area'>
                <span className='item_title'>Fried Chicken</span>
                <span className='item_date'>Wed 10:00-12:00</span>
              </div>
              <div className='price_area'>
                <div className='price_zoom'>
                  <span className='item_price'>$ 249</span>
                  <span className='item_newprice'>$ 124.5</span>
                </div>
                <div className='act_zoom'>
                  <button className='item_add'>+</button>
                  <input type='text' className='input_num' id='input_num'></input>
                  <button className='item_minus'>-</button>
                </div>
              </div>
              <div className='item_act_area'>
                <button className='item_add_wish'>Add to wish</button>
                <button className='item_remove'>Remove</button>
              </div>
            </div> */}
          </div>
        </List>
        <div className='cartpage_act_area'>
          {/* <span className='page_total_price'>Total:&nbsp;$&nbsp;{totalprice}</span> */}
          <Button className='cartpage_checkout' type="button" id="check_outbtn" variant="contained" color="primary">
            Checkout
          </Button>
          {/* <button className='page_checkout' onclick={<a href={`/eateryaccount`}></a>}>Checkout</button> */}
        </div>
      </div>
      <div>
        {/* <input type='file' onChange={showVoucher({ 'available_time': '00:00-23.59', 'v_id': 1, 'e_name': 'My Chicken', 'title': 'Chicken', 'date': 'Wed 10:00-13:00', 'newprice': '80', 'price': '100', 'quantity': '200' })} /> */}
      </div>

    </>


  );
}

export default Cart;