queue()
    .defer(d3.csv, "docs/static/data/boroughs-data.csv") // load csv data 
    .defer(d3.json, "docs/static/data/boroughsGeo.json") // load geoJson data for choropleth map
    .await(makeCharts); // load data into makeCharts function when complete or throw error if an error 

// ==== main makeCharts function to render all charts
function makeCharts(error, csv, geoJson){
    
    // format d3.locale  
    var GB = d3.locale(GBLocale);

    // convert strings to numbers
    csv.forEach(function(d){
        d.Proportion_of_resident_population_born_abroad = +d.Proportion_of_resident_population_born_abroad;
        d.Median_House_Price = +d.Median_House_Price;
        d.Gross_Annual_Pay = +d.Gross_Annual_Pay;
        d.Proportion_of_largest_migrant_population = +d.Proportion_of_largest_migrant_population;
        d.Area_that_is_Greenspace = +d.Area_that_is_Greenspace
        d.Childhood_Obesity = +d.Childhood_Obesity;
        d.Proportion_of_working_age_with_degree_or_equivalent_and_above = +d.Proportion_of_working_age_with_degree_or_equivalent_and_above;
        d.Crime_rates_per_thousand_population = +d.Crime_rates_per_thousand_population;
    })

    // format strings into numbers
    csv.forEach(function (d){
        d.GLA_Population_Estimate = +d.GLA_Population_Estimate;
    });

    // crossfilter csv data
    var cf = crossfilter(csv);

    // reuseable custom reduce average function 
    function reduceAvg(dimension, type){
        return dimension.groupAll().reduce(
            function(p, v){
                p.count ++;
                p.total += v[type];
                p.average = p.total/p.count;
                return p;
            },
    
            function(p, v){
                p.count --;
                p.total -= v[type];
                p.average = p.total/p.count;
                return p;
            },
    
            function(){
               return {count:0, total:0, average:0};
            },
        );
    };
    
    // groupAll averages groups
    var bornAbroadGroup = reduceAvg(cf, "Proportion_of_resident_population_born_abroad");
    var housePriceGroup = reduceAvg(cf, "Median_House_Price");
    var avgPayGroup = reduceAvg(cf, "Gross_Annual_Pay");

    // multi-use dimensions
    var boroughDim = cf.dimension(dc.pluck("Area_name"));

    // all charts
    populationNd(cf);
    bornAbroadNd(cf, bornAbroadGroup);
    avgHousePrcNd(cf, housePriceGroup, GB);
    annualPayNd(cf, avgPayGroup, GB);
    BAMEBar(cf, boroughDim);
    nonEnglishBar(cf, boroughDim);
    migrantPieChart(cf);
    obesityScatter(cf);
    avgHousePrcRow(cf, boroughDim, GB);
    genderPayComposite(cf, boroughDim);
    crimeRatesChoro(cf, boroughDim, geoJson);

    dc.renderAll();
}

// ==== total population number display
function populationNd(cf) {

    // group on total population with groupAll on crossfilter to observe all filter when applied
    var popGroup = cf.groupAll().reduceSum(function(d){return d.GLA_Population_Estimate});
    // create number display at #population
    var popNd = dc.numberDisplay("#nd-population");
    // dc number display
    popNd
        .group(popGroup)
        .valueAccessor(function(d){
            return d;
        });
}

// % population born abroad number display 
function bornAbroadNd(cf, bornAbroadGroup) {
    
    // attach dc.js numberDisplay to born abroad ID
    var abroadNd = dc.numberDisplay("#nd-born-abroad")

    abroadNd
        .formatNumber(d3.format(".0%"))
        .group(bornAbroadGroup)
        .valueAccessor(function(d){
            return d.average / 100; // divide by 100 to allow % number format
        });
}

// average house price number display
function avgHousePrcNd(cf, housePriceGroup, GB){

     // attach dc.js numberDisplay to avg house price ID
     var housePriceNd = dc.numberDisplay("#nd-avg-house-prc")

     housePriceNd
        .formatNumber(GB.numberFormat("$,.0f"))
        .group(housePriceGroup)
        .valueAccessor(function(d){
            return d.average;
        });
}

// gross annual pay number display
function annualPayNd(cf, avgPayGroup, GB){

    // attach dc.js numberDisplay to avg pay ID
    var avgPayNd = dc.numberDisplay("#nd-avg-pay")

    avgPayNd
        .formatNumber(GB.numberFormat("$,.0f"))
        .group(avgPayGroup)
        .valueAccessor(function(d){
            return d.average;
        });
}

// proportion of population that are BAME bar chart
function BAMEBar(cf, boroughDim){

    //  group on population that are BAME
    var BAMEGroup = boroughDim.group().reduceSum(dc.pluck("Proportion_of_population_from_BAME_groups"));
     // attach dc.js barChart to BAME-bar ID
    var BAMEBarChart = dc.barChart("#bar-BAME");

    BAMEBarChart
        .width(600)
        .height(200)
        .useViewBoxResizing(true) // adds responsiveness
        .gap(1)
        .title(function(d){
            return `${d.key}: ${d.value}%`
        })
        // .centerBar(true)
        .group(BAMEGroup)
        .dimension(boroughDim)
        .margins({top:10, right:30, bottom:80, left:40})
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal);
        
}

// proportion of population whos main language is not English bar chart
function nonEnglishBar(cf, boroughDim){

    //  group on population whose main language is not English
    var nonEnglishGroup = boroughDim.group().reduceSum(dc.pluck("Proportion_people_whose_main_language_is_not_English"));
     // attach dc.js barChart to english-lng-bar ID
    var nonEnglishBarChart = dc.barChart("#bar-english-lng");

    nonEnglishBarChart
        .width(600)
        .height(200)
        .useViewBoxResizing(true) // adds responsiveness
        .gap(1)
        .title(function(d){
            return `${d.key}: ${d.value}%`
        })
        .group(nonEnglishGroup)
        .dimension(boroughDim)
        .margins({top:10, right:30, bottom:80, left:40})
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal);
        
}

// largest migrant population by country of birth pie chart
function migrantPieChart(cf){

    // dimension on Largest migrant population
    var migrantCountryDim = cf.dimension(dc.pluck('Largest_migrant_population_by_country_of_birth'))
    // group count of each Country
    var migrantGroup = migrantCountryDim.group();
    // attach dc.js barChart to migrant-by-birth-pie ID
    var migrantPieChart = dc.pieChart("#pie-migrant-by-birth")

    migrantPieChart
        .height(200)
        .radius(80)
        .transitionDuration(1000)
        .dimension(migrantCountryDim)
        .group(migrantGroup)
        .useViewBoxResizing(true) // adds responsiveness
        .cx(140)
        .cy(105)
        .legend(dc.legend()
                .x(105).y(65)
                .itemHeight(12)
                .gap(5)
                .maxItems(5))
        // .externalLabels(10)
        .innerRadius(60)
        .minAngleForLabel(10)
        .title(function(d){
                    return `${d.key} tops the migrant
            population in ${d.value} boroughs`
        })
        // .drawPaths(true);
}

/* ==== crimes per 1000 popluation choropleth map
* choropleth map learnt from LinkedIn Learning - dc.js course
*/
function crimeRatesChoro(cf, boroughDim, geoJson){

    var crimesDim = cf.dimension(dc.pluck("Crime_rates_per_thousand_population"));
    // pull in boroughDim and group on Crime_rates_per_thousand_population
    var crimesRateGroup = boroughDim.group().reduceSum(dc.pluck("Crime_rates_per_thousand_population"));
    // set centre of geoJson map coordinates using d3.geo.centroid to allow for translating 
    var centre = d3.geo.centroid(geoJson);
    // set projection to allow for lat and long of geoJson to be drawn in the browser
    var projection = d3.geo.mercator() // default projection is geo.AlbersUSA which does not work for UK geoJson 
                        .center(centre)
                        .scale(15000) // scale the map 
                        .translate([150,140]); // translate the map in the svg

    // attach dc.js choroplethChart to crime-rates ID
    var crimesChoroMap = dc.geoChoroplethChart("#map-crimes")

    crimesChoroMap
        .width(350)
        .height(300)
        .dimension(boroughDim)
        .group(crimesRateGroup)
        .useViewBoxResizing(true)
        .title(function(d){
                return `${d.key}
            ${d.value} crimes per 1000 people`
            
        })
        .colors(d3.scale.quantize().range(colorbrewer.Blues[9]).domain([0, 200]))
        .projection(projection)
        .overlayGeoJson(geoJson.features, "area", function(d){
            return d.properties.LAD13NM;
        })

    /**
     * Create a color legend
     * Learnt from https://www.visualcinnamon.com/2016/05/smooth-color-legend-d3-svg-gradient.html
     */   
    crimesChoroMap.on("pretransition", function(chart){
        // use color brewers "Blues" scheme
        var colorArray = colorbrewer.Blues[9];
        // set height and width for color legend 
        var width = 10;
        var height = 170;

        /**
         * Append a defs element to svg to render rects
         * Append an svg linearGradient element 
         */
        var svg = chart.select("svg");

        var grad = svg.append("defs")
                    .append("linearGradient")
                    .attr("id", "grad")
                    .attr("x1", "0%")
                    .attr("x2", "0%")
                    .attr("y1", "100%")
                    .attr("y2", "0%");

        // Set linearGradient stop positions to colorArray index
        grad.selectAll("stop")
            .data(colorArray)
            .enter()
            .append("stop")
            .attr("offset", function(d, i) {
                return (i / colorArray.length) *100 +"%";
            })
            .attr("stop-color", function(d){
                return d;
            });

        // set margin object for color legend positioning 
        var margin = {left:280,right:0,top:60,bottom:0};
        
        // create legend group to control color legend svg and yAxis together 
        var legendGroup = svg.append("g")
                .attr("transform", "translate("+margin.left+","+margin.top+")");

        // Append rect and fill with linearGradient styles to legend group 
        legendGroup.append("rect")
                .attr("x", "0")
                .attr("y", "0")
                .attr("width", width)
                .attr("height", height)
                .attr("fill", "url(#grad)");

        var min = crimesDim.bottom(1)[0].Crime_rates_per_thousand_population;
        var max = crimesDim.top(1)[0].Crime_rates_per_thousand_population
        // create linear scale for crimes 
        var y = d3.scale.linear()
                .domain([max, min])
                .range([0, height]);
        // create axis bottom for color legend
        var yAxis = d3.svg.axis()
                .scale(y)
                .ticks(6)
                .innerTickSize(4)
                .orient("right");
        legendGroup.append("g")
                .attr("class", "axis y")
                .attr("transform", "translate(10, 0)")
                .call(yAxis);
    });
}

// correlation between obesity rates and areas of greenspace(parks)
function obesityScatter(cf){
    // create fake dimension to find min and max values for scales
    var fakeObesityDim = cf.dimension(function(d){
        return d.Childhood_Obesity;
    });
    // dimension on three fields for scatter plot 
    var obesityGreenspaceDim = cf.dimension(function(d){
        return [ d.Area_that_is_Greenspace, d.Childhood_Obesity, d.Area_name];
    });
    // straight group to reduce to one value 
    var obesityGroup = obesityGreenspaceDim.group();
    // find min and max values for x linear scales
    var OBmin = fakeObesityDim.bottom(1)[0].Childhood_Obesity;
    var OBmax = fakeObesityDim.top(1)[0].Childhood_Obesity;
    // attach dc.js scatterPlot to obesity ID
    var obesityScatterPlot = dc.scatterPlot("#scatter-obesity")

    obesityScatterPlot
        .width(370)
        .height(220)
        .dimension(obesityGreenspaceDim)
        .group(obesityGroup)
        .useViewBoxResizing(true)
        .brushOn(false)
        .margins({top:10, right:30, bottom:35, left:35})
        .x(d3.scale.linear().domain([OBmin, (OBmax + 10)]))
        .yAxisLabel('Childhood Obesity (%)')
        .xAxisLabel('Area That Is Greenspace (%)')
        .symbolSize(10)
        .clipPadding(15)
        .title(function(d){
            return `${d.key[2]}
            Greenspace Area: ${d.key[0]}%
            Childhood Obesity Rate: ${d.key[1]}%`

        });
}

// average house price row chart
function avgHousePrcRow(cf, boroughDim, GB) {

    // group on median house price and divide by 1000 to reduce tick text size
    var avgHousePrcGroup = boroughDim.group().reduceSum(function(d){
        return Math.round(d.Median_House_Price / 1000)});
    // attach dc.js rowChart to avg-house-row ID
    var avgPrcRow = dc.rowChart("#row-avg-house")

    avgPrcRow
        .width(350)
        .height(230)
        .margins({top:20, right:30, bottom:45, left:20})
        .gap(1)
        .fixedBarHeight(15)
        .cap(10)
        .useViewBoxResizing(true)
        .othersGrouper(null)
        .dimension(boroughDim)
        .group(avgHousePrcGroup)
        .title(function(d){
            return `${d.key}: ${GB.numberFormat("$,.0f")(d.value * 1000)}`
        });
}

// proportion of working age people with a degree row chart
function genderPayComposite(cf, boroughDim){
    
    var maleGroup = boroughDim.group().reduceSum(dc.pluck("Gross_Annual_Pay_Male"));
    var femaleGroup = boroughDim.group().reduceSum(dc.pluck("Gross_Annual_Pay_Female"));

    // attach dc.js compositeChart to line-employment ID
    var employCompChart = dc.compositeChart("#line-gender-pay")

    employCompChart
        .width(350)
        .height(230)
        .useViewBoxResizing(true)
        .margins({top:20, right:40, bottom:25, left:40})
        .dimension(boroughDim)
        .group(maleGroup)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Across London")
        .legend(dc.legend().x(60).y(150).itemHeight(13).gap(5))
        .compose([
            dc.lineChart(employCompChart)
                .group(maleGroup, "Male Average Pay ")
                .interpolate("bundle")
                .colors("red"),
            dc.lineChart(employCompChart)
                .group(femaleGroup, "Female Average Pay")
                .interpolate("bundle")
                .colors("green")
        ]);
        // set yAxis tick format
        employCompChart.yAxis()
                .ticks(8)
                .tickFormat(function(v){
                    return v / 1000 + "k"
                });

}

