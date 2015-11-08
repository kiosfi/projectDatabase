"use strict";

/**
 * Hides or shows the given HTML element.
 *
 * @param {String} id     id of the element.
 * @returns {undefined}
 */
function toggleCollapse(id) {
    var element = document.getElementById(id);

    if (element.style.display !== 'block') {
        document.getElementById(id).style.display = 'block';
    } else {
        document.getElementById(id).style.display = 'none';
    }
}

/**
 * Hides or shows the given HTML element and changes the show/hide button
 * accordingly.
 *
 * @param {String} elementID    id of the element.
 * @param {String} buttonID     id of the button.
 * @return {undefined}
 */
function toggleCollapse2(elementID, buttonID) {
    var element = document.getElementById(elementID);
    var indicator = document.getElementById(buttonID);
    if (element.style.display !== 'block') {
        element.style.display = 'block';
        indicator.innerHTML = '-';
    } else {
        element.style.display = 'none';
        indicator.innerHTML = '+';
    }
}