from flask import Flask, render_template
from flask_sockets import Sockets
import time
from flask import request

import json

app = Flask(__name__)
#app.config['SECRET_KEY'] = 'secret!'
sockets = Sockets(app)

checklists_json = ""
with open("checklist.json") as f:
    checklists_json = f.read()

checklists = json.loads(checklists_json)

@sockets.route('/')
def echo_socket(ws):
    print("echo")
    while not ws.closed:
        print("not closed")
        message = ws.receive()
        ws.send(message)
        print(message)
        ws.close()


@app.route('/')
def hello():
    pass
    return render_template("index.html")

@app.route('/api', methods=['POST', 'GET']) 
def api():
    data = request.args

    
        
    #print(data)

    

    return str(checklists[0]["name"])

@app.route('/api/all', methods=['GET'])
def api_all():
    return str(checklists_json)

if __name__ == '__main__':
    from gevent import pywsgi
    from geventwebsocket.handler import WebSocketHandler
    server = pywsgi.WSGIServer(('', 5000), app, handler_class=WebSocketHandler)
    server.serve_forever()
    #app.run(debug=True)

    
