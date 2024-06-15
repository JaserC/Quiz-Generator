import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check


//Saved as {"Math" : [["7*7", "49"], ["3+3", "6"] ...]}, where each quiz is a key and the value is a mutlimensional array that stores length 2 arrays (q and a)
const flashcards: Map<string, string[][]> = new Map<string, string[][]>();

//Saved as [["jake", "Math", 66], ["jojo", "Spanish", 89], ...]
//scores stored in the format [testTakerName, quizName, score]
const scores: string[][] = [];



/** Returns whether or not flashcard has been saved */
/** Takes parameters "name" and "value" in request body */
/** Responds with 400 if either "name" or "value" is missing in request body or if a flashcard with the same name exists, or with 200 success information  */
export const saveFlashcards = (req: SafeRequest, res: SafeResponse): void => {

  const name = req.body.name;
  if (name === undefined || typeof name !== 'string') {
    res.status(400).send('Faulty request: argument "name" was missing or incorrectly formatted');
    return;
  }

  const value = req.body.value;
  if (value === undefined) {
    res.status(400).send('Faulty Request: request body is missing argument "value"');
    return;
  }

  if (!Array.isArray(value)){
    res.status(400).send('Oops, something went wrong...');
    return;
  }

  if (flashcards.has(name)){
    res.status(400).send('Quiz already exists');
    return;
  }
  
  flashcards.set(name, value);
  res.status(200).send(`${ name } was saved`);
  return;
}

/** Returns whether or not the score was saved */
/** Takes parameters "testTaker" and "quizName" and "score" in request body */
/** Responds with 400 if any of those are missing in request body (or improperly formatted), or with success information  */
export const saveScores = (req: SafeRequest, res: SafeResponse): void => {

  const testTaker = req.body.testTaker;
  if (testTaker === undefined || typeof testTaker !== 'string') {
    res.status(400).send('Faulty request: argument "testTaker" was missing or incorrectly formatted');
    return;
  }

  const quizName = req.body.quizName;
  if (typeof quizName === undefined || typeof quizName !== 'string') {
    res.status(400).send('Faulty Request: request body is missing argument "quizName"');
    return;
  }

  const score = req.body.score;
  if (score === undefined || typeof score !== 'string') {
    res.status(400).send('Faulty request: argument "score" was missing or incorrectly formatted');
    return;
  }

  const scoreDetails : string[] = [];
  scoreDetails.push(testTaker);
  scoreDetails.push(quizName);
  scoreDetails.push(score);
  scores.push(scoreDetails);

  res.status(200).send(`${ testTaker }'s score was saved`);
}


/** Returns a given name, flashcard deck combination in the global map as a JSON object*/
/** Needs a "name" field in the query parameters in request */
/** Responds with 400 error if "name" is missing in query params, 404 error if a flashcard deck with that name is not found, or with success information  */
export const loadFlashcards = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.query.name);
  if (name === undefined) {
    res.status(400).send('required argument "name" was missing');
    return;
  }
  else if(flashcards.get(name) === undefined){
    res.status(404).send('no flashcard found with that name');
    return;
  }
  else{
    res.status(200).send({name: name, value: flashcards.get(name)}); 
    return;
  }
}

/** Returns a list of saved flashcards in the form of an array stored in JSON */
/** Does not need a request body, just the request */
/** Responds with all flashcard names currently stored */
export const listFlashcards = (_req: SafeRequest, res: SafeResponse): void => {
  const flashcardArr: string[] = [];
  for (const flashcard of flashcards.keys()){
    flashcardArr.push(flashcard);
  } 
  res.status(200).send({flashcards: flashcardArr});
}

/** Returns a list of saved scores in the form of an array stored in JSON */
/** Does not need a request body, just the request */
/** Responds with all scores currently stored */
export const listScores = (_req: SafeRequest, res: SafeResponse): void => {
  const scoreArr: string[] = [];
  for (const scoreData of scores){
    const [testTaker, quizName, score] = scoreData; 
    const scoreElement = testTaker + ", " + quizName + ": " + score; //Combine these components into a single string
    scoreArr.push(scoreElement);
  } 
  res.status(200).send({scores: scoreArr});
}

/** Used in tests to set the flashcards map back to empty. */
export const resetFlashcardsForTesting = (): void => {
  // Do not use this function except in tests!
  flashcards.clear();
};

/** Used in tests to set the scores array back to empty. */
export const resetScoresForTesting = (): void => {
  // Do not use this function except in tests!
  scores.length = 0;
};


// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string|undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};
