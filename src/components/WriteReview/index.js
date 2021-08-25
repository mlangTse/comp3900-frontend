import React from 'react';
import axios from 'axios';
import 'antd/dist/antd.css';
import { Modal, Form, Rate, Input, Button } from 'antd';
import { extractEId } from '../../utils/token';
import { FrownOutlined, MehOutlined, SmileOutlined } from '@ant-design/icons';
import AuthContext from '../../AuthContext';

const { TextArea } = Input;

const customIcons = {
  1: <FrownOutlined />,
  2: <FrownOutlined />,
  3: <MehOutlined />,
  4: <SmileOutlined />,
  5: <SmileOutlined />
};

export class WriteReview extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '', visible: false, rating: 3 };
    this.handleChange = this.handleChange.bind(this);
    this.handleRating = this.handleRating.bind(this);
  }
  handleChange(event) {
    //console.log(event);
    this.setState({ value: event.target.value });
  }
  handleRating(event) {
    //console.log(event);
    this.setState({ rating: event });
  }

  showModal = () => {
    this.setState({ visible: true });
  };

  handleOk = () => {
    alert('The review was submitted: ' + this.state.value + this.state.rating);

    axios
      .post(`/user/addratingandreview`, { token: this.props.token, e_id: this.props.e_id, rating: this.state.rating, review: this.state.value, image: '' })
      .then(({ data }) => {
        console.log(data)
        window.location.reload()
      })
      .catch((err) => {
        console.error(err);
      });

    this.setState({ visible: false });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  render() {
    return (
      <>
        <Button type="primary" onClick={this.showModal}>
          Write Review
        </Button>
        <Modal
          title="Review"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form name="basic" labelCol={{ span: 5 }} wrapperCol={{ span: 30 }}>
            <Form.Item label="Rating" name="rating">
              <Rate
                defaultValue={3}
                character={({ index }) => customIcons[index + 1]}
                value={this.state.rating}
                onChange={this.handleRating}
              />
            </Form.Item>
            <Form.Item label="comment" name="comment">
              <TextArea
                showCount
                maxLength={100}
                value={this.state.value}
                placeholder="Please leave comment"
                onChange={this.handleChange}
              />
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}

export default WriteReview