from flask import Flask, render_template
from flask_sockets import Sockets
import time
from flask import request

import json

app = Flask(__name__)
#app.config['SECRET_KEY'] = 'secret!'
sockets = Sockets(app)

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

    data = ""
    with open("checklist.json") as f:
        data = f.read()
        
    #print(data)

    y = json.loads(data)

    return str(y[0]["name"])

if __name__ == '__main__':
    from gevent import pywsgi
    from geventwebsocket.handler import WebSocketHandler
    server = pywsgi.WSGIServer(('', 5000), app, handler_class=WebSocketHandler)
    server.serve_forever()
    #app.run(debug=True)

    
