$( () => {
    var basic_choropleth = new Datamap({
        element: $("#pagerank")[0],
        projection: 'mercator',
        fills: {
            defaultFill: "#ABDDA4",
        },
        // data: {
        //     USA: "#456789",
        //     JPN: { fillKey: "authorHasTraveledTo",
        //     "electoralVotes": 500 },
        //     ITA: { fillKey: "authorHasTraveledTo" },
        //     CRI: { fillKey: "authorHasTraveledTo" },
        //     KOR: { fillKey: "authorHasTraveledTo" },
        //     DEU: { fillKey: "authorHasTraveledTo" },
        // },
        geographyConfig: {
            highlightBorderColor: '#bada55',
            popupTemplate: function(geography, data) {
                return '<div class="hoverinfo">' + geography.properties.name + 'Electoral Votes:' +  data.electoralVotes + ' '
            },
            highlightBorderWidth: 3
        },
        done: drawYear
    });

    var colors = d3.scale.category10();
});
function drawYear() {
    console.log("done!");
}
