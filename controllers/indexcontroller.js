

//!Test
const getIndex = async(req, res) => {
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

        for (let i = 0; i < results.rows.length; i++) {
            results.rows[i].year = results.rows[i].year.toISOString().split("-")[0];
        }
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

module.exports = {
    getIndex
}