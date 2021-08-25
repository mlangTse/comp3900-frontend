import {
  Button,
  Modal as M,
  TextField,
} from '@material-ui/core';
import { Upload, Modal, message  } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import React from 'react';
import AuthContext from '../../AuthContext';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import PhoneInput from 'react-phone-input-2'

import EateryProfileHeader from '../Layout/EateryProfileHeader';
import { cuisineOptions, locationOption } from '../../utils/constants';
import avatar from '../../static/logo.png'
import ShowReview from '../ShowReview';

function EateryProfile({ e_id }) {
  const animatedComponents = makeAnimated();
  const token = React.useContext(AuthContext);
  const [edit, setEdit] = React.useState(false);
  const [selectedCuisine, setSelectedCuisine] = React.useState([])
  const [editError, setEditError] = React.useState({
    name: '',
    address: '',
    description: ''
  })
  const [thisEatery, setThisEatery] = React.useState({});
  const [oldEatery, setOldEatery] = React.useState({});
  const [eateries, setEateries] = React.useState([]);
  const [photowall, setPhotowall] = React.useState({
    previewVisible: false,
    previewImage: '',
    fileList: []
  });

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  React.useEffect(() => {
    console.log('eatery profile useEffect')
    axios
    .get(`/eatery/profile`, { params: { token } })
    .then(({ data }) => {
      setEateries(data)
      console.log('eatery profile data: ',data)
      if (e_id == -1) {
        e_id = Number(data[0]['e_id'])
      }

      Array.from(data).forEach(elm => {
        if (elm['e_id'] == e_id) {
          console.log('i', elm);
          var v = ''
          for(let i of elm['cuisines']) {
            v += i['value']
            if (i == elm['cuisines'][elm['cuisines'].length-1]) break
            v += ','
          }

          var fileList = []
          for(let i of elm['photowall']) {
            fileList.push({
              uid: i['uid'],
              status: 'done',
              url: i['img_src']
            })
          }
          setPhotowall({...photowall, ['fileList']: fileList})
          setOldEatery(elm)
          setThisEatery({
            e_id: elm['e_id'],
            name: elm['name'],
            cuisines: v,
            phone: elm['phone'],
            address: elm['address'],
            image_src: elm['image_src'],
            rating: elm['rating'],
            description: elm['description'],
            suburb: elm['suburb']
          })
          setSelectedCuisine(elm['cuisines'])
        }
      })
      console.log('eateries', eateries);
    })
    .catch((err) => {
        console.error(err);
    });
  }, []);

  const handleChange = name => event => {
    setEditError({...editError, [name]: ''})
    setThisEatery({ ...thisEatery, [name]: event.target.value })
  }

  const handleCuisinesChange = name => value => {
    console.log(value)
    var v = ''
    for(let i of value) {
      v += i['value']
      if (i == value[value.length-1]) break
      v += ','
    }
    console.log('v', v)
    setThisEatery({ ...thisEatery, [name]: v });
    setSelectedCuisine(value)
  }

  // storage all eateries
  var a = new Array()
  Array.from(eateries).forEach(elm => {
    let i = JSON.stringify(elm)
    a.push(i)
  })
  localStorage.setItem('eateries', JSON.stringify(a))

  function updateName() {
    if (thisEatery.name == oldEatery.name) return
    axios
    .put(`/eatery/profile/setname`, { token, e_id, new_name: thisEatery.name })
    .then(() => {
        console.log('all good');
    })
    .catch((err) => {
      setEdit(true)
      console.log(err)
      setEditError({...editError, ['name']: err.response.data.message})
    });
  }

  function updateCuisine() {
    if (thisEatery.cuisines == oldEatery.cuisines) return
    axios
    .put(`/eatery/profile/setcuisines`, { token, e_id, new_cuisines: thisEatery.cuisines })
    .then(() => {
        console.log('all good');
    })
    .catch((err) => {
      setEdit(true)
      console.error(err);
    });
  }

  function updateSuburb() {
    if (thisEatery.suburb == oldEatery.suburb) return
    axios
    .put(`/eatery/profile/setsuburb`, { token, e_id, new_suburb: thisEatery.suburb })
    .then(() => {
        console.log('all good');
    })
    .catch((err) => {
      setEdit(true)
      console.error(err);
    });
  }

  function updatePhone() {
    if (thisEatery.phone == oldEatery.phone) return
    axios
    .put(`/eatery/profile/setphone`, { token, e_id, new_phone: thisEatery.phone })
    .then(() => {
    console.log('all good');
    })
    .catch((err) => {
      setEdit(true)
      setEditError({...editError, ['phone']: err.response.data.message})
    });
  }

  function updateAddress() {
    if (thisEatery.address == oldEatery.address) return
    axios
    .put(`/eatery/profile/setaddress`, { token, e_id, new_address: thisEatery.address })
    .then(() => {
    console.log('all good');
    })
    .catch((err) => {
      setEdit(true)
      setEditError({...editError, ['address']: err.response.data.message})
    });
  }

  function updateDescription() {
    if (thisEatery.description == oldEatery.description) return
    axios
    .put(`/eatery/profile/setdescription`, { token, e_id, description: thisEatery.description })
    .then(() => {
    console.log('all good');
    })
    .catch((err) => {
      setEdit(true)
      setEditError({...editError, ['description']: err.response.data.message})
    });
  }

  const UploadPhoto = event => {
    const file = event.target.files[0]
    console.log('file type: ', file, file.type)
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
      console.log('You can only upload JPG/PNG file!');
      return isJpgOrPng
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      console.log('Image must smaller than 10MB!');
      return isLt10M
    }
    const image = new Image();
    image.style.width = '300px'
    image.style.height = '300px'

    const reader = new FileReader();
    reader.readAsDataURL(file)
    reader.onload = e => {
      image.src = reader.result
      let img_src = image.src
      axios.put(`/eatery/profile/setimage`, {
        token,
        e_id,
        img_src,
      })
      .then((res) => {
        window.location.reload()
      })
      .catch((err) => {
        console.error(err);
      });
    }
  }

  const ModelOpen = (e) => {
    e.preventDefault()
    console.log('modal open')
    setEdit(true)
  }

  const ModelClose = () => {
    setEdit(false)
  }

  const Edit_eatery_info = (e) => {
    e.preventDefault()
    console.log('eatery profile updating: ', thisEatery)
    updateName()
    updateCuisine()
    updateSuburb()
    updatePhone()
    updateAddress()
    updateDescription()
    ModelClose()
  }

  // Photo Wall
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  const handleCancel = () => setPhotowall({ ...photowall, ['previewVisible']: false });

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    console.log('file', file)

    setPhotowall({...photowall,
      ['previewImage']: file.url || file.preview,
      ['previewVisible']: true,
    });
  };

  const handlephotoChange = ({ fileList }) => {
    const reader = new FileReader();
    const image = new Image();
    var tmp = []
    console.log(fileList, photowall.fileList,fileList.length, photowall.fileList.length , fileList.length >= photowall.fileList)

    // add photo
    if (fileList.length > photowall.fileList.length) {
      reader.readAsDataURL(fileList[fileList.length - 1].originFileObj);
      reader.onload = () => {
        image.src = reader.result
        console.log('image src', image.src)
        let img_src = image.src
        axios.put(`/eatery/profile/updatePhotowall`, {
          token,
          e_id,
          img_src,
        })
        .then(({data}) => {
          for(let k of photowall.fileList) {
            console.log('each image', k)
            tmp.push(k)
          }

          tmp.push({
            uid: data['uid'],
            status: 'done',
            url: image.src
          })
          console.log('after upload', tmp)
          setPhotowall({...photowall, ['fileList']: tmp})
        })
        .catch((err) => {
          console.error(err);
        });
      }
    } else { //delete photo
      var index = 0, flag = 1, i = 0
      while (i < photowall.fileList.length) {
        if (i == fileList.length && flag) {
          index = i
          i += 1
          continue
        } else if (flag && fileList[i]['uid'] != photowall.fileList[i]['uid']) {
          index = i
          flag = 0
          i += 1
          continue
        }
        tmp.push(photowall.fileList[i])
        i += 1
      }

      axios.delete(`/eatery/profile/deletePhotowall`, {
        data: {
          token,
          e_id,
          img_id: photowall.fileList[index]['uid']
        }
      })
      .catch((err) => {
        console.error(err);
      });
      setPhotowall({...photowall, ['fileList']: tmp})
    }
  }

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };



  return (
    <div>
      <EateryProfileHeader e_id={e_id} eateries={eateries}  />
      <div style={{maxWidth: '1228px'}} className='page_container'>
        <form style={{display: 'flex'}}>
          <div onChange={UploadPhoto}>
            <div id='avatar_img' style={{ border: '1px solid black', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#fff', width: '300px', height: '300px', marginTop: 50}}>
              <img src={(thisEatery.image_src == null || thisEatery.image_src == '') ? avatar:thisEatery.image_src} alt='avatar' style={{ width: '300px', height: '300px'}}/>
            </div>

            <div style={{ paddingLeft: 70, marginTop: 8 }}>
              <input type='file' onChange={UploadPhoto} accept="image/png, image/jpeg"/>
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
              value={thisEatery.name}/>
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
              value={thisEatery.phone}/>
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
              id="address"
              label="Address"
              name="address"
              type="text"
              autoFocus
              value={`${thisEatery.address} ${thisEatery.suburb}`}/>
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
              id="cuisine"
              label="Cuisine"
              name="cuisine"
              type="text"
              autoFocus
              value={thisEatery.cuisines}/>
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
              id="description"
              label="Description"
              name="description"
              type="text"
              multiline
              rows={4}
              autoFocus
              value={(thisEatery.description == null || thisEatery.description == '') ? 'this guy is lazy and left nothing':thisEatery.description}/>
          </div>

          <div style={{position: 'relative'}}>
            <Button variant="contained" id='edit_btn' style={{fontSize: 'large', marginLeft: 210}} onClick={ModelOpen}>
              Edit
            </Button>
          </div>
        </form>

        <M
          open={edit}
          onClose={ModelClose}>
          <div className='create_voucher_modal' id='create_voucher_modal' style={{width: 560}}>
            <h2 style={{textAlign: 'center', paddingTop: 15}}>Edit Your Profile</h2>
            <form noValidate onSubmit={Edit_eatery_info}>
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
                value={thisEatery.name}
                onChange={handleChange('name')}/>
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
                value={thisEatery.phone}
                onChange={phone => setThisEatery({ ...thisEatery, ['phone']: phone })}
              />
              <TextField
                error={editError.address != ''}
                helperText={editError.address}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="address"
                label="Address"
                name="address"
                type="text"
                autoFocus
                value={thisEatery.address}
                onChange={handleChange('address')}/>
              <TextField
                error={editError.description != ''}
                helperText={editError.description}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="description"
                label="Description"
                name="description"
                type="text"
                multiline
                rows={4}
                autoFocus
                value={thisEatery.description}
                onChange={handleChange('description')}/>
              <Select
                styles={{control: styles => ({ ...styles, width: 505})}}
                components={animatedComponents}
                name='suburb'
                defaultValue={locationOption.map(elm => {
                  if (elm['value'] == thisEatery.suburb) return elm
                  })}
                placeholder='Suburb'
                options={locationOption}
                onChange={suburb => {
                  setThisEatery({ ...thisEatery, ['suburb']: suburb['value'] })
                }}/>
              <Select
                styles={{control: styles => ({ ...styles, width: 505})}}
                components={animatedComponents}
                isMulti
                name='cuisine'
                options={cuisineOptions}
                value={selectedCuisine}
                placeholder='Cuisine'
                options={selectedCuisine.length >= 3 ?
                          selectedCuisine:
                          cuisineOptions}
                onChange={handleCuisinesChange('cuisines')}/>
            </form>

            <div className='form_submit_bar' style={{marginTop: 10}}>
              <Button variant="contained" color="primary" onClick={Edit_eatery_info}>
                Confirm
              </Button>
              <Button  variant="contained" onClick={ModelClose}>
                Cancel
              </Button>
            </div>
          </div>
        </M>

        <span style={{fontSize: 'xx-large'}}>Image Wall</span>
        <div className='image_table' style={{height: 106, margin: '20px 0'}}>
          <Upload
            customRequest={dummyRequest}
            listType="picture-card"
            fileList={photowall.fileList}
            onPreview={handlePreview}
            beforeUpload = {(file) => {
              const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
                  if (!isJPG) {
                      message.error('You can only upload JPG or PNG file!');
                      return Upload.LIST_IGNORE;
                  } else {
                      return true;
                  }
              }}
              onChange={handlephotoChange}
          >
            {photowall.fileList.length >= 6 ? null : uploadButton}
          </Upload>
          <Modal
            visible={photowall.previewVisible}
            title={photowall.previewTitle}
            footer={null}
            onCancel={handleCancel}
          >
            <img alt="example" style={{ width: '100%' }} src={photowall.previewImage} />
          </Modal>
        </div>

        <div>
          <div id='Rating' style={{fontSize: 'xx-large'}}>
            Customer Review
          </div>
          <ShowReview e_id={e_id} reply={true} />
        </div>
      </div>
    </div>
  );
}

export default EateryProfile