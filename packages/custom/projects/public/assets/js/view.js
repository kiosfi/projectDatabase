"use strict";

function toggleCollapse(id) {
    var element = document.getElementById(id);

    if (element.style.display !== 'block') {
        document.getElementById(id).style.display = 'block';
    } else {
        document.getElementById(id).style.display = 'none';
    }
}
