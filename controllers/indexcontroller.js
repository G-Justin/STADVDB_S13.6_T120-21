
//*optimized
const getHighestGrossing = async(req, res) => {
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
        query = 
        `
        SELECT id, title, revenue-budget AS gross_income
        FROM metadata
        ORDER BY gross_income DESC
        LIMIT $1;

        `;

        parameters.push(limit);
    } else {
        tableTitle = year;
        query = `
        SELECT id, title, revenue-budget AS gross_income
        FROM metadata
        WHERE EXTRACT(YEAR from release_date) = $1
        ORDER BY gross_income DESC
        LIMIT $2;

        `;

        parameters.push(year);
        parameters.push(limit);
    }
    
    try {
        let results = await pgconnection.query(query, parameters);

        data = results.rows;
        fields = [{name: 'title'}, {name: 'gross_income'}];
    } catch (error) {
        res.redirect(req.get('referer'));
        return;
    }

    res.render('index', {
        title: 'Highest Grossing Films',
        data: data,
        fields: fields,
        highestGrossing: true,
        formTitle: 'year-limit-form',
        formAction: '/highestgrossing',
        tableTitle: `Highest Grossing Films of ${tableTitle}`,
        year: true,
        limit: true
    });

};

//*optimized
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
            SELECT id, title, vote_average AS vote_count, 
            ((DENSE_RANK() OVER(ORDER BY vote_count ASC))*vote_average) AS vote_score
            FROM metadata
            ORDER BY vote_score DESC
            LIMIT $1;
            `;

        parameters.push(limit);
    } else {
        tableTitle = year;
        query = `
            SELECT id, title, vote_average AS vote_count, 
            ((DENSE_RANK() OVER(ORDER BY vote_count ASC))*vote_average) AS vote_score
            FROM metadata
            WHERE EXTRACT(YEAR from release_date) = $1
            ORDER BY vote_score DESC
            LIMIT $2;

            `;

        parameters.push(year);
        parameters.push(limit);
    }
    
    try {
        let results = await pgconnection.query(query, parameters);

        data = results.rows;
        fields = [{name: 'tile'}, {name: 'vote_count'}, {name: 'vote_score'}];
           
        for (let i = 0; i < data.length; i++) {
            data[i].vote_score = data[i].vote_score.toFixed(2);
        }
    } catch (error) {
        res.redirect(req.get('referer'));
        return;
    }

    res.render('index', {
        title: 'Top Rated Films',
        data: data,
        fields: fields,
        topRatedMovies: true,
        formTitle: 'year-limit-form',
        formAction: '/topratedmovies',
        tableTitle: `Top Rated Films of ${tableTitle}`,
        year: true,
        limit: true
    });
}

//*optimized
const getMostProducedGenres = async(req, res) => {
    let data;
    let fields;
    let parameters = [];
    let tableTitle;

    let year = req.query['year-input'];
    let limit = req.query['limit-input'];
    
    if (!limit) {
        limit = 20; //default
    } 

    let query;
    if (String(year).trim() === "" || year == null) {
        tableTitle = '1951 to 2017';
        query =`
            SELECT g.name, COUNT(g.name) AS count
            FROM genres g 
            JOIN movies_genres
            ON genre_id = g.id
            JOIN metadata m
            ON movie_id = m.id
            GROUP BY g.name
            ORDER BY count DESC
            LIMIT $1;
              
            `;

        parameters.push(limit);
    } else {
        tableTitle = year;
        query = `
            SELECT g.name, COUNT(g.name) AS count
            FROM genres g 
            JOIN movies_genres
            ON genre_id = g.id
            JOIN metadata m
            ON movie_id = m.id
            WHERE EXTRACT(YEAR from release_date) = $1
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
        res.redirect(req.get('referer'));
        return;
    }

    res.render('index', {
        title: 'Most Produced Genres',
        data: data,
        fields: fields,
        mostProducedGenres: true,
        formTitle: 'year-limit-form',
        formAction: '/mostproducedgenres',
        tableTitle: `Most Produced Genres of ${tableTitle}`,
        year: true,
        limit: true
    });
}


//*optimized
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
        let results = await pgconnection.query(`
       
        select id,title, tagline, runtime, release_date, overview, 
        vote_average, vote_count, budget, revenue,
        ( select array_agg(json_build_object('name', c.name, 'job', j.name)) 
        from crew c join jobs j on c.job = j.id 
        where c.movie_id = m.id 
        and (position('Writer' in j.name) > 0 or position('Director' in j.name) > 0)
        )
        AS crew,
        ((DENSE_RANK() OVER(ORDER BY vote_count ASC))*vote_average) AS vote_score 
        from metadata m
        where m.id in (
        Select mg.movie_id
        From movies_genres mg 
        Join genres g on mg.genre_id = g.id 
        Where g.name = $1
        )
        order by vote_score DESC 
        Limit $2;
            `, [genre, limit]);

        data = results.rows;
        fields = [
            {name: 'title'},
            {name: 'tagline'},
            {name: 'runtime'},
            {name: 'year'},
            {name: 'overview'},
            {name: 'vote_average'},
            {name: 'vote_count'},
            {name: 'budget'},
            {name: 'revenue'},
            {name: 'crew'},
            {name: 'vote_score'}
            ];

        for (let i = 0; i < data.length; i++) {
            data[i].crew = JSON.stringify(data[i].crew);
        }

        for (let i = 0; i < data.length; i++) {
            data[i].vote_score = data[i].vote_score.toFixed(2);
        }

        convertToYear(data);
    } catch (error) {
        res.redirect(req.get('referer'));
        return;
    }

    res.render('index', {
        title: 'Top Rated Genres',
        data: data,
        fields: fields,
        topRatedMovieGenres: true,
        formTitle: 'genre-limit-form',
        formAction: '/topratedmoviegenres',
        tableTitle: `Top Rated ${genre}`,
        genre: true,
        limit: true
    });
}

//*optimized
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
        With movies_director as (
            Select c.id as crew_id, c.name as crew_name, ((DENSE_RANK() OVER(ORDER BY m.vote_count ASC))*m.vote_average) as dense_rank_score
            From crew c
            Join metadata m on c.movie_id = m.id
            Where c.job=1
            and m.id in (
                Select mg.movie_id
                From movies_genres mg 
                Join genres g on mg.genre_id = g.id 
                Where g.name = $1
            )
            )
            Select crew_name, avg(dense_rank_score) as vote_score
            From movies_director
            Group by crew_id, crew_name
            Order by vote_score desc
            Limit $2;
            
            `, [genre, limit]);


        data = results.rows;
        fields = [{name: 'Name'}, {name: 'Vote Score'}];

        for (let i = 0; i < data.length; i++) {
            data[i].vote_score = data[i].vote_score.toFixed(2);
        }
    } catch (error) {
        res.redirect(req.get('referer'));
        return;
    }

    res.render('index', {
        title: 'Top Directors of a Genre',
        data: data,
        fields: fields,
        topDirectorsOfAGenre: true,
        formTitle: 'genre-limit-form',
        formAction: '/topdirectorsofagenre',
        tableTitle: `Top Directors of ${genre}`,
        genre: true,
        limit: true
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
        fields = [{name: 'title'}, {name: 'keywords'}];
        
    } catch (error) {
        res.redirect(req.get('referer'));
        return;
    }

    res.render('index', {
        title: 'Movies from Keyword/s',
        data: data,
        fields: fields,
        moviesFromKeyword: true,
        formTitle: 'keyword-form',
        formAction: '/moviesfromkeyword',
        tableTitle: `Movies from Keyword/s '${keyword}'`,
        keyword: true,
        limit: true
    });
}

const getMovie = async(req, res) => {
    let data;
    let id = req.params.id;
    if (id == null) {
        res.send('Invalid param');
        return;
    }

    let query = `
        select title, tagline, runtime, release_date, overview, 
        vote_average, vote_count, budget, revenue,
        ( select array_agg(name) from genres g 
        join movies_genres mg on g.id = mg.genre_id
        where mg.movie_id = m.id ) AS genres,
        ( select array_agg(name) from keywords k 
        join movies_keywords mk on k.id = mk.keyword_id
        where mk.movie_id = m.id ) AS keywords,
        ( select array_agg(name) from production_companies p 
        join movies_pcs mp on p.id = mp.pc_id
        where mp.movie_id = m.id ) AS companies,
        ( select array_agg(json_build_object('name', c.name, 'job', j.name)) 
        from crew c join jobs j on c.job = j.id 
        where c.movie_id = m.id and 
        (position('Writer' in j.name) > 0 or position('Director' in j.name) > 0) ) AS crew
        from metadata m
        where m.id =  $1;`;

    try {
        let results = await pgconnection.query(query, [id]);

        data = results.rows[0];
       
    } catch (error) {
        console.log('error handled successfully');
        res.redirect(req.get('referer'));
        return;
    }

    res.render('details', {
        title: data.title,
        tableTitle: data.title,
        tagline: data.tagline,
        runtime: data.runtime,
        genres: data.genres,
        keywords: data.keywords,
        companies: data.companies,
        crew: data.crew,
        budget: data.budget,
        revenue: data.revenue,
        vote_count: data.vote_count,
        vote_average: data.vote_average,
        release_date: data.release_date.toISOString().split("-")[0],
        overview: data.overview
    });
}
//TODO: other queries

//==========================================================================
// OLAP
//==========================================================================

const getHighestGrossingGenreDecade = async(req, res) => {
    let data = [];
    let fields;

    let decade = req.query['decade-input'];
    if (decade == null || decade.trim() === "") {
        decade = '2010';
    }

    try {
        let results = await olapconnection.query(`
        SELECT G.name, R.decade, SUM(revenue) AS total_revenue
        FROM genres_groups GG, movies_reception_facts MR, ref_calendar R, movies_genres M, genres G  
        WHERE G.genre_id = M.genre_id AND
        M.genre_group_key = GG.genre_group_key AND
          GG.genre_group_key = MR.genre_group_key AND
          MR.release_date_key = R.date_key AND
          R.decade IN ($1)
        GROUP BY ROLLUP(name, decade)
        ORDER BY total_revenue ASC;
        `, [decade]);

        fields = [{name: 'genre'}, {name: 'total revenue'}];
        for (let i = 0; i < results.rows.length; i++) {
            let name;

            if (results.rows[i].decade == null && results.rows[i].name === null) {
                name = 'TOTAL';
            } else if (results.rows[i].decade !== null) {
                name = results.rows[i].name;
            } else {
                continue;
            }

            data[i] = {
                name: name,
                total_revenue: results.rows[i]['total_revenue']
            };
        }

    } catch (e) {
        console.log(e)
        res.redirect(req.get('referer'));
        return;
    }


    res.render('index',{
        title: 'Highest Grossing Genre per Decade',
        data: data,
        fields: fields,
        formTitle: 'genre-decade-form',
        formAction: '/highestgrossinggenreperdecade',
        tableTitle: `Highest Grossing Genres of Decade ${decade}`,
        highestGrossingGenreDecade: true,
        decade: true
    })
}

const getProductionCompanyRevenue = async(req, res) => {
    let data;
    let fields;

    let pc = req.query['pc'];
    if (pc == null || pc.trim() === "") {
        pc = 'Disney'
    }

    let query = `
        SELECT PC.name, sum(MR.revenue) AS revenue
        FROM movies_reception_facts MR, pc_groups PG, movies_pc MP, production_companies PC, metadata M
        WHERE PC.pc_id = MP.pc_id AND
            MP.pc_group_key = PG.pc_group_key AND
            PG.pc_group_key = MR.pc_group_key AND
            M.metadata_id = MR.metadata_id AND
        PC.name IN ($1)
        GROUP BY PC.name;
    `;

    let pcQuery = `
        SELECT PC.name, sum(MR.revenue)
        FROM movies_reception_facts MR, pc_groups PG, movies_pc MP, production_companies PC, metadata M
        WHERE PC.pc_id = MP.pc_id AND
              MP.pc_group_key = PG.pc_group_key AND
              PG.pc_group_key = MR.pc_group_key AND
              M.metadata_id = MR.metadata_id 
        GROUP BY PC.name
    `;

    let pcOptions;
    try {
        let [results, optionResults] = await Promise.all([
            olapconnection.query(query, [pc]),
            olapconnection.query(pcQuery)
        ]);

        data = results.rows;
        pcOptions = optionResults.rows;
        fields = [{name: 'Production Company'}, {name: 'Revenue'}];

    } catch (e) {
        console.log(e);
        res.redirect(req.get('referer'));
        return;
    }

    res.render('index', {
        title: 'Total Revenue of a Production Company',
        data: data,
        fields: fields,
        formTitle: 'pc-revenue-form',
        formAction: '/totalrevenueofapc',
        tableTitle: `Total Revenue of ${pc}`,
        pcRevenue: true,
        pc: true,
        pcOptions: pcOptions
    });
}

function convertToYear(rows) {
    for (let i = 0; i < rows.length; i++) {
        rows[i].release_date = rows[i].release_date.toISOString().split("-")[0];
    }
}

module.exports = {
    getHighestGrossing,
    getTopRatedMovies,
    getMostProducedGenres,
    getTopRatedMovieGenres,
    getTopDirectorsOfAGenre,
    getMoviesFromKeyword,
    getMovie,

    getHighestGrossingGenreDecade,
    getProductionCompanyRevenue
}