# Import flask
from flask import Flask, render_template, redirect
# Import our pymongo library, which lets us connect our Flask app to our Mongo database.
from flask_pymongo import PyMongo
# Import the python scraping file (scrape_mars.py)
import scrape_mars
import os

# Create an instance of our Flask app.
app = Flask(__name__)

# Create connection variable to MongoDB
mongo = PyMongo(app, uri="mongodb://localhost:27017/mars_app")

#conn = 'mongodb://localhost:27017'
#client = pymongo.MongoClient(conn)

# Set route to query mongoDB and make an HTML template
@app.route("/")
def home():
    # find and store the data in marsinfo mongo db
    mars_info = mongo.db.mars_info.find_one()

    # Return the template with the mars info passed in
    return render_template("index.html", mars_info=mars_info)

# Create a route called /scrape
@app.route("/scrape")
def scrape():
    # execute scrape funcions
    mars_info = mongo.db.mars_info
    mars_data = scrape_mars.scrape_news()
    mars_data = scrape_mars.scrape_image()
    mars_data = scrape_mars.scrape_weather()
    mars_data = scrape_mars.scrape_facts()
    mars_data = scrape_mars.scrape_hemispheres()

    # update mongo database
    mars_info.update({}, mars_data, upsert=True)

    # redirect back to home page
    return redirect("/")

if __name__ == "__main__":
    app.run(debug=True,
        port=int(os.getenv('PORT', 4444)))
