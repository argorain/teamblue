from flask import Flask, render_template
from flask_socketio import SocketIO
import time

app = Flask(__name__)
#app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route('/')
def hello():
    pass
    return render_template("index.html")

@app.route('/api', methods=['POST', 'GET']) 
def api():
    data = request.args
    return str(data)

if __name__ == '__main__':
    socketio.run(app)
    #app.run(debug=True)

    
