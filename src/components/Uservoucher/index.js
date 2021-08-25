import React from 'react';
import axios from 'axios';
import 'antd/dist/antd.css';
import { Tooltip,Button, Table, Typography,Layout  } from 'antd';
import WriteReview from '../WriteReview';
import ProfileHeader from '../Layout/ProfileHeader';
import { getColumnSearchProps } from '../SearchHelper';

const { Title } = Typography;
const {Content} = Layout;
const text = <span>You can review voucher you used only</span>;

const sortdata = {
  Ready: 1,
  Used: 3,
  Expired:4,
  'Not Ready':2
}

function onChange(pagination, filters, sorter, extra) {
  console.log('params', pagination, filters, sorter, extra);
}

export function Uservoucher({token}) {
  const [voucherlist, setvoucher] = React.useState([])
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
      title: 'Eatery Name',
      dataIndex: 'e_name',
      ...getColumnSearchProps('e_name', searchValue, setSearchValue)
    },
    {
      title: 'Code',
      dataIndex: 'code'
    },
    {
      title: 'Use Period',
      dataIndex: 'period',
      ...getColumnSearchProps('period', searchValue, setSearchValue)
    },
    {
      title: 'State',
      dataIndex: 'state',
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
    },
    {
      title: 'Write Rewiew',
      dataIndex: 'rewiew'
    }
  ];

  React.useEffect(() => {
    axios
      .get('/user/get/voucher', { params: { token } })
      .then(({ data }) => {
        // to do
        // let total = data['total']
        let voulist = data['voucher_list']
        let key = 1
        let newlist = []
        Array.from(voulist).forEach(elm => {
            console.log(elm)
            newlist.push(addvoucher(elm,key))
            key += 1
        })
        setvoucher(newlist)
      })
      .catch((err) => {
        console.error(err);
      });
  }, [])

  const addvoucher = (data,key) => {
    return {
      key: key.toString(),
      name: data['name'],
      code: data['key'],
      state: data['state'],
      e_name: data['e_name'],
      rewiew: review(data['state'],data['e_id']),
      period: data['period']
    }
  }

  const review = (data,e_id) => {
    if (data != 'Used') {
      return (
        <Tooltip placement="top" title={text}>
        <Button type="primary" disabled={true}>
        Write Review
        </Button>
      </Tooltip>
      )
    }
    return <WriteReview e_id = {e_id} token = {token}/>
  }

  return(
    <div >
      <ProfileHeader/>
      <Layout className='page_container' style={{background:"#fff", maxWidth: 1258 }}>
        <Title className="title1" style={{ flex: 1, textAlign: 'center' }}>
          My Voucher
        </Title>
        <Layout style={{background:"#fff" }}>
          <Content >
            <Table columns={columns} dataSource={voucherlist}/>
          </Content>
        </Layout>
      </Layout>
  </div>
  )
}
export default Uservoucher