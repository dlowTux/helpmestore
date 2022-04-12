from app import client
import database
import stripe
import sells
class user:
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
        if self.CheckAtribute(data,"phone"): 
            return data["phone"]
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
        if self.HasDirection(user_data):
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



