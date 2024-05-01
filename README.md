# crop-llM

## Screenshots
![Screenshot 1](https://github.com/richiectr360/crop-llM/blob/main/photos/1.png?raw=true)
![Screenshot 2](https://github.com/richiectr360/crop-llM/blob/main/photos/2.png?raw=true)
![Screenshot 3](https://github.com/richiectr360/crop-llM/blob/main/photos/3.png?raw=true)
![Screenshot 4](https://github.com/richiectr360/crop-llM/blob/main/photos/4.png?raw=true)
![Screenshot 5](https://github.com/richiectr360/crop-llM/blob/main/photos/5.png?raw=true)
![Screenshot 6](https://github.com/richiectr360/crop-llM/blob/main/photos/6.png?raw=true)

## Workflow
- - Train LSTM based forecasting model on a [crop yield dataset](https://open.canada.ca/data/en/dataset/754a5961-0d27-406c-b5e3-224b6e494e9e/resource/a97f11b2-31f3-469d-a8da-49f0db0a0146).
- Predict the crop yield for the next year for the selected crop type in the selected location
- Pass the yield history and prediction to LLM via LangChain to get actionable insights
- Develop frontend using ReactJS
- Integrate Google Maps API at the frontend
- Develop a chat interface
- Create Flask APIs to bridge frontend and backend functionalities.

## Benefits to Farmers
- Farmers can rely on precise yield forecasts, minimizing guesswork.
- Helps in understanding and preparing for bad yield years, protecting against severe financial fallout.
- Efficient use of resources (seeds, water, fertilizers) based on targeted insights, reducing waste and expenditure.

## Future Steps
- Possibilities of scaling to new regions, crops, or functionalities.
- Update LLM’s data for richer and more precise soil insights.
- Improvements in data, model, or user interaction.
