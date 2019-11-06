
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
            id = l[1][self.lineNo]['id']
            try:
                read_value = l[1][self.lineNo]['readableValue']
            except(Exception):
                read_value = None

            line_type = l[1][self.lineNo]['type']

            print(name)
            print(value)
            print(id)
            return [name, value, id, line_type, read_value]
        return None

    def getList(self):
        for i in range(len(self.checklist)):
            listName = self.checklist[i]['name'].lower()
            if(listName == self.listName):
                items = self.checklist[i]['items']
                id = self.checklist[i]['id']
                print(listName)
                print(items)
                return [listName, items, id]
        return None
    
    def setListName(self, name):
        self.listName = name
        if(self.getList() == None):
            return None
        else:
            return name

    def incrementLine(self):
        self.lineNo += 1

    def resetListLine(self):
        self.lineNo = 0

    def getLineNo(self):
        return self.lineNo