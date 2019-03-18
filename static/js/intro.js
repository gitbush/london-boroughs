// intro.js dashboard intructions
$(".intro").on("click", function startIntro(){
    var intro = introJs();
        intro.setOptions({
        steps: [
            {
            element: '#bar-BAME',
            intro: "Click on a bar in the chart to focus all other charts on a particular borough."
            },
            {
            element: '#bar-BAME',
            intro: "Click on more boroughs to add to the selection.",
            position: 'auto'
            },
            {
            element: '#crimes',
            intro: "The Crimes section will not be affected by other charts. Click on the map to see the type of crime which is most prevalent in the row chart below.",
            position: 'auto'
            },
            {
            element: '.reset-all',
            intro: 'Click the reset-all button to remove <b>all</b> filters.',
            position: 'auto'
            },
            {
            element: '.fa-info-circle',
            intro: 'The info button will provide some background about the project'
            },
            {
            element: '.fa-question-circle',
            intro: 'The question button will take you through these steps again.'
            }
        ]
        });

        intro.start();
})
