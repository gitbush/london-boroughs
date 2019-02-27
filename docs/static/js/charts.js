queue()
    .defer(d3.csv, 'docs/static/data/boroughs-data.csv') // load data first
    .await(makeGraphs); // load data into makeGraphs function when complete or throw error if an error 

// ==== main makeGraphs function to render all charts
function makeGraphs(error, csv){

     // crossfilter csv data
     var cf = crossfilter(londonCsv);

}

// ==== total population number display
