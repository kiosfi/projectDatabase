"use strict";

/**
 * Sets the state of the given array of checkboxes to match the state of a
 * master checkbox.
 *
 * @param {Array} ids           ID's of the checkboxes to be selected/unselected.
 * @param {Boolean} masterID    ID of the master checkbox element.
 * @returns {undefined}
 */
function setStates(ids, masterID) {
    var state = document.getElementById(masterID).checked;
    var checkboxes = [];
    ids.forEach(function (x) {checkboxes.push(document.getElementById(x));});
    checkboxes.forEach(function (x) {x.checked = state;});
}