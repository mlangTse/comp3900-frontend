export const drawerWidth = 240;
export const url = 'http://localhost:' + window.BACKEND_PORT;
export const PAGINATION_SIZE = 50;
export const SLICE_SIZE = 10;

export const customStyles = {
  control: styles => ({ ...styles, backgroundColor: 'white', width: 170, marginLeft: 5, zIdex: '9999'}),
  option: styles => ({ ...styles}),
  menu: styles => ({ ...styles, width: 200}),
}

export const cuisineOptions = [
  {value: 'desserts', label: 'Desserts'},
  {value: 'drinks', label: 'Drinks'},
  {value: 'fast food', label: 'Fast food'},
  {value: 'pizza', label: 'Pizza'},
  {value: 'chicken', label: 'Chicken'},
  {value: 'vegen', label: 'Vegen'},
  {value: 'asian', label: 'Asian'},
  {value: 'european', label: 'European'},
  {value: 'mexican', label: 'Mexican'}
]

export const discountOptions = [
  {value: '10', label: '10-30%'},
  {value: '30', label: '30-60%'},
  {value: '60', label: 'above 60%'}
]

export const paymentOptions = [
  {value: 'Cash', label: 'Cash'},
  {value: 'PayPal', label: 'PayPal'},
  {value: 'Credit Card', label: 'Credit Card'}
]

export const locationOption = [
  {value: 'Alexandria', label: 'Alexandria'},
  {value: 'Annandale', label: 'Annandale'},
  {value: 'Barangaroo', label: 'Barangaroo'},
  {value: 'Beaconsfield', label: 'Beaconsfield'},
  {value: 'Camperdown', label: 'Camperdown'},
  {value: 'Centennial Park', label: 'Centennial Park'},
  {value: 'Chippendale', label: 'Chippendale'},
  {value: 'Darlinghurst', label: 'Darlinghurst'},
  {value: 'Darlington', label: 'Darlington'},
  {value: 'Dawes Point', label: 'Dawes Point'},
  {value: 'Elizabeth Bay', label: 'Elizabeth Bay'},
  {value: 'Erskineville', label: 'Erskineville'},
  {value: 'Eveleigh', label: 'Eveleigh'},
  {value: 'Forest Lodge', label: 'Forest Lodge'},
  {value: 'Glebe', label: 'Glebe'},
  {value: 'Haymarket', label: 'Haymarket'},
  {value: 'Millers Point', label: 'Millers Point'},
  {value: 'Moore Park', label: 'Moore Park'},
  {value: 'Newtown', label: 'Newtown'},
  {value: 'Paddington', label: 'Paddington'},
  {value: 'Potts Point', label: 'Potts Point'},
  {value: 'Pyrmont', label: 'Pyrmont'},
  {value: 'Redfern', label: 'Redfern'},
  {value: 'Rosebery', label: 'Rosebery'},
  {value: 'Rushcutters Bay', label: 'Rushcutters Bay'},
  {value: 'St Peters', label: 'St Peters'},
  {value: 'Surry Hills', label: 'Surry Hills'},
  {value: 'Sydney CBD', label: 'Sydney CBD'},
  {value: 'The Rocks', label: 'The Rocks'},
  {value: 'Ultimo', label: 'Ultimo'},
  {value: 'Waterloo', label: 'Waterloo'},
  {value: 'Woolloomooloo', label: 'Woolloomooloo'},
  {value: 'Zetland', label: 'Zetland'},
]

export const TimeOption = getTime()
function getTime() {
  var options = []

  for (var i = 0; i < 24 * 2; i++) {
    var timeslot = `${i < 20 ? '0' : ''}${Math.floor(i / 2)}:${i % 2 === 0 ? '00' : '30'}`
    options.push({
      value: timeslot,
      label: timeslot
    })
  }
  return options
}

export const DateOption = getDate()
function getDate() {
  const MONTHS = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var options = []
  var startDate = new Date()

  for (var i = 0; i < 7; i++) {
    options.push({
      value: `${MONTHS[startDate.getMonth()]} ${startDate.getDate()}`,
      label: `${MONTHS[startDate.getMonth()]} ${startDate.getDate()}`
    })
    startDate.setDate(startDate.getDate() + 1)
  }
  return options
}