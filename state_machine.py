
class StateMachine:
    def __init__(self, checklist):
        self.listName = ""
        self.lineNo = 0
        self.checklist = checklist

    def getLine(self):
        l = self.getList()
        if(l != None and self.lineNo < len(l[1])):
            name = l[1][self.lineNo]['text']
            value = l[1][self.lineNo]['value']
            print(name)
            print(value)
            return [name, value]
        return None

    def getList(self):
        for i in range(len(self.checklist)):
            listName = self.checklist[i]['name'].lower()
            if(listName == self.listName):
                items = self.checklist[i]['items']
                print(listName)
                print(items)
                return [listName, items]
        return None
    
    def setListName(self, name):
        self.listName = name
        if(self.getList() == None):
            return None
        else:
            return name

    def incrementLine(self):
        self.lineNo += 1