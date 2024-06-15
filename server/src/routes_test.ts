import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { listFlashcards, listScores, loadFlashcards, resetFlashcardsForTesting, resetScoresForTesting, saveFlashcards, saveScores, } from './routes';


describe('routes', function() {

  it('saveFlashcards', function() {

    //CORRECTLY SAVED (2 TESTS)
    const req1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveFlashcards', body: {name: "test1", value: [["7*7", "49"]]}});
    const res1 = httpMocks.createResponse();
    saveFlashcards(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(),
        'test1 was saved');

    const req2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveFlashcards', body: {name: "test2", value: [["3+3", "6"]]}});
    const res2 = httpMocks.createResponse();
    saveFlashcards(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getData(),
        'test2 was saved');

    //N0 NAME PROVIDED OR NAME IS NOT STRING (2 TESTS PER)

    const req3 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveFlashcards', body: {value: [["3+3", "6"]]}});
    const res3 = httpMocks.createResponse();
    saveFlashcards(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(),
        'Faulty request: argument "name" was missing or incorrectly formatted');
    const req4 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveFlashcards', body: {}});
    const res4 = httpMocks.createResponse();
    saveFlashcards(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 400);
    assert.deepStrictEqual(res4._getData(),
        'Faulty request: argument "name" was missing or incorrectly formatted');

    const req5 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveFlashcards', body: {name: 42, value: [["3+3", "6"]]}});
    const res5 = httpMocks.createResponse();
    saveFlashcards(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 400);
    assert.deepStrictEqual(res5._getData(),
        'Faulty request: argument "name" was missing or incorrectly formatted');
    const req6 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveFlashcards', body: {name: true, value: [["3+3", "6"]]}});
    const res6 = httpMocks.createResponse();
    saveFlashcards(req6, res6);
    assert.strictEqual(res5._getStatusCode(), 400);
    assert.deepStrictEqual(res5._getData(),
        'Faulty request: argument "name" was missing or incorrectly formatted');

    //NO VALUE PROVIDED OR VALUE IS NOT ARRAY (2 TESTS)

    const req7 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveFlashcards', body: {name: "something"}});
    const res7 = httpMocks.createResponse();
    saveFlashcards(req7, res7);
    assert.strictEqual(res7._getStatusCode(), 400);
    assert.deepStrictEqual(res7._getData(),
        'Faulty Request: request body is missing argument "value"');

    const req8 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveFlashcards', body: {name: "something", values: "values not value"}});
    const res8 = httpMocks.createResponse();
    saveFlashcards(req8, res8);
    assert.strictEqual(res8._getStatusCode(), 400);
    assert.deepStrictEqual(res8._getData(),
        'Faulty Request: request body is missing argument "value"');

    const req9 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveFlashcards', body: {name: "something", value: "value not an array"}});
    const res9 = httpMocks.createResponse();
    saveFlashcards(req9, res9);
    assert.strictEqual(res9._getStatusCode(), 400);
    assert.deepStrictEqual(res9._getData(),
        'Oops, something went wrong...');

    const req10 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveFlashcards', body: {name: "something", value: 42}});
    const res10 = httpMocks.createResponse();
    saveFlashcards(req10, res10);
    assert.strictEqual(res10._getStatusCode(), 400);
    assert.deepStrictEqual(res10._getData(),
        'Oops, something went wrong...');

    //DUPLICATE FLASHCARD 

    const req11 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveFlashcards', body: {name: "test1", value: [["7*7", "49"]]}});
    const res11 = httpMocks.createResponse();
    saveFlashcards(req11, res11);
    assert.strictEqual(res11._getStatusCode(), 400);
    assert.deepStrictEqual(res11._getData(),
        'Quiz already exists');

    const req12 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveFlashcards', body: {name: "test2", value: [["3+3", "6"]]}});
    const res12 = httpMocks.createResponse();
    saveFlashcards(req12, res12);
    assert.strictEqual(res12._getStatusCode(), 400);
    assert.deepStrictEqual(res12._getData(),
        'Quiz already exists');

    resetFlashcardsForTesting();
  });

  it('loadFlashcards', function() {

    const saveReq1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveFlashcards', body: {name: "test1", value: [["7*7", "49"]]}});
    const saveRes1 = httpMocks.createResponse();
    saveFlashcards(saveReq1, saveRes1);

    const saveReq2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveFlashcards', body: {name: "test2", value: [["3+3", "6"]]}});
    const saveRes2 = httpMocks.createResponse();
    saveFlashcards(saveReq2, saveRes2);

    //ERROR BLOCK (no name passed)
    //2 tests
    const loadReq2 = httpMocks.createRequest(
        {method: 'GET', url: '/api/loadFlashcards', query: {}});
    const loadRes2 = httpMocks.createResponse();
    loadFlashcards(loadReq2, loadRes2);
    assert.strictEqual(loadRes2._getStatusCode(), 400);
    assert.deepStrictEqual(loadRes2._getData(),
        'required argument "name" was missing');

    const loadReq3 = httpMocks.createRequest(
        {method: 'GET', url: '/api/loadFlashcards', query: {randoParam: "Random"}});
    const loadRes3 = httpMocks.createResponse();
    loadFlashcards(loadReq3, loadRes3);
    assert.strictEqual(loadRes3._getStatusCode(), 400);
    assert.deepStrictEqual(loadRes3._getData(),
        'required argument "name" was missing');

    //Error Block (no flashcard found)
    //2 tests
    const loadReq4 = httpMocks.createRequest(
        {method: 'GET', url: '/api/loadFlashcards', query: {name: "Ballers"}});
    const loadRes4 = httpMocks.createResponse();
    loadFlashcards(loadReq4, loadRes4);
    assert.strictEqual(loadRes4._getStatusCode(), 404);
    assert.deepStrictEqual(loadRes4._getData(),
        'no flashcard found with that name');

    const loadReq5 = httpMocks.createRequest(
        {method: 'GET', url: '/api/loadFlashcards', query: {name: "File"}});
    const loadRes5 = httpMocks.createResponse();
    loadFlashcards(loadReq5, loadRes5);
    assert.strictEqual(loadRes5._getStatusCode(), 404);
    assert.deepStrictEqual(loadRes5._getData(),
        'no flashcard found with that name');

    //FOUND BLOCK (name passed and flashcard found)
    //2 tests
    const loadReq6 = httpMocks.createRequest(
        {method: 'GET', url: '/api/loadFlashcards', query: {name: "test1"}});
    const loadRes6 = httpMocks.createResponse();
    loadFlashcards(loadReq6, loadRes6);
    assert.strictEqual(loadRes6._getStatusCode(), 200);
    assert.deepStrictEqual(loadRes6._getData(), {name: "test1", value: [["7*7", "49"]]});

    const loadReq7 = httpMocks.createRequest(
        {method: 'GET', url: '/api/loadFlashcards', query: {name: "test2"}});
    const loadRes7 = httpMocks.createResponse();
    loadFlashcards(loadReq7, loadRes7);
    assert.strictEqual(loadRes7._getStatusCode(), 200);
    assert.deepStrictEqual(loadRes7._getData(), {name: "test2", value: [["3+3", "6"]]});

    // Called to clear all saved flashcards created in this test
    //    to not effect future tests
    resetFlashcardsForTesting();
  });

  it('listFlashcards', function() {

  //EMPTY FLASHCARDS MAP (single test)

  const listReq = httpMocks.createRequest(
      {method: 'GET', url: '/api/listFlashcards'});
  const listRes = httpMocks.createResponse();
  listFlashcards(listReq, listRes);
  assert.strictEqual(listRes._getStatusCode(), 200);
  assert.deepStrictEqual(listRes._getData(), {flashcards: []});
  
  //1 FLASHCARD IN MAP (2 tests)

  const saveReq1 = httpMocks.createRequest(
    {method: 'POST', url: '/api/saveFlashcards', body: {name: "test1", value: [["7*7", "49"]]}});
  const saveRes1 = httpMocks.createResponse();
  saveFlashcards(saveReq1, saveRes1);

  const listReq2 = httpMocks.createRequest(
    {method: 'GET', url: '/api/listFlashcards'});
  const listRes2 = httpMocks.createResponse();
  listFlashcards(listReq2, listRes2);
  assert.strictEqual(listRes2._getStatusCode(), 200);
  assert.deepStrictEqual(listRes2._getData(), {flashcards: ["test1"]});

  resetFlashcardsForTesting();

  const saveReq2 = httpMocks.createRequest(
    {method: 'POST', url: '/api/saveFlashcards', body: {name: "test2", value: [["3+3", "6"]]}});
  const saveRes2 = httpMocks.createResponse();
  saveFlashcards(saveReq2, saveRes2);
  
  const listReq3 = httpMocks.createRequest(
    {method: 'GET', url: '/api/listFlashcards'});
  const listRes3 = httpMocks.createResponse();
  listFlashcards(listReq3, listRes3);
  assert.strictEqual(listRes3._getStatusCode(), 200);
  assert.deepStrictEqual(listRes3._getData(), {flashcards: ["test2"]});
  
  resetFlashcardsForTesting();

  //MULTIPLE FLASHCARDS IN MAP 

  const saveReq3 = httpMocks.createRequest(
    {method: 'POST', url: '/api/saveFlashcards', body: {name: "test1", value: [["7*7", "49"]]}});
  const saveRes3 = httpMocks.createResponse();
  saveFlashcards(saveReq3, saveRes3);
  
  const saveReq4 = httpMocks.createRequest(
    {method: 'POST', url: '/api/saveFlashcards', body: {name: "test2", value: [["3+3", "6"]]}});
  const saveRes4 = httpMocks.createResponse();
  saveFlashcards(saveReq4, saveRes4);

  const listReq4 = httpMocks.createRequest(
    {method: 'GET', url: '/api/listFlashcards'});
  const listRes4 = httpMocks.createResponse();
  listFlashcards(listReq4, listRes4);
  assert.strictEqual(listRes4._getStatusCode(), 200);
  assert.deepStrictEqual(listRes4._getData(), {flashcards: ["test1", "test2"]});

  const saveReq5 = httpMocks.createRequest(
    {method: 'POST', url: '/api/saveFlashcards', body: {name: "test3", value: [["2+2", "4"]]}});
  const saveRes5 = httpMocks.createResponse();
  saveFlashcards(saveReq5, saveRes5);

  const listReq5 = httpMocks.createRequest(
    {method: 'GET', url: '/api/listFlashcards'});
  const listRes5 = httpMocks.createResponse();
  listFlashcards(listReq5, listRes5);
  assert.strictEqual(listRes5._getStatusCode(), 200);
  assert.deepStrictEqual(listRes5._getData(), {flashcards: ["test1", "test2", "test3"]});

  resetFlashcardsForTesting();
  });

  it('saveScores', function() {

    //CORRECTLY SAVED (2 TESTS)
    const req1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveScores', body: {testTaker: "Jaser", quizName: "Math", score: "66"}});
    const res1 = httpMocks.createResponse();
    saveScores(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(),
        "Jaser's score was saved");

    const req2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveScores', body: {testTaker: "Niko", quizName: "Spanish", score: "100"}});
    const res2 = httpMocks.createResponse();
    saveScores(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getData(),
        "Niko's score was saved");

    //N0 TEST TAKER PROVIDED OR IS NOT STRING (2 TESTS PER)

    const req3 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveScores', body: {quizName: "Math", score: "66"}});
    const res3 = httpMocks.createResponse();
    saveScores(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(),
        'Faulty request: argument "testTaker" was missing or incorrectly formatted');
    const req4 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveScores', body: {tesTtaker: "HOno", quizName: "Math", score: "66"}});
    const res4 = httpMocks.createResponse();
    saveScores(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 400);
    assert.deepStrictEqual(res4._getData(),
        'Faulty request: argument "testTaker" was missing or incorrectly formatted');
    const req5 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveScores', body: {testTaker: 42, quizName: "Math", score: "66"}});
    const res5 = httpMocks.createResponse();
    saveScores(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 400);
    assert.deepStrictEqual(res5._getData(),
        'Faulty request: argument "testTaker" was missing or incorrectly formatted');
    const req6 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveScores', body: {testTaker: true, quizName: "Math", score: "66"}});
    const res6 = httpMocks.createResponse();
    saveScores(req6, res6);
    assert.strictEqual(res6._getStatusCode(), 400);
    assert.deepStrictEqual(res6._getData(),
        'Faulty request: argument "testTaker" was missing or incorrectly formatted');

    //NO QUIZ NAME PROVIDED OR IS NOT STRING (2 TESTS PER)

    const req7 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveScores', body: {testTaker: "Joquim", score: "66"}});
    const res7 = httpMocks.createResponse();
    saveScores(req7, res7);
    assert.strictEqual(res7._getStatusCode(), 400);
    assert.deepStrictEqual(res7._getData(),
        'Faulty Request: request body is missing argument "quizName"');
      
    const req8 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveScores', body: {testTaker: "Joquim", quiz: "math", score: "66"}});
    const res8 = httpMocks.createResponse();
    saveScores(req8, res8);
    assert.strictEqual(res8._getStatusCode(), 400);
    assert.deepStrictEqual(res8._getData(),
        'Faulty Request: request body is missing argument "quizName"');

    const req9 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveScores', body: {testTaker: "Joquim", quizName: 42, score: "66"}});
    const res9 = httpMocks.createResponse();
    saveScores(req9, res9);
    assert.strictEqual(res9._getStatusCode(), 400);
    assert.deepStrictEqual(res9._getData(),
        'Faulty Request: request body is missing argument "quizName"');

    const req10 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveScores', body: {testTaker: "Joquim", quizName: true, score: "66"}});
    const res10 = httpMocks.createResponse();
    saveScores(req10, res10);
    assert.strictEqual(res10._getStatusCode(), 400);
    assert.deepStrictEqual(res10._getData(),
        'Faulty Request: request body is missing argument "quizName"');


    //NO SCORE PROVIDED OR IS NOT STRING (2 TESTS PER)

    const req11 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveScores', body: {testTaker: "Joquim", quizName: "Math"}});
    const res11 = httpMocks.createResponse();
    saveScores(req11, res11);
    assert.strictEqual(res11._getStatusCode(), 400);
    assert.deepStrictEqual(res11._getData(),
        'Faulty request: argument "score" was missing or incorrectly formatted');

    const req12 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveScores', body: {testTaker: "Joquim", quizName: "Math", scores: 31}});
    const res12 = httpMocks.createResponse();
    saveScores(req12, res12);
    assert.strictEqual(res12._getStatusCode(), 400);
    assert.deepStrictEqual(res12._getData(),
        'Faulty request: argument "score" was missing or incorrectly formatted');

    const req13 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveScores', body: {testTaker: "Joquim", quizName: "Math", score: 46}});
    const res13 = httpMocks.createResponse();
    saveScores(req13, res13);
    assert.strictEqual(res13._getStatusCode(), 400);
    assert.deepStrictEqual(res13._getData(),
        'Faulty request: argument "score" was missing or incorrectly formatted');

    const req14 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveScores', body: {testTaker: "Joquim", quizName: "Math", score: true}});
    const res14 = httpMocks.createResponse();
    saveScores(req14, res14);
    assert.strictEqual(res14._getStatusCode(), 400);
    assert.deepStrictEqual(res14._getData(),
        'Faulty request: argument "score" was missing or incorrectly formatted');
  
    resetScoresForTesting();
  });


  it('listScores', function() {

    //EMPTY SCORES ARRAY (single test)
  
    const listReq = httpMocks.createRequest(
        {method: 'GET', url: '/api/listScores'});
    const listRes = httpMocks.createResponse();
    listScores(listReq, listRes);
    assert.strictEqual(listRes._getStatusCode(), 200);
    assert.deepStrictEqual(listRes._getData(), {scores: []});
    
    //1 SCORE IN ARRAY (2 tests)
  
    const req1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveScores', body: {testTaker: "Jaser", quizName: "Math", score: "66"}});
    const res1 = httpMocks.createResponse();
    saveScores(req1, res1);

    const listReq2 = httpMocks.createRequest(
      {method: 'GET', url: '/api/listScores'});
    const listRes2 = httpMocks.createResponse();
    listScores(listReq2, listRes2);
    assert.strictEqual(listRes2._getStatusCode(), 200);
    assert.deepStrictEqual(listRes2._getData(), {scores: ["Jaser, Math: 66"]});
  
    resetScoresForTesting();
  
    const req2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveScores', body: {testTaker: "Niko", quizName: "Spanish", score: "100"}});
    const res2 = httpMocks.createResponse();
    saveScores(req2, res2);
    
    const listReq3 = httpMocks.createRequest(
      {method: 'GET', url: '/api/listScores'});
    const listRes3 = httpMocks.createResponse();
    listScores(listReq3, listRes3);
    assert.strictEqual(listRes3._getStatusCode(), 200);
    assert.deepStrictEqual(listRes3._getData(), {scores: ["Niko, Spanish: 100"]});
    
    resetScoresForTesting();
  
    //MULTIPLE SCORES IN ARRAY 

    const req3 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveScores', body: {testTaker: "Jaser", quizName: "Math", score: "66"}});
    const res3 = httpMocks.createResponse();
    saveScores(req3, res3);

    const req4 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveScores', body: {testTaker: "Niko", quizName: "Spanish", score: "100"}});
    const res4 = httpMocks.createResponse();
    saveScores(req4, res4);
  
    const listReq4 = httpMocks.createRequest(
      {method: 'GET', url: '/api/listScores'});
    const listRes4 = httpMocks.createResponse();
    listScores(listReq4, listRes4);
    assert.strictEqual(listRes4._getStatusCode(), 200);
    assert.deepStrictEqual(listRes4._getData(), {scores: ["Jaser, Math: 66", "Niko, Spanish: 100"]});
  
    const req5 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveScores', body: {testTaker: "Josiah", quizName: "Linguistics", score: "100"}});
    const res5 = httpMocks.createResponse();
    saveScores(req5, res5);
  
    const listReq5 = httpMocks.createRequest(
      {method: 'GET', url: '/api/listScores'});
    const listRes5 = httpMocks.createResponse();
    listScores(listReq5, listRes5);
    assert.strictEqual(listRes5._getStatusCode(), 200);
    assert.deepStrictEqual(listRes5._getData(), {scores: ["Jaser, Math: 66", "Niko, Spanish: 100", "Josiah, Linguistics: 100"]});
  
    resetScoresForTesting();
  });


});
