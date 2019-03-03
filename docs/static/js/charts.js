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
    avgHousePrcRow(cf, boroughDim);
    degreeRow(cf);

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
        .formatNumber(d3.format(".0%"))
        .group(bornAbroadGroup)
        .valueAccessor(function(d){
            return d.average / 100; // divide by 100 to allow % number format
        });
}

// average house price number display
function avgHousePrcNd(cf, housePriceGroup, GB){

     // attach dc.js numberDisplay to avg house price ID
     var housePriceNd = dc.numberDisplay("#avg-house-prc")

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
    var avgPayNd = dc.numberDisplay('#avg-pay')

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
    var BAMEBarChart = dc.barChart("#BAME-bar");

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
        .margins({top:20, right:30, bottom:60, left:40})
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal);
        
}

// proportion of population whos main language is not English bar chart
function nonEnglishBar(cf, boroughDim){

    //  group on population whose main language is not English
    var nonEnglishGroup = boroughDim.group().reduceSum(dc.pluck("Proportion_people_whose_main_language_is_not_English"));
     // attach dc.js barChart to english-lng-bar ID
    var nonEnglishBarChart = dc.barChart("#english-lng-bar");

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
        .margins({top:20, right:30, bottom:60, left:40})
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
    var migrantPieChart = dc.pieChart("#migrant-by-birth-pie")

    migrantPieChart
        .height(200)
        .radius(70)
        .transitionDuration(1000)
        .dimension(migrantCountryDim)
        .group(migrantGroup)
        .useViewBoxResizing(true) // adds responsiveness
        .cx(120)
        .cy(100)
        .legend(dc.legend().x(210).y(20).itemHeight(10).gap(5))
        .externalLabels(10)
        .innerRadius(30)
        // .minAngleForLabel(99)
        // .drawPaths(true);
}

// crimes per 1000 popluation choropleth map


















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
    var obesityScatterPlot = dc.scatterPlot("#obesity-scatter")

    obesityScatterPlot
        .width(400)
        .height(250)
        .dimension(obesityGreenspaceDim)
        .group(obesityGroup)
        .useViewBoxResizing(true)
        .brushOn(false)
        .margins({top:20, right:10, bottom:35, left:30})
        .x(d3.scale.linear().domain([OBmin, (OBmax + 10)]))
        .yAxisLabel('Childhood Obesity (%)')
        .xAxisLabel('Area That Is Greenspace (%)')
        .symbolSize(10)
        .clipPadding(15);
}

// average house price row chart
function avgHousePrcRow(cf, boroughDim) {

    // group on median house price and divide by 1000 to reduce tick text size
    var avgHousePrcGroup = boroughDim.group().reduceSum(function(d){
        return Math.round(d.Median_House_Price / 1000)});
    // attach dc.js rowChart to avg-house-row ID
    var avgPrcRow = dc.rowChart("#avg-house-row")

    avgPrcRow
        .width(400)
        .height(200)
        .margins({top:20, right:50, bottom:35, left:15})
        .gap(1)
        .fixedBarHeight(13)
        .cap(10)
        .useViewBoxResizing(true)
        .othersGrouper(null)
        .dimension(boroughDim)
        .group(avgHousePrcGroup);

    
}

// proportion of working age people with a degree row chart
function degreeRow(cf){
    // dimension on Inner and Outer London boroughs
    var InnerOuterDim = cf.dimension(function(d){
        return d.Inner_Outer_London;
    });
    // find average of group using custom reduce()
    var degreeGroup = InnerOuterDim.group().reduce(
        
        function(p,v){
            p.count ++;
            p.total += v.Proportion_of_working_age_with_degree_or_equivalent_and_above;
            p.average = p.total/p.count;
            return p;
        },

        function(p,v){
            p.count --;
            p.total -= v.Proportion_of_working_age_with_degree_or_equivalent_and_above;
            p.average = p.total/p.count;
            return p;
        },

        function(){
            return {count:0, total:0, average:0};
        },
    )
    // attach dc.js rowChart to degree-row ID
    var degreeRowChart = dc.rowChart("#degree-row")

    degreeRowChart
        .width(600)
        .height(230)
        .useViewBoxResizing(true)
        .margins({top:10, right:10, bottom:20, left:20})
        .dimension(InnerOuterDim)
        .group(degreeGroup)
        .valueAccessor(function(d){
            return d.value.average
        });

}

