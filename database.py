import pyrebase
import os
#from firebase import firebase 

class database:
    firebaseConfig={
            "apiKey": os.environ.get('apiKeyh'),
            "authDomain": os.environ.get('authDomainh'),
            "databaseURL":os.environ.get('databaseURLh'),
            "projectId": os.environ.get('projectIdh'),
            "storageBucket": os.environ.get('storageBucketh'),
            "messagingSenderId": os.environ.get('messagingSenderIdh'),
            "appId": os.environ.get('appIdh'),
            "measurementId": os.environ.get('measurementIdh')
            }
    firebase=pyrebase.initialize_app(firebaseConfig)
    auth=firebase.auth()
    def resetpassword(self,email):
        self.auth.send_password_reset_email(email)

    def CreateUserWithEmail(self,data):
        try:
            user=self.auth.create_user_with_email_and_password(data['email'],data['password'])
            data['localId']=user["localId"]
            self.RegisterData(data)
            return user["localId"]
        except:
            return False

    def RegisterData(self,data):
        #pop the email and password
        data.pop("email")
        data.pop("password")
        try:
            db =self.firebase.database()
            db.child("users").push(data)
        except:
            return False
        return True

    def registersell(self,data):
        try:
            db =self.firebase.database()
            db.child("sells").push(data)
        except:
            return False
        return True
    
    def UpdateUserInfo(self,data_user):
        try:
            db=self.firebase.database()
            db.child("users").child(data_user["uuid"]).update(data_user)
        except:
            return False
        return True

    def SignIn(self,data):
        try:
            user=self.auth.sign_in_with_email_and_password(data["email"],data["password"])
            return user["localId"]
        except:
            print("Nel")
            return False

    def SearchByLocalID(self,localId):
        db =self.firebase.database()
        users_by_id = db.child("users").get()
        for user in users_by_id.each():
            user_=user.val()
            if user_['localId']==localId:
                user_["uuid"]=user.key()
                return user_
        return None
    def GetSells(self,localId):
        db =self.firebase.database()
        sells = db.child("sells").get()
        all_sell=[]
        for  sel in sells.each():
            sell_=sel.val()
            if sell_["customer"]["id_user"]==localId:
                all_sell.append({"key":sel.key(),"data":sell_})
        return all_sell
        
  

