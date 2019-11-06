'use strict'

var ws = new WebSocket(`ws://${window.location.host}/`);
const url = `http://${window.location.host}/api`;

ws.onopen = (e) => {
    console.log("WS: OPEN");
};

ws.onmessage = (e) => {
    let data = JSON.parse(e.data);
    console.log("WS: DATA", data);
    if (data.listid) {
        selectChecklist(data.listid);
    } else if (data.lineid) {
        selectLine(data.lineid);
    }
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
            sensorsOK();
            sendData({ do: "next" });
            break;
        case "KeyW":
            $.get(url + '?list=starting%20engine', (data) => {});
            break;
        case "KeyS":
            $.get(url + '?list=engine%20failure', (data) => {});
            break;
        case "KeyE":
            $.get(url + '?getline', (data) => {});
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

    $div.append('<h5>' + name + '</h5>')

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
    checklist.items.forEach((item, index) => {
        var auto = item.type === "auto" ? " (A)" : "";
        var active = index === 0 ? " active" : "";
        var listItem = $('<li class="list-group-item ' + item.type + active + '" data-id="' + item.id + '"><input class="form-check-input position-static item-check" type="checkbox" value="' + item.text + '" aria-label="' + item.text + '"><span class="item-text">' + item.text + auto + '</span><span class="item-value">' + item.value + '</span></li>');
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
    var $item = $left.find('li[data-id=' + id + ']');
    $item.addClass('active');
    $left.scrollTop($left.scrollTop() + $item.position().top);
}

function getChecklist(id) {
    return checklists.filter((list) => list.id == id)[0];
}

function selectLine(line) {
    var $activeEl = $checklistItems.find(".list-group-item.active");
    if (line === "fail") {
        $activeEl.addClass('fail');
    } else if (line === "done") {
        $activeEl.find(".form-check-input").prop("checked", true);
        $activeEl.addClass('done');
    } else {
        $activeEl.find(".form-check-input").prop("checked", true);
        $activeEl.addClass('done');
        $activeEl.removeClass('active');
        $activeEl.removeClass('fail');
        $activeEl.removeClass('successful');

        var $nextEl = $($checklistItems.find('.list-group-item[data-id=' + line + ']'));

        if ($nextEl) {
            $nextEl.addClass('active');
        }
    }
}

function sensorsOK() {
    var $activeEl = $checklistItems.find(".list-group-item.active.auto");
    if ($activeEl) {
        $activeEl.removeClass('fail');
        $activeEl.addClass('successful');
    }
}