'''
Created on Apr 27, 2024

@author: m_haupt13
'''

import mysql.connector
from pip._vendor.distlib import database



db = mysql.connector.connect(
    host = "localhost",
    user = "root",
    password = "MHaupt20233680!",
    database = "STONKdb"
    )


cursor = db.cursor()


'''
Getting information from the database


query = "SELECT * FROM user_information"

cursor.execute(query)

rows = cursor.fetchall()

for row in rows:
    print(row)
'''


'''
Finding a user from the database



query = "SELECT * FROM user_information WHERE username='mhauptman'"

cursor.execute(query)

userInfo = cursor.fetchall()

for field in userInfo:
    print(field)
'''


'''
Inserting information into the Database


newUser = input("What is your username?")
newPass = input("What is your password?")
newWatch = input("What stocks are in your watchlist?")

query = "INSERT INTO user_information (username, passwords, stockTickers) VALUES (%s, %s, %s)"

values = (newUser, newPass, newWatch)

cursor.execute(query, values)

db.commit()

print(cursor.rowcount, "record inserted")
'''


'''
Deleting information from the database
'''

query = "DELETE FROM user_information WHERE username='ottenwa'"

cursor.execute(query)

db.commit()