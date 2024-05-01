from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
from flask_cors import CORS
from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationChain 
from string import Template
from forecast import get_forecast
from geopy.geocoders import Nominatim

def get_location_by_coordinates(lat, lon):
    geolocator = Nominatim(user_agent="abcd")
    location = geolocator.reverse((lat, lon), exactly_one=True)
    address = location.raw['address']
    
    # Depending on the granularity you want you can access different levels of the address
    # For example, address['country'], address['state'], address['city'] etc.
    region = address.get('state', '')
    if not region:
        region = address.get('region', '')
    if not region:
        region = address.get('county', '')
    
    return region

# Load environment variables from .env file
load_dotenv()

# Access OPENAI_API_KEY from environment
openai_api_key = os.getenv('OPENAI_API_KEY')

app = Flask(__name__)
CORS(app)

@app.route('/api/get-yield-graph', methods=['POST'])
def get_yield_graph():
    api_data = request.json
    print("------")
    print(api_data)
    lat, lng, crop = float(api_data['lat']), float(api_data['lng']), api_data['crop']

    print(lat, lng, crop)
    location = get_location_by_coordinates(lat, lng)
    print(location)
    chatbot = ChatOpenAI()
    global conversation
    conversation = ConversationChain(llm=chatbot)  

    firstQuery = Template("""Crop Yield Prediction
                          
    You are an expert on prediciting crop yeild.
                          
    The farm is located in $location.

    Based on the crop yield values from the last 25 years, you used a LSTM-based model predicts the following crop yield for the upcoming year:
                          
    Yield from previous years: $yieldHistory

    Predicted Yield: $input

    Compare the predicted yield to the yield from previous years (giving more emphasis to past 2-3 years), and to your knowedledge of yield of $crop crop in pounds per acre

    And tell if its high or low compared to your knowledge. Also consider the location of the farm. The user has provided all the information you need. Don't ask for more information.

    Respond in friendly manner. If the yield is high, tell the user how they can reach that target or surpass it.
    If the yield is low, tell the user how they can improve their yield.
    """
    )
    time_axis, yieldData = get_forecast(crop, lng, lat)
    print(time_axis,yieldData)
    yieldHistory = yieldData[:-1]
    input = yieldData[-1]

    firstQuery = firstQuery.substitute(location=location, yieldHistory=yieldHistory, input=input, crop=crop)
    print(firstQuery)
    response = conversation.run(firstQuery)
    print(response)

    return jsonify({"labels": time_axis.tolist(), "data": yieldData, "response": response})

@app.route('/api/chat', methods=['POST'])
def chat():
    chatbot = ChatOpenAI()
    global conversation
    conversation = ConversationChain(llm=chatbot) 
    if not request.json or 'message' not in request.json:
        return jsonify({'error': 'No message provided'}), 400
    
    data = request.get_json()
    user_message = data['message']

    bot_response = conversation.run(user_message)
    print(bot_response)
    return jsonify({'response': bot_response})
    

@app.route('/')
def hello():
    return "hello"


if __name__ == '__main__':
    app.run()
