import {
  FormControlLabel,
  Switch,
  Button,
  Modal,
  TextField,
} from '@material-ui/core';
import { Tooltip, Button as B, Table } from 'antd';
import { QuestionOutlined } from '@ant-design/icons';

import moment from 'moment';
import axios from 'axios';
import React from 'react';
import AuthContext from '../../AuthContext';

import EateryProfileHeader from '../Layout/EateryProfileHeader';
import { extractEateries } from '../../utils/token';
import { getColumnSearchProps } from '../SearchHelper';

import '../../static/styles/eateryvoucher.css'
import deleteIron from '../../static/delete.png'

function EateryVoucher({ e_id, page}) {
  const token = React.useContext(AuthContext)
  const [results, setResults] = React.useState('');
  const [vouchers, setVouchers] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState({
    searchText: '',
    searchedColumn: '',
  });
  const [open, setOpen] = React.useState(false);
  const [isValuesInvalid, setIsValuesInvalid] = React.useState({
    img_src: false,
    name: true,
    description: false,
    start_date: false,
    expire_date: false,
    available_time: false,
    weekday: false,
    price: false,
    discount: false,
    quantity: false,
    form: true
  });
  const [values, setValues] = React.useState({
    image: '',
    name: '',
    description: '',
    start_date: '',
    expire_date: '',
    start_time: '00:00',
    expire_time: '23:59',
    weekday: '0000000',
    price: '',
    discount: '',
    quantity: '',
    token: token,
    e_id: e_id,
  });

  // table column
  const columns = [
    {
      dataIndex: 'image',
      title: 'Image',
    },
    {
      dataIndex: 'name',
      title: 'Name',
      sorter: (a, b) => {
        if (a.name.toUpperCase() < b.name.toUpperCase()) return -1
        else if (a.name.toUpperCase() > b.name.toUpperCase()) return -1
        else return 0
      },
      ...getColumnSearchProps('name', searchValue, setSearchValue)
    },
    {
      dataIndex: 'description',
      title: 'Description',
    },
    {
      dataIndex: 'start_date',
      title: 'Start Date',
      sorter: (a, b) => moment(a.start_date, 'YYYY-MM-DD').diff(moment(b.start_date, 'YYYY-MM-DD'))
    },
    {
      dataIndex: 'expire_date',
      title: 'Expire Date',
      sorter: (a, b) => moment(a.expire_date, 'YYYY-MM-DD').diff(moment(b.expire_date, 'YYYY-MM-DD'))
    },
    {
      dataIndex: 'availble_time',
      title: 'Available Time',
      sorter: (a, b) => moment(a.availble_time, 'HH:mm:ss-HH:mm:ss').diff(moment(b.availble_time, 'HH:mm:ss-HH:mm:ss'))
    },
    {
      dataIndex: 'freq',
      title: 'Frequency',
      filters: [
        {
          text: 'Mon',
          value: 'Mon'
        },
        {
          text: 'Tue',
          value: 'Tue'
        },
        {
          text: 'Wed',
          value: 'Wed'
        },
        {
          text: 'Thu',
          value: 'Thu'
        },
        {
          text: 'Fri',
          value: 'Fri'
        },
        {
          text: 'Sat',
          value: 'Sat'
        },
        {
          text: 'Sun',
          value: 'Sun'
        },
      ],
      onFilter: (value, record) => record.freq.indexOf(value) === 0,
    },
    {
      dataIndex: 'price',
      title: 'Price',
      sorter: (a, b) => Number(a.price.slice(1)) - Number(b.price.slice(1))
    },
    {
      dataIndex: 'sale_price',
      title: 'Sale Price',
      sorter: (a, b) => Number(a.sale_price.slice(1)) - Number(b.sale_price.slice(1))
    },
    {
      dataIndex: 'quantity',
      title: 'Quantity',
      sorter: (a, b) => a.quantity - b.quantity
    },
    {
      dataIndex: 'delete_btn',
      title: '',
    },
  ]

  React.useEffect(() => {
    console.log('eatery voucher useEffect')
    axios
    .get(`/eatery/get/voucher`, { params: { token, e_id, page } })
    .then(({ data }) => {
      console.log(data);
      let key = 1
      let newlist = []
      Array.from(data['voucher_list']).forEach(elm => {
        newlist.push(addVoucher(elm, key++))
      })
      console.log('list voucher', newlist)
      setVouchers(newlist)
      setResults(data['total'])
    })
    .catch((err) => {
      console.error(err);
    });
  }, [])

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
    if (event.target.value == '') {
      setInvalid(name, true)
    } else {
      setInvalid(name, false)
    }
  };

  const handleImage = event => {
    const file = event.target.files[0]
    console.log('file type: ', file, file.type)
    const err = document.getElementById('file_error')
    const input_btn = document.getElementById('uploadImage')
    err.style.color = 'red'
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
      err.innerHTML = 'You can only upload JPG/PNG file!';
      input_btn.value = ''
      setTimeout(() => {err.innerHTML = ''}, 2000)
      return isJpgOrPng
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      err.innerHTML = 'Image must smaller than 10MB!';
      input_btn.value = ''
      setTimeout(() => {err.innerHTML = ''}, 2000)
      return isLt10M
    }

    const image = new Image();
    const reader = new FileReader();
    reader.readAsDataURL(file)
    reader.onload = e => {
      image.src = reader.result
      setValues({ ...values, ['image']: image.src})
      console.log('image.src: ', image.src)
    }
  }

  const handleCancel = event => {
    setValues({
      image: '',
      name: '',
      description: '',
      start_date: '',
      expire_date: '',
      start_time: '00:00',
      expire_time: '23:59',
      weekday: '0000000',
      price: '',
      discount: '',
      quantity: '',
      token: token,
      e_id: e_id,
    })
    setOpen(false)
  }

  const showCreatModal = event => {
    setIsValuesInvalid({
      img_src: false,
      name: false,
      description: false,
      start_date: false,
      expire_date: false,
      available_time: false,
      weekday: false,
      price: false,
      discount: false,
      quantity: false,
      form: true
    })
    setOpen(true)
  }

  const handleFrequency = event => {
    var weekday = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    console.log(typeof(event.target), event.target.innerHTML, event.target.style.backgroundColor)
    if (event.target.style.backgroundColor != 'greenyellow') {
      event.target.style.backgroundColor = 'greenyellow'
    } else {
      event.target.style.backgroundColor = '#fff'
      event.target.style.cssText = ".span:hover {background-color: greenyellow;}"
    }
    var a = ''
    for (var i = 0; i < weekday.length ; i++){
      if (weekday[i] == event.target.innerHTML) {
        a += (event.target.style.backgroundColor == 'greenyellow') ? '1' : '0'
      } else {
        a += values['weekday'][i]
      }
    }
    setValues({ ...values, ['weekday']: a})
  }

  function addVoucher(data, key) {
    var weekday = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    var string = ''
    for (var i = 0; i < weekday.length; i++) {
      if (data['weekday'][i] == '1') {
        string += `${weekday[i] + ', '}`
      }
    }

    return {
      'id': key,
      'image': VoucherImage(data),
      'name': data['title'],
      'description': data['description'],
      'start_date': data['start_date'],
      'expire_date': data['expire_date'],
      'availble_time': data['period_time'],
      'freq': string.slice(0, -2),
      'price': data['price'],
      'sale_price': data['discount'],
      'quantity': data['quantity'],
      'delete_btn': VoucherRemoveBtn(data),
    }
  }

  const VoucherRemoveBtn = (data) =>{
    return (
      <Tooltip title='Delete Voucher'>
        <B type='text' shape='circle' icon={<img style={{width: 20}} src={deleteIron}/>} onClick={() => {
            deleteVoucher(data['v_id'])
          }}
        />
      </Tooltip>
    )
  }

  const VoucherImage = (data) =>{
    return (
      <img style={{height: 100, width: 120}} src={data['image_src']} />
    )
  }

  React.useEffect(() => {
    console.log('create voucher form', isValuesInvalid['form'])
    var check_value = ['name', 'description', 'start_date', 'expire_date', 'price', 'discount', 'quantity','available_time', 'start_time', 'expire_time', 'weekday', 'form']

    for (let elm of check_value) {
      if (isValuesInvalid[elm]) {
        return
      }
    }

    axios
    .post(`/eatery/create/voucher`, { ...values })
    .then(({ data }) => {
      setVouchers([])
      console.log(data)
      handleCancel()
      window.location.reload()
    })
    .catch((err) => {
      setOpen(true)
      setInvalid('form', true)
      console.error(err);
    });
  }, [isValuesInvalid])

  function setInvalid(name, validation) {
    setIsValuesInvalid({ ...isValuesInvalid, [name]: Boolean(validation) });
  }

  const createVoucher = (e) => {
    e.preventDefault()
    var check_value = ['name', 'description', 'start_date', 'expire_date', 'price', 'discount', 'quantity']
    var flag = true

    const updatedState = {}

    for (let elm of check_value) {
      if ((elm == 'quantity' || elm == 'price' || elm == 'discount') && values[elm] < 1) {
        updatedState[elm] = true
        flag = true
        break
      } else if (values[elm] == '') {
        updatedState[elm] = true
        flag = true
        break
      } else {
        console.log('which one? ', elm)
        updatedState[elm] = false
        flag = false
      }
    }
    updatedState['form'] = flag
    console.log('flag', updatedState, isValuesInvalid)
    setIsValuesInvalid(updatedState)
  }

  function deleteVoucher(v_id) {
    axios
    .post(`/eatery/delete/voucher`, { token, e_id, v_id })
    .then(({ data }) => {
      console.log(data)
      window.location.reload()
    })
    .catch((err) => {
        console.error(err);
    });
  }

  return (
    <div>
      <EateryProfileHeader e_id={e_id} eateries={extractEateries(token)} />
      <div style={{maxWidth: '1228px'}} className='page_container'>
        <div className='voucher_bar'>
          <nav>
            <Button variant="contained" onClick={showCreatModal}>Create</Button>
          </nav>
        </div>

        <div style={{height: 800}}>
          <Table
            dataSource={vouchers}
            columns={columns}
          />
        </div>

        <Modal
          open={open}
          onClose = {handleCancel}>
          <div className='create_voucher_modal' id='create_voucher_modal' style={{overflowY: 'scroll', height: 800}} >
            <h2>Create a new Voucher</h2>
            <form noValidate>
              <span>Image</span><br></br>
              <input type='file' id='uploadImage' onChange={handleImage} />
              <span id='file_error' style={{display: 'block'}} />

              <TextField
                error={isValuesInvalid.name}
                helperText={isValuesInvalid.name && 'Please enter a name'}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                type="text"
                autoFocus
                value={values.name}
                onChange={handleChange('name')}/>

              <TextField
                error={isValuesInvalid.description}
                helperText={isValuesInvalid.description && 'Please enter the description'}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="description"
                label="Description"
                name="description"
                type="text"
                autoFocus
                value={values.description}
                onChange={handleChange('description')}/>

              <div className='start_date'>
                <TextField
                  error={isValuesInvalid.start_date}
                  helperText={isValuesInvalid.start_date && 'Please select a start date'}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="start_date"
                  label='Start_date'
                  name="start_date"
                  type="date"
                  autoFocus
                  value={values.start_date}
                  onChange={handleChange('start_date')}
                  InputLabelProps={{
                    shrink: true,
                  }}/>
              </div>
              <div className='expire_date'>
                <TextField
                  error={isValuesInvalid.expire_date}
                  helperText={isValuesInvalid.expire_date && 'Please select a expire date'}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="expire_date"
                  label='Expire_date'
                  name="expire_date"
                  type="date"
                  autoFocus
                  value={values.expire_date}
                  onChange={handleChange('expire_date')}
                  InputLabelProps={{
                    shrink: true,
                  }}/>
              </div>

              <div>
                <FormControlLabel
                  control=
                  {<Switch
                    onChange={(event) => {
                      setInvalid('available_time', event.target.checked)
                    }}
                    name='Available Period'
                    color='primary'
                  />}
                  label='Available Period'
                  labelPlacement='start'
                />
                <div style={{display: (isValuesInvalid.available_time) ? 'block':'none'}}>
                  <div className='start_date'>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="start_time"
                      label='Start_time'
                      name="start_time"
                      type="time"
                      autoFocus
                      value={values.start_time}
                      onChange={handleChange('start_time')}
                      InputLabelProps={{
                        shrink: true,
                      }}/>
                  </div>
                  <div className='expire_date'>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="expire_time"
                      label='Expire_time'
                      name="expire_time"
                      type="time"
                      autoFocus
                      value={values.expire_time}
                      onChange={handleChange('expire_time')}
                      InputLabelProps={{
                        shrink: true,
                      }}/>
                  </div>
                </div>
              </div>

              <div>
                <Tooltip arrow placement="left" title={`When the frequency is selected, the voucher will be automatically created on the days which have been selected within the start_date and expire_date. The created voucher will be available for one week.`} zIndex={99999}>
                  <B style={{marginLeft: 10}} size='small' shape="circle" icon={<QuestionOutlined />}/>
                </Tooltip>
                <FormControlLabel
                  style={{marginLeft: 3}}
                  control=
                  {<Switch
                    onChange={(event) => {
                      if (!event.target.checked) {
                        const allDay = document.getElementById('frequency').getElementsByTagName('span')
                        Array.from(allDay).forEach((elm) => {
                          elm.style.backgroundColor = '#fff'
                        })
                        setValues({ ...values, ['weekday']: '0000000'})
                      }
                      setInvalid('frequency', event.target.checked)
                    }}
                    name='Frequency'
                    color='primary'
                  />}
                  label='Frequency'
                  labelPlacement='start'
                />
                <div style={{display: (isValuesInvalid.frequency) ? 'block':'none'}} className='frequency' id='frequency'>
                  <span onClick={handleFrequency}>Mon</span>
                  <span onClick={handleFrequency}>Tue</span>
                  <span onClick={handleFrequency}>Wed</span>
                  <span onClick={handleFrequency}>Thu</span>
                  <span onClick={handleFrequency}>Fri</span>
                  <span onClick={handleFrequency}>Sat</span>
                  <span onClick={handleFrequency}>Sun</span>
                </div>
              </div>

              <TextField
                error={isValuesInvalid.price}
                helperText={isValuesInvalid.price && 'Price have to be larger than 1'}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="price"
                label="Orginal Price"
                name="price"
                type="number"
                autoFocus
                value={values.price}
                onChange={handleChange('price')}/>

              <TextField
                error={isValuesInvalid.discount}
                helperText={isValuesInvalid.discount && 'Discount have to be larger than 1'}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="discount"
                label="Discount (% off)"
                name="discount"
                type="number"
                autoFocus
                value={values.discount}
                onChange={handleChange('discount')}/>

              <TextField
                error={isValuesInvalid.quantity}
                helperText={isValuesInvalid.quantity && 'Quantity have to be larger than 1'}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="quantity"
                label="Quantity"
                name="quantity"
                type="number"
                InputProps={{ inputProps: { min: "1", step: "1" } }}
                autoFocus
                value={values.quantity}
                onChange={handleChange('quantity')}/>
            </form>

            <div className='form_submit_bar'>
              <Button variant="contained" color="primary" onClick={createVoucher}>
                Confirm
              </Button>
              <Button  variant="contained" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default EateryVoucher