import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import '../../static/styles/reset.css';

const useStyles = makeStyles(() => ({
  body: {
    paddingTop: 130,
  },
}));

function Body({ children }) {
  const classes = useStyles();
  return (
    <div className={classes.body}>
      {/* Padding */}
      {children}
    </div>
  );
}

export default Body;