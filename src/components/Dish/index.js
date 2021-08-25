import {
    Modal,
    TextField,
} from '@material-ui/core';
import axios from 'axios';
import React, { useState } from 'react';
import AuthContext from '../../AuthContext';
import { extractUId, extractEId } from '../../utils/token';
import { extractEateries } from '../../utils/token';
import '../../static/styles/dish.css';
import chicken from '../../static/Fchicken.jpg';
import EateryProfileHeader from '../Layout/EateryProfileHeader';

function Dish() {
    const [dishdetail, setDishDetail] = React.useState({});
    const [eateries, setEateries] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [dishes, setDishes] = React.useState([]);
    const token = React.useContext(AuthContext);
    const u_id = extractUId(token);
    const e_id = extractEId(token);
    const [isValuesInvalid, setIsValuesInvalid] = React.useState({
        image_src: false,
        dish_name: true,
        description: false,
        price: false,
        form: true
    });
    const [values, setValues] = React.useState({
        image: '',
        name: '',
        description: '',
        price: '',
        token: token,
        e_id: e_id,
    });

    const handleCancel = event => {
        setValues({
            image: '',
            name: '',
            description:
                '',
            price: '',
            token: token,
            e_id: e_id,
        })
        setOpen(false)
    }
    const showCreatModal = event => {
        setIsValuesInvalid({
            image_src: false,
            dish_name: false,
            description: false,
            price: false,
            form: true
        })
        setOpen(true)
    }

    console.log(token, u_id)

    React.useEffect(() => {
        axios
            .get('/eatery/getdish', { params: { e_id } })
            .then(({ data }) => {
                console.log(data);
                setDishDetail(data)
                console.log(dishdetail);
                const dish_li = document.getElementById('dish_list')
                Array.from(data).forEach(elm => {
                    console.log(elm)
                    dish_li.appendChild(showDish(elm))
                })
            })
            .catch((err) => {
              setOpen(true)
              console.error(err);
            });
    }, []);

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
            setTimeout(() => { err.innerHTML = '' }, 2000)
            return isJpgOrPng
        }
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            err.innerHTML = 'Image must smaller than 10MB!';
            input_btn.value = ''
            setTimeout(() => { err.innerHTML = '' }, 2000)
            return isLt10M
        }

        const image = new Image();
        const reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onload = e => {
            image.src = reader.result
            setValues({ ...values, ['image']: image.src })
            console.log('image.src: ', image.src)
        }
    }

    const showDish = (data) => {
        console.log(data)
        const dish_li = document.getElementById('dish_list')
        const dish_card = document.createElement('div')
        dish_card.className = 'dish_container'

        const image_area = document.createElement('span')
        image_area.className = 'dish_image_area'
        const image = new Image();
        image.src = data['image_src']
        image.className = 'dish_image'
        image_area.appendChild(image)
        dish_card.appendChild(image_area)

        const dish_info_area = document.createElement('div')
        dish_info_area.className = 'dish_info_area'

        const title = document.createElement('span')
        title.textContent = data['dish_name']
        title.className = 'dish_title'
        dish_info_area.appendChild(title)

        const desc = document.createElement('span')
        desc.textContent = data['description']
        desc.className = 'dish_desc'
        dish_info_area.appendChild(desc)

        dish_card.appendChild(dish_info_area)

        const price_area = document.createElement('div')
        price_area.className = 'dish_price_area'

        const price = document.createElement('span')
        // price.textContent = `$ ${data['price']}`
        price.innerHTML = `$ ${data['price']}`
        price.className = 'dish_price'

        price_area.appendChild(price)

        const dish_act_area = document.createElement('div')
        dish_act_area.className = 'dish_act_area'

        const deletebtn = document.createElement('button')
        deletebtn.innerHTML = 'Remove'
        deletebtn.className = 'dish_remove'

        const dish_id = data["dish_id"]
        console.log(dish_id)
        console.log(data)
        deletebtn.onclick = () => {
            console.log("pressed remove")
            // setTotalPrice(totalprice => totalprice - parseInt(dishprice.value))
            axios
                .post('/eatery/removedish', { token, e_id, dish_id })
                .then(() => {
                    dish_li.removeChild(dish_card)
                    console.log("dish removed")
                })
                .catch((err) => {
                    console.error(err);
                });
        }
        dish_card.appendChild(price_area)

        // dish_act_area.appendChild(dishprice)
        dish_act_area.appendChild(deletebtn)
        // dish_act_area.appendChild(addbtn)
        // dish_card.appendChild(v_id)
        dish_card.appendChild(dish_act_area)
        return dish_card
    }

    const addbtn = document.getElementById("add_new_dish")

    React.useEffect(() => {
        if (isValuesInvalid['form']) {
            return
        }
        axios
            .post('/eatery/createdish', { ...values })
            .then(({ data }) => {
                setDishes([])
                console.log(data)
                handleCancel()
                window.location.reload()
            })
            .catch((err) => {
                console.error(err);
            });
    }, [isValuesInvalid['form']])

    function setInvalid(name, validation) {
        setIsValuesInvalid({ ...isValuesInvalid, [name]: Boolean(validation) });
    }

    const createDish = (e) => {
        e.preventDefault()
        var check_value = ['name', 'description', 'price']
        var flag = true

        const updatedState = {}

        for (let elm of check_value) {
            if ((elm == 'price') && values[elm] < 1) {
                updatedState[elm] = true
            } else if (values[elm] == '') {
                updatedState[elm] = true
            } else {
                updatedState[elm] = false
                flag = false
            }
        }
        updatedState['form'] = flag
        setIsValuesInvalid(updatedState)
    }

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
        if (event.target.value == '') {
            setInvalid(name, true)
        } else {
            setInvalid(name, false)
        }
    };

    return (
        <div>
            <EateryProfileHeader e_id={e_id} eateries={extractEateries(token)} />
            <div className='page_container' style={{ maxWidth: '800px' }}>
                <div className='search_bar' id='search_bar'>
                </div>
                <div className='page_act_area'>
                    <nav className="btn_area">
                        <button className='add_dishbtn' onClick={showCreatModal}>Add a new dish</button>
                    </nav>
                </div>
                <br></br>
                <br></br>
                <div style={{ marginLeft: '0%' }} id='dish_list'>
                </div>
                <Modal
                    open={open}
                    onClose={handleCancel}>
                    <div className='create_dish_modal' id='create_dish_modal' >
                        <h2>Create a new dish</h2>
                        <form noValidate onSubmit={createDish}>
                            <span>Image</span><br></br>
                            <input type='file' id='uploadImage' onChange={handleImage} />
                            <span id='file_error' style={{ display: 'block' }} />

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
                                onChange={handleChange('name')} />

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
                                onChange={handleChange('description')} />

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
                                onChange={handleChange('price')} />
                        </form>

                        <div className='form_submit_bar'>
                            <button onClick={createDish}>
                                Confirm
                            </button>
                            <button onClick={handleCancel}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>


    );
}

export default Dish;