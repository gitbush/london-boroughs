queue()
    .defer(d3.csv, 'docs/static/data/boroughs-data.csv') // load data first
    .await(makeCharts); // load data into makeCharts function when complete or throw error if an error 

// ==== main makeCharts function to render all charts
function makeCharts(error, csv){

    // format strings into numbers
    csv.forEach(function (d){
        d.GLA_Population_Estimate = +d.GLA_Population_Estimate;
    });

    // crossfilter csv data
    var cf = crossfilter(csv);

    // all charts
    populationNd(cf);

    dc.renderAll();
}

// ==== total population number display
function populationNd(cf) {
    // group on total population with groupAll on crossfilter to observe all filter when applied
    var popGroup = cf.groupAll().reduceSum(function(d){return d.GLA_Population_Estimate});
    // create number display at #population
    var popNd = dc.numberDisplay("#population");
    // dc number display
    popNd
        .group(popGroup)
        .valueAccessor(function(d){
            return d;
        });
}