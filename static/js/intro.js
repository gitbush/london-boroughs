    
$("#intro").on("click", function startIntro(){
    var intro = introJs();
        intro.setOptions({
        steps: [
            {
            element: '#bar-BAME',
            intro: "Click on a bar in the chart to focus all other charts on a particular borough."
            },
            {
            element: '#bar-BAME',
            intro: "Select more boroughs to add to the selection.",
            position: 'auto'
            },
            {
            element: '.reset-all',
            intro: 'Click this button to remove all filters.',
            position: 'auto'
            },
            {
            element: '#crimes',
            intro: "The Crimes section will not be affected by other charts. Click on the map to see the type of crime which is most prevalent in the row chart below.",
            position: 'bottom'
            },
            {
            element: '.fa-info-circle',
            intro: 'The info icon will provide some background about the project'
            },
            {
            element: '#intro',
            intro: 'Click "Show me" to go through these steps again.'
            }
        ]
        });

        intro.start();
})
