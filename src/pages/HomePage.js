import axios from 'axios';
import React from 'react';
import { useHistory } from "react-router-dom";

import Layout from '../components/Layout';
import { makePagination } from '../components/pagination'
import Recommendation from '../components/Recommend';
import { showVoucher } from '../components/voucherCard';
import { getQuery, SearchFilter, useSearchData } from '../components/SearchHelper';
import SimpleImageSlider from "react-simple-image-slider";


import '../static/styles/reset.css';
import '../static/styles/home.css';
import '../static/styles/body.css';
import coverImg from '../static/valueEat.jpg'
import coverImg2 from '../static/KFC_chicken.png'
import coverImg3 from '../static/pizza.jpg'

function HomePage({ location }) {
  const history = useHistory();
  const [selectedValue, setSelectedValue] = React.useState({})
  const [searchValue, setSearchValue] = React.useState({})
  const [values, setValues] = React.useState();
  const [imageWidth, setImageWidth] = React.useState(0);
  const urlParams = new URLSearchParams(location.search);
  var page = urlParams.get('page');
  if (page == null) page = '1'

  // fetch search data
  useSearchData(urlParams, setSelectedValue, setSearchValue)

  // setup page after search query change
  React.useEffect(() => {
    // fetch search query
    const query = getQuery(searchValue)
    console.log('query', query, query!='', page)

    setImageWidth(document.getElementById('tmp').getBoundingClientRect().width)

    // search
    axios.get('/get/search', {
      params: {
        page,
        payment_method: (searchValue['payment'] == undefined) ? '' : searchValue['payment'],
        cuisine: (searchValue['cuisine'] == undefined) ? '' : searchValue['cuisine'],
        discount: (searchValue['discount'] == undefined) ? '' : searchValue['discount'],
        keyword: (searchValue['query_str'] == undefined) ? '' : searchValue['query_str'],
        suburb: (searchValue['suburb'] == undefined) ? '' : searchValue['suburb'],
        time: (searchValue['time'] == undefined) ? '' : searchValue['time'],
        date: (searchValue['date'] == undefined) ? '' : searchValue['date'],
      },
    })
    .then(({ data }) => {
      const list = document.getElementById('voucher_list')
      while (list.firstChild) {
        list.removeChild(list.lastChild)
      }
      Array.from(data['voucher_list']).forEach(elm => {
        list.appendChild(showVoucher(elm)(history))
      })
      setValues(data['total'])

      // setup pagaination
      const pagination_list = document.getElementById('pagination')
      while (pagination_list.firstChild) {
        pagination_list.removeChild(pagination_list.lastChild)
      }
      makePagination(page, values, query, 'voucher')

      // jump to search page
      if (query != '') {
        if (Number(page)) {
          history.push(`/voucher?` + query)
        } else {
          history.push(`/voucher?page=${page}&` + query)
        }
      }
    })
    .catch((err) => {
        console.error(err);
    });
  }, [searchValue])

  const handleChange = name => value => {
    console.log('hi', name, value)
    setSearchValue({ ...searchValue, [name]: value['value'] })
    setSelectedValue({ ...selectedValue,  [name]: value})
  }

  return (
      <Layout
        body={
          <>
            <div className='page_container' style={{maxWidth: '1528px'}}>
              <div className='search_bar' id='search_bar' style={{display: 'relative', margin: '0 auto', width: '100%', maxWidth: '1060px', borderBottom: '1px solid rgb(233, 229, 229)', marginBottom: 20}}>
                {SearchFilter(handleChange, searchValue, selectedValue, history)}
              </div>

              <Recommendation page={page}/>

              <div className='recommendation' id='recommendation'>
                <SimpleImageSlider
                  showNavs={1}
                  showBullets={true}
                  width={imageWidth}
                  height={550}
                  images={[
                    {url: coverImg},
                    {url: coverImg2},
                    {url: coverImg3},
                    {url: coverImg}
                  ]}
                />
              </div>

              <h2 id='tmp' style={{ display: 'block', fontSize: 'large', width:'80%', margin: '0 auto', marginBottom: '10px'}}>So Many Deals... See Them All!</h2>
              <div style={{marginLeft: '10%'}} id='voucher_list'/>

              <div id='pagination' className='pagination' />
              <div className='pagination' style={{width: 180, height: 10}}>
                <span>{(values == '0') ? '0' : 1+((page-1)*30)}-{(values > page*30) ? page*30 : values}&nbsp;of&nbsp;{values}&nbsp;results</span>
              </div>
            </div>
          </>
        }
      />
  );
}

export default HomePage