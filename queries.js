const Pool = require("pg").Pool;

const pool = new Pool({
  user: "admin",
  host: "localhost",
  database: "movies",
  password: "password",
  //   port: 3030,
});

const getHighestGrossing = (req, res) => {
  const year = req.query.year;
  const limit = req.query.limit;
  pool.query(
    `
    EXPLAIN ANALYZE VERBOSE 
    SELECT title, revenue-budget AS gross_income
  FROM metadata
  WHERE EXTRACT(year from metadata.release_date) = $1
  ORDER BY gross_income DESC
  LIMIT $2
  `,
    [year, limit],
    (error, results) => {
      if (error) {
        console.log(error);
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

const getMostProducedGenre = (req, res) => {
  const year = req.query.year;
  const limit = req.query.limit;
  pool.query(
    `SELECT g.name, COUNT(g.name) AS "count"
      FROM metadata m, genres g
      where $$'$$ || CAST(g.id AS text) || $$'$$ = ANY(m.genres) AND EXTRACT(year from m.release_date) = $1
      GROUP BY g.name
      ORDER BY count DESC
      LIMIT $2;      
  `,
    [year, limit],
    (error, results) => {
      if (error) {
        console.log(error);
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

const getMoviesFromKeyword = (req, res) => {
  const keyword = req.query.keyword;
  pool.query(
    `select m.id, m.title
    from metadata m join keywords k
    on $$'$$ || CAST(k.id AS text) || $$'$$ = ANY(m.keywords)
    where k.name = $1;
  `,
    [keyword],
    (error, results) => {
      if (error) {
        console.log(error);
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

const getMovie = (req, res) => {
  pool.query(
    `select 	*, 
    array( 	select name from genres g 
    where $$'$$ || CAST(g.id AS text) || $$'$$ = ANY(m.genres) ) 
    AS genreNames,
      array( 	select name from production_companies p
        where $$'$$ || CAST(p.id AS text) || $$'$$ = ANY(m.production_companies) ) 
    AS production_companies,
      array(	select json_build_object('name', name, 'job', job) from crew c 
        where c.movie_id = m.id and (position('Writer' in job) > 0 
    or position('Director' in job) > 0))
    AS crew
    from metadata m
    where m.id = 35 ;
  `,
    (error, results) => {
      if (error) {
        console.log(error);
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

const getTopRatedMovieYear = (req, res) => {
  const year = req.query.year;
  const limit = req.query.limit;
  pool.query(
    `SELECT title, vote_average, vote_count, 
    ((DENSE_RANK() OVER(ORDER BY vote_count ASC))*vote_average) AS vote_score
    FROM metadata
    WHERE EXTRACT(year from metadata.release_date) = $1
    ORDER BY vote_score DESC
    LIMIT $2
  `,
    [year, limit],
    (error, results) => {
      if (error) {
        console.log(error);
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

const getTopRatedMovieGenre = (req, res) => {
  const genre = req.query.genre;
  const limit = req.query.limit;
  pool.query(
    `select 	title, tagline, runtime, release_date, overview, 
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
  `,
    [genre, limit],
    (error, results) => {
      if (error) {
        console.log(error);
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

const getTopDirectorsGenre = (req, res) => {
  const genre = req.query.genre;
  const limit = req.query.limit;
  pool.query(
    `SELECT c.name, m.vote_average, ((DENSE_RANK() OVER(ORDER BY vote_count ASC))*vote_average) AS vote_score
    FROM crew c, metadata m, genres g
    WHERE c.movie_id = m.id 
    AND $$'$$ || CAST(g.id AS text) || $$'$$ = ANY(m.genres) 
    AND c.job = 'Director' 
    AND g.name = $1
    ORDER BY vote_score DESC
    LIMIT $2;
  `,
    [genre, limit],
    (error, results) => {
      if (error) {
        console.log(error);
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

module.exports = {
  getHighestGrossing,
  getMostProducedGenre,
  getMoviesFromKeyword,
  getMovie,
  getTopRatedMovieYear,
  getTopRatedMovieGenre,
  getTopDirectorsGenre,
};
