import React, { Component, ChangeEvent, MouseEvent } from 'react';
import './style.css'
import { isRecord } from './record';

type Flip = 0 | 1; //Either show question or answer 
type Progress = {kind: "taking"} | {kind: "finished"}


type QuizProps = {
    //Name of quiz being taken 
    name: string,

    //Callback to return to list page 
    onBackClick: () => void
}


type QuizState = {
    testTaker: string, //Name of the test taker 
    correct: number, //Number of problems marked correct 
    incorrect: number, //Number of problems marked incorrect
    flashcard: Flip, //Refers to whether to display fornt or back of flashcard 
    display: Progress, //Refers to whether test is in progress or finished 

    flashcards: string[][]; //List of all cards in deck left to be processed
};


export class TakeQuiz extends Component<QuizProps, QuizState> {

    constructor(props: QuizProps) {
        super(props);
        this.state = {testTaker: "", correct: 0, incorrect: 0, flashcard: 0, display: {kind: "taking"}, flashcards: [[]]};
    }

    //On initial mount, load the quiz and all cards of the deck
    componentDidMount = (): void => {
        this.doLoadClick();
    }

    //Render the test-taking UI 
    render = (): JSX.Element => {
        //If the quiz is still in progress, then render the flashcards and provide buttons for navigation
        if (this.state.display.kind === "taking"){
            return(
                <div>
                    <h1>{this.props.name}</h1>
                    <h3>Correct: {this.state.correct} | Incorrect: {this.state.incorrect}</h3>
                    {this.renderFlashcard()}
                    <button type="button" onClick={ this.doFlipClick }>Flip</button>
                    <button type="button" onClick={ this.doCorrectClick }>Correct</button>
                    <button type="button" onClick={ this.doIncorrectClick }>Incorrect</button>
                </div>
            ); 
        }
        //If the quiz is finished, then render an end message and give the user the option to input name and submit score
        else{
            return (
                <div>
                    <h1>{this.props.name}</h1>
                    <h3>Correct: {this.state.correct} | Incorrect: {this.state.incorrect}</h3>
                    <p>End of Quiz</p>
                    <label htmlFor="name">Name:</label>
                    <input id="name" type="text" value={this.state.testTaker}
                        onChange={this.doTestTakerNameChange}></input>
                    <button type="button" onClick={ this.doSaveClick }>Finish</button>
                </div>
            );
        }
    };

    //Render the first element in the deck 
    renderFlashcard = (): JSX.Element => {
        //return a div with some inline styling 
        return (
            <div className="card">
                {this.state.flashcards[0][this.state.flashcard]}
            </div>
        );
    }

    //Flip the card to reveal the opposite side (change index between 0 and 1)
    doFlipClick = (_: MouseEvent<HTMLButtonElement>): void => {
        const newFlip = this.state.flashcard === 0 ? 1 : 0;
        this.setState({flashcard : newFlip});
        return;
    }

    
    /** Buttons to increment score and slice array to remove all processed cards in the deck */

    //Increments correct by 1 
    doCorrectClick = (_: MouseEvent<HTMLButtonElement>): void => {
        const arr = this.state.flashcards.slice(1)
        if(arr.length === 0){
            this.setState({display: {kind: "finished"}, correct: this.state.correct + 1});
        }
        else{
            this.setState({flashcard: 0, flashcards: arr, correct: this.state.correct + 1});
        }
        return;
    }
    //Increments incorrect by 1 
    doIncorrectClick = (_: MouseEvent<HTMLButtonElement>): void => {
        const arr = this.state.flashcards.slice(1)
        if(arr.length === 0){
            this.setState({display: {kind: "finished"}, incorrect: this.state.incorrect + 1});
        }
        else{
            this.setState({flashcard: 0, flashcards: arr, incorrect: this.state.incorrect + 1});
        }
        return;
    }
  
    //Register change events on input boxes to update state 
    doTestTakerNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
      this.setState({testTaker: evt.target.value});
    };
  
    /** LOAD FLASHCARDS API PROCESSING */

    //Initial request to the server to get all cards in deck 
    doLoadClick = (): void => {
        const url = "/api/loadFlashcards?" + "name=" + encodeURIComponent(this.props.name);
        fetch(url).then(this.doLoadResp)
            .catch(() => this.doLoadError("failed to connect to server"));
    };
    //Process server response
    doLoadResp = (res: Response): void => {
        if (res.status === 200) {
            res.json().then(this.doLoadJson)
                .catch(() => this.doLoadError("not JSON"));
        } else if (res.status === 404) {
            res.text().then(this.doLoadError)
                .catch(() => this.doLoadError("not text"));
        } else {
            this.doLoadError(`bad status: ${res.status}`);   
        }
    };
    //If a successful request, process the data and update state 
    doLoadJson = (data: unknown): void => {
        if (!isRecord(data)) {
            console.error("bad data from /api/loadFlashcards: not a record", data);
            return;
        }
        if (typeof data.name !== 'string') {
            console.error("bad data from /api/loadFlashcards: name is not a string", data);
            return;
        }
        if(!Array.isArray(data.value)){
            console.error("bad data from /api/loadFlashcards: value is not an array", data);
            return;   
        }
        this.setState({flashcards: data.value});
    }
    // All errors will be logged to the console 
    doLoadError = (msg: string): void => {
        console.error(`Error fetching /api/loadFlashcards: ${ msg }`);
    }


    /** SAVE SCORES API PROCESSING */
    doSaveClick = (_: MouseEvent<HTMLButtonElement>): void => {
      
        //No empty names
        if (this.state.testTaker.length === 0){ 
            return;
        }

        //Calculate whole number score from state 
        const score = Math.floor(this.state.correct * 100.0 / (this.state.correct + this.state.incorrect)); 
        //Construct an obj with all request args 
        const args = {testTaker: this.state.testTaker, quizName: this.props.name, score: score.toString()};
    
        //Send request to server 
        fetch("/api/saveScores", {
            method: "POST", body: JSON.stringify(args),
            headers: {"Content-Type": "application/json"} 
        })
        .then(this.doSaveResp)
        .catch(() => this.doSaveError("failed to connect to server"));
    };
    //Process server response 
    doSaveResp = (res: Response): void => {
      if (res.status === 200) {
        this.doBackClick();  // show the updated list only after no errors have been raised
      } else if (res.status === 400) {
        res.text().then(this.doSaveError)
            .catch(() => this.doSaveError("400 response is not text"));
      } else {
        this.doSaveError(`bad status code from /api/saveFlashcards: ${res.status}`);
      }
    };
    //All errors get logged to the console 
    doSaveError = (msg: string): void => {
        console.error(`Error fetching /api/saveScores: ${ msg }`);
    };
  
    //Invoke callback to return to lists page
    doBackClick = (): void => {
        this.props.onBackClick();  // tell the parent this was clicked
    };
}
  