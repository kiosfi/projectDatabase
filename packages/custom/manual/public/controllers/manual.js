'use strict';

angular.module('mean.manual').controller('ManualController',
        ['$scope', 'Global', 'Manual', ManualController]);

function ManualController($scope, Global, Manual) {
    $scope.global = Global;
    $scope.package = {
        name: 'manual'
    };
}