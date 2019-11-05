from flask import Flask, render_template

import time
app = Flask(__name__)

@app.route('/')
def hello():
    pass
    return render_template("index.html")

@app.route('/api', methods=['POST', 'GET']) 
def api():
    data = request.args
    return str(data)

if __name__ == '__main__':
    app.run(debug=True)

    
