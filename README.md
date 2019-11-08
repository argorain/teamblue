## Checklist Execution Assistant

Checklist Execution Assistant Voice-enabled Checklist 
readout and verification assistant. It finds a checklist 
based on user's voice command, reads items from the checklists, 
waits for user to confirm every item and verifies item has been actually executed.

Voice interaction is handled by Alexa engine. It translates voice commands to requests for backend, 
which tracks which checklist and checklist item is being executed at the moment. 
Backend sends back result to Alexa and it is spoken to the user. 
There is also a web page that lists all checklists registered in the system and shows 
current state of execution. Items that are validated by the system have green text, 
items that are checked by the user but are not validated by the system have red text 
and successfully checked and verified items have green background.

### Typical voice interaction:
User: Open the checklist.  
Assistant: Which one?  
User: Power up  
Assistant: Ground Crew Clearance Received  
User: Check  
Assistant: Packs Off  
User: Check  
(external system does not report Packs Off)  
Assistant: Not done  
User: Check  
(external system now reports Packs Off)  
Assistant: Start Sequence Announced  
User: Check  
Assistant: Checklist complete

### Interfaces
Backend runs on port 5000. Alexa frontend sends HTTP GET request to 
``/api?list=<checklist_name>`` to open a checklist. To move to the next checklist item, 
Alexa frontend send HTTP get request to ``/api?getline``.

Web page loads all checklists from backend using HTTP GET request to
``/api/all``. Web page also connects to backend via web socket and receives current state of
checklist execution and automatically updates the UI.


### List of important files
* checklist.json - JSON with list of checklists and their items
* alexa.json - Configuration of Alexa interaction model
* alexa_script.py - Python code for Alexa intent handlers
* backend.py - Backend server
* state_machine.py - Keeps the state of checklist execution
* static/css/index.css - webpage styling
* static/js/index.js - webpage javascript
* templates/index.html - HTML webpage template