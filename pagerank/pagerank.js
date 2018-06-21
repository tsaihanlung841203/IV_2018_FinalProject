var map;
var year = 2012;
$( () => {
    map = new Datamap({
        element: $("#pagerank")[0],
        projection: 'mercator',
        fills: {
            defaultFill: "green"
        },
        dataType: 'csv',
        dataUrl: 'https:///ghost.cs.nccu.edu.tw/~s10329/vis/data.csv',
        geographyConfig: {
            highlightBorderColor: 'gray',
            popupTemplate: function(geography, data) {
                return '<div class="hoverinfo">' + geography.properties.name + '\n' +  data[year];
            },
            highlightBorderWidth: 1
        },
        done: (map) => {
            setTimeout( () => {
                drawYear(map)
            });
        }
    });

    var colors = d3.scale.category10();
    map.labels();
});
function drawYear(map) {
    let data = map.options.data;
    let color = {};
    for( country in data ) {
        let rank = data[country][year];
        color[country] = parseColor(rank);
    }
    console.log(color);
    map.updateChoropleth(color);
}

function parseColor(rank) {
    let total = 222;
    let percent = rank/total;
    console.log(percent);
    return `hsl(0, 100%, ${100-percent*100}%)`;
}
