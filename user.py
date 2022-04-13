from app import client
import database
import stripe
import sells
class user:
    def UpdateDataUser(self,data):
        database.database().UpdateUserInfo(data)

    def resetpassword(self,data):
        database.database().resetpassword(data["email"])

    def AddAdress(self,data,user):
        user["adress"].append(data)
        database.database().UpdateUserInfo(user)
        return user

    def CreateAccount(self,data):
        response=database.database().CreateUserWithEmail(data)
        if response!=False:
            return database.database().SearchByLocalID(response)
        return False
    def LogIn(self,data):
        localId=database.database().SignIn(data)
        if localId!=False:
            user_data=database.database().SearchByLocalID(localId)
            return user_data
        return False

    def CheckAtribute(self,data,atribute):
        try:
            data[atribute]
        except:
            return False
        return True
    def CheckOptionalData(self,data):
        
        return self.CheckAdress(data), self.CheckPhoneNumber(data)

    def CheckPhoneNumber(self,data):
        try:
            print("Phone" )
            return data["phone"]
        except:
            return ""
     

    def CheckAdress(self,data):
        if self.CheckAtribute(data,"adress"):
            return data["adress"]
        return [] 

    def CheckIDCustumber(self,data):
        try:
            data["client"]
            cards= stripe.PaymentMethod.list(customer=data["client"], type="card") 
            if len(cards["data"])>0:
                return True
            return False
        except :
            return False

    def SaveSell(self,data,user):
        user_data=database.database().SearchByLocalID(user["localId"])
        user_data["phone"]=data["telefono"]
        if self.HasDirection(user_data):
            if self.SaveDirection(data,user_data):
                user_data["adress"].append(data["adress"])
        else:
            user_data["adress"]=[data["adress"]]

        if self.HasIDCustumber(user_data)==False:
            user_data["client"]=user["client"]
        #Update data user
        database.database().UpdateUserInfo(user_data)
        #Save the sell 
        data["customer"]={
                "name":user["name"],
                "lastname":user["lastname"],
                "id_user":user["localId"],
                "client":user["client"]
                }
        sells.seell().SaveSell(data)
        return user_data

    def SaveDirection(self,data,user):
        
        for x in user["adress"]:
            if x==data["adress"]:
                print("No es nueva")
                return False
        return True

    def HasIDCustumber(self,user_data):
        try:
            user_data["client"]
        except:
            return False
        return True

    def HasDirection(self,user_data):
        try:
            user_data["adress"]
        except:
            return False
        return True



