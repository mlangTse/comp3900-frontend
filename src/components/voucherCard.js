import { showRating } from "./showRating"
import '../static/styles/home.css';

export const showVoucher = data => history  => {
  const item_card = document.createElement('div')
  item_card.className = 'card item_card'
  
  item_card.onclick = () => {
    history.push(`/deals/${data['v_id']}`, {v_id: data['v_id'], e_id: data['e_id']})
  }

  const img = new Image()
  img.src = data['image_src']
  img.className = 'item_card_img'

  const title = document.createElement('span')
  title.textContent = data['title']
  title.className = 'item_card_title'

  const addr = document.createElement('span')
  addr.innerHTML = data['e_name'] + ' &#183; ' + data['address']
  addr.className = 'item_card_address'

  const price = document.createElement('span')
  price.textContent = data['price']
  price.className = 'item_card_price'

  const discount = document.createElement('span')
  discount.textContent = data['discount']
  discount.className = 'item_card_discount'

  const desc = document.createElement('span')
  desc.textContent = data['description']
  desc.className = 'item_card_description'

  item_card.appendChild(img)
  item_card.appendChild(title)
  item_card.appendChild(addr)
  item_card.appendChild(showRating(data['rating'], data['n_rating']))
  item_card.appendChild(price)
  item_card.appendChild(discount)
  item_card.appendChild(desc)
  return item_card
}