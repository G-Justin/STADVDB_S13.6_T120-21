jQuery( function () {

    const MAX_YEAR = 2017; //Arbitrary
    const MIN_YEAR = 1951;
    const MAX_LIMIT = Number.MAX_SAFE_INTEGER;
    const MIN_LIMIT = 1;
    const GENRES = [];
    const MAX_STRING_LENGTH = 100;

    $('#test').DataTable({
        "order": [],
        "scrollX": true,
        "pageLength": 25
    });

    function getMovie(id) {
        alert('hello')
        window.open('/movie/' + id);
    }
    
} );

