from flask import Flask,render_template,session,g,request,jsonify
import os

import user


app=Flask(__name__)
app.secret_key=os.environ.get('secret_key')
@app.route('/')
def index():
    user=0
    if g.user:
        user=1
    return render_template('index.html',token=user)

@app.before_request
def before_request():
    g.user=None
    if 'user' in session:
        g.user=session['user']
@app.route("/signup",methods=["POST","GET"])
def signup():
    if request.method=="POST":
        data=request.get_json()
        response=user.user().CreateAccount(data)
        return signup_before(response)
    elif request.method=="GET":
        return render_template('signup.html')

def signup_before(response):
    if response==False:
        return jsonify({'response':0})
    return savesession(response)

def savesession(idlocal):
    session.pop('user',None)
    session["user"]=idlocal
    return jsonify({'response':1})

if __name__ =="__main__":
    app.run(port=5000, debug=True)
