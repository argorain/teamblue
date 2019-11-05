'use strict'

var ws = new WebSocket(`ws://${window.location.host}/`);

ws.onopen = (e) => {
    console.log("WS: OPEN");
    ws.send("test");
};

ws.onmessage = (e) => {
    //let data = JSON.parse(e.data);
    console.log("WS: DATA", e);
};

ws.onclose = (e) => {
    console.log("WS: CLOSE");
};

const checklists = [
    {
        id: 1,
        name: "Normal Takeoff",
        items: [
            {
                id: 1,
                text: "Wing Flaps",
                value: "20 degrees"
            },
            {
                id: 2,
                text: "Throttle",
                value: "100%"
            }
        ]
    },
    {
        id: 2,
        name: "Short Field Takeoff",
        items: [
            {
                id: 3,
                text: "Wing Flaps",
                value: "30 degrees"
            }
        ]
    }
]

$( document ).ready(() => {
    var $left = $("#left");
    var $right = $("#right");

    var $leftMenu = $('<ul class="list-group"></ul>');
    $left.append($leftMenu);

    var $checklistName = $('<h4></h4>');
    $right.append($checklistName);

    var $checklistItems = $('<ul class="list-group"></ul>');
    $right.append($checklistItems);

    checklists.forEach((list) => {
        var listItem = $('<li class="list-group-item" data-id="' + list.id + '">' + list.name + '</li>');
        $leftMenu.append(listItem);
        listItem.on('click', (e) => {
            $checklistItems.empty();
            var clickedId = $(e.currentTarget).data().id;
            console.log(clickedId);

            var checklist = getChecklist(clickedId);
            $checklistName.html(checklist.name)
            checklist.items.forEach(item => {
                $checklistItems.append('<li class="list-group-item" data-id="' + item.id + '">' + item.text+ '.......' + item.value + '</li>');

            })
        });
    })

    var content = $("#content");

})

function getChecklist(id) {
    return checklists.filter((list) => list.id == id)[0];
}