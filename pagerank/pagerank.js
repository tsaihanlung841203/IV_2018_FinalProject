var map;
var year;
var MIN_YEAR = 1981;
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
                let rankNow = data ? data[year] : -1;
                let rankPrev = data ? data[parseInt(year)-1] : -1;
                let rankData = getRankImprove(rankNow, rankPrev);
                return `<div class="hoverinfo">${geography.properties.name} ${geography.id}\n`
                 + `this year=${rankData.now}, prev year=${rankData.prev}, improve=${rankData.improve}`;
            },
            highlightBorderWidth: 1
        },
        done: (map) => {
            setTimeout( () => {
                drawYear(map)
            });
        }
    });

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
        let interval = 500;

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

    $(".scroll-btn").click(function(){
        let id = $(this).data('rel');
        $('html, body').animate({
            scrollTop: $(`#${id}`).offset().top
        });
    });
    $('#range-slider').trigger('input');
});
function drawYear(map) {
    let data = map.options.data;
    let color = {};
    for( country in data ) {
        let rankNow = data[country][year];
        let rankPrev = data[country][parseInt(year)-1];
        let rankData = getRankImprove(rankNow, rankPrev);
        // console.log(country, rankData);
        color[country] = parseColor(rankData.improve);
    }
    // console.log(color);
    map.updateChoropleth(color);
}

function getRankImprove(rankNow, rankPrev) {
    function parseValidRank(n) {
        let rank;
        try {
            rank = parseInt(n);
            if( rank<0 ) throw "negative";
        } catch(e) {
            rank = 222;
        }
        return rank;
    }
    rankNow = parseValidRank(rankNow);
    rankPrev = parseValidRank(rankPrev);
    return {
        now: rankNow,
        prev: rankPrev,
        improve: rankPrev - rankNow
    };
}
function parseColor(improve) {

    let s = (0.5)*improve+50;
    let l = (-0.4)*improve+80;
    // console.log(s, l);
    return `hsl(0, ${s}%, ${l}%)`;
}
