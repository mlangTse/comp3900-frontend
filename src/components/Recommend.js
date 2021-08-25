import axios from 'axios';
import React from 'react';
import AuthContext from '../AuthContext';
import { useHistory } from "react-router-dom";
import { showVoucher } from './voucherCard';

function Recommendation({page}) {
  const history = useHistory();
  const token = React.useContext(AuthContext);
  var pos = 0

  React.useEffect(() => {
    const recommendation = document.getElementById('recommendation')
    if (page == '1' && token != null) {
      axios.get('/get/recommendations',  {params: {token}})
      .then(({ data }) => {
        console.log('recommendation: ', data)
        let positions = [], i = 0
        const recommend_list = document.getElementById('recommend_list')

        positions.push(0)
        Array.from(data).forEach(elm => {
          console.log('elm: ', elm)
          recommend_list.appendChild(showVoucher(elm)(history))
          if (!(i++ % 2)) {
            positions.push(380*(i+1))
            console.log('add recomman', i)
          }
          console.log('recommand', i)
        })
        recommendation.style.display = 'block'
        if (i % 2) {
          positions.push(380*i)
        }

        const right_btn = document.getElementById('right_btn')
        right_btn.onclick = () => {
          if (pos < positions.length - 1) pos += 1
          recommend_list.scroll(positions[pos], 0)
        }
        const left_btn = document.getElementById('left_btn')
        left_btn.onclick = () => {
          if (pos > 0) pos -= 1
          recommend_list.scroll(positions[pos], 0)
        }
      })
      .catch((err) => {
        console.error(err);
      });
    } else {
      recommendation.style.display = 'none'
    }
  }, [])

  return (
    <div className='recommendation' id='recommendation'>
      <h2 style={{fontSize: 'x-large', marginBottom: '10px'}}>Recommendation for you</h2>
      <button id='right_btn' className='right_btn' style={{width: 30, height: 30}}></button>
      <button id='left_btn' className='left_btn' style={{width: 30, height: 30}}></button>

      <div className='recommend_list' id='recommend_list'>
      </div>
    </div>
  );
}
export default Recommendation;