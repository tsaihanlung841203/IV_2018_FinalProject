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
            defaultFill: "#AAA"
        },
        dataType: 'csv',
        dataUrl: 'https:///ghost.cs.nccu.edu.tw/~s10329/vis/data.csv',
        geographyConfig: {
            highlightBorderColor: 'gray',
            popupTemplate: function(geography, data) {
                let rankNow = data ? data[year] : -1;
                let rankPrev = data ? data[parseInt(year)-1] : -1;
                let rankData = getRankImprove(rankNow, rankPrev);
                rankNow = rankData.now==200 ? "---" : rankData.now
                rankPrev = rankData.prev==200 ? "---" : rankData.prev
                return `<div class="hoverinfo">${geography.properties.name}<br>`
                 + `去年排名: ${rankPrev}<br>今年排名: ${rankNow}<br>排名上升: ${rankData.improve}</div>`;
            },
            highlightBorderWidth: 1
        },
        done: () => {
            setTimeout( () => {
                $('#range-slider').trigger('input');
                map.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                    let country = geography.properties.name;
                    window.open(`https://www.google.com.tw/search?q=${country} ${year}`, '_blank');

                });
            });
        }
    });

    $('#range-slider').on('input', function() {
        let _year = $(this).val();
        year = _year;
        $('.year-label').text(year);
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
            scrollTop: $(id).offset().top
        });
    });

    $('#rank-table tr').click(function(){
        let country = $(this).find('#country').text();
        window.open(`https://www.google.com.tw/search?q=country ${country} ${year}`, '_blank');
    })
});
function drawYear(map) {
    let mapData = map.options.data;
    let color = {};
    let rank = [];
    let time = Date.now();
    for( country in mapData ) {
        let rankNow = mapData[country][year];
        let rankPrev = mapData[country][parseInt(year)-1];
        let rankData = getRankImprove(rankNow, rankPrev);

        rank.push({...rankData, country: country});
        color[country] = parseColor(rankData.improve);
    }
    map.updateChoropleth(color);
    rank = rank.sort( (a, b) => {
        return b.improve - a.improve;
    });
    // console.log(rank);
    $('#rank-table tr').each( (index, item) => {
        let data = rank[index];
        // console.log(item);
        $(item).find('#country').text(data.country);
        $(item).find('#rank-now').text( data.now==200 ? "---" : data.now );
        $(item).find('#rank-prev').text( data.prev==200 ? "---" : data.prev );
        $(item).find('#rank-improve').text(data.improve);
    })
    console.log(Date.now()-time);
}

function getRankImprove(rankNow, rankPrev) {
    function parseValidRank(n) {
        let rank;
        try {
            rank = parseInt(n);
            if( rank<0 ) throw "negative";
        } catch(e) {
            rank = 200;
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
