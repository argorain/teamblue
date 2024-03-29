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
User: Next  
(external system now reports Packs Off)  
Assistant: Start Sequence Announced  
User: Done  
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

### Ngrok

Before running the backend we need to download ngrok application at https://ngrok.com/ for publishing your interface in order to allow at Alexa to communicate with them.
Ngrok is going to create a tunnel at your localhost. After downloading it, you have to run this command at your terminal at the directory where ngrok is downloaded:

``ngrok http 5000``

5000 is the port where the server will run.

### Run Checklist Execution Assistant Demo

For running the Checklist Execution Assistant Demo, we need to make the following operations:

*Run Server*: 
1. Open the terminal (Unix) / cmd (Windows)
2. Go to your local folder for the teamblue directory.
3. Run ``py backend.py``
4. Remember to run ``ngrok http 5000``
5: Open your browser e go http://localhost:5000

*Run Alexa*:
1.  Sign-in to https://developer.amazon.com/alexa/console/ask
2.  Create a new skill: Choose Custom Model and Alexa-Hosted (Python) Method
3.  Go To Json Editor
4.  Copy in the text editor the content of ``alexa.json``
5.  Build the model
6.  Go to Code Tab
7.  Copy into lambda_function.py the content of the file ``alexa_script.py``
8.  Search for http and change the url until /api with the url provided by your ngrok instance.
9.  Click on Save and Deploy it.

*Run  Checklist Execution Assistant*: 
1. Go to Test tab or download and sign-in to Reverb mobile app.
2. Ask ``open the checklist``
3. Choose between Engine Failure and Power UP checklist and say ``Run Power UP``
4. Check on your browser the result.
5. If you receive a verifiable instruction, ``press Q`` on your web page for simulating the pilot's execution.
6. For getting the next instruction, say one of ``Next``, ``Done``, ``Check``, ``It's done``

Enjoy with Checklist Execution Assistant!

For more and technical information go to: ``ChecklistExecutionAssistant.pdf``