export function extractUId(token) {
  let u_id = localStorage.getItem('u_id');
  if (u_id == null || u_id == 'undefined') {
  	u_id = -1;
  }
  return u_id;
}

export function extractEId(token) {
  let e_id = localStorage.getItem('e_id');
  if (e_id == null || e_id == 'undefined') {
  	e_id = -1;
  }
  return e_id;
}

export function extractEateries(token) {
  let eateries = JSON.parse(localStorage.getItem('eateries'))
  var a = new Array()
  Array.from(eateries).forEach(elm => {
    let i = JSON.parse(elm)
    a.push(i)
  })
  return a
}