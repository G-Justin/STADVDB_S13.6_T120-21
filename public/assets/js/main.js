jQuery( function () {

    const MAX_YEAR = 2017; //Arbitrary
    const MIN_YEAR = 1951;
    const MAX_LIMIT = Number.MAX_SAFE_INTEGER;
    const MIN_LIMIT = 1;
    const GENRES = [];
    const MAX_STRING_LENGTH = 100;

    $('#test').DataTable({
        "order": [],
        "scrollX": true
    });

    /*
    $('#year-limit-form').on('submit', (e) => {
        
        const errorMessage = $('#error-message');
        const year = $('#year-input').val();
        const limit = $('#limit-input').val();

        if (year.trim() !== "") {
            if (Number(year) > MAX_YEAR || Number(year) < MIN_YEAR) {
                errorMessage.text('Year exceeds 1951 - 2017 range!');
                e.preventDefault();
                return;
            }
        }

        if (limit.trim() === "") {
            if (Number(limit) > MAX_LIMIT || Number(limit) < MIN_LIMIT) {
                errorMessage.text('Invalid limit input!');
                e.preventDefault();
                return;
            }
        }

    }); */

    /*
    $('#genre-limit-form').on('submit', (e) => {
        const genre = $('#genre-input').val().trim();
        const limit = $('#limit-input').val().trim();

        if (!GENRES.includes(genre)) {
            //TODO: Error message
            e.preventDefault();
        }

        if (limit > MAX_LIMIT || limit < MIN_LIMIT) {

            e.preventDefault();
        }
    });
    */

    $('#keyword-form').on('submit', (e) => {
        const keyword = $('#keyword-input').val().trim();

        if (keyword.length > MAX_STRING_LENGTH) {
            e.preventDefault();
        }
    })






} );

