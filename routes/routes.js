const express = require("express");
const path = require("path");
const app = express();
const db = require("../queries");

app.get('/', (req, res) => {
    res.render('index', {
        title: 'index'});
    return;
});

app.get("/highestgrossing", db.getHighestGrossing); //ex: /highestgrossing?year=<YEAR>&limit=<NUMBER OF RESULTS>
app.get("/mostproducedgenre", db.getMostProducedGenre); //ex: /mostproducedgenre?year=<YEAR>&limit=<NUMBER OF RESULTS>
app.get("/moviesfromkeyword", db.getMoviesFromKeyword); //ex: /moviefromkeyword?keyword=<keyword>
app.get("/movie", db.getMovie); //ex: /movie
app.get("/topratedmovieyear", db.getTopRatedMovieYear); //ex: /topratedmovieyear?year=<YEAR>&limit=<NUMBER OF RESULTS>
app.get("/topratedmoviegenre", db.getTopRatedMovieGenre); //ex: /topratedmoviegenre?genre='<GENRE_ID>'&limit=<NUMBER OF RESULTS>
app.get("/topdirectorsgenre", db.getTopDirectorsGenre); //ex: /topdirectorsgenre?genre=<GENRE_NAME>&limit=<NUMBER OF RESULTS>

module.exports = app;
