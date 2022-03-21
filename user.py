import database
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
