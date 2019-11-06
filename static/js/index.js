'use strict'

var ws = new WebSocket(`ws://${window.location.host}/`);
const url = `http://${window.location.host}/api`;

ws.onopen = (e) => {
    console.log("WS: OPEN");
    //ws.send("{\"exec\":\"getline\"}");
};

ws.onmessage = (e) => {
    let data = JSON.parse(e.data);
    console.log("WS: DATA", data);
};

ws.onclose = (e) => {
    console.log("WS: CLOSE");
};

function sendData(data) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
    }
}

var checklists = []

var $left;
var $checklistName;
var $checklistItems;

$(document).ready(() => {

    $left = $("#left");
    var $right = $("#right");

    $checklistName = $('<h4></h4>');
    $right.append($checklistName);

    $checklistItems = $('<ul class="list-group"></ul>');
    $right.append($checklistItems);

    fetchChecklists();
})

$(document).on('keypress', function(e) {
    switch (e.code) {
        case "KeyQ":
            sendData({ do: "next" });
            break;
    }
});

function fetchChecklists(callback) {
    $.get(url + '/all', function(data) {
        checklists = JSON.parse(data);
        renderChecklists();
    });
}

function renderChecklists() {
    var standardChecklists = checklists.filter(list => list.group == 'Standard')
    renderChecklist("Standard Checklists", standardChecklists)

    var emergencyChecklists = checklists.filter(list => list.group == 'Emergency')
    renderChecklist("Emergency Checklists", emergencyChecklists)
}

function renderChecklist(name, items) {
    var $div = $('<div class="checklist"></div>');
    $left.append($div);

    $div.append('<h5>' + name +'</h5>')

    var $leftMenu = $('<ul class="list-group"></ul>');
    $div.append($leftMenu);

    items.forEach((list) => {
        var listItem = $('<li class="list-group-item" data-id="' + list.id + '">' + list.name + '</li>');
        $leftMenu.append(listItem);
        listItem.on('click', (e) => {
            var clickedId = $(e.currentTarget).data().id;
            selectChecklist(clickedId)
        });
    })
}

function selectChecklist(id) {
    $checklistItems.empty();
    var checklist = getChecklist(id);
    $checklistName.html(checklist.name)
    checklist.items.forEach(item => {
        var listItem = $('<li class="list-group-item" data-id="' + item.id + '"><input class="form-check-input position-static item-check" type="checkbox" value="' + item.text + '" aria-label="' + item.text + '"><span class="item-text">' + item.text + '</span><span class="item-value">' + item.value + '</span></li>');
        $checklistItems.append(listItem);
        listItem.find('.form-check-input').change(function() {
            if ($(this).prop('checked'))
                $(this.parentElement).addClass('done');
            else
                $(this.parentElement).removeClass('done');
        });
        listItem.on('click', (e) => {
            $checklistItems.find('li').removeClass('active');
            $(e.target).addClass('active');
        });
    })
    $left.find('li').removeClass('active');
    $left.find('li[data-id=' + id + ']').addClass('active');
}

function getChecklist(id) {
    return checklists.filter((list) => list.id == id)[0];
}