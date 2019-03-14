# London Boroughs Dashboard

This dashboard was created to present the user with a range of headline indicators  covering demographic, economic, environmental and crime of each borough of the city of London.

Bringing to life some very interesting London datasets using the Javascript libraries D3.js, Dc.js and Crossfilter.js. 
 
## UX
 
The design of this website was used to provide the user with a fun and interactive way to discover facts about each borough of London without over complicating things.

Using D3 Dc and Crossfilter, all charts will filter each other on clicking to allow the user to narrow down their selection.

The crimes per borough section is using its own seperate dataset and as a result will not filter when other chart categories are selected. This was left as is owing to the format of the two datasets and I think leads to a less complicated experience. 

A few potential users are someone who:
- Is thinking of moving to London and wants to know the economic, social and safety side of the city.
- Wants to know how all London boroughs differ on key indicators. 

## Features

The dashboard as the name suggests centres around the charts. Each chart is interactive to varied degrees.
- Four number displays head the dashboard displaying some of the key indicators to any city. These will filter accordingly based on the selected filters
- Two bar charts and pie chart focused on migration. Showcases some interesting insights into the multicultural population of London.
- Choropleth Map with accompanied row chart based on crime within each borough. My personal favourite visualisation on the dashboard. By clicking on a borough on the map you can see which crimes are most prevalent.
- Obesity vs greenspace scatter plot. Shows the correlation between the amount of greenspace a borough has and the rate of chidhood obesity. 
- Gender pay gap composite chart. Another data relationship that I was expecting but no less impactful. 
- Average house price row chart. Showing the extortionate value of property in each borough.

### Features Left to Implement
- Something that would be useful is to display the name of the selected borough/s so the user is aware of the data being used.

## Technologies Used

The dashboard relies:
* HTML 
    - For markup
* CSS
...For dashboard styles and grid layout
* Bootstrap (version 4.3.1)
... Used for all cards, font styles and modal.
* D3.js (version 3.5.17)
... JavaScript library for manipulating documents based on data and the backbone of the dashbaord.
* Dc.js (version 2.1.8)
... Leveraging d3.js to render charts in CSS-friendly SVG format. 
* Crossfilter.js (version 1.3.12)
... A dependency of dc.js to provide linked filtering and aggregation of large datasets.
* Javascript 
... All three charting libraries are based on Javascript.
* Queue.js (version 1.0.7)
... Used to load in csv and geoJson data 
* Color Brewer (version 1)
... A tool designed to select various color schemes for maps and other graphics. Used in the crimes chorpleth map and color legend.
* Jquery
... For the welcome/info modal.
* Font Awesome (version v5.7.2)
... For number display icons and info icon.

## Testing

In this section, you need to convince the assessor that you have conducted enough testing to legitimately believe that the site works well. Essentially, in this part you will want to go over all of your user stories from the UX section and ensure that they all work as intended, with the project providing an easy and straightforward way for the users to achieve their goals.

Whenever it is feasible, prefer to automate your tests, and if you've done so, provide a brief explanation of your approach, link to the test file(s) and explain how to run them.

For any scenarios that have not been automated, test the user stories manually and provide as much detail as is relevant. A particularly useful form for describing your testing process is via scenarios, such as:

1. Contact form:
    1. Go to the "Contact Us" page
    2. Try to submit the empty form and verify that an error message about the required fields appears
    3. Try to submit the form with an invalid email address and verify that a relevant error message appears
    4. Try to submit the form with all inputs valid and verify that a success message appears.

In addition, you should mention in this section how your project looks and works on different browsers and screen sizes.

You should also mention in this section any interesting bugs or problems you discovered during your testing, even if you haven't addressed them yet.

If this section grows too long, you may want to split it off into a separate file and link to it from here.

## Deployment

This section should describe the process you went through to deploy the project to a hosting platform (e.g. GitHub Pages or Heroku).

In particular, you should provide all details of the differences between the deployed version and the development version, if any, including:
- Different values for environment variables (Heroku Config Vars)?
- Different configuration files?
- Separate git branch?

In addition, if it is not obvious, you should also describe how to run your code locally.


## Credits

### Content
- The text for section Y was copied from the [Wikipedia article Z](https://en.wikipedia.org/wiki/Z)

### Media
- The photos used in this site were obtained from ...

### Acknowledgements

- I received inspiration for this project from X
