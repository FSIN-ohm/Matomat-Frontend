#!/usr/bin/python3
import flask
from flask import Flask
from flask import Response

from flask_cors import CORS

app = Flask(__name__)

CORS(app)

def returnFileOnGet(filename):
    if flask.request.method == "GET":
        with open(filename) as file:
            return Response(file.read(), mimetype='application/json')
    elif flask.request.method == "POST":
        return Response('', 201)
    elif flask.request.method == "PATCH":
        return Response('', 202)
    elif flask.request.method == "DELETE":
        return Response('', 200)
    else:
        return Response('', 404)

@app.route("/")
def hello():
    return "<html>This is the Matohmat REST intorface. Please read in the <a href=\"https://fsin-ohm.github.io/Matomat-Documentation/\">Documentation</a> how to use this.</html>"

##### USERS #####

@app.route("/v1/users", methods=["GET", "POST"])
def users():
    return returnFileOnGet("users.json")

@app.route("/v1/users/me")
def usersMe():
    return returnFileOnGet("user_me.json")

@app.route("/v1/users/0", methods=["GET", "DELETE", "PATCH"])
def users0():
    return returnFileOnGet("user0.json")

##### ADMINS #####

@app.route("/v1/admins", methods=["GET", "POST"])
def admins():
    return returnFileOnGet("admins.json")

@app.route("/v1/admins/me")
def adminsMe():
    return returnFileOnGet("admin_me.json")

@app.route("/v1/admins/0", methods=["GET", "PATCH", "DELETE"])
def admins0():
    return returnFileOnGet("admin0.json")

##### PRODUCTS #####

@app.route("/v1/products", methods=["GET", "POST"])
def products():
    return returnFileOnGet("products.json")

@app.route("/v1/products/0", methods=["GET", "PATCH", "DELETE"])
def product0():
    return returnFileOnGet("product0.json")

##### TRANSACTIONS #####

@app.route("/v1/transactions", methods=["GET", "POST"])
def transactions():
    return returnFileOnGet("transactions.json")

@app.route("/v1/transactions/0")
def transactions0():
    return returnFileOnGet("transaction0.json")

@app.route("/v1/transactions/1")
def transactions1():
    return returnFileOnGet("transaction1.json")

@app.route("/v1/transactions/2")
def transactions2():
    return returnFileOnGet("transaction2.json")

@app.route("/v1/transactions/3")
def transactions3():
    return returnFileOnGet("transaction3.json")

if __name__ == '__main__':
    app.run(debug=True)

