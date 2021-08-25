export function makePagination(page, total, query, path) {
  console.log('total', total, 'page', page)
  if (total == undefined || total == null || Number(total) <= 30) return
  const pagination_list = document.getElementById('pagination')

  var total = Number(total)
  var page = Number(page)
  total = (total/30)+1
  
  if (total < 5) {
    for (let i = 1; i <= total; i++) {
      const a = document.createElement('a')
      a.innerHTML = `${i}`
      a.href = `/${path}?page=${i}&` + query
      if (a.innerHTML == page) a.className = 'active'
      pagination_list.appendChild(a)
    }
    return
  }

  if (page > 1) {
    const a = document.createElement('a')
    a.innerHTML = '&laquo'
    a.href = `/${path}?page=${page-1}&` + query
    pagination_list.appendChild(a)
  }

  var p = (page > total/2) ? [1, '...', page-1, page, page+1]:[page-1, page, page+1, '...', total]
  var p = (page == 1) ? [page, page+1, page+2, '...', total]:p
  var p = (page == total) ? [1, '...', page-2, page-1, page]:p
  for (let i of p) {
    const a = document.createElement('a')
    a.innerHTML = i
    pagination_list.appendChild(a)
    if (i == '...') continue
    a.href = `/${path}?page=${i}&` + query
    if (a.innerHTML == page) a.className = 'active'
  }

  if (page != total) {
    const a = document.createElement('a')
    a.innerHTML = '&raquo'
    a.href = `/${path}?page=${page+1}&` + query
    pagination_list.appendChild(a)
  }
}