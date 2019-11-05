from flask import Flask
from flask import jsonify
from flask import request

import time
app = Flask(__name__)

@app.route('/')
def hello():
    pass
    return "bla bla index"

@app.route('/api', methods=['POST', 'GET']) 
def api():
    data = request.args
    return str(data)

if __name__ == '__main__':
    app.run(debug=True)

    