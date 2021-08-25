import React from 'react';
import { cuisineOptions, paymentOptions, discountOptions, customStyles, locationOption, DateOption, TimeOption } from '../utils/constants';
import { Input, Button, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

export const fetchSearchData = (option, value) => {
  return option.map(elm => {
          if (elm['value'] == value) return elm
          }).filter((e) => {
            if (e == "" || e == null) return false
            return true
          })[0]
}

export const useSearchData = (urlParams, setSelectedValue, setSearchValue) => {
  React.useEffect(() => {
    var check_value = ['time', 'date', 'suburb', 'cuisine', 'discount', 'payment', 'query_str']

    const updatedState = {}
    const SearchState = {}

    for (let elm of check_value) {
      var data = urlParams.get(elm);
      if (data != null) {
        switch (elm) {
          case 'cuisine':
            data = fetchSearchData(cuisineOptions, data)
            break;

          case 'payment':
            data = fetchSearchData(paymentOptions, data)
            break;

          case 'discount':
            data = fetchSearchData(discountOptions, data)
            break;

          case 'suburb':
            data = fetchSearchData(locationOption, data)
            break;

          case 'time':
            data = fetchSearchData(TimeOption, data)
            break;

          case 'date':
            data = fetchSearchData(DateOption, data)
            break;

          default:
            break;
        }
      } else {
        console.log('search data', data, elm)
        data = ''
      }

      if (elm != 'query_str') {
        updatedState[elm] = data
      }
      SearchState[elm] = (data == '' || elm == 'query_str') ? data:data['value']
    }

    setSelectedValue(updatedState)
    setSearchValue(SearchState)

  }, []);
}

export const getQuery = (searchValue) => {
  const serialize = obj => Object.keys(obj).map(key => { if (obj[key] != "") return `${key}=${encodeURIComponent(obj[key])}`})
  var query = serialize(searchValue).filter((e) => {
    if (e == "" || e == null || e == undefined) return false
    return true
  }).join('&')
  return query
}

export function SearchFilter(handleChange, searchValue, selectedValue, history) {
  return (
    <>
    <Select
      styles={customStyles}
      components={animatedComponents}
      value={selectedValue['time']}
      placeholder='Time'
      options={TimeOption}
      onChange={handleChange('time')}/>
    <Select
      styles={customStyles}
      components={animatedComponents}
      value={selectedValue['date']}
      placeholder='Date'
      options={DateOption}
      onChange={handleChange('date')}/>
    <Select
      styles={customStyles}
      components={animatedComponents}
      value={selectedValue['suburb']}
      placeholder='Location'
      options={locationOption}
      onChange={handleChange('suburb')}/>
    <Select
      styles={customStyles}
      components={animatedComponents}
      options={cuisineOptions}
      value={selectedValue['cuisine']}
      placeholder='Cuisine'
      onChange={handleChange('cuisine')}/>
    <Select
      styles={customStyles}
      components={animatedComponents}
      options={discountOptions}
      value={selectedValue['discount']}
      placeholder='Discount'
      onChange={handleChange('discount')}/>
    <Select
      styles={customStyles}
      components={animatedComponents}
      options={paymentOptions}
      value={selectedValue['payment']}
      placeholder='Payment method'
      onChange={handleChange('payment')}/>
    {showReset(searchValue, selectedValue, history)}
    </>
  )
}

function showReset(searchValue, selectedValue, history) {
  var search = ['time', 'date', 'suburb', 'cuisine', 'discount', 'payment']
  var flag = 0

  for (let i of search) {
    if (selectedValue[i] != undefined && selectedValue[i] != null && selectedValue[i] != '') {
      flag = 1
      break
    }
  }

  if (flag) {
    return (
      <>
        <a style={{color: 'rgb(24, 144, 255)', fontSize: 'large'}} onClick={() => emptySearch(searchValue, history)}>
          Reset
        </a>
      </>
    )
  }
  return(
    <></>
  )
}

function emptySearch(searchValue, history) {
  console.log('reset', searchValue)
  if (searchValue['query_str'] == undefined || searchValue['query_str'] == null ||  searchValue['query_str'] == '') {
    history.push(`${history.location.pathname}`)
    window.location.reload()
    return
  }
  history.push(`${history.location.pathname}?query_str=${searchValue['query_str']}`)
  window.location.reload()
}

export const getColumnSearchProps = (dataIndex, searchValue, setSearchValue) => ({
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
    <div style={{ padding: 8 }}>
      <Input
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0]}
        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={() => handleSearch(setSearchValue)(selectedKeys, confirm, dataIndex)}
        style={{ marginBottom: 8, display: 'block' }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => handleSearch(setSearchValue)(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Search
        </Button>
        <Button onClick={() => handleReset(setSearchValue)(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
        <Button
          type="link"
          size="small"
          onClick={() => {
            confirm({ closeDropdown: false });
            setSearchValue({
              searchText: selectedKeys[0],
              searchedColumn: dataIndex,
            });
          }}
        >
          Filter
        </Button>
      </Space>
    </div>
  ),
  filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
  onFilter: (value, record) =>
    record[dataIndex]
      ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
      : '',
  render: text =>
  searchValue.searchedColumn === dataIndex ? (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[searchValue.searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ''}
      />
    ) : (
      text
    ),
});


// search in table
const handleSearch = (setSearchValue) => (selectedKeys, confirm, dataIndex) => {
  confirm();
  setSearchValue({
    searchText: selectedKeys[0],
    searchedColumn: dataIndex,
  });
};

const handleReset = (setSearchValue) => clearFilters => {
  clearFilters();
  setSearchValue({ searchText: '' });
};
