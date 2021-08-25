import React from 'react';
import { useHistory } from "react-router-dom";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import 'font-awesome/css/font-awesome.min.css';
import '../../static/styles/eateryprofileHeader.css';

function EateryProfileHeader({ e_id, eateries }) {
  const history = useHistory();
  const [eateriesName, setEateryName] = React.useState('');

  React.useEffect(() => {
    console.log('eatery profile header useEffect')
    var menu = document.getElementById('eatery_dropdown_menu')
    menu.style.display = "none";
    // clear up menu
    while (menu.firstChild) {
      menu.removeChild(menu.lastChild);
    }
    console.log('eateries:', eateries, e_id)

    // build menu
    Array.from(eateries).forEach(elm => {
      if (elm['e_id'] == e_id) {
        setEateryName(elm['name'])
      }
      menu.appendChild(addEatery(elm['name'], elm['e_id']))
    })
    const add_eatery = document.createElement('button')
    add_eatery.onclick = () => {
      history.push('/eatery/register')
    }
    add_eatery.innerHTML = 'add a new eatery'
    menu.appendChild(add_eatery)
  }, [e_id, eateries])

  console.log('eatery profile header eateries: ', [eateries], 'eid: ', e_id)

  function addEatery(name, e_id) {
    const eatery = document.createElement('button')
    eatery.innerHTML = name
    eatery.onclick = () => {
      localStorage.setItem('e_id', e_id)
      window.location.reload()
    }
    return eatery
  }

  function showEatery(e) {
    e.preventDefault();
    console.log('show')
    var menu = document.getElementById('eatery_dropdown_menu')
    if (menu.style.display === "block") {
      menu.style.display = "none";
    } else {
      menu.style.display = "block";
    }
  }

  const handleClickAway = () => {
    const menu = document.getElementById('eatery_dropdown_menu')
    menu.style.display = "none";
  }

  return (
    <div className='eatery_profile_menu_header page_container'>
      <ClickAwayListener onClickAway={handleClickAway}>
        <div className='eatery_name'>
          <button className='menu_btn' onClick={showEatery}>
            <span id='open'>{eateriesName}</span>
            <span className='fa'></span>
          </button>
          <div className='eatery_dropdown_menu' id='eatery_dropdown_menu' style={{zIndex: '9999'}}>
          </div>
        </div>
      </ClickAwayListener>
      <div className='eatery_profile_menu'>
        <a href={'/eateryprofile'}>
          Profile
        </a>
        <a href={'/eaterydish'}>
          Dish
        </a>
        <a href={`/eateryvoucher`}>
          Voucher
        </a>
        <a href={`/eateryreserved`}>
          Reservation
        </a>
        <a href={`/eateryaccount`}>
          Account
        </a>
      </div>
    </div>
  )
}

export default EateryProfileHeader