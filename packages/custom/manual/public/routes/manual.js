(function () {
  'use strict';

  angular
    .module('mean.manual')
    .config(manual);

  manual.$inject = ['$stateProvider'];

  function manual($stateProvider) {
    $stateProvider.state('manual', {
      url: '/manual',
      templateUrl: 'manual/views/index.html'
    });
  }

})();
