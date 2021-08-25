import '../static/styles/reset.css'

export function showRating(star_rating, n_rating) {
  var rating_style = 'padding-right: 10px; display: inline-block;'
  const rating_block = document.createElement('div')

  if (n_rating > 5) {
    rating_block.style.cssText = 'padding-left: 10px; display: inline-block; height: 20px;  font-size: medium; '
    const rating = document.createElement('a')
    rating.innerText = star_rating
    rating.style.cssText = rating_style

    const star = document.createElement('span')
    star.className = 'Stars'
    star.style.cssText = `--rating: ${star_rating}`

    const n_ratings = document.createElement('a')
    n_ratings.innerHTML = `${n_rating} Ratings`

    rating_block.appendChild(rating)
    rating_block.appendChild(star)
    rating_block.appendChild(n_ratings)
  }

  return rating_block
}