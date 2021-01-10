

//*optimized
const getHighestGrossing = async(req, res) => {
    let data;
    let fields;
    let parameters = [];
    let tableTitle;

    let year = req.query['year-input'];
    let limit = req.query['limit-input'];
    
    if (!limit) {
        console.log('fired');
        limit = 100; //default
    } 

    let query;
    if (String(year).trim() === "" || year == null) {
        tableTitle = '1951 to 2017';
        query = 
        `
        SELECT title, revenue-budget AS gross_income
        FROM metadata
        ORDER BY gross_income DESC
        LIMIT $1

        `;

        parameters.push(limit);
    } else {
        tableTitle = year;
        query = `
        SELECT title, revenue-budget AS gross_income
        FROM metadata
        WHERE EXTRACT(YEAR from release_date) = $1
        ORDER BY gross_income DESC
        LIMIT $2

        `;

        parameters.push(year);
        parameters.push(limit);
    }
    
    try {
        let results = await pgconnection.query(query, parameters);

        data = results.rows;
        fields = results.fields;
    } catch (error) {
        console.log('error');
        res.send(404);
    }

    res.render('index', {
        title: 'Highest Grossing Films',
        data: data,
        fields: fields,
        highestGrossing: true,
        formTitle: 'year-limit-form',
        formAction: '/highestgrossing',
        tableTitle: `Highest Grossing Films of ${tableTitle}`,
        year: true
    });

};

const getTopRatedMovies = async(req, res) => {
    let data;
    let fields;
    let parameters = [];
    let tableTitle; 

    let year = req.query['year-input'];
    let limit = req.query['limit-input'];
    
    if (!limit) {
        limit = 10; //default
    } 

    let query;
    if (String(year).trim() === "" || year == null) {
        tableTitle = '1951 to 2017';
        query =`
            SELECT title, vote_average AS vote_count, 
            ((DENSE_RANK() OVER(ORDER BY vote_count ASC))*vote_average) AS vote_score
            FROM metadata
            ORDER BY vote_score DESC
            LIMIT $1
            `;

        parameters.push(limit);
    } else {
        tableTitle = year;
        query = `
            SELECT title, vote_average AS vote_count, 
            ((DENSE_RANK() OVER(ORDER BY vote_count ASC))*vote_average) AS vote_score
            FROM metadata
            WHERE EXTRACT(YEAR from release_date) = $1
            ORDER BY vote_score DESC
            LIMIT $2
            `;

        parameters.push(year);
        parameters.push(limit);
    }
    
    try {
        let results = await pgconnection.query(query, parameters);

        data = results.rows;
        fields = results.fields;
           
        for (let i = 0; i < data.length; i++) {
            data[i].vote_score = data[i].vote_score.toFixed(2);
        }
    } catch (error) {
        console.log('error');
        res.send(404);
    }

    res.render('index', {
        title: 'Top Rated Films',
        data: data,
        fields: fields,
        topRatedMovies: true,
        formTitle: 'year-limit-form',
        formAction: '/topratedmovies',
        tableTitle: `Top Rated Films of ${tableTitle}`,
        year: true
    });
}

const getMostProducedGenres = async(req, res) => {
    let data;
    let fields;
    let parameters = [];
    let tableTitle;

    let year = req.query['year-input'];
    let limit = req.query['limit-input'];
    
    if (!limit) {
        limit = 10; //default
    } 

    let query;
    if (String(year).trim() === "" || year == null) {
        tableTitle = '1951 to 2017';
        query =`
            SELECT g.name, COUNT(g.name) AS "count"
            FROM metadata m, genres g
            where $$'$$ || CAST(g.id AS text) || $$'$$ = ANY(m.genres)
            GROUP BY g.name
            ORDER BY count DESC
            LIMIT $1;      
            `;

        parameters.push(limit);
    } else {
        tableTitle = year;
        query = `
            SELECT g.name, COUNT(g.name) AS "count"
            FROM metadata m, genres g
            where $$'$$ || CAST(g.id AS text) || $$'$$ = ANY(m.genres) AND EXTRACT(year from m.release_date) = $1
            GROUP BY g.name
            ORDER BY count DESC
            LIMIT $2;      
            `;

        parameters.push(year);
        parameters.push(limit);
    }
    
    try {
        let results = await pgconnection.query(query, parameters);

        data = results.rows;
        fields = results.fields;

    } catch (error) {
        console.log('error');
        res.send(error);
    }

    res.render('index', {
        title: 'Most Produced Genres',
        data: data,
        fields: fields,
        mostProducedGenres: true,
        formTitle: 'year-limit-form',
        formAction: '/mostproducedgenres',
        tableTitle: `Most Produced Genres of ${tableTitle}`,
        year: true
    });
}

const getTopRatedMovieGenres = async(req, res) => {
    let data;
    let fields;

    let genre = req.query['genre-input'];
    let limit = req.query['limit-input'];

    if (genre == null || genre.trim() === "") {
        genre = 'Drama';    
    }
    
    if (!limit) {
        limit = 10; //default
    } 
 
    try {
        let results = await pgconnection.query(`select 	title, tagline, runtime, release_date, overview, 
            popularity, vote_average, vote_count, budget, revenue,
            array(	select json_build_object('name', name, 'job', job) from crew c 
            where c.movie_id = m.id and (position('Writer' in job) > 0 
            or position('Director' in job) > 0))
            AS crew,
            vote_average, vote_count,
            ((DENSE_RANK() OVER(ORDER BY vote_count ASC))*vote_average) AS vote_score 
            from metadata m, genres g 
            where g.name = $1 AND $$'$$ || CAST(g.id as text) || $$'$$ = ANY(genres)
            order by vote_score DESC 
            Limit $2;
            `, [genre, limit]);

        data = results.rows;
        fields = results.fields;

        for (let i = 0; i < data.length; i++) {
            data[i].vote_score = data[i].vote_score.toFixed(2);
        }
    } catch (error) {
        console.log('error');
        res.send(error);
    }

    res.render('index', {
        title: 'Top Rated Genres',
        data: data,
        fields: fields,
        topRatedMovieGenres: true,
        formTitle: 'genre-limit-form',
        formAction: '/topratedmoviegenres',
        tableTitle: `Top Rated ${genre}`,
        genre: true
    });
}

const getTopDirectorsOfAGenre = async(req, res) => {
    let data;
    let fields;

    let genre = req.query['genre-input'];
    let limit = req.query['limit-input'];

    if (genre == null || genre.trim() === "") {
        genre = 'Drama';    
    }
    
    if (!limit) {
        limit = 10; //default
    } 
 
    try {
        let results = await pgconnection.query(`
            SELECT c.name, m.vote_average, ((DENSE_RANK() OVER(ORDER BY vote_count ASC))*vote_average) AS vote_score
            FROM crew c, metadata m, genres g
            WHERE c.movie_id = m.id 
            AND $$'$$ || CAST(g.id AS text) || $$'$$ = ANY(m.genres) 
            AND c.job = 'Director' 
            AND g.name = $1
            ORDER BY vote_score DESC
            LIMIT $2;
            `, [genre, limit]);


        data = results.rows;
        fields = results.fields;

        for (let i = 0; i < data.length; i++) {
            data[i].vote_score = data[i].vote_score.toFixed(2);
        }
    } catch (error) {
        console.log('error');
        res.send(error);
    }

    res.render('index', {
        title: 'Top Directors of a Genre',
        data: data,
        fields: fields,
        topDirectorsOfAGenre: true,
        formTitle: 'genre-limit-form',
        formAction: '/topdirectorsofagenre',
        tableTitle: `Top Directors of ${genre}`,
        genre: true
    });
}


//*optimized
const getMoviesFromKeyword = async(req, res) => {
    let data;
    let fields;

    let keyword = req.query['keyword-input'];
    let limit = req.query['limit-input'];
    if (keyword == null || keyword.trim() === "") {
        keyword = "director";
    }

    if (!limit) {
        limit = 10; //default
    } 
 
    try {
        let results = await pgconnection.query(`
            with keywordIDs as (
                select id, name from keywords
                where name ~ ('(^|(. ))' || $1 || '(( .)|$)')
            )
            
            select m.id, m.title, array_agg(k.name)
            from movies_keywords mk join metadata m on mk.movie_id = m.id 
            join keywordIDs k on k.id = mk.keyword_id
            group by m.id
            limit $2

            `, [keyword, limit]);


        data = results.rows;
        fields = [{name: 'id'}, {name: 'title'}, {name: 'keywords'}];
        
    } catch (error) {
        console.log('error');
        res.send(error);
    }

    res.render('index', {
        title: 'Movies from Keyword/s',
        data: data,
        fields: fields,
        moviesFromKeyword: true,
        formTitle: 'keyword-form',
        formAction: '/moviesfromkeyword',
        tableTitle: `Movies from Keyword/s '${keyword}'`,
        keyword: true
    });
}
//TODO: other queries

function convertToYear(rows) {
    for (let i = 0; i < rows.length; i++) {
        rows[i].year = rows[i].year.toISOString().split("-")[0];
    }
}

module.exports = {
    getHighestGrossing,
    getTopRatedMovies,
    getMostProducedGenres,
    getTopRatedMovieGenres,
    getTopDirectorsOfAGenre,
    getMoviesFromKeyword
}