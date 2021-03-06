from datetime import datetime
import pytz
import database
class seell:
    def GetDate(self):
        country_time_zone = pytz.timezone('Mexico/General')
        country_time = datetime.now(country_time_zone)
        return (country_time.strftime("%d-%m-%y %H:%M:%S"))
    def SaveSell(self,data):
        data["date"]=self.GetDate()
        if database.database().registersell(data):
            return True
        return False
    def GetSells(self,uuid):
        return database.database().GetSells(uuid)

    def GetAllSells(self):
        return database.database().GetAllSells()
    def UpdateSell(self,data,key):
        return database.database().UpdateSellInfo(data,key)

