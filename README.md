# uninfo


## Overview: 

Uninfo is a data visualization of university statistics (admission rate, diversity, test scores, etc ...) It is meant to help high school seniors and college students looking to transfer (like myself) to have a better understanding of their options. <a href="http://luwilliam.me/uninfo" target="_blank">Check it Out!</a>


## Functionality and MVPs:

* Users can search universities by name
* Users can view statistics of universities
* Users can use google map as a way to find universities
* Search has filters (by state, tuition, etc ...)
* Users can compare the stats of a university to that of another university

## Architecture and Technology:

* IPEDS dataset
   * The foundation of everything. There no data visualization when there's no data
* Google Map Api
   * Add an additional way for users to search for universities 
* D3
   * For charts and graphs I suppose
* wikipedia Api
   * It would be boring if it were only stats and nothing else. Photos and descriptions from wikipedia API would add some more flavor to the project 

File structure:


* webpack files
* npm files
* uninfo.html
* uninfo.csv
* /src 
    * /assets
        * /stylesheets
        * /images
    * uninfo.js
    * /js
        * /search 
        * /data
            * test_score.js
            * admission.js
            * diversity.js
            * enrollment.js
            * cost.js
        * /google_map
            map.js
            
# Wireframes
    
<img width="1024" alt="Screen Shot 2019-08-12 at 9 42 04 PM" src="https://user-images.githubusercontent.com/40703541/62909411-83531300-bd4a-11e9-8fe0-4e6c3069c236.png">

# Implementation Timeline 

* 8/13: familiarize myself with the d3.js libraries and webpack, and also setup the project.
    * learn d3
    * project setup
* 8/14: work on search functionality 
    * users can search universities
    * the search bar is well styled
* 8/15: add google map api to the project and related functionalities
    * google map should function properly
    * add university markers
    * add onClickListeners to the markers
* 8/16, 8/17, 8/18: work on the data visualization part of the project
    * create interactive pie charts for test scores (SAT and ACT), diversity and enrollment
    * create interactive bar graphs for costs of attendance and application/admission
* 8/19: CSS day and make sure everything works

# Bonus features

* Users can compare stats to the average state/city stats
* Users can see the changes in stats over the past few years



