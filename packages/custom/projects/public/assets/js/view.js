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
 * Hides or shows the given HTML element and changes the animation of the
 * associated indicator image.
 *
 * @param {String} elementID   id of the element.
 * @param {String} indicatorID id of the indicator.
 * @return {undefined}
 */
function toggleCollapse2(elementID, indicatorID) {
    var element = document.getElementById(elementID);
    var indicator = document.getElementById(indicatorID);
    if (element.style.display !== 'block') {
        element.style.display = 'block';
        indicator.src = '../img/indicator-closing.gif';
    } else {
        element.style.display = 'none';
        indicator.src = '../img/indicator-opening.gif';
    }
}