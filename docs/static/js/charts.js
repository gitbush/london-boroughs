queue()
    .defer(d3.csv, 'docs/static/data/boroughs-data.csv') // load data first
    .await(makeCharts); // load data into makeCharts function when complete or throw error if an error 

// ==== main makeCharts function to render all charts
function makeCharts(error, csv){

    // convert strings to numbers
    csv.forEach(function(d){
        d.Proportion_of_resident_population_born_abroad = +d.Proportion_of_resident_population_born_abroad;
    })

    // format strings into numbers
    csv.forEach(function (d){
        d.GLA_Population_Estimate = +d.GLA_Population_Estimate;
    });

    // crossfilter csv data
    var cf = crossfilter(csv);

    // all charts
    populationNd(cf);
    bornAbroadNd(cf);

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
function bornAbroadNd(cf) {

    // use custom reduce to get average of all boroughs population born abroad
    var bornAbroadGroup = cf.groupAll().reduce(
        
        function(p, v){
            p.count ++;
            p.total += v.Proportion_of_resident_population_born_abroad;
            p.average = p.total/p.count;
            return p;
        },

        function(p, v){
            p.count --;
            p.total -= v.Proportion_of_resident_population_born_abroad;
            p.average = p.total/p.count;
            return p;
        },

        function(){
           return {count:0, total:0, average:0};
        },
    );
    
    console.log(bornAbroadGroup.value());

    


}