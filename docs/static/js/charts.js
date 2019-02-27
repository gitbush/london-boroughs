queue()
    .defer(d3.csv, 'docs/static/data/boroughs-data.csv')
    .await(makeGraphs);

function makeGraphs(error, csv){

    
}