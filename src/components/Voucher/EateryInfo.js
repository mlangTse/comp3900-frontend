import { Modal } from '@material-ui/core';
import React from 'react';

import EateryDish from '../EateryDish';
import '../../static/styles/eateryinfo.css'

import location from '../../static/location.png'
import call from '../../static/call.png'
import menu from '../../static/menu.png'
import tagIron from '../../static/tag.png'

function EateryInfo({ eatery ,e_id}) {
  const [showFlag, setShowFlag] = React.useState({
    dish: false
  });
  const googleMapRef = React.useRef()
  let googleMap
  console.log('show map', eatery)

  React.useEffect(() => {
    if (document.getElementById('googleMapAPI') != null) return
    const googleMapScript = document.createElement("script");
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB7NPPbKf5XzB1HRNIU-Rb0vrrefBmz6HA&libraries=places`;
    googleMapScript.async = true;
    googleMapScript.id = 'googleMapAPI'
    window.document.body.appendChild(googleMapScript);
    googleMapScript.addEventListener("load", () => {
      getLatLng();
    });
  }, []);

  const createGoogleMap = (coordinates) => {
    googleMap = new window.google.maps.Map(googleMapRef.current, {
      zoom: 16,
      center: {
        lat: coordinates.lat(),
        lng: coordinates.lng(),
      },
      disableDefaultUI: true,
    });
  };

  const getLatLng = () => {
    let lat, lng, placeId;
    var city = 'Sydney'
    var suburb = eatery['suburb']
    var addr = `${eatery['address']}`.replaceAll(' ', '+')
    console.log(eatery, `${addr},+${suburb},+${city}`)

    new window.google.maps.Geocoder().geocode(
      { address: `${addr},+${suburb},+${city}` },
      function (results, status) {
        if (status === window.google.maps.GeocoderStatus.OK) {
          placeId = results[0].place_id;
          createGoogleMap(results[0].geometry.location);
          lat = results[0].geometry.location.lat();
          lng = results[0].geometry.location.lng();
          const marker = new window.google.maps.Marker({
            position: { lat, lng },
            map: googleMap,
            animation: window.google.maps.Animation.DROP,
            title: `${addr},+${suburb},+${city}`,
          });

          marker.addListener("click", () => {
            new window.google.maps.InfoWindow({
              content: `${eatery['address']} ${suburb}, ${city}`
            }).open(googleMap, marker)
          })

        } else {
          alert(
            "Geocode was not successful for the following reason: " + status
          );
        }
      }
    );
  };

  const ModalClose = () => {
    setShowFlag({...showFlag, ['dish']: false})
  }

  return (
    <div style={{marginTop: 20}}>
      <div className='Info_card'>
        <div className='map' ref={googleMapRef}>
        </div>

        <div className='addrDetail'>
            <img src={location} style={{width: 60, height: 60, transform: 'translate(0, 30%)'}} />
            <a href='#viewMap' style={{ margin: 'auto 10px', fontSize: 'medium'}}>
              <div style={{ fontSize: 'x-large' }}>
                {eatery['e_name']}
              </div>
              {eatery['address']}
            </a>
            <a href={`https://maps.google.com/maps?daddr=${eatery['address'].replaceAll(' ','+')},+${eatery['suburb']},+Sydney`} style={{ margin: 'auto 10px', fontSize: 'large', color:'#0070cc', display: 'flex', marginLeft: 'auto', fontWeight: 400}}>Direction</a>
        </div>

        <div className='CommDetail'>
          <div>
            <img src={call} style={{width: 30, height: 25, transform: 'translate(0, 30%)', paddingLeft: 5}} />
            <span>
              {eatery['phone']}
            </span>
          </div>
          <div>
            <img src={menu} style={{width: 30, height: 25, transform: 'translate(0, 30%)'}} />
            <a onClick={() => {setShowFlag({...showFlag, ['dish']: true})}}>See Menu</a>
          </div>
          <div style={{ width: 300 }}>
            <img src={tagIron} style={{width: 30, height: 25, transform: 'translate(0, 30%)', paddingLeft: 5}} />
            <span>
              {eatery['cuisines'].replaceAll(',', ', ')}
            </span>
          </div>
        </div>
      </div>
      <Modal
        open={showFlag.dish}
        onClose = {ModalClose}
      >
        <div className='create_voucher_modal' id='create_voucher_modal'>
          <div style={{padding: '10px'}}>
            <h2 style={{textAlign: "center"}}>Menu</h2>
            <EateryDish e_id = {e_id}/>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default EateryInfo;