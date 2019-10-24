# Dependenceis
from splinter import Browser
from bs4 import BeautifulSoup
import pandas as pd
import numpy as np
import requests
import tensorflow
from tensorflow.keras.models import load_model
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
tensorflow.keras.__version__
import time

#https://splinter.readthedocs.io/en/latest/drivers/chrome.html
#!which chromedriver
# MAC user: 
#executable_path = {'executable_path': '/usr/local/bin/chromedriver'}
#browser = Browser('chrome', **executable_path, headless=False)
# PC user:
#executable_path = {'executable_path': 'chromedriver.exe}
#browser = Browser('chrome', **executable_path, headless=False)

# Initialize browser
def init_browser():
    executable_path = {'executable_path': '/usr/local/bin/chromedriver'}
    return Browser('chrome', **executable_path, headless=True) # if headless=False, the page being scrapped will remain open and on display

# Create a dictionary {} to store scraped data and labels, and a list [] for just the numbers to be used in the ML model
eco_scrape_dict = {}
eco_scrape_list = []
final_prediction = [['?']]
########################################################################################################################################
# Scraping function to get current bond and stock pricing info
def scrape_bonds():
    eco_scrape_list.clear()
    browser = init_browser()
    # Identifying the website to be scrapped and establishing a connection
    url_bonds = 'https://finance.yahoo.com/bonds/'
    browser.visit(url_bonds)
    time.sleep(1)

    # Creating a beautifulsoup object and parsing this object
    html = browser.html
    soup = BeautifulSoup(html, 'html.parser')
    #browser.quit() #this will close the browser window after scraping

    # Extracting the trading volumes for the dow, snp500 and nasdaq
    stocks = soup.find_all('span', class_='Trsdu(0.3s)')
    dow = float(stocks[3].text.replace(',', ''))
    snp = float(stocks[0].text.replace(',', ''))
    nasdaq = float(stocks[6].text.replace(',', ''))

    # Extracting the current rate for 13-wk, 5-yr and 10-yr federal bonds
    bond1 = soup.find_all('div', class_='Ovx(a)')
    bond2 = bond1[0].text
    wk13 = float(bond2[81:87])
    #yr5 = float(bond2[126:132])
    yr5 = float(bond2[124:130])     # website changed 10/20/19, had to adjust list values
    #yr10 = float(bond2[172:178])
    yr10 = float(bond2[170:172])

    # Store data in eco_scrape_dict{}
    eco_scrape_dict['dow'] = f'Current Dow Jones Index trading volume is {dow}'
    eco_scrape_dict['13wk'] = f'Current 13-week Treasury Yield is {wk13}%'
    eco_scrape_dict['5yr'] = f'Current 5-year Treasury Yield is {yr5}%'
    eco_scrape_dict['10yr'] = f'Current 10-year Treasury Yield is {yr10}%'

    # Store data in eco_scrape_list[] for modeling
    eco_scrape_list.append(dow)
    eco_scrape_list.append(wk13)
    eco_scrape_list.append(yr5)
    eco_scrape_list.append(yr10)
    
    # Return results
    return eco_scrape_dict, eco_scrape_list

# scrape_bonds()
########################################################################################################################################
# Scraping function to get current federal interest rate info
def scrape_fedrate():
    browser = init_browser()
    # Identifying the website to be scrapped and establishing a connection
    url_fedrate = 'https://www.federalreserve.gov/monetarypolicy/openmarket.htm'
    browser.visit(url_fedrate)
    time.sleep(1)

    # Creating a beautifulsoup object and parsing this object
    html = browser.html
    soup = BeautifulSoup(html, 'html.parser')
    #browser.quit() #this will close the browser window after scraping
    
    # Extracting the current Fed interest rate
    table_values = soup.find_all('div', class_ = "data-table")
    tr = table_values[0].find_all('tr')
    td = tr[1].find_all('td')
    values = (td[3].text)
    value1 = float(values[:4])
    value2 = float(values[5:9])
    fed = (value1 + value2) / 2
    
    # Store data in eco_scrape_dict{}
    eco_scrape_dict['fed'] = f'Current Fed interst rate is {fed}%'

    # Store data in eco_scrape_list[] for modeling
    eco_scrape_list.append(fed)

    # Return results
    return eco_scrape_dict, eco_scrape_list

# scrape_fedrate()
########################################################################################################################################
# Scraping function to get current federal unemployment rate
def scrape_unemployment():
    browser = init_browser()
    # Identifying the website to be scrapped and establishing a connection
    url_unemployment = 'https://www.google.com/search?rlz=1C5CHFA_enUS840US848&sxsrf=ACYBGNSWmRd3yXsKiJmADGqbIn59XdmoHA%3A1569866539880&ei=\
    K0OSXbCmNann5gKFgbzYBQ&q=current+federal+unemployment+rate&oq=current+federal+unemployment+rate&gs_l=psy-ab.3..0j0i30j0i8i30l2.24028.24900\
    ..26933...0.2..0.82.567.8....3..0....1..gws-wiz.......0i71j35i304i39j0i13j0i7i30j0i8i7i30.KnvecmdU8IY&ved=0ahUKEwjw59DLkPnkAhWps1kKHYUAD1s\
    Q4dUDCAs&uact=5'
    browser.visit(url_unemployment)
    time.sleep(1)

    # Creating a beautifulsoup object and parsing this object
    html = browser.html
    soup = BeautifulSoup(html, 'html.parser')
    #browser.quit() #this will close the browser window after scraping
    
    # Extracting the current federal unemployment rate
    unemploy = soup.find_all('div', class_ = "Z0LcW AZCkJd")
    unemploy2 = unemploy[0].text
    unemployment = float(unemploy2[:3])

    # Store data in eco_scrape_dict{}
    eco_scrape_dict['unemployment'] = f'The current federal unemployment rate is {unemployment}%'

    # Store data in eco_scrape_list[] for modeling
    eco_scrape_list.append(unemployment)

    # Return results
    return eco_scrape_dict, eco_scrape_list

# scrape_unemployment()
########################################################################################################################################
# Scraping function to get current gold price in US dollars
def scrape_gold():
    browser = init_browser()
    # Identifying the website to be scrapped and establishing a connection
    url_gold = 'https://www.gold.org/goldhub/data/gold-prices'
    browser.visit(url_gold)
    time.sleep(1)

    # Creating a beautifulsoup object and parsing this object
    html = browser.html
    soup = BeautifulSoup(html, 'html.parser')
    #browser.quit() #this will close the browser window after scraping
    
    # Extracting the current price of gold in the US
    price = soup.find_all('span', class_ = "text value")
    gold_price = float(price[0].text.replace(',', ''))

    # Store data in eco_scrape_dict{}
    eco_scrape_dict['gold'] = f"Today's gold price is ${gold_price} U.S.D."

    # Store data in eco_scrape_list[] for modeling
    eco_scrape_list.append(gold_price)

    # Return results
    return eco_scrape_dict, eco_scrape_list

# scrape_gold()
########################################################################################################################################
# Scraping function to get current consumer pricing info
def scrape_cpi():
    browser = init_browser()
    # Identifying the website to be scrapped and establishing a connection
    url_cpi = 'https://tradingeconomics.com/united-states/consumer-price-index-cpi'
    browser.visit(url_cpi)
    time.sleep(1)

    # Creating a beautifulsoup object and parsing this object
    html = browser.html
    soup = BeautifulSoup(html, 'html.parser')
    #browser.quit() #this will close the browser window after scraping
    
    # Extracting the current consumer price index for the US
    table_values = soup.find_all('div', class_ = "table-responsive")
    cpi1 = table_values[0].find('a', href='/united-states/consumer-price-index-cpi')
    cpi2 = cpi1.parent
    cpi = float(cpi2.next_sibling.next_sibling.text)

    # Store data in eco_scrape_dict{}
    eco_scrape_dict['cpi'] = f'Consumer Price Index is {cpi}'

    # Store data in eco_scrape_list[] for modeling
    eco_scrape_list.append(cpi)

    # Return results
    return eco_scrape_dict, eco_scrape_list
    
# scrape_cpi()
########################################################################################################################################
# Scraping function to get current federal inflation rate
def scrape_inflation():
    browser = init_browser()
    # Identifying the website to be scrapped and establishing a connection
    url_inflation = 'https://tradingeconomics.com/united-states/inflation-cpi'
    browser.visit(url_inflation)
    time.sleep(1)

    # Creating a beautifulsoup object and parsing this object
    html = browser.html
    soup = BeautifulSoup(html, 'html.parser')
    #browser.quit() #this will close the browser window after scraping

    #Extracting the current monthly housing starts number in the US
    table_values = soup.find_all('div', class_ = "table-responsive")
    x = table_values[1].find('a', href='/united-states/inflation-cpi')
    y = x.parent
    z = float(y.next_sibling.next_sibling.text)

    # Store data in eco_scrape_dict{}
    eco_scrape_dict['inflation'] = f'Current federal inflation rate is {z}%'

    # Store data in eco_scrape_list[] for modeling
    eco_scrape_list.append(z)

    # Return results
    return eco_scrape_dict, eco_scrape_list

# scrape_inflation()
########################################################################################################################################
# Scraping function to get current GDP info
def scrape_gdp():
    browser = init_browser()
    # Identifying the website to be scrapped and establishing a connection
    url_gdp = 'https://fred.stlouisfed.org/series/A191RL1Q225SBEA'
    browser.visit(url_gdp)
    time.sleep(1)

    # Creating a beautifulsoup object and parsing this object
    html = browser.html
    soup = BeautifulSoup(html, 'html.parser')
    #browser.quit() #this will close the browser window after scraping

    # Extracting the current quarter's GDP for the US
    gdp1 = soup.find('div', id='mobile-meta-col')
    gdp2 = gdp1.text
    gdp = float(gdp2[14:17])

    # Store data in eco_scrape_dict{}
    eco_scrape_dict['gdp'] = f'Current US GDP is {gdp}'

    # Store data in eco_scrape_list[] for modeling
    eco_scrape_list.append(gdp)

    # Return results
    return eco_scrape_dict, eco_scrape_list

# scrape_gdp()
########################################################################################################################################
# Scraping function to get median house sale pricing info
def scrape_housesales():
    browser = init_browser()
    # Identifying the website to be scrapped and establishing a connection
    url_housesales = 'https://fred.stlouisfed.org/series/MSPUS'
    browser.visit(url_housesales)
    time.sleep(1)

    # Creating a beautifulsoup object and parsing this object
    html = browser.html
    soup = BeautifulSoup(html, 'html.parser')
    #browser.quit() #this will close the browser window after scraping

    #Extracting the current median home sale's price in the US
    price = soup.find_all('span', class_='series-meta-observation-value')
    house_price = float(price[0].text.replace(',', ''))
    
    # Store data in eco_scrape_dict{}
    eco_scrape_dict['home sales'] = f'Median home sale price is ${house_price}'

    # Store data in eco_scrape_list[] for modeling
    eco_scrape_list.append(house_price)

    # Return results
    return eco_scrape_dict, eco_scrape_list

# scrape_housesales()
########################################################################################################################################
# Scraping function to get current monthly number of housing starts 
def scrape_housestarts():
    browser = init_browser()
    # Identifying the website to be scrapped and establishing a connection
    url_housestarts = 'https://tradingeconomics.com/united-states/housing-starts'
    browser.visit(url_housestarts)
    time.sleep(1)

    # Creating a beautifulsoup object and parsing this object
    html = browser.html
    soup = BeautifulSoup(html, 'html.parser')
    #browser.quit() #this will close the browser window after scraping

    #Extracting the current monthly housing starts number in the US
    table_values = soup.find_all('div', class_ = "table-responsive")
    x = table_values[1].find('a', href='/united-states/housing-starts')
    y = x.parent
    z = float(y.next_sibling.next_sibling.text)

    # Store data in eco_scrape_dict{}
    eco_scrape_dict['Housing starts'] = f'Monthly housing starts {z}%'

    # Store data in eco_scrape_list[] for modeling
    eco_scrape_list.append(z)

    # Return results
    return eco_scrape_dict, eco_scrape_list

# scrape_housestarts()
########################################################################################################################################
# Scraping function to get current earnings info
def scrape_earnings():
    browser = init_browser()
    # Identifying the website to be scrapped and establishing a connection
    url_earnings = 'https://data.bls.gov/timeseries/CES0000000001'
    browser.visit(url_earnings)
    time.sleep(1)

    # Creating a beautifulsoup object and parsing this object
    html = browser.html
    soup = BeautifulSoup(html, 'html.parser')
    #browser.quit() #this will close the browser window after scraping

    #Extracting the current earnings in the US
    table_values = soup.find_all('table', class_ = "regular-data")
    x=table_values[0].find('th', id='col0 row11')
    y=x.next_sibling.next_sibling.next_sibling.next_sibling.next_sibling.next_sibling.next_sibling.text
    z=x.next_sibling.next_sibling.next_sibling.next_sibling.next_sibling.next_sibling.next_sibling.next_sibling.text
    s=float(y[:6])
    t=float(z[:6])
    v=t-s

    # Store data in eco_scrape_dict{}
    eco_scrape_dict['earnings'] = f'Monthy net change in earnings for the US is ${v}'

    # Store data in eco_scrape_list[] for modeling
    eco_scrape_list.append(v)

    # Return results
    return eco_scrape_dict, eco_scrape_list

# scrape_earnings()


########################################################################################################################################
# Scraping function to get current earnings info
def recession_prediction():
    final_prediction = []
    #final_prediction = ['Y'] #activate me for poop emoji
    recession_model = load_model("recession_model_trained.h5")
    encoder = LabelEncoder()
    encoder.classes_ = np.load("classes.npy", allow_pickle=True)
    recession_model.summary()
    var = (recession_model.predict_classes(np.array(eco_scrape_list).reshape(1, -1), verbose=1))
    #print(var)
    answer = encoder.inverse_transform(var)
    #print(answer)
    final_prediction.append(answer)
    return final_prediction

# recession_prediction()

# print(final_prediction[0]) 
# print(eco_scrape_list)
#print(eco_scrape_dict)