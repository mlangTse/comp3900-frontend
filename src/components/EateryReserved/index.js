import 'antd/dist/antd.css';
import { Table  } from 'antd';
import moment from 'moment';
import axios from 'axios';
import React from 'react';
import AuthContext from '../../AuthContext';

import EateryProfileHeader from '../Layout/EateryProfileHeader';
import {Redeem} from '../Redeem'
import { extractEateries } from '../../utils/token';
import { getColumnSearchProps } from '../SearchHelper';

import '../../static/styles/eateryreserved.css'

const text = <span>You can review voucher you used only</span>;

const sortdata = {
  Ready: 1,
  Used: 3,
  Expired:4,
  'Not Ready':2
}

function EateryReserved({ e_id, page}) {
  const token = React.useContext(AuthContext)
  const [results, setResults] = React.useState([])
  const [searchValue, setSearchValue] = React.useState({
    searchText: '',
    searchedColumn: '',
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      ...getColumnSearchProps('name', searchValue, setSearchValue)
    },
    {
      title: 'User Name',
      dataIndex: 'u_name',
      ...getColumnSearchProps('u_name', searchValue, setSearchValue)
    },
    {
      title: 'User Phone',
      dataIndex: 'u_phone',
      ...getColumnSearchProps('u_phone', searchValue, setSearchValue)
    },
    {
      title: 'Start Date',
      dataIndex: 'start_date',
      ...getColumnSearchProps('start_date', searchValue, setSearchValue),
      sorter: (a, b) => moment(a.start_date, 'YYYY-MM-DD').diff(moment(b.start_date, 'YYYY-MM-DD'))
    },
    {
      title: 'Expire Date',
      dataIndex: 'expire_date',
      ...getColumnSearchProps('expire_date', searchValue, setSearchValue),
      sorter: (a, b) => moment(a.expire_date, 'YYYY-MM-DD').diff(moment(b.expire_date, 'YYYY-MM-DD'))
    },
    {
      title: 'Available Time',
      dataIndex: 'available_time',
      ...getColumnSearchProps('available_time', searchValue, setSearchValue),
      sorter: (a, b) => moment(a.availble_time, 'HH:mm:ss-HH:mm:ss').diff(moment(b.availble_time, 'HH:mm:ss-HH:mm:ss'))
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      ...getColumnSearchProps('discount', searchValue, setSearchValue)
    },
    {
      title: 'Reserve State',
      dataIndex: 'reserve',
      filters: [
        {
          text: 'Expired',
          value: 'Expired'
        },
        {
          text: 'Used',
          value: 'Used'
        },
        {
          text: 'Ready',
          value: 'Ready'
        },
        {
          text: 'Not Ready',
          value: 'Not Ready'
        }
      ],
      onFilter: (value, record) => record.state.indexOf(value) === 0,
      sorter: (a, b) => sortdata[a.state] - sortdata[b.state],
      defaultSortOrder: 'ascend'
    }
  ];

  React.useEffect(() => {
    axios
      .get('/eatery/get/reservation', { params: { token, e_id } })
      .then(({ data }) => {
        let voulist = data
        let key = 1
        let newlist = []
        Array.from(voulist).forEach(elm => {
            console.log(elm)
            newlist.push(addvoucher(elm,key))
            key += 1
        })
        setResults(newlist)
      })
      .catch((err) => {
        console.error(err);
      });
  }, [])

  const addvoucher = (data,key) => {
    return {
      key: key.toString(),
      name: data['name'],
      u_name: data['u_name'],
      u_phone: data['u_phone'],
      start_date: data['start_date'],
      expire_date: data['expire_date'],
      available_time: data['available_time'],
      discount:data['discount'],
      reserve: data['reserve'],
    }
  }

  return (
    <div>
      <EateryProfileHeader e_id={e_id} eateries={extractEateries(token)} />
      <div style={{maxWidth: '1228px'}} className='page_container'>
        <div className='reserved_bar'>
          <nav>
            <Redeem e_id = {e_id}/>
          </nav>
        </div>

      <Table columns={columns} dataSource={results}/>

      </div>
    </div>
  );
}

export default EateryReserved