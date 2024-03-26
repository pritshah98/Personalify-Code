import React from 'react';
import SongCard from './SongCard';
import { connect } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

class CardGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      songsPerPage: 20,
    };
  }

  render() {
    const SONGS_PER_ROW = 5;
    const { page, songsPerPage } = this.state;
    const totalJobs = this.props.songs.length;
    const elemsToDisplay =
      (page + 1) * songsPerPage > totalJobs
        ? totalJobs - page * songsPerPage
        : songsPerPage;

    const renderRows = () => {
      let table = [];
      let row = [];
      for (let i = 0; i < elemsToDisplay; i++) {
        const song = this.props.songs[page * songsPerPage + i];
        row.push(
          <TableCell
            key={i}
            padding='default'
            className='card job-card'
            component={() => <SongCard song={song} />}
          >
            <SongCard {...this.props} key={i} i={i} song={song} />
          </TableCell>
        );
        if ((i + 1) % SONGS_PER_ROW === 0) {
          table.push(<TableRow key={table.length}>{row}</TableRow>);
          row = [];
        }
      }
      if (row.length !== 0) {
        table.push(row);
      }
      return table;
    };
    return (
      <Table className='song-grid'>
        <TableBody>{renderRows()}</TableBody>
      </Table>
    );
  }
}

const mapStateToProps = (state) => ({
  songs: state.result.playlist.tracks,
});

export default connect(mapStateToProps)(CardGrid);
