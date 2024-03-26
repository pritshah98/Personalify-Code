import React from 'react';

const Landing = () => {
  return (
    <section className='landing'>
      <div className='landing-inner'>
        <h1 className='x-large p-1'>Personalify</h1>
        <p className='lead'>
          Discover a playlist of songs based on your answers to the following
          questions!
        </p>
        <a
          className='btn btn-dark'
          href={'https://personalify.onrender.com/spotify/login'}
        >
          Spotify Login
        </a>
      </div>
    </section>
  );
};

export default Landing;
