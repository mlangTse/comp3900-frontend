import {
  Button,
  Modal,
  TextField,
} from '@material-ui/core';
import axios from 'axios';
import React from 'react';
import AuthContext from '../../AuthContext';
import PhoneInput from 'react-phone-input-2'

import ProfileHeader from '../Layout/ProfileHeader'
import avatar from '../../static/logo.png'

function Profile({ profile }) {
  const token = React.useContext(AuthContext);
  const [editable, setEditable] = React.useState(false);
  const [oldUser, setOldUser] = React.useState({});
  const [userProfile, setUserProfile] = React.useState({
    email: '',
    name: '',
    phone: '',
  });
  const [editError, setEditError] = React.useState({
    name: '',
    email: '',
  })
  const [errormsg, setErrormsg] = React.useState('');
  const image = new Image();
  image.style.width = '300px'
  image.style.height = '300px'

  React.useEffect(() => {
      axios
      .get(`/user/profile`, { params: { token, u_id: profile } })
      .then(({ data }) => {
          console.log(data);
          var userData = {
            email: data['email'],
            name: data['name'],
            image: data['image'],
            phone: data['phone'],
          }
          setOldUser(userData)
          setUserProfile(userData);
      })
      .catch((err) => {
          console.error(err);
      });
  }, [editable]);

  function updateName(name) {
    if (userProfile.name == oldUser.name) return
      axios
      .put(`/user/profile/setname`, { token, name })
      .then(() => {
          console.log('all good');
      })
      .catch((err) => {
        setEditable(true)
        console.error(err);
        setEditError({...editError, ['name']: err.response.data.message})
      });
  }

  const handleChange = name => event => {
    setUserProfile({ ...userProfile, [name]: `${event.target.value}` })
  }

  function updateEmail(email) {
    if (userProfile.email == oldUser.email) return
      axios
      .put(`/user/profile/setemail`, { token, email })
      .then(() => {
          console.log('all good');
      })
      .catch((err) => {
        setEditable(true)
        console.error(err);
        setEditError({...editError, ['email']: err.response.data.message})
      });
  }

  function updatePhone(phone) {
    if (userProfile.phone == oldUser.phone) return
      axios
      .put(`/user/profile/setphone`, { token, phone })
      .then(() => {
      console.log('all good');
      })
      .catch((err) => {
        setEditable(true)
        console.error(err);
      });
  }

  const UploadPhoto = event => {
    const file = event.target.files[0]
    console.log('file type: ', file, file.type)
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
      setErrormsg('You can only upload JPG/PNG file!');
      setTimeout(() => {setErrormsg('')}, 2000)
      return isJpgOrPng
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      setErrormsg('Image must smaller than 10MB!');
      setTimeout(() => {setErrormsg('')}, 2000)
      return isLt10M
    }

    const reader = new FileReader();
    reader.readAsDataURL(file)
    reader.onload = e => {
      image.src = reader.result
      let img_src = image.src
      axios.put(`/user/profile/setimage`, {
        token,
        img_src,
      })
      .then((res) => {
        window.location.reload()
        console.log('all good');
      })
      .catch((err) => {
        console.error(err);
      });
    }
  }

  const ModelOpen = (e) => {
    e.preventDefault()
    console.log('modal open')
    console.log('open: ', userProfile.phone, typeof(userProfile.phone))
    setEditable(true)
  }

  const ModelClose = () => {
    setEditable(false)
  }

  const Edit_profile = (e) => {
    e.preventDefault()
    updateName( userProfile.name )
    updatePhone( userProfile.phone )
    updateEmail( userProfile.email )
    ModelClose()
  }

  return (
    <div>
      <ProfileHeader/>
      <div style={{maxWidth: '1228px'}} className='page_container'>
        <form style={{display: 'flex'}}>
          <div>
            <div id='avatar_img' style={{ border: '1px solid black', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#fff', width: '300px', height: '300px' }}>
              <img src={(userProfile.image == null || userProfile.image == '') ? avatar:userProfile.image} alt='avatar' style={{ width: '300px', height: '300px'}}/>
            </div>

            <div style={{ margin: '130px', marginTop: 8 }}>
              <input type='file' onChange={UploadPhoto} accept="image/png, image/jpeg"/>
              <p style={{color: 'red'}}>{errormsg}</p>
            </div>
          </div>

          <div className='eatery_profile' style={{ paddingLeft: 70}}>
            <TextField
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              margin="normal"
              fullWidth
              id="name"
              label="Name"
              name="name"
              type="text"
              autoFocus
              value={userProfile.name}/>

            <TextField
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              margin="normal"
              fullWidth
              id="email"
              label="Email"
              name="email"
              type="text"
              autoFocus
              value={userProfile.email}/>

            <TextField
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              margin="normal"
              fullWidth
              id="phone"
              label="Phone"
              name="phone"
              type="text"
              autoFocus
              value={userProfile.phone}/>
          </div>

          <div style={{position: 'relative'}}>
            <Button variant="contained" id='edit_btn' style={{fontSize: 'large', marginLeft: 210}} onClick={ModelOpen}>
              Edit
            </Button>
          </div>
        </form>

        <Modal
          open={editable}
          onClose={ModelClose}>
          <div className='create_voucher_modal' id='create_voucher_modal' style={{width: 560}}>
            <h2 style={{textAlign: 'center', paddingTop: 15}}>Edit Your Profile</h2>
            <form noValidate onSubmit={Edit_profile}>
              <TextField
                error={editError.name != ''}
                helperText={editError.name}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                type="text"
                autoFocus
                onChange={handleChange('name')}/>
              <TextField
                error={editError.email != ''}
                helperText={editError.email}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                type="text"
                autoFocus
                onChange={handleChange('email')}/>
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
                inputStyle={{width: '505px', height: '55px'}}
                country={'us'}
                onChange={(phone) => {setUserProfile({ ...userProfile, ['phone']: phone })} }
              />
            </form>

            <div className='form_submit_bar' style={{marginTop: 10}}>
              <Button variant="contained"  color="primary" onClick={Edit_profile}>
                Confirm
              </Button>
              <Button  variant="contained" onClick={ModelClose}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default Profile