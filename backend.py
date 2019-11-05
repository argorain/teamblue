from flask import Flask

import time
app = Flask(__name__)

@app.route('/')
def hello():
    pass
    return "bla bla index"

if __name__ == '__main__':
    app.run(debug=True)

    