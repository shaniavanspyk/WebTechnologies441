$(document).ready(function () {

    let movieData = [];

    // ==========================
    // LOAD JSON
    // ==========================
    $.getJSON("movies.json")
        .done(function (data) {

            movieData = data;

            renderTable(movieData);

            $("#movieCount").text("Total Movies: " + data.length);
        })
        .fail(function () {
            console.error("Failed to load JSON.");
        });


    // ==========================
    // RENDER TABLE
    // ==========================
    function renderTable(data) {

        let rows = "";

        $.each(data, function (index, movie) {

            let ratingClass = "";

            if (movie.rating >= 8.5) {
                ratingClass = "high";
            } else if (movie.rating >= 7) {
                ratingClass = "medium";
            } else {
                ratingClass = "low";
            }

            let badge = movie.rating >= 9 ? "⭐" : "";

            rows += `
                <tr class="movieRow" data-index="${index}">
                    <td>${movie.title} ${badge}</td>
                    <td>${movie.genre}</td>
                    <td class="${ratingClass}">${movie.rating}</td>
                    <td>${movie.year}</td>
                    <td>${movie.director}</td>
                </tr>
            `;
        });

        $("#movieTable tbody").html(rows);

        $(".movieRow").hide().fadeIn(800);

        $(".movieRow").clickHighlight();
    }


    // ==========================
    // SEARCH
    // ==========================
    $("#search").on("keyup", function () {
        let value = $(this).val().toLowerCase();
        let visible = 0;

        $(".movieRow").filter(function () {
            let match = $(this).text().toLowerCase().includes(value);
            $(this).toggle(match);
            if (match) visible++;
        });

        $("#noResults").toggle(visible === 0);
    });


    // ==========================
    // SORT
    // ==========================
    $("#sortRating").click(function () {
        movieData.sort((a, b) => b.rating - a.rating);
        renderTable(movieData);
    });


    // ==========================
    // CUSTOM PLUGIN
    // ==========================
    $.fn.clickHighlight = function () {

        return this.each(function () {

            $(this).on("click", function () {

                $(".movieRow").removeClass("highlight");
                $(this).addClass("highlight");

                let index = $(this).data("index");
                let movie = movieData[index];

                $("#movieDetails").html(`
                    <h2>${movie.title}</h2>
                    <p><strong>Genre:</strong> ${movie.genre}</p>
                    <p><strong>Rating:</strong> ${movie.rating}</p>
                    <p><strong>Year:</strong> ${movie.year}</p>
                    <p><strong>Director:</strong> ${movie.director}</p>
                    <p>${movie.description}</p>
                `);

                $("html, body").animate({
                    scrollTop: $("#movieDetails").offset().top
                }, 500);

            });

        });

    };

});