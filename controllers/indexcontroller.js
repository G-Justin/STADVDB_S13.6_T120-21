

//!Test
const getHighestGrossing = async(req, res) => {
    let data;
    let fields;

    const year = "";
    const limit = req.query.limit;
    
    //right now for testing purposes, limit and year are placeholders
    let query = (year.trim() === "") ? 
    `
        SELECT title, release_date AS year, revenue-budget AS gross_income
        FROM metadata
        ORDER BY gross_income DESC
        LIMIT 10
    `
    :

    `
        SELECT title, release_date AS year, revenue-budget AS gross_income
        FROM metadata
        WHERE EXTRACT(year from metadata.release_date) = 2005
        ORDER BY gross_income DESC
        LIMIT 10
    `;
    
    
    console.log(query);
    try {
        let results = await pgconnection.query(query);

        data = results.rows;
        fields = results.fields;

        convertToYear(data)
    } catch (error) {
        console.log('error');
        res.send(404);
    }

    res.render('index', {
        title: 'Movies Database',
        data: data,
        fields: fields,
        highestGrossing: true
    });

};

const getTopRateMovie = async(req, res) => {
    let data;
    let fields;

    const year = req.query.year;
    const limit = req.query.limit;

    try {
        let results =  await pgconnection.query(
            `SELECT title, release_date AS year, vote_average, vote_count, 
        ((DENSE_RANK() OVER(ORDER BY vote_count ASC))*vote_average) AS vote_score
        FROM metadata
        WHERE EXTRACT(year from metadata.release_date) = $1
        ORDER BY vote_score DESC
        LIMIT $2`
                [year, limit]);

        data = results.rows;
        fields = results.fields;

        convertToYear(data);
    } catch (e) {
        console.log(e);
        res.sendStatus(404);
    }

    res.render('index', {
        title: 'Top Rated Movies',
        data: data,
        fields: fields,
        topRatedMovies: true
    });
}

//TODO: other queries

function convertToYear(rows) {
    for (let i = 0; i < rows.length; i++) {
        rows[i].year = rows[i].year.toISOString().split("-")[0];
    }
}

module.exports = {
    getHighestGrossing
}