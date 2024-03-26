const express = require('express');
const router = express.Router();
const config = require('config');
const request = require('request');

const client_id = encodeURIComponent(config.get('clientId'));
const client_secret = encodeURIComponent(config.get('clientSecret'));

// Spotify login page
router.get('/login', (req, res) => {
  try {
    const scope = encodeURIComponent('user-read-private user-read-email');
    let url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=code';
    url += '&client_id=' + encodeURIComponent(client_id);
    url +=
      '&scope=' +
      encodeURIComponent(
        'user-read-currently-playing user-modify-playback-state user-read-playback-state user-library-modify user-library-read'
      );
    url +=
      '&redirect_uri=' +
      encodeURIComponent(
        `https://personalify.onrender.com/spotifyapp/redirect`
      );
    url += '&show_dialog=true';
    res.redirect(url);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Get initial access token
router.get('/first_token/:code', (req, res) => {
  try {
    var options = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        response_type: 'token',
        code: req.params.code,
        grant_type: 'authorization_code',
        redirect_uri: `https://personalify.onrender.com/spotifyapp/redirect`,
      },
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${client_id}:${client_secret}`
        ).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      json: true,
    };

    request.post(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token,
          refresh_token = body.refresh_token;
        res.json({
          access_token: access_token,
          refresh_token: refresh_token,
        });
      } else {
        res.status(400).send('Error getting access');
      }
    });
  } catch (error) {
    console.error(error);
    res.status(400).send('Error getting access');
  }
});

// Get refreshed access token
router.get('/refresh_token/:token', (req, res) => {
  try {
    var options = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        grant_type: 'refresh_token',
        refresh_token: req.params.token,
      },
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${client_id}:${client_secret}`
        ).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      json: true,
    };

    request.post(options, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        res.send(access_token);
      } else {
        res.status(404).send('Error getting new token');
      }
    });
  } catch (error) {
    console.error(error);
    res.status(404).send('Error getting new token');
  }
});

// Get spotify profile data
router.get('/me/:token', (req, res) => {
  try {
    var options = {
      url: 'https://api.spotify.com/v1/me',
      headers: { Authorization: 'Bearer ' + req.params.token },
      json: true,
    };

    request.get(options, function (error, response, body) {
      res.send(body);
    });
  } catch (error) {
    console.error(error);
    res.status(404).send('Unable to fetch spotify profile data');
  }
});

// Get personalized playlist
router.get('/playlist/:filter/:token', (req, res) => {
  try {
    const filterObj = req.params.filter;
    var url = 'https://api.spotify.com/v1/recommendations?';

    url = `${url}${filterObj}`;

    var options = {
      url: url,
      headers: { Authorization: 'Bearer ' + req.params.token },
      json: true,
    };

    request.get(options, function (error, response, body) {
      res.send(body);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Save track to user's library
router.post('/save_track/:id/:token', (req, res) => {
  try {
    var url = `https://api.spotify.com/v1/me/tracks?ids=${req.params.id}`;

    var options = {
      url: url,
      headers: { Authorization: 'Bearer ' + req.params.token },
      json: true,
    };

    request.put(options, function (error, response, body) {
      res.send(body);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Check if track is already saved in user's library
router.get('/check_saved/:id/:token', (req, res) => {
  try {
    var url = `https://api.spotify.com/v1/me/tracks/contains?ids=${req.params.id}`;

    var options = {
      url: url,
      headers: { Authorization: 'Bearer ' + req.params.token },
      json: true,
    };

    request.get(options, function (error, response, body) {
      res.send(body);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Remove track from user's library
router.delete('/delete_track/:id/:token', (req, res) => {
  try {
    var url = `https://api.spotify.com/v1/me/tracks?ids=${req.params.id}`;

    var options = {
      url: url,
      headers: { Authorization: 'Bearer ' + req.params.token },
      json: true,
    };

    request.delete(options, function (error, response, body) {
      res.send(body);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
