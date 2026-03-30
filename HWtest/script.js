$(document).ready(function () {

    // ==========================
    // LOAD JSON WITH AJAX
    // ==========================
    $.getJSON("movies.json")
        .done(function (data) {

            let rows = "";

            // LOOP THROUGH DATA
            $.each(data, function (index, movie) {
                rows += `
                    <tr class="movieRow">
                        <td>${movie.title}</td>
                        <td>${movie.genre}</td>
                        <td>${movie.rating}</td>
                    </tr>
                `;
            });

            // ADD TO TABLE
            $("#movieTable tbody").append(rows);

            // APPLY PLUGIN
            $(".movieRow").clickHighlight();
        })

        .fail(function () {
            console.error("Failed to load JSON file.");
        });


    // ==========================
    // CUSTOM jQuery PLUGIN
    // ==========================
    $.fn.clickHighlight = function () {

        return this.each(function () {

            $(this).on("click", function () {

                $(".movieRow").removeClass("highlight");
                $(this).addClass("highlight");

            });

        });

    };

});