# Dependenceis
from splinter import Browser
from bs4 import BeautifulSoup
import pandas as pd
import requests
import time

# MAC user: 
#https://splinter.readthedocs.io/en/latest/drivers/chrome.html
#!which chromedriver
#executable_path = {'executable_path': '/usr/local/bin/chromedriver'}
#browser = Browser('chrome', **executable_path, headless=False)

# Initialize browser
def init_browser():
    executable_path = {'executable_path': '/usr/local/bin/chromedriver'}
    return Browser('chrome', **executable_path, headless=False)

# Create a dictionary to store all scraped data
mars_info = {}

#-------------------------------------------------------------------------------------
# Step I: NASA Mars News Site
# Scraping function that exectutes the scraping of targeted webpages
def scrape_news():
    browser = init_browser()
    # Identifying the website to be scrapped and establishing a connection
    url_news = 'https://mars.nasa.gov/news'
    browser.visit(url_news)
    time.sleep(1)

    # Creating a beautifulsoup object and parsing this object
    html = browser.html
    soup = BeautifulSoup(html, 'html.parser')

    # Scraping for the title of text of the most recent news article
    news_title = soup.find('div', class_='content_title').text
    #print(news_title)
    news_p = soup.find('div', class_='article_teaser_body').text
    #print(news_p)

    # Store data in mars_scraped_dict
    mars_info['news_title'] = news_title
    mars_info['news_p'] = news_p

    # Return results
    return mars_info

#-------------------------------------------------------------------------------------
#Step II: JPL Mars Space Images
# Scraping function that exectutes the scraping of targeted webpages
def scrape_image():
    browser = init_browser()
    # Identifying the website to be scrapped and establishing a connection
    url_jpl = 'https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars'
    browser.visit(url_jpl)
    time.sleep(1)

    # Click the full image button to get to right set of images
    browser.click_link_by_partial_text('FULL IMAGE')

    # Creating a beautifulsoup object and parsing this object
    html = browser.html
    soup = BeautifulSoup(html, 'html.parser')
    #print(soup.prettify)

    # Extracting the link for largesize featured images (hunting for the right anchor)
    #featured_image_url = soup.find('ul', class_='articles').a['data-fancybox-href']
    featured_image = soup.find('div', class_ = 'carousel_items').find('article')['style']
    #featured_image

    # Removing the text before the image url
    featured_image_url = featured_image.split("'")[1]
    #print(featured_image_url)

    # Attaching the base url to the featured image
    base_url = "https://www.jpl.nasa.gov/"
    full_featured_image_url = base_url + featured_image_url
    #full_featured_image_url

    # Store data in mars_scraped_dict
    mars_info['full_featured_image_url'] = full_featured_image_url
    
    # Return results
    return mars_info

#-------------------------------------------------------------------------------------
#Step III: Mars Weather
# Scraping function that exectutes the scraping of targeted webpages
def scrape_weather():
    browser = init_browser()
    # Identifying the website to be scrapped and establishing a connection
    url_weather = 'https://twitter.com/marswxreport?lang=en'
    browser.visit(url_weather)
    time.sleep(1)

    # Creating a beautifulsoup object and parsing this object
    html = browser.html
    soup = BeautifulSoup(html, 'html.parser')

    # Extracting the link for latest tweet about Mars
    #tweet = soup.find('div', class_='js-tweet-text-container')
    #tweet = soup.find('p', class_='TweetTextSize').text
    tweets = soup.find_all('div', class_='js-tweet-text-container')
    for tweet in tweets:
        weather = tweet.find('p').text
        if "Insight" and "pressure" and "sol" in weather:
            #print(weather)
            break
        else:
            pass

    # Store data in mars_scraped_dict
    mars_info['weather'] = weather
    
    # Return results
    return mars_info

#-------------------------------------------------------------------------------------
#Step IV: Mars Facts
# Scraping function that exectutes the scraping of targeted webpages
def scrape_facts():
    # Scraping via Pandas
    url_facts = 'https://space-facts.com/mars/'
    tables = pd.read_html(url_facts)
    #tables

    # Creating a dataframe from the first table = comparison table
    df1 = tables[0]
    df1.columns = ['Mars - Earth Comparison', 'Mars', 'Earth']
    # Convert this dataframe to a HTML table string
    Mars_vs_Earth = df1.to_html()
    #Mars_vs_Earth

    # Creating a dataframe from the second table = Mars parameters
    df2 = tables[1]
    df2.columns = ['Mars Parameters', 'Values']
    # Convert this dataframe to a HTML table string
    Mars_Facts = df2.to_html()
    #Mars_Facts

    # Store data in mars_scraped_dict
    mars_info['Mars_vs_Earth'] = Mars_vs_Earth
    mars_info['Mars_Facts'] = Mars_Facts
    
    # Return results
    return mars_info

#-------------------------------------------------------------------------------------
# Step V: Mars Hemispheres
# Scraping function that exectutes the scraping of targeted webpages
def scrape_hemispheres():
    browser = init_browser()
    # Identifying the website to be scrapped and establishing a connection
    url_hemi = "https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars"
    browser.visit(url_hemi)
    time.sleep(1)

    # Creating a beautifulsoup object and parsing this object
    html = browser.html
    soup = BeautifulSoup(html, 'html.parser')

    # Confirming landing spot, target data
    #cerberus_description = soup.find('div', class_='description').text
    #print(cerberus_description)

    # Create the hemisphere_image_urls list
    hemisphere_image_urls = []

    hemispheres_main_url = 'https://astrogeology.usgs.gov'

    # Create a list of hemispheres for Mars
    hemispheres = soup.find_all('div', class_='item')

    # Loop through this hemispheres list to extract name and image link
    for hemisphere in hemispheres:
        
        title = hemisphere.find('h3').text #name = a.h3.text
        partial_img_url = hemisphere.find("div", class_="description").a["href"]
    
        # output check
        #print('-------------')
        #print(title)
        #print(partial_img_url)
    
        # 
        browser.visit(hemispheres_main_url + partial_img_url)
    
        partial_img_html = browser.html
        soup = BeautifulSoup( partial_img_html, 'html.parser')
        img_url = hemispheres_main_url + soup.find('img', class_='wide-image')['src']
    
        # append the hemisphere_image_urls list with the hemisphere dictionary
        hemisphere_image_urls.append({"title" : title, "img_url" : img_url})

    # Check dictionary
    #print('-------------')
    #print(hemisphere_image_urls)

    # Store data in mars_scraped_dict
    mars_info['hemisphere_image_urls'] = hemisphere_image_urls
    
    # Return results
    return mars_info