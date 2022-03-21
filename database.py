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

    def CreateUserWithEmail(self,data):
        try:
            user=self.auth.create_user_with_email_and_password(data['email'],data['password'])
            data['localId']=user["localId"]
            self.RegisterData(data)
        except:
            return "Error el correo ya esta en uso"
        return "Usuario registrado"

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
