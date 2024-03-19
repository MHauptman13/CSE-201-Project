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

if __name__ == "__main__":
    app.run(debug=True)