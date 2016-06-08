'use strict';

angular.module('mean.manual').controller('ManualController',
        ['$scope', 'Global', 'Manual', ManualController]);

function ManualController($scope, Global, Manual) {
    $scope.global = Global;
    $scope.package = {
        name: 'manual'
    };
    /**
     * Number of the current figure.
     */
    $scope.figNr;

    $scope.init = function () {
        console.log("dfg");
        $scope.figNr = 1;
    };
}