const express = require("express");
const app = express();
const indexController = require('../controllers/indexcontroller.js');
app.get('/', indexController.getHighestGrossing);

app.get('/highestgrossing', indexController.getHighestGrossing);
app.get('/topratedmovies', indexController.getTopRatedMovies);
app.get('/mostproducedgenres', indexController.getMostProducedGenres);
app.get('/topratedmoviegenres', indexController.getTopRatedMovieGenres);
app.get('/topdirectorsofagenre', indexController.getTopDirectorsOfAGenre);
app.get('/moviesfromkeyword', indexController.getMoviesFromKeyword);
app.get('/movie/:id', indexController.getMovie);
/* TODO: test
app.get("/highestgrossing", db.getHighestGrossing); //ex: /highestgrossing?year=<YEAR>&limit=<NUMBER OF RESULTS>
app.get("/mostproducedgenre", db.getMostProducedGenre); //ex: /mostproducedgenre?year=<YEAR>&limit=<NUMBER OF RESULTS>
app.get("/moviesfromkeyword", db.getMoviesFromKeyword); //ex: /moviefromkeyword?keyword=<keyword>
app.get("/movie", db.getMovie); //ex: /movie
app.get("/topratedmovieyear", db.getTopRatedMovieYear); //ex: /topratedmovieyear?year=<YEAR>&limit=<NUMBER OF RESULTS>
app.get("/topratedmoviegenre", db.getTopRatedMovieGenre); //ex: /topratedmoviegenre?genre='<GENRE_ID>'&limit=<NUMBER OF RESULTS>
app.get("/topdirectorsgenre", db.getTopDirectorsGenre); //ex: /topdirectorsgenre?genre=<GENRE_NAME>&limit=<NUMBER OF RESULTS>
*/
module.exports = app;
