import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';
import { getApiAccessToken } from '../../actions/auth';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from './Spinner';
let render_count = 0;

export const RedirectURI = ({ getApiAccessToken, isAuthenticated }) => {
  useEffect(() => {
    getApiAccessToken();
  }, [getApiAccessToken]);

  render_count += 1;

  console.log(render_count);
  console.log(window.location.href);

  if (render_count === 2 && window.location.href.includes('error')) {
    return <Redirect to='/' />;
  } else if (render_count >= 3 || isAuthenticated) {
    return <Redirect to='/spotifyapp/quiz' />;
  } else if (window.location.href.includes('error')) {
    return <Redirect to='/' />;
  } else {
    return <Spinner />;
  }
};

RedirectURI.propTypes = {
  isAuthenticated: PropTypes.bool,
  getApiAccessToken: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { getApiAccessToken })(
  withRouter(RedirectURI)
);
