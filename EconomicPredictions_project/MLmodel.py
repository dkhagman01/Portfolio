# Set the seed value for the notebook so the results are reproducible
from numpy.random import seed
seed(1)

# Dependencies
import numpy as np
import pandas as pd
import tensorflow
tensorflow.keras.__version__
#pd.show_versions(as_json=False)

#import pickle
#import _pickle as cPickle

# Import the data file
economic_data = pd.read_csv('Combined_Data_Base.csv')

#drop date, 30yr, gas, cars and recession2 columns
economic_data.drop(columns = ["date", "30_yr", "gas_price", "cars_sold", "recession2"], inplace = True)
#print(economic_data.dtypes)

# Convert the data types to float
economic_data[['dow_open', '13_wk', '5_yr', '10_yr', 'fed_rate', 'unemployment', 'gold_price', 'cpi', 'inflation', 'gdp', 'median_house', 'housing_starts', 'earnings_chg']] = \
economic_data[['dow_open', '13_wk', '5_yr', '10_yr', 'fed_rate', 'unemployment', 'gold_price', 'cpi', 'inflation', 'gdp', 'median_house', 'housing_starts', 'earnings_chg']].astype(np.float64)

# Pre-processing of the data for ML
# assign x & y
X = economic_data.drop("recession", axis=1)
y = economic_data["recession"]
#print(X.shape, y.shape)

# Additional dependencies/functions for modeling to import
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from tensorflow.keras.utils import to_categorical

#print(X)
#print(y)
# Randomly splitting up the data set into separate training and testing data sets
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=1, stratify=y)

# Scaling the data
#print(X_train)
X_scaler = MinMaxScaler().fit(X_train)
X_train_scaled = X_scaler.transform(X_train)
X_test_scaled = X_scaler.transform(X_test)

# Step 1: Label-encode data set
label_encoder = LabelEncoder()
label_encoder.fit(y_train)
encoded_y_train = label_encoder.transform(y_train)
encoded_y_test = label_encoder.transform(y_test) 

# Step 2: Convert encoded labels to one-hot-encoding
y_train_categorical = to_categorical(encoded_y_train)
y_test_categorical = to_categorical(encoded_y_test)

# Creating the Deep Learning Model
# Importing additional modeling functions
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense

# Create model and add layers
# changed input_dim from 20 to value shown correct an error relating to the number of expected values
model = Sequential()
model.add(Dense(units=100, activation='relu', input_dim=13)) 
model.add(Dense(units=100, activation='relu'))
model.add(Dense(units=2, activation='softmax'))

# Compile and fit the model
model.compile(optimizer='adam',
              loss='categorical_crossentropy',
              metrics=['accuracy'])

# Assessing model 
model.summary()

# Fit the model
model.fit(
    X_train_scaled,
    y_train_categorical,
    epochs=60,
    shuffle=True,
    verbose=2
)

# Quantify the training of the model
model_loss, model_accuracy = model.evaluate(
    X_test_scaled, y_test_categorical, verbose=2)
print(f"Normal Neural Network - Loss: {model_loss}, Accuracy: {model_accuracy}")

# Make predictions (display)
encoded_predictions = model.predict_classes(X_test_scaled[:5])
#print(encoded_predictions)
prediction_labels = label_encoder.inverse_transform(encoded_predictions)
#print(prediction_labels)

print(f"Predicted classes: {prediction_labels}")
print(f"Actual Labels: {list(y_test[:5])}")

# Test model with positive and negative lists
yes_list = [808.6, 8.42, 12.58, 12.76, 11.28, 10.1, 438.15, 97.9, 0.2, -2.6, 67800, 1144, -180]
X_train_scaled = X_scaler.transform([yes_list])
prediction = model.predict_classes(np.array(X_train_scaled))
answer = label_encoder.inverse_transform(prediction)
prediction[:]
print(answer)

no_list = [985.1, 6.14, 6.29, 6.04, 4, 3.4, 42.291, 35.6, 0.28, 4.5, 24600, 1769, 191]
X_train_scaled2 = X_scaler.transform([no_list])
prediction2 = model.predict_classes(np.array(X_train_scaled2))
answer2 = label_encoder.inverse_transform(prediction2)
prediction2[:]
print(answer2)

# This imports? the scraped data list
#X_train_scaled3 = X_scaler.transform([eco_scrape_list])
#prediction3 = model.predict_classes(np.array(X_train_scaled3))
#answer3 = label_encoder.inverse_transform(prediction3)
#prediction3[:]
#print(answer3)

# saving the trained model and exporting it for on demand recall
#pickle.dump(model, open('model.sav', 'wb')
model.save("recession_model_trained.h5")
np.save('classes.npy', label_encoder.classes_)