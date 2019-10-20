# Mission to Mars – Web Scrapping & HTML deployment with Flask

Background
Create a web application that scrapes multiple websites for Mars related information and display this information on a customized HTML page.

# Part I 
Use Jupyter notebook, Pandas, BeautifulSoup, and Requests/Splinter to create web scrapping applications for the following sites:
	
From NASA Mars News at https://mars.nasa.gov/news/ collect the latest news title and associated paragraph text and assign these to variables ‘news_title’ and ‘news_p’ for later reference.

From JPL Mars Space Images at https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars use Splinter to retrieve the current featured Mars image. Save the complete full-size jpeg image url string as variable called ‘featured_image_url’.

Visit the Mars Weather twitter account at https://twitter.com/marswxreport?lang=en and obtain the most current weather tweet. Save the tweet text of the weather report as the variable ‘mars_weather’.

Go to the Mars Facts webpage at https://space-facts.com/mars/ and scrape the table containing facts about Mars including its diameter, mass, etc. Use Pandas to convert the data into a HTML table string.

Finally, visit the USGS Astrogeology site at https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars to obtain the high resolution images for each of Mar’s four hemispheres. Save both the full resolution image url string and hemisphere name. Store this data as a Python dictionary using the keys ‘img_url’ and ‘title’ and append this dictionary with image url and hemisphere title to a list. This final list will contain one dictionary for each of the hemispheres.


# Part II	
Use MongoDB and Flask to display all of the scraped information on an HTML page.

Step 1: convert the Jupyter notebook scrapping files into a Python script called ‘scrape_mars.py’ with a function called ‘scrape’ that executes all of the scrapping tasks and returns a single Python dictionary containing all of the scraped data.
	
Step 2: create a route called ‘/scrape’ that imports the ‘scrape_mars.py’ and calls the ‘scrape’ function. Store the return value in Mongo as a Python dictionary.

Step 3: create a route ‘/’ that will query the MongoDB and transfer the Mars data into an HTML template for display.

Step 4: create a HTML template file called ‘index.html’ to receive all of the Mars data in the dictionary and display it in the appropriate HTML elements.


Data Boot Camp (C) 2019. All Rights Reserved.
