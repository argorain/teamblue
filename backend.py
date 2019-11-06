from flask import Flask, render_template
from flask_sockets import Sockets
import time
from flask import request

from state_machine import StateMachine

import json

app = Flask(__name__)
#app.config['SECRET_KEY'] = 'secret!'
sockets = Sockets(app)

ws_socket = None
mock_counter = 0

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
    global ws_socket
    global mock_counter

    ws_socket = ws
    print("Socket stored")
    while not ws_socket.closed: 
        action_json = ws.receive()
        action = json.loads(action_json)
        if(action['do'] == 'next'):
            mock_counter += 1
            print(mock_counter)
       

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
    id = None
    id_name = None

    if(listName != None):
        if(s.setListName(listName.lower()) != None):
            s.resetListLine()
            id = s.getList()
            if(id != None):
                id = id[2]
                print("List id:" + str(id))
                id_name = "listid"
            response = "OK"
        else:
            response = "FAIL"

    if(getLine != None):
        response = s.getLine()
        s.incrementLine()
        if(response != None):
            id = response[2]
            print("Line id:" + str(id))
            id_name = "lineid"
        response = response[0] + " " + response[1]
    
    global ws_socket
    if ws_socket != None and not ws_socket.closed:  
        json_ws = "{\""+id_name +"\":\""+str(id)+"\"}"
        print("send to ws: " + json_ws)
        ws_socket.send(json_ws)

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

    
