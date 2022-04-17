from flask import Flask,render_template,session,g,request,jsonify,redirect,url_for

from decouple import config
from stripe.api_resources import customer
import cart
import user
import stripe
import sells
app=Flask(__name__)
app.secret_key=config('secret_key')
stripe.api_key = config('key')
@app.route('/')
def index():
    user=0
    data={}
    if g.user:
        user=1
        data =session['user']
    cart_=getCart()
    num_pro=len(cart_)
    p,pre=cart.cart().CalculatePrice(cart_)
    
    return render_template('index.html',precies=pre,price=p,token=user,user_data=data,carrito=cart_,items=num_pro)

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

@app.route("/checkout")
def checkout():
    user_=0
    data=None
    if g.user:
        user_=1
        data =session['user']
        #Check For optinonal data
        data["adress"],data["phone"]=user.user().CheckOptionalData(data)
        
    cart_=getCart()
    len_adress=len(data["adress"])
    num_pro=len(cart_)
    p,pre=cart.cart().CalculatePrice(cart_)

    return render_template('checkout.html',
            len_a=len_adress,
            carrito=cart_,
            len_carrito=num_pro,
            total=p,
            sub_total=pre,
            isuser=user_,data_user=data)

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

@app.route("/keys")
def public_keys():
    return jsonify({'key':config('public_key')})


@app.route("/create-payment-intent", methods=['POST'])
def create_payment():
    if g.user:
        try:   
            return client()
        except Exception as e:
            print(e)
            return jsonify(error=str(e))

def client():
    if user.user().CheckIDCustumber(session['user'])==False:
        customer=stripe.Customer.create();
        p,pre=cart.cart().CalculatePrice(getCart())
        p=int (round(p/19.95,1))
        # Create a PaymentIntent with the order amount and currency
        intent = stripe.PaymentIntent.create(
                customer=customer['id'],
                setup_future_usage='off_session',
                amount=p*100,
                currency='usd',
                )
        users=session["user"]
        users["client"]=customer["id"]
        session["user"]=users
        return jsonify({'sin_tarjeta':0,
                'clientSecret': intent['client_secret']
                })

    else:
        cards= stripe.PaymentMethod.list(customer=session["user"]["client"], type="card") 
        return jsonify({
            'sin_tarjeta':1,
            'cards': cards['data']
            })
                
    

@app.route('/newcard', methods=["POST"])
def addcards():
    p,pre=cart.cart().CalculatePrice(getCart())
    p=int (round(p/19.95,1))
    # Create a PaymentIntent with the order amount and currency
    intent = stripe.PaymentIntent.create(
            customer=session['user']["client"],
            setup_future_usage='off_session',
            amount=p*100,
            currency='usd',
            )
    return jsonify({'sin_tarjeta':0,'clientSecret': intent['client_secret']})

@app.route("/payall", methods=["POST"])
def payall():
    p,pre=cart.cart().CalculatePrice(getCart())
    p=int (round(p/19.95,1))
    card=request.get_json()
    try:
        cards=stripe.PaymentMethod.list(customer=session['user']['client'], type="card")
        print(cards)
        intent = stripe.PaymentIntent.create(
                customer=session['user']["client"],
                payment_method=cards["data"][int(card["tarjeta"])],
                off_session=True,
                confirm=True,
                amount=p*100,
                currency='usd',
                )
        return jsonify({"response":intent["client_secret"]})
    except Exception as e:
        print("Error", e)
        pass
    return jsonify({"Error":"Error"})

    
@app.route("/checkoutsave", methods=["POST"])
def checkoutsave():
    if g.user:
        data=request.get_json();
        session["user"]=user.user().SaveSell(data,session['user'],session['car_item'])
    return jsonify({"response":"Respuesta"})

@app.route('/paymentcomplete')
def paymentcomplete():
    return render_template('paymentcomplete.html')
@app.route('/getAdresses')
def getAdresses():
    if g.user:
        return jsonify({"response":session["user"]["adress"]})
@app.route('/addadress',methods=["POST"])
def addadress():
    if g.user:
        nuser=user.user().AddAdress(request.get_json(),session["user"])
        session["user"]=nuser
        return jsonify({"response":session["user"]})

@app.route("/nextsell")
def nextsell():
    if 'car_item' in session:
        session["car_item"]=[]
    return redirect(url_for('index'))

@app.route("/password_reset",methods=["POST"])
def password_reset():
    data=request.get_json()
    user.user().resetpassword(data)
    return jsonify({"response":"OK"})

@app.route('/getdatauser')
def getdatauser():
    if g.user:
        return jsonify({"response":session["user"]})
    return jsonify({"response":"error you have to sigin before"}),403
@app.route('/updatedata', methods=["POST"])
def updatedata():
    if g.user:
        data=request.get_json()
        user.user().UpdateDataUser(data)
        session["user"]=data
        return jsonify({"response":session["user"]})
    return jsonify({"response":"Error you must have a user"})

@app.route('/getsells')
def getsells():
    if g.user:
        se=sells.seell().GetSells(session["user"]["localId"])
        return jsonify({"response":se})
    return jsonify({"response":"error you must sigin before "}),403
@app.route('/cancelarcompra/<id_venta>')
def cancelarcompra(id_venta):
    if g.user:
        return jsonify({"response":""})
    return jsonify({"response":"error you must sigin"}),403

@app.route('/dashboard')
def dashboard():
    if g.user:
        print(config("localId"))
        print(session["user"])
        if session["user"]["localId"]==config("localId"):
            return  jsonify({"response":"You are admin"})
        return render_template('error.html'),403

if __name__ =="__main__":
    app.run(port=5000,host="0.0.0.0", debug=True)
