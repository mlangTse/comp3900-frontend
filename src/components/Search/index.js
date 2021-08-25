import {
  Typography
} from '@material-ui/core';
import axios from 'axios';
import React from 'react';
import { useHistory } from "react-router-dom";
import LinearProgress from '@material-ui/core/LinearProgress';

import AuthContext from '../../AuthContext';
import { showVoucher } from '../voucherCard';
import { makePagination } from '../pagination';
import {useSearchData, getQuery, SearchFilter} from '../SearchHelper'

function Search({location}) {
  const token = React.useContext(AuthContext);
  const [selectedValue, setSelectedValue] = React.useState({})
  const [searchValue, setSearchValue] = React.useState({})
  const [loading, setLoading] = React.useState(true);
  const [vouchers, setVouchers] = React.useState([]);
  const [nResults, setNResults] = React.useState();

  const urlParams = new URLSearchParams(location.search);
  var page = urlParams.get('page');
  if (page == null) page = 1

  // fetch search data
  useSearchData(urlParams, setSelectedValue, setSearchValue)

  const history = useHistory();
  function performSearch() {
    // fetch search query
    const query = getQuery(searchValue)
    console.log('query', query, page)

    var check_value = ['time', 'date', 'suburb', 'cuisine', 'discount', 'payment', 'query_str']
    var flag = 0
    for (let elm of check_value) {
      if (searchValue[elm] == undefined) {
        flag = 1
        break
      }
    }

    if (flag) return

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
    .then(({data}) => {
      const list = document.getElementById('voucher_list')
      while (list.firstChild) {
        list.removeChild(list.lastChild)
      }
      Array.from(data['voucher_list']).forEach(elm => {
        list.appendChild(showVoucher(elm)(history))
      })
      setVouchers(data['vouchers'])
      setNResults(data['total'])
      setLoading(false);

      // setup pagaination
      const pagination_list = document.getElementById('pagination')
      while (pagination_list.firstChild) {
        pagination_list.removeChild(pagination_list.lastChild)
      }
      makePagination(page, nResults, query, 'search')

      // jump to search page
      if (query != '') {
        if (Number(page) == 1) {
          history.push(`/search?` + query)
        } else {
          history.push(`/search?page=${page}&` + query)
        }
      }
    })
    .catch((err) => {
      setLoading(false);
    });
  }

  React.useEffect(() => {
    performSearch();
  }, [searchValue])

  const handleChange = name => value => {
    console.log('hi', name, value)
    setSearchValue({ ...searchValue, [name]: value['value'] })
    setSelectedValue({ ...selectedValue,  [name]: value})
  }

  return (
    <div className='page_container' style={{maxWidth: '1180px'}}>
      <div style={{margintop: 100}} >
        <Typography variant="h4" >
          {(searchValue['query_str'] == '') ?
            'All Deals':`Results for '${searchValue['query_str']}'`}
        </Typography>
        {/* search bar */}
        <div className='search_bar' id='search_bar' style={{display: 'relative', margin: '0 auto', width: '100%'}}>
          {SearchFilter(handleChange, searchValue, selectedValue, history)}
        </div>
      </div>

      {(loading) ?
          <LinearProgress />
      :
          (nResults == '0') ?
              <Typography variant="h6">Your search did not return any results 🙁</Typography>
          :
          <>
          </>
      }

      {/* result */}
      <div style={{marginLeft: '10%'}} id='voucher_list'/>

      {/* pagination */}
      <div id='pagination' className='pagination' />
      <div className='pagination' style={{width: 180, height: 10}}>
        <span>{(nResults == '0') ? '0' : 1+((page-1)*30)}-{(nResults > page*30) ? page*30 : nResults}&nbsp;of&nbsp;{nResults}&nbsp;results</span>
      </div>
    </div>
  )

}

export default Search;