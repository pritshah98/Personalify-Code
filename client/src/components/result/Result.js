import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import CardGrid from './CardGrid';
import Spinner from '../layout/Spinner';
import { withRouter, useHistory } from 'react-router-dom';
import { clearResult, setResult } from '../../actions/result';
import { connect } from 'react-redux';

const Result = ({ result, playlist, setResult, clearResult }) => {
  useEffect(() => {
    let isMounted = true;
    if (isMounted) setResult(result, localStorage.getItem('accessToken'));
    return () => {
      isMounted = false;
    };
  }, [setResult, result]);

  const history = useHistory();

  return (
    <div className='result'>
      <strong>Here is a playlist generated based on your answers!</strong>
      <div>
        <button
          className='btn btn-primary'
          onClick={(e) => {
            clearResult();
            history.push('/spotifyapp/quiz');
          }}
        >
          Retake quiz!
        </button>
      </div>
      {playlist.tracks ? <CardGrid songs={playlist.tracks} /> : <Spinner />}
    </div>
  );
};

Result.propTypes = {
  result: PropTypes.string.isRequired,
  playlist: PropTypes.object.isRequired,
  setResult: PropTypes.func.isRequired,
  clearResult: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  result: state.result.result,
  playlist: state.result.playlist,
});

export default connect(mapStateToProps, { setResult, clearResult })(
  withRouter(Result)
);
