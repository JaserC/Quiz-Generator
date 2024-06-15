import express, { Express } from "express";
import { listFlashcards, listScores, loadFlashcards, saveFlashcards, saveScores } from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());

//Save APIs designed to call respective save functions in routes
app.post("/api/saveFlashcards", saveFlashcards);
app.post("/api/saveScores", saveScores);

//List APIs designed to call respective list functions in routes
app.get("/api/listFlashcards", listFlashcards);
app.get("/api/listScores", listScores);

//Load api designed to call respective loadFlashcards functions in routes (only flashcards need to be loaded)(scores are solely for display purposes which is taken care of by list)
app.get("/api/loadFlashcards", loadFlashcards);

app.listen(port, () => console.log(`Server listening on ${port}`));
