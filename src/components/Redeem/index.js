import React from 'react';
import axios from 'axios';
import 'antd/dist/antd.css';
import { message, Modal, Form, Input, Button } from 'antd';
import AuthContext from '../../AuthContext';
import { extractEId } from '../../utils/token';

export class Redeem extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = { value: '', visible: false };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  showModal = () => {
    this.setState({ visible: true });
  };


  handleOk = () => {
    if(this.state.value==''){
      message.error('Please type code')
    }else{
      this.setState({ visible: false });
      axios
        .post(`/user/myvouchers/usevouchers`, { token: this.context, e_id:this.props.e_id ,key: this.state.value})
        .then(({ data }) => {
          message
        .loading('Checking..', 1.5)
        .then(() => message.success('Redeem success!The discount rate is ' + data["discount"] + '%!', 3))
        .then(() => message.success('Please wait auto refesh', 3, window.location.reload()));
        })
        .catch((err) => {
          message.error(err);
          // console.error(err);
        });

      this.setState({ visible: false });
    }
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  render() {
    return (
      <>
        <Button type="primary" onClick={this.showModal}>
          Redeem code
        </Button>
        <Modal
          title="Redeem Voucher code"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Back
            </Button>,
            <Button key="submit" type="primary" onClick={this.handleOk}>
              Redeem
            </Button>
          ]}
        >
          <Form name="basic" labelCol={{ span: 5 }} wrapperCol={{ span: 30 }}>
            <Form.Item label="Code" name="Code">
              <Input
                maxLength={10}
                value={this.state.value}
                onChange={this.handleChange}
                placeholder="Please type code"
                enterButton="Redeem"
              />
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}
export default Redeem
