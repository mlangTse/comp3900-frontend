import React from 'react';
import axios from 'axios';
import {
  Button,
  ClickAwayListener,
  MenuList,
  MenuItem,
  Popper,
  Paper
} from '@material-ui/core';
import {
  Comment,
  Tooltip,
  List,
  Form,
  Input,
  Modal
} from 'antd';
import moment from 'moment';
import { Rate } from 'antd';
import { useHistory } from 'react-router-dom';
import { DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled } from '@ant-design/icons';

import 'antd/dist/antd.css';

const { TextArea } = Input;
const data1 = [
  {
    // actions: [<span key="comment-list-reply-to-0">Reply to</span>],
    author: 'Han Solo',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    content: (
      <p>
        We supply a series of design principles, practical patterns and high
        quality design resources (Sketch and Axure), to help people create their
        product prototypes beautifully and efficiently.
      </p>
    ),
    datetime: (
      <Tooltip
        title={moment()
          .subtract(1, 'days')
          .format('YYYY-MM-DD HH:mm:ss')}
      >
        <span>
          {moment()
            .subtract(1, 'days')
            .fromNow()}
        </span>
      </Tooltip>
    ),
    rate: 1
  }
];

export function ShowReview({ e_id, reply }) {
  const [reviewslist, setrewiew] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [likes, setLikes] = React.useState(0);
  const [dislikes, setDislikes] = React.useState(0);
  const [openReply, setOpenReply] = React.useState(false);
  const [writeReply, setWriteReply] = React.useState('');
  const [sortSting, setSortSting] = React.useState('Most Recent');

  const anchorRef = React.useRef(null);
  const history = useHistory()
  const urlParams = new URLSearchParams(history.location.search)
  const order = urlParams.get('sort')

  // sorting
  React.useEffect(() => {
    axios
      .get('/eatery/getreview', { params: { e_id } })
      .then(({ data }) => {
        console.log(data)
        if (order == 'asce') {
          setrewiew(data.sort(function(f, s) {
            return f.rate - s.rate;
          }))
          setSortSting('Lowest Rated')
        } else if (order == 'desc'){
          setrewiew(data.sort(function(f, s) {
            return s.rate - f.rate;
          }))
          setSortSting('Highest Rated')
        } else {
          setrewiew(data.sort(function(f, s) {
            return moment(s.date, 'YYYY-MM-DD').diff(moment(f.date, 'YYYY-MM-DD'));
          }))
          setSortSting('Most Recent')
        }
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
        console.error(err);
      });
  }, [])

  const handleClose = () => {
    setOpen(false)
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const sortTime = () => {
    history.push(`${history.location.pathname}?sort=recent`)
    window.location.reload()
  }

  const sortDesc = () => {
    history.push(`${history.location.pathname}?sort=desc`)
    window.location.reload()
  }

  const sortAsce = () => {
    history.push(`${history.location.pathname}?sort=asce`)
    window.location.reload()
  }

  // reply
  const handleChange = (event) => {
    //console.log(event);
    setWriteReply(event.target.value);
  }

  const handleOk = () => {
    alert('The review was submitted: ' + writeReply);

    setOpenReply(false);
  };

  const handleCancel = () => {
    setOpenReply(false);
  };

  // comment
  const actions = [
    (!reply) ? <Tooltip key="comment-basic-like" title="Like">
      <span>
        {React.createElement(LikeOutlined)}
        <span className="comment-action">{likes}</span>
      </span>
    </Tooltip> : <></>,
    (!reply) ? <Tooltip key="comment-basic-dislike" title="Dislike">
      <span>
        {React.createElement(DislikeOutlined)}
        <span className="comment-action">{dislikes}</span>
      </span>
    </Tooltip> : <></>,
    (reply) ? <span onClick={() => {setOpenReply(true);}} key="comment-basic-reply-to">Reply</span> : <></>,
  ];

  return (
    <>
      <Button
        style={{marginLeft: 'auto', display: 'flex'}}
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        Sort by: {sortSting}
      </Button>
      <Popper style={{zIndex: '9999'}} open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
        <Paper>
          <ClickAwayListener onClickAway={handleClose}>
            <MenuList autoFocusItem={open} id="menu-list-grow">
              <MenuItem onClick={sortTime}>Most Recent</MenuItem>
              <MenuItem onClick={sortDesc}>Highest Rated</MenuItem>
              <MenuItem onClick={sortAsce}>Lowest Rated</MenuItem>
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>

      <List
        style={{overflowY: 'scroll', height: 800}}
        loading={loading}
        className="comment-list"
        itemLayout="horizontal"
        dataSource={reviewslist}
        renderItem={item => (
          <li>
            <Rate disabled defaultValue={item.rate} />
            <Comment
              actions={actions}
              author={item.user_name}
              avatar={item.avatar}
              content={<p>{item.review}</p>}
              datetime={item.date}
            />
          </li>
        )}
      />
      <Modal
        title="Reply"
        visible={openReply}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form name="basic" labelCol={{ span: 5 }} wrapperCol={{ span: 30 }}>
          <Form.Item label="comment" name="comment">
            <TextArea
              showCount
              maxLength={100}
              value={writeReply}
              placeholder="Please leave reply"
              onChange={handleChange}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
export default ShowReview;