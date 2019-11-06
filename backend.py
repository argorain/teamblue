from flask import Flask, render_template
from flask_sockets import Sockets
import time
from flask import request

from state_machine import StateMachine

import json

app = Flask(__name__)
#app.config['SECRET_KEY'] = 'secret!'
sockets = Sockets(app)

checklists_json = ""
with open("checklist.json") as f:
    checklists_json = f.read()

checklists = json.loads(checklists_json)

print(checklists)

s = StateMachine(checklists)
#s.setListName("Field Takeoff")
#s.getLine()
#s.incrementLine()
#s.getLine()
#s.incrementLine()
#s.getLine()

@sockets.route('/')
def echo_socket(ws):
    print("echo")
    while not ws.closed:
        message = ws.receive()
        print("WS received: " + message)
        req = json.loads(message)
        print(req)
        
        ws.send(message)
       

@app.route('/')
def hello():
    pass
    return render_template("index.html")

@app.route('/api', methods=['POST', 'GET']) 
def api():
    data = request.args.to_dict()   
    print(data)

    try:
        listName = data['list']
    except(Exception):
        listName = None

    try:
        getLine = data['getline']
    except(Exception):
        getLine = None

    response = ""

    if(listName != None):
        if(s.setListName(listName.lower()) != None):
            s.resetListLine()
            response = "OK"
        else:
            response = "FAIL"

    if(getLine != None):
        response = s.getLine()
        s.incrementLine()


    return str(response)

@app.route('/api/all', methods=['GET'])
def api_all():
    return str(checklists_json)

if __name__ == '__main__':
    from gevent import pywsgi
    from geventwebsocket.handler import WebSocketHandler
    server = pywsgi.WSGIServer(('', 5000), app, handler_class=WebSocketHandler)
    server.serve_forever()
    #app.run(debug=True)

    
