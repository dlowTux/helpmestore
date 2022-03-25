class cart:
    def CalculatePrice(self,data):
        price=0
        prices=[]
        for x in data:
            prices.append(int(x["amount"]))
            price+=500*int(x["amount"])
        return price,prices
