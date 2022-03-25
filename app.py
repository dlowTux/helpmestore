from flask import Flask,render_template,session,g,request,jsonify,redirect,url_for
import os

import user


app=Flask(__name__)
app.secret_key=os.environ.get('secret_key')
@app.route('/')
def index():
    user=0
    data={}
    if g.user:
        user=1
        data =session['user']
    cart=getCart()
    print(cart)
    num_pro=len(cart)
    return render_template('index.html',token=user,user_data=data,carrito=cart,items=num_pro)

@app.before_request
def before_request():
    g.user=None
    if 'user' in session:
        g.user=session['user']

@app.route("/signin",methods=["POST"])
def signin():
    if request.method=="POST":
        response=user.user().LogIn(request.get_json())
        if response!=False:
            return savesession(response)
        return jsonify({"response":0})

@app.route("/signup",methods=["POST","GET"])
def signup():
    if request.method=="POST":
        data=request.get_json()
        response=user.user().CreateAccount(data)
        return signup_before(response)
    elif request.method=="GET":
        return render_template('signup.html')

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('index'))

@app.route('/addcart',methods=["POST"])
def addcart():
    data=request.get_json()
    carrito=[]
    if 'car_item' in session:
        carrito = session['car_item']
        carrito.append(data)
        session['car_item'] = carrito
    else:
        array = [data]
        session['car_item'] = array
    return jsonify({"response":session["car_item"]})

@app.route("/removeitem/<number>")
def RemoveItemFromCart(number):
    carrito=[]
    if 'car_item' in session:
        carrito=session["car_item"]
        carrito.pop(int(number))
        session["car_item"]=carrito
    return redirect(url_for('index'))

@app.route("/addmore/<number>")
def addmorecart(number):
    carrito=[]
    if 'car_item' in session:
        carrito=session["car_item"]

        amount=carrito[int(number)]["amount"]
        amount=int(amount)
        carrito[int(number)]["amount"]=amount+1;
        session["car_item"]=carrito
    return jsonify({"response":session["car_item"]})

@app.route("/lessproduct/<number>")
def lessproduct(number):
    carrito=[]
    if "car_item" in session:
        carrito=session["car_item"]
        amount=carrito[int(number)]["amount"]
        amount=int(amount)
        if (amount-1)>0:
            carrito[int(number)]["amount"]=amount-1;
        else:
            carrito.pop(number)
        session["car_item"]=carrito
    return jsonify({"response":session["car_item"]})


def signup_before(response):
    if response==False:
        return jsonify({'response':0})
    return savesession(response)

def savesession(data):
    session.pop('user',None)
    session["user"]=data
    return jsonify({'response':1})

def getCart():
    if 'car_item' in session:
        try:
            return session['car_item']
        except Exception as e :
            pass
    return []


if __name__ =="__main__":
    app.run(port=5000, debug=True)
