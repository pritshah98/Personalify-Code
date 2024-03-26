import React from 'react';
import quizQuestions from './QuizQuestions';
import Quiz from './Quiz';
import update from 'react-addons-update';
import { withRouter, Redirect } from 'react-router-dom';
import { setResult, setFilter } from '../../actions/result';
import { connect } from 'react-redux';
import genres from './Genres';
let answersArray = [];

class QuizContainter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0,
      questionId: 1,
      question: '',
      answerOptions: [],
      answer: '',
      answersCount: {
        Nintendo: 0,
        Microsoft: 0,
        Sony: 0,
      },
      result: '',
    };
    this.handleAnswerSelected = this.handleAnswerSelected.bind(this);
  }

  componentWillMount() {
    const shuffledAnswerOptions = quizQuestions.map((question) =>
      this.shuffleArray(question.answers)
    );
    this.setState({
      question: quizQuestions[0].question,
      answerOptions: shuffledAnswerOptions[0],
      result: '',
    });
    answersArray = [];
  }

  shuffleArray(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  setUserAnswer(answer) {
    const updatedAnswersCount = update(this.state.answersCount, {
      [answer]: { $apply: (currentValue) => currentValue + 1 },
    });
    this.setState({
      answersCount: updatedAnswersCount,
      answer: answer,
    });
    answersArray.push(answer);
  }

  handleAnswerSelected(event) {
    this.setUserAnswer(event.currentTarget.value);
    if (this.state.questionId < quizQuestions.length) {
      setTimeout(() => this.setNextQuestion(), 300);
    } else {
      setTimeout(() => this.setResults(answersArray), 300);
    }
  }

  setNextQuestion() {
    const counter = this.state.counter + 1;
    const questionId = this.state.questionId + 1;
    this.setState({
      counter: counter,
      questionId: questionId,
      question: quizQuestions[counter].question,
      answerOptions: quizQuestions[counter].answers,
      answer: '',
    });
  }

  setResults(result) {
    var resultString = 'limit=20&market=US&';
    var seed_genres = '';
    var min_tempo = '';
    var max_tempo = '';
    var random_genre = '';
    var min_popularity = '';
    var max_popularity = '';

    // result = [...new Set(result)];
    // result = result.slice(0, 5);

    result.forEach((item) => {
      if (genres.includes(item) && seed_genres === '') {
        seed_genres = item;
      } else if (genres.includes(item) && seed_genres !== '') {
        seed_genres = `${seed_genres},${item}`;
      }

      if (item === 'low') {
        min_tempo = 30;
        max_tempo = 90;
      } else if (item === 'medium') {
        min_tempo = 60;
        max_tempo = 100;
      } else if (item === 'high') {
        min_tempo = 100;
        max_tempo = 150;
      } else if (item === 'all') {
        min_tempo = 130;
        max_tempo = 180;
      }

      if (item === 'lesser') {
        min_popularity = 10;
        max_popularity = 50;
      } else if (item === 'award') {
        min_popularity = 55;
        max_popularity = 90;
      }
    });

    random_genre = genres[Math.floor(Math.random() * genres.length)];
    seed_genres = `${seed_genres},${random_genre}`;

    resultString = `${resultString}seed_genres=${seed_genres}&min_tempo=${min_tempo}&max_tempo=${max_tempo}&min_popularity=${min_popularity}&max_popularity=${max_popularity}`;

    this.setState({ result: resultString });
  }

  renderQuiz() {
    return (
      <Quiz
        answer={this.state.answer}
        answerOptions={this.state.answerOptions}
        questionId={this.state.questionId}
        question={this.state.question}
        questionTotal={quizQuestions.length}
        counter={this.state.counter}
        onAnswerSelected={this.handleAnswerSelected}
      />
    );
  }

  renderResult() {
    this.props.setFilter(this.state.result);
    // this.state.result = '';
    return <Redirect to='/spotifyapp/result' />;
  }

  render() {
    return (
      <div>
        <h2 className='text-center'>Spotify Playlist Quiz</h2>
        {this.state.result !== '' ? this.renderResult() : this.renderQuiz()}
      </div>
    );
  }
}

export default connect(null, { setResult, setFilter })(
  withRouter(QuizContainter)
);
