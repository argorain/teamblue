'use strict'

var ws = new WebSocket(`ws://${window.location.host}/`);
const url = `http://${window.location.host}/api`;

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

var checklists = []

var $leftMenu;
var $checklistName;
var $checklistItems;

$( document ).ready(() => {

    var $left = $("#left");
    var $right = $("#right");

    $leftMenu = $('<ul class="list-group"></ul>');
    $left.append($leftMenu);

    $checklistName = $('<h4></h4>');
    $right.append($checklistName);

    $checklistItems = $('<ul class="list-group"></ul>');
    $right.append($checklistItems);

    fetchChecklists();
})

function fetchChecklists(callback) {
    $.get(url + '/all', function(data) {
        checklists = JSON.parse(data);
        renderChecklists();
    });
}

function renderChecklists() {
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
}

function getChecklist(id) {
    return checklists.filter((list) => list.id == id)[0];
}
