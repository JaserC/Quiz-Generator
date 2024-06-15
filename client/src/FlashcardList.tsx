import React, { Component, MouseEvent } from 'react';
import { isRecord } from './record';

//Props to store callbacks
type ListProps = {
  onNewClick: () => void,
  onQuizClick: (name: string) => void
};

type ListState = {
  // current time when rendering
  now: number,  
  // current list of flashcard names
  flashcards: string[] | undefined, 
  // current list of all quiz attempts and their scores
  scores: string[] | undefined
};


// Shows the list of all the flashcard decks
export class FlashcardList extends Component<ListProps, ListState> {

  constructor(props: ListProps) {
    super(props);
    this.state = {now: Date.now(), flashcards: undefined, scores: undefined};
  }

  /** When the page first loads, fetch the most recent lists */
  componentDidMount = (): void => {
    this.doRefreshClick();
  }

  /** If props change, update the state */
  componentDidUpdate = (prevProps: ListProps): void => {
    if (prevProps !== this.props) {
      this.setState({now: Date.now()});  // Force a refresh
    }
  };

  //Render both lists on the main page and provide functionality to create a new quiz 
  render = (): JSX.Element => {
    return (
      <div>
        <h2>List</h2>
        {this.renderFlashcards()}
        <button type="button" onClick={this.doNewClick}>New</button>
        <h2>Scores</h2>
        {this.renderScores()}
      </div>
      
    );
  };

  //Read flashcards list from state, iterate through, and create a list of all elements
  renderFlashcards = (): JSX.Element => {
    if (this.state.flashcards === undefined) {
      return <></>;
    } else {
      const flashcards: JSX.Element[] = [];
      for (const flashcard of this.state.flashcards) {
        flashcards.push(
          <li key={flashcard}>
            <a href="#" onClick={(evt) => this.doQuizClick(evt, flashcard)}>{flashcard}</a>
          </li>);
      }
      return <ul>{flashcards}</ul>;
    }
  };
  //Read scores list from state, iterate through, and create a list of all elements
  renderScores = (): JSX.Element => {
    if (this.state.scores === undefined) {
      return <></>;
    } else {
      const scores: JSX.Element[] = [];

      for (const [index, score] of this.state.scores.entries()) {
        scores.push(
          <li key={index}>{score}</li>
        );
      }
      return <ul>{scores}</ul>;
    }
  };

  /**
   * QUIZ LIST API PROCESSING
   */

  doQuizListResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doQuizListJson)
          .catch(() => this.doQuizListError("200 response is not JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doQuizListError)
          .catch(() => this.doQuizListError("400 response is not text"));
    } else {
      this.doQuizListError(`bad status code from /api/listFlashcards: ${res.status}`);
    }
  };
  doQuizListJson = (data: unknown): void => {
    if (!isRecord(data)) {
      console.error("bad data from /api/listFlashcards: not a record", data);
      return;
    }
    if (!Array.isArray(data.flashcards)) {
      console.error("bad data from /api/listFlashcards: flashcards is not an array", data);
      return;
    }
    const quizNames: string[] = [];
    for (const val of data.flashcards) {
      if (val === undefined)
        return;
      quizNames.push(val);
    }
    this.setState({flashcards: quizNames, now: Date.now()});  // fix time also
  };
  doQuizListError = (msg: string): void => {
    console.error(`Error fetching /api/listFlashcards: ${msg}`);
  };


  /**
   * SCORES LIST API PROCESSING
   */

  doScoreListResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doScoreListJson)
          .catch(() => this.doScoreListError("200 response is not JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doScoreListError)
          .catch(() => this.doScoreListError("400 response is not text"));
    } else {
      this.doScoreListError(`bad status code from /api/listScores: ${res.status}`);
    }
  };
  doScoreListJson = (data: unknown): void => {
    if (!isRecord(data)) {
      console.error("bad data from /api/listScores: not a record", data);
      return;
    }
    if (!Array.isArray(data.scores)) {
      console.error("bad data from /api/listScores: scores is not an array", data);
      return;
    }
    const scores: string[] = [];
    for (const val of data.scores) {
      if (val === undefined)
        return;
      scores.push(val);
    }
    this.setState({scores: scores, now: Date.now()});  // fix time also
  };
  doScoreListError = (msg: string): void => {
    console.error(`Error fetching /api/listScores: ${msg}`);
  };

  //When invoked will update both lists to reflect newest elements 
  doRefreshClick = (): void => {
    fetch("/api/listFlashcards").then(this.doQuizListResp)
        .catch(() => this.doQuizListError("failed to connect to server"));
    fetch("/api/listScores").then(this.doScoreListResp)
        .catch(() => this.doScoreListError("failed to connect to server"));
  };

  //Call props callback to create a new flashcard deck 
  doNewClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    this.props.onNewClick();  // tell the parent to show the new flashcard page
  };

  //Call props callback to take a quiz and render a new component
  doQuizClick = (evt: MouseEvent<HTMLAnchorElement>, name: string): void => {
    evt.preventDefault();
    this.props.onQuizClick(name);
  };
}
