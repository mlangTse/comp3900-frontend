import axios from 'axios';
import {
  Avatar,
  Box,
  Button,
  Container,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import DeveloperOutlinedIcon from '@material-ui/icons/DeveloperModeOutlined';
import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

import AuthContext from '../AuthContext';
import { extractUId } from '../utils/token';
import { cuisineOptions, paymentOptions, locationOption } from '../utils/constants';

import logo from '../static/logo.png'

const useStyles = makeStyles((theme) => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.background.paper,
    },
  },
  card: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: theme.shape.borderRadius,
  },
}));

function RegisterPage({ setAuth, ...props }) {
  const animatedComponents = makeAnimated();
  const token = React.useContext(AuthContext);
  const u_id = extractUId(token);
  const [selectedCuisine, setSelectedCuisine] = React.useState([])
  const [selectedPayment, setSelectedPayment] = React.useState([])
  const [values, setValues] = React.useState({
    name: '',
    phone: '',
    address: '',
    suburb: '',
    cuisines: '',
    payment_method: '',
    token: token,
    u_id: u_id,
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handlemultiChange = name => value => {
    var a = ''
    for(let i of value) {
      a += i['value']
      if (i == value[value.length-1]) break
      a += ', '
    }
    setValues({ ...values, [name]: a });
    if (name == 'cuisines') {
      setSelectedCuisine(value)
    } else {
      setSelectedPayment(value)
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    // Send to backend
    console.log('eatery register ', values)

    console.log(values)
    axios.post(`/auth/eatery/register`, { ...values })
      .then((response) => {
        console.log(response);
        const data = response.data;
        setAuth(data.token, data.u_id, data.e_id);
        props.history.push('/home');
      })
      .catch((err) => {});
  }

  const classes = useStyles();

  return (
    <Container component="main" maxWidth="sm">
      <a href="/home" class='logo'><img src={logo} alt='logo' /></a>
      <Box boxShadow={3} className={classes.card}>
        <Avatar>
          <DeveloperOutlinedIcon color="secondary" />
        </Avatar>
        <Typography component="h1" variant="h5">
          Eatery Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            type="text"
            autoFocus
            value={values.name_first}
            onChange={handleChange('name')}
          />
          <PhoneInput
            inputProps={{
              name: 'phone',
              required: true,
              autoFocus: true,
              variant: 'outlined',
              margin: "normal"
            }}
            required
            label='Phone'
            name='phone'
            id='phone'
            inputStyle={{width: '500px', height: '55px'}}
            country={'us'}
            value={values.phone}
            onChange={phone => setValues({ ...values, ['phone']: phone })}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="address"
            label="address"
            type="text"
            id="address"
            value={values.address}
            onChange={handleChange('address')}
          />
          <div style={{marginBottom: 10}}>
            <Select
              styles={{control: styles => ({ ...styles, width: 505})}}
              components={animatedComponents}
              name='suburb'
              placeholder='Select suburb'
              options={locationOption}
              onChange={suburb => {setValues({ ...values, ['suburb']: suburb['value'] })}}/>
          </div>
          <div style={{marginBottom: 10}}>
            <Select
              styles={{control: styles => ({ ...styles, width: 505})}}
              components={animatedComponents}
              isMulti
              name='cuisines'
              placeholder='Select cuisines'
              options={selectedCuisine.length >= 3 ?
                        selectedCuisine:
                        cuisineOptions}
              value={selectedCuisine}
              onChange={handlemultiChange('cuisines')}/>
          </div>
          <div style={{marginBottom: 10}}>
            <Select
              styles={{control: styles => ({ ...styles, width: 505})}}
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              name='payment method'
              placeholder='Select supported payment method'
              options={paymentOptions}
              value={selectedPayment}
              onChange={handlemultiChange('payment_method')}/>
          </div>
          <Button type="submit" fullWidth variant="contained" color="primary">
            Sign Up
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default RegisterPage;
