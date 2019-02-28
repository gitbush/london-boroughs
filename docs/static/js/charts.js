queue()
    .defer(d3.csv, 'docs/static/data/boroughs-data.csv') // load data first
    .await(makeCharts); // load data into makeCharts function when complete or throw error if an error 

// ==== main makeCharts function to render all charts
function makeCharts(error, csv){

    // convert strings to numbers
    csv.forEach(function(d){
        d.Proportion_of_resident_population_born_abroad = +d.Proportion_of_resident_population_born_abroad;
        d.Median_House_Price = +d.Median_House_Price;
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
    
    // averages groups
    var bornAbroadGroup = reduceAvg(cf, "Proportion_of_resident_population_born_abroad");
    var housePriceGroup = reduceAvg(cf, "Median_House_Price");

    // all charts
    populationNd(cf);
    bornAbroadNd(cf, bornAbroadGroup);
    avgHousePrcNd(cf, housePriceGroup);

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

// % population born abroad number display 
function bornAbroadNd(cf, bornAbroadGroup) {
    
    // attach dc.js numberDisplay to born abroad ID
    var abroadNd = dc.numberDisplay("#born-abroad")

    abroadNd
        .formatNumber(d3.format("%"))
        .group(bornAbroadGroup)
        .valueAccessor(function(d){
            return d.average / 100; // divide by 100 to allow % number format
        });
}

// average house price number display
function avgHousePrcNd(cf, housePriceGroup){

     // attach dc.js numberDisplay to avg house price ID
     var housePriceNd = dc.numberDisplay("#avg-house-prc")

     housePriceNd
        .group(housePriceGroup)
        .valueAccessor(function(d){
            return d.average;
        });
}