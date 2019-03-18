# London Boroughs Dashboard

This dashboard was created to present the user with a range of headline indicators  covering demographic, economic, environmental and crime of each borough of the city of London.

Bringing to life some very interesting London datasets using the Javascript libraries D3.js, Dc.js and Crossfilter.js. 
 
## UX
 
The design of this website was used to provide the user with a fun and interactive way to discover facts about each borough of London without over complicating things.

Using D3 Dc and Crossfilter, all charts will filter each other on clicking to allow the user to narrow down their selection.

The crimes per borough section is using its own seperate dataset and as a result will not filter when other chart categories are selected. This was left as is owing to the format of the two datasets and I think leads to a less complicated experience. 

A few potential users are someone who:
1. Is thinking of moving to London and wants to know the economic, social and safety side of the city.
2. Wants to know how all London boroughs differ on key indicators.
3. Wants to see how a particular borough compares on key indicators. 

## Features

The dashboard, as the name suggests centres around the charts. Each chart is interactive to varied degrees.
- Four number displays head the dashboard displaying some of the key indicators to any city. These will filter accordingly based on the selected filters
- Two bar charts and pie chart focused on migration. Showcases some interesting insights into the multicultural population of London.
- Choropleth Map with accompanied row chart based on crime within each borough. My personal favourite visualisation on the dashboard. By clicking on a borough on the map you can see which crimes are most prevalent.
- Obesity vs greenspace scatter plot. Shows the correlation between the amount of greenspace a borough has and the rate of chidhood obesity. 
- Gender pay gap composite chart. Another data relationship that I was expecting but no less impactful. 
- Average house price row chart. Showing the extortionate value of property in each borough.

All charts are fully responsive and interactive. Clicking on any chart will apply filters to others allowing the user to narrow down their selection. A reset all button at the bottom of page will remove all filters and reset all charts to starting point. 

### Features Left to Implement
- Something that would be useful is to display the name of the selected borough/s so the user is aware of the data being used.

## Technologies Used

The dashboard relies:
* <a href="https://www.w3.org/TR/html52/" target="_blank">HTML</a> 
    - For markup
* <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS3" target="_blank">CSS3</a>
    - For dashboard styles and grid layout
* <a href="https://sass-lang.com/documentation/file.SCSS_FOR_SASS_USERS.html" target="_blank">SCSS</a>
    - For splitting the stylesheets into partials for ease of development. My first time using SCSS and I do need to find a work flow that suits me. 
* <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">Javascript</a> 
    - All three charting libraries are based on Javascript.
* <a href="https://getbootstrap.com/docs/4.0/getting-started/introduction/" target="_blank">Bootstrap (version 4.3.1)</a>
    -  Used for all cards, font styles and modal.
* <a href="https://d3js.org/" target="_blank">D3.js (version 3.5.17)</a>
    -  JavaScript library for manipulating documents based on data and the backbone of the dashbaord.
* <a href="https://dc-js.github.io/dc.js/" target="_blank">Dc.js (version 2.1.8)</a>
    - Leveraging d3.js to render charts in CSS-friendly SVG format. 
* <a href="http://square.github.io/crossfilter/" target="_blank">Crossfilter.js (version 1.3.12)</a>
    - A dependency of dc.js to provide linked filtering and aggregation of large datasets.
* <a href="https://github.com/d3/d3-queue" target="_blank">Queue.js (version 1.0.7)</a> 
    - Used to load in csv and geoJson data 
* <a href="https://jquery.com/" target="_blank">Jquery (version 3.3.1)</a>
    - For the welcome/info modal.
* <a href="https://fontawesome.com/" target="_blank">Font Awesome (version v5.7.2)</a>
    - For number display icons and info icon.

## Testing

The dashboard was tested throughout development on all the major browsers latest versions. The dashboard will render accordingly on all device screen widths. Content driven breakpoints were used rather than focusing on individual device width. I think this provides the most fail safe way of accomodating any screen on which the dashboard is viewed as well as keeping up with the speed at which new devices are being made.

How the potential users mentioned in the UK section can achieve their goals:
1. A comparison of all boroughs across every indicator can be gained when first arriving at the dashboard as all charts are initially rendered without any filters applied. 
2. The user can focus on one particular section/indicator and see how all boroughs match up.
3. Clicking on a particular borough on any chart will filter other indicators so the user can see how that borough compares to others. 

I would have liked to incorporate some form of automated testing and TDD during the build of this project but I could not find any reliable sources showing how to use a testing framework like Jasmine on d3.js charts. Or svg testing in general...

A testing matrix can be found <a href="docs/testing.xlsx" target="_blank">here</a> showing all tests carried out on all browsers and breakpoints.

## Deployment

The project source control was handled by git and remotely on Github. The repository can be found here:

Repo: <a href= "https://github.com/gitbush/london-boroughs" target="_blank">https://github.com/gitbush/london-boroughs</a>

Deployed site on Github pages here:

Github Pages (master branch): <a href="https://gitbush.github.io/london-boroughs/" target="_blank">https://gitbush.github.io/london-boroughs/</a>

To run locally, you can clone this repository directly into the editor of your choice by pasting `git clone https://github.com/gitbush/london-boroughs.git` into your terminal. 

### Content

The dashboard is based on two seperate datasets:
* <a href="https://data.london.gov.uk/dataset/london-borough-profiles" target="_blank">London Boroughs Data</a>
* <a href= "https://www.met.police.uk/sd/stats-and-data/met/crime-data-dashboard/" target="_blank">Met Police Stats and Data</a>

### Acknowledgements

The color legend used in the Crimes per Borough section was learnt from the <a href="https://www.visualcinnamon.com/2016/05/smooth-color-legend-d3-svg-gradient.html" target="_blank">SVG linear gradient tutorial.</a>
