class cart:
    def CalculatePrice(self,data):
        price=0
        for x in data:
            price+=500*int(x["amount"])
        return price
