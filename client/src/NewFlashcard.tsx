import React, { Component, ChangeEvent, MouseEvent } from 'react';


//Props from parent 
type NewFlashcardProps = {
  //Back callback to return to list
  onBackClick: () => void
};

//Component state 
type NewFlashcardState = {
  //Name of new flashcard
  flashcardName: string,

  //String of cards for deck 
  QnA: string, 

  //Potential error message 
  error: string
};


// Allows the user to create a new auction.
export class NewFlashcard extends Component<NewFlashcardProps, NewFlashcardState> {

  constructor(props: NewFlashcardProps) {
    super(props);
    this.state = {flashcardName: "", QnA: "", error: ""};
  }

  //Render input boxes and buttons 
  render = (): JSX.Element => {
    return (
      <div>
        <h2>Create</h2>
        <div>
          <label htmlFor="name">Name:</label>
          <input id="name" type="text" value={this.state.flashcardName}
              onChange={this.doFlashcardNameChange}></input>
        </div>
        <div>
            <label htmlFor="textbox">Options (one per line formatted as front|back):</label>
            <br/>
            <textarea id="textbox" rows={3} cols={40} value={this.state.QnA}
                onChange={(evt) => this.doQnANameChange(evt)}></textarea>
        </div>
   
        <button type="button" onClick={this.doSaveClick}>Add</button>
        <button type="button" onClick={this.doBackClick}>Back</button>
        {this.renderError()}
      </div>);
  };

  //Render error messages 
  renderError = (): JSX.Element => {
    if (this.state.error.length === 0) {
      return <div></div>;
    } else {
      const style = {width: '300px', backgroundColor: 'rgb(246,194,192)',
          border: '1px solid rgb(137,66,61)', borderRadius: '5px', padding: '5px' };
      return (<div style={{marginTop: '15px'}}>
          <span style={style}><b>Error</b>: {this.state.error}</span>
        </div>);
    }
  };

  //Register change events on input boxes to update state 
  doFlashcardNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({flashcardName: evt.target.value, error: ""});
  };
  doQnANameChange = (evt: ChangeEvent<HTMLTextAreaElement>): void => {
    this.setState({QnA: evt.target.value, error: ""});
  };


  /**
   * SAVE FLASHCARD API PROCESSING
   */  

  //Save click will register response and send flashcard name and content to server 
  doSaveClick = (_: MouseEvent<HTMLButtonElement>): void => {
    // Verify that the user entered all required information

    if (this.state.flashcardName.length === 0){
      this.setState({error: "Name should not be empty"});
      return;
    }

    //Create array of new lines for input 
    const newLines = this.state.QnA.split('\n');
    
    if(newLines.length <= 1 && newLines[0].length === 0){
      this.setState({error: "No cards"});
      return;
    }

    const questionArr : string[][] = [];
    for (const question of newLines){
      //ex. question = "7*7|49" at this point

      if(question.length === 0){
        this.setState({error: "Blank line inputted"});
        return;
      }

      //Split lines into front and back of cards
      const arrElem = question.split('|');
      //ex. arrElem = ["7*7", "49"]

      if(arrElem.length != 2){
        this.setState({error: `Wrong format for "${ question }" question & answer pair`});
        return;
      }

      if (arrElem[0].length === 0 || arrElem[1].length === 0){
        this.setState({error: `Blank question or answer in "${ question }" question & answer pair`});
        return;
      }
      questionArr.push(arrElem);
    }

    const args = {name: this.state.flashcardName, value: questionArr};

    //Send request to server
    fetch("/api/saveFlashcards", {
        method: "POST", body: JSON.stringify(args),
        headers: {"Content-Type": "application/json"} })
      .then(this.doSaveResp)
      .catch(() => this.doSaveError("failed to connect to server"));
  };
  //Process server response to request
  doSaveResp = (res: Response): void => {
    if (res.status === 200) {
      this.props.onBackClick();  // show the updated list only after no errors have been raised
    } else if (res.status === 400) {
      res.text().then(this.doSaveError)
          .catch(() => this.doSaveError("400 response is not text"));
    } else {
      this.doSaveError(`bad status code from /api/saveFlashcards: ${res.status}`);
    }
  };
  //Set error state with any potential errors raised by server
  doSaveError = (msg: string): void => {
    this.setState({error: msg})
  };

  //On back click, call props callback to return to list
  doBackClick = (_: MouseEvent<HTMLButtonElement>): void => {
    this.props.onBackClick();  // tell the parent this was clicked
  };
}
