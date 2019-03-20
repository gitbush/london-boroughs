// intro.js dashboard intructions
$(".intro").on("click", function startIntro(){

    $(".reset").css({right:"2rem", top: ".2rem"})

    var intro = introJs();
        intro.setOptions({
        steps: [
            {
            element: '#bar-BAME',
            intro: "Click on a bar in the chart to focus on a particular borough. The same filter will apply to other charts."
            },
            {
            element: '#bar-BAME',
            intro: "Click on more boroughs to add to the selection. Or click the reset link to clear.",
            position: 'auto'
            },
            {
            element: '#crimes',
            intro: "The Crimes section will not be affected by other charts. Click on the map to see the type of crime which is most prevalent in the row chart below.",
            position: 'right'
            },
            {
            element: '.fa-info-circle',
            intro: 'The info button will provide some background about the project'
            },
            {
            element: '.fa-question-circle',
            intro: 'The question button will take you through these steps again.'
            },
            {
            intro: 'This completes the tour'
            }
        ]
        });

        intro.onexit(function() {
            $(".reset").css({right:"2rem", top: "8.5rem"})
          });

        intro.start();        
})
