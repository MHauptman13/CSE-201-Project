# imports for server specifically
from flask import Flask, request, jsonify
from flask_cors import CORS

# declaring server
app = Flask(__name__)
CORS(app)

# other imports
import yfinance as yf

# setting the route for getStockInfo so that the website can use it
@app.route("/getStockInfo", methods=["POST"])
def getStockInfo():
    # getting data from the website
    data = request.get_json()
    try:
        # getting the data not included in the .info for stocks
        todaydata = yf.download(data.get("ticker"), period="1d")
        # sending the info back to the website
        return jsonify({"info": yf.Ticker(data.get("ticker")).info,
                        "open": todaydata["Open"].iloc[0],
                        "high": todaydata["High"].iloc[0],
                        "low": todaydata["Low"].iloc[0]})
    except:
        # returns -1 if an invalid stock is sent
        return jsonify({"info": -1})

# setting the route for getStockPast so that the website can use it
@app.route("/getStockPast", methods=["POST"])
def getStockPast():
    # getting data from the website
    data = request.get_json()
    try:
        # getting the data from the past 5 days
        data = yf.download(data.get("ticker"), period=data.get("time"))
        # getting the dates of the past 5 days
        dates = []
        for i in range(len(data.index)):
            dates.append(data.index[i].date())
        # sending the info back to the website
        return jsonify({"values": data.values.tolist(), "dates": dates})
    except:
        # returns -1 if an invalid stock is sent
        return jsonify({"values": -1})

if __name__ == "__main__":
    app.run(debug=True)