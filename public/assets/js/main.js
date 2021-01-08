jQuery( function () {

    const MAX_YEAR = 9999; //Arbitrary
    const MIN_YEAR = 0;
    const MAX_LIMIT = Number.MAX_SAFE_INTEGER;
    const MIN_LIMIT = 0;
    const GENRES = [];
    const MAX_STRING_LENGTH = 100;

    $('#test').DataTable({
        "order": [],
    });

    $('#year-limit-form').on('submit', (e) => {
        const year = $('#year-input').val().trim();
        const limit = $('#limit-input').val().trim();

        if (year > MAX_YEAR || year < MIN_YEAR) {
            //TODO: Error message
            e.preventDefault();
        }

        if (limit > MAX_LIMIT || limit < MIN_LIMIT) {

            e.preventDefault();
        }
    });

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

    $('#keyword-form').on('submit', (e) => {
        const keyword = $('#keyword-input').val().trim();

        if (keyword.length > MAX_STRING_LENGTH) {
            e.preventDefault();
        }
    })






} );

