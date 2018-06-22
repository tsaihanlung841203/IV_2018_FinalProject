var map;
var year;
var MIN_YEAR = 1980;
var MAX_YEAR = 2017;
var colors = d3.scale.category10();

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
                console.log(geography.id);
                return '<div class="hoverinfo">' + geography.properties.name + '\n' +  (data ? data[year] : "none");
            },
            highlightBorderWidth: 1
        },
        done: (map) => {
            setTimeout( () => {
                drawYear(map)
            });
        }
    });
    // map.labels();

    $('#range-slider').on('input', function() {
        let _year = $(this).val();
        year = _year;
        $('#year-label').text(year);
        drawYear(map);
    });
    $('#year-play-btn').on('click', function() {
        let _year = MIN_YEAR;
        let slider = $('#range-slider');
        let playBtn = $(this);
        let interval = 100;

        playBtn.prop('disabled', true);
        let timer = setInterval( ()=> {
            console.log(_year);
            slider.val(_year);
            slider.trigger('input');
            if( ++_year > MAX_YEAR ) clearInterval(timer);
        }, interval);
        setTimeout( () => {
            playBtn.prop('disabled', false);
        }, interval*(MAX_YEAR-MIN_YEAR+3) );
    });

    $('#range-slider').trigger('input');
});
function drawYear(map) {
    let data = map.options.data;
    let color = {};
    for( country in data ) {
        let rank = data[country][year];
        color[country] = parseColor(rank);
    }
    // console.log(color);
    map.updateChoropleth(color);
}

function parseColor(rank) {
    let total = 222;
    let percent = 100*rank/total;
    console.log(rank, percent);
    // let gb = 255*percent;
    // let r = 255 * (100-percent)/100;
    // // console.log(percent);
    // return `rgb(${r}, ${gb}, ${gb})`;
    let s = (-0.8)*percent+100;
    let l = 0.6*percent+20;
    console.log(s, l);
    return `hsl(0, ${s}%, ${l}%)`;
}
