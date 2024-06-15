import React, { Component } from "react";
import { FlashcardList } from "./FlashcardList";
import { TakeQuiz } from "./TakeQuiz";
import { NewFlashcard } from "./NewFlashcard";


// TODO: When you're ready to get started, you can remove all the example 
//   code below and start with this blank application:

// All possible page types for purposes of rendering UI 
type Page = {kind: "list"} | {kind: "create"} | {kind: "details", quiz: string} 


type FlashcardAppState = {
  //Refers to the page the user wants to see
  page: Page,
}

/** Displays the UI of the Flashcard application. */
export class FlashcardApp extends Component<{}, FlashcardAppState> {

  constructor(props: {}) {
    super(props);

    //Default page is the list page
    this.state = {page: {kind: "list"}};
  }
  
  //Based on display, render the appopriate component 
  render = (): JSX.Element => {
    if (this.state.page.kind === "list") {
      return <FlashcardList onNewClick={this.doNewQuizClick}
                          onQuizClick={this.doQuizClick}/>;
    } else if (this.state.page.kind === "create") {
      return <NewFlashcard onBackClick={this.doBackClick}/>;
    } else {  // details
      return <TakeQuiz name={this.state.page.quiz} onBackClick={this.doBackClick}/>; ///No back button invokes handler, only finish quiz button
    }

  };


  //Function to pass as a callback to redirect to NewFlashcard component 
  doNewQuizClick = (): void => {
    this.setState({page: {kind: "create"}});
  };
  
  //Function to pass as a callback to redirect to TakeQuiz component with the name of the quiz being taken
  doQuizClick = (name: string): void => {
    this.setState({page: {kind: "details", quiz: name}});
  };

  //Function to pass as a callback to redirect all components back to default page (list page)
  doBackClick = (): void => {
    this.setState({page: {kind: "list"}});
  }
}

