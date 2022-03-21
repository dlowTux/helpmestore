import database
class user:
    def CreateAccount(self,data):
        return database.database().CreateUserWithEmail(data)
