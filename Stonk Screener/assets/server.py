# imports for server specifically
from flask import Flask, request, jsonify
from flask_cors import CORS

# other imports
import yfinance as yf
dbgood = True
try:
    import mysql.connector
    from pip._vendor.distlib import database
    db = mysql.connector.connect(
        host = "localhost",
        user = "root",
        password = "12345",
        database = "STONKdb"
    )
    cursor = db.cursor()
except:
    dbgood = False

# declaring server
app = Flask(__name__)
CORS(app)


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


# setting the route for getStockInfo so that the website can use it
@app.route("/getStock", methods=["POST"])
def getStock():
    # getting data from the website
    data = request.get_json()
    try:
        # sending the info back to the website
        return jsonify({"info": yf.Ticker(data.get("ticker")).info})
    except:
        # returns -1 if an invalid stock is sent
        return jsonify({"info": -1})


# setting the route for getStockInfo so that the website can use it
@app.route("/tryForAccount", methods=["POST"])
def tryForAccount():
    # getting data from the website
    data = request.get_json()
    try:
        # sending the info back to the website
        print(f"1 but also {data.get('password')} and of course {data.get('username')}")
        query = f"SELECT * FROM user_information WHERE username='{data.get('username')}'"
        print("2")
        cursor.execute(query)
        print("3")
        userInfo = cursor.fetchall()
        print("4")
        if userInfo[0][1] == data.get("password"):
            print("5")
            return jsonify({"result": 0, "stocks": userInfo[0][2]})
        else:
            print("6")
            return jsonify({"result": 1})
    except:
        # returns -1 if an invalid stock is sent
        print("7")
        return jsonify({"result": -1})


# setting the route for getStockInfo so that the website can use it
@app.route("/createAccount", methods=["POST"])
def createAccount():
    if (dbgood):
        data = request.get_json()
        print(f"OK we got {data.get('name')} and uh {data.get('pw')} yeah")
        values = (data.get('name'), data.get('pw'), "")
        query = "INSERT INTO user_information (username, passwords, stockTickers) VALUES (%s, %s, %s)"
        cursor.execute(query, values)
        db.commit()
        return jsonify({"result": True, "un": data.get("name"), "pw": data.get("pw")})
    else:
        return jsonify({"result": False})
    

@app.route("/addStock", methods=["POST"])
def addStock():
    if (dbgood):
        data = request.get_json()
        query = f"SELECT stockTickers FROM user_information WHERE username = '{data.get("usr")}'"
        cursor.execute(query)
        newWatch = cursor.fetchall()
        newStocks = str(newWatch[0][0]) + data.get("stock") + ";"
        query = f"UPDATE user_information SET stockTickers = '{newStocks}' WHERE username = '{data.get("usr")}'"
        cursor.execute(query)
        db.commit()
        return jsonify({"result": True})
    else:
        return jsonify({"result": False})
    

@app.route("/deleteAccount", methods=["POST"])
def deleteAccount():
    if (dbgood):
        data = request.get_json()
        query = f"DELETE FROM user_information WHERE username='{data.get('username')}'"
        cursor.execute(query)
        db.commit()
        return jsonify({"result": True})
    else:
        return jsonify({"result": False})


if __name__ == "__main__":
    app.run(debug=True)
