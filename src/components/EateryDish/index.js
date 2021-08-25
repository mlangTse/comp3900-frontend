import axios from 'axios';
import React from 'react';
import '../../static/styles/eaterydish.css';
import { extractEId, extractUId } from '../../utils/token';
import EateryProfileHeader from '../Layout/EateryProfileHeader';
import AuthContext from '../../AuthContext';
import { extractEateries } from '../../utils/token';

export function EateryDish({e_id}) {
    const [dishdetail, setDishDetail] = React.useState({});
    const [noDish, setNoDish] = React.useState(false);
    const token = React.useContext(AuthContext);
    const u_id = extractUId(token);
    console.log(token, u_id)

    React.useEffect(() => {
      axios
        .get('/eatery/getdish', { params: { e_id } })
        .then(({ data }) => {
            console.log(data);
            setDishDetail(data)
            console.log(dishdetail);
            const dish_li = document.getElementById('eaterydish_list')
            if (data.length > 0) {
              Array.from(data).forEach(elm => {
                  console.log(elm)
                  dish_li.appendChild(showDish(elm))
              })
            } else {
              setNoDish(true)
            }
        })
        .catch((err) => {
          setNoDish(true)
          console.error(err);
        });
    }, []);

    const showDish = (data) => {
      console.log(data)
      const dish_li = document.getElementById('eaterydish_list')
      const dish_card = document.createElement('div')
      dish_card.className = 'eaterydish_container'

      const image_area = document.createElement('span')
      image_area.className = 'eaterydish_image_area'
      const image = new Image();
      image.src = data['image_src']
      image.className = 'eaterydish_image'
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

      const price_area = document.createElement('div')
      price_area.className = 'dish_price_area'

      const price = document.createElement('span')
      price.innerHTML = `$ ${data['price']}`
      price.className = 'dish_price'

      price_area.appendChild(price)
      const dish_id = data["dish_id"]
      console.log(dish_id)
      console.log(data)
      dish_card.appendChild(dish_info_area)
      dish_card.appendChild(price_area)
      return dish_card
    }

  return (
    <div style={{ overflowY: 'auto', height: 700, position: 'relative'}} >
        <div className='search_bar' id='search_bar'>
        </div>
        <div style={{ marginLeft: '0%' }} id='eaterydish_list'>
          {
            (noDish) ?
            <>
              The restaurant has not uploaded any dishes
            </> : <> </>
          }
        </div>
    </div>
  );
}

export default EateryDish;