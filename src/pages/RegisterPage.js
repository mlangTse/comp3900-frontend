import axios from 'axios';
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Link,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import DeveloperOutlinedIcon from '@material-ui/icons/DeveloperModeOutlined';
import React from 'react';
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

  const [values, setValues] = React.useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    repeat_password: '',
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  function handleSubmit(event) {
    event.preventDefault();

    console.log('values: ', values);
    // Send to backend
    axios.post(`/auth/register`, { ...values })
      .then((response) => {
        console.log('response: ', response);
        const data = response.data;
        console.log('response.data: ', data.token, data.u_id);
        setAuth(data.token, data.u_id, null);
        props.history.push('/home');
      })
      .catch((err) => {});
  }

  const classes = useStyles();

  return (
    <Container component="main" maxWidth="sm">
      <a href="/home" className='logo'><img src={logo} alt='logo' /></a>
      <Box boxShadow={3} className={classes.card}>
        <Avatar>
          <DeveloperOutlinedIcon color="secondary" />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
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
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange('email')}
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
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={values.password}
            onChange={handleChange('password')}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="repeat_password"
            label="Repeat password"
            type="password"
            id="repeat_password"
            autoComplete="current-password"
            value={values.repeat_password}
            onChange={handleChange('repeat_password')}
          />
          <Button type="submit" fullWidth variant="contained" color="primary">
            Sign Up
          </Button>
          <Grid container>
            <Grid item>
              <br />
              <Link href="/login" variant="body1">
                {'Already have an account? Login'}
              </Link>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
}

export default RegisterPage;
