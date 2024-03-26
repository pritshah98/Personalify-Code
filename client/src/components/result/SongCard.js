import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import axios from 'axios';
import { useAlert } from 'react-alert';

const SongCard = (props) => {
  useEffect(() => {
    songAlreadySaved(props.song.id);
  }, [songAlreadySaved, props.song.id]);

  const song = props.song;
  const alert = useAlert();

  const [songState, setSongState] = useState(true);

  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    details: {
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      flex: '1 0 auto',
    },
    cover: {
      width: 200,
    },
    controls: {
      display: 'flex',
      alignItems: 'center',
      paddingLeft: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    playIcon: {
      height: 38,
      width: 38,
    },
    addIcon: {
      height: 30,
      widght: 30,
    },
    checkIcon: {
      height: 30,
      width: 30,
    },
  }));

  const classes = useStyles();

  async function saveSong(id) {
    try {
      await axios.post(
        `/spotify/save_track/${id}/${localStorage.getItem('accessToken')}`
      );
      setSongState(false);
      alert.show('Successfully saved the song to your Spotify library!');
    } catch (error) {
      alert.show('Unable to save the song to your Spotify library!');
      console.error(error);
    }
  }

  async function deleteSong(id) {
    try {
      await axios.delete(
        `/spotify/delete_track/${id}/${localStorage.getItem('accessToken')}`
      );
      setSongState(true);
      alert.show('Successfully deleted the song from your Spotify library!');
    } catch (error) {
      alert.show('Unable to delete the song from your Spotify library!');
      console.error(error);
    }
  }

  async function songAlreadySaved(id) {
    try {
      const res = await axios.get(
        `/spotify/check_saved/${id}/${localStorage.getItem('accessToken')}`
      );
      if (res.data[0] === true) setSongState(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <td key={song.id}>
      <Card className={classes.root}>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Typography>{song.name}</Typography>
            <Typography variant='subtitle1' color='textSecondary'>
              {song.artists[0].name}
            </Typography>
          </CardContent>
          <div className={classes.controls}>
            <IconButton
              aria-label='play/pause'
              onClick={(e) => {
                e.preventDefault();
                window.open(`${song.external_urls.spotify}`, '_blank');
              }}
            >
              <PlayArrowIcon className={classes.playIcon} />
            </IconButton>
            {songState ? (
              <IconButton
                aria-label='add'
                onClick={(e) => {
                  e.preventDefault();
                  saveSong(song.id);
                }}
              >
                <AddIcon className={classes.addIcon} />
              </IconButton>
            ) : (
              <IconButton
                aria-label='delete'
                onClick={(e) => {
                  e.preventDefault();
                  deleteSong(song.id);
                }}
              >
                <CheckIcon className={classes.checkIcon} />
              </IconButton>
            )}
          </div>
        </div>
        <CardMedia
          className={classes.cover}
          image={song.album.images[0].url}
          title={song.album.name}
        />
      </Card>
    </td>
  );
};

SongCard.propTypes = {
  song: PropTypes.object.isRequired,
};

export default SongCard;
