'use strict';

angular.module('mean.projects', ['mean.system'])
.config(['$viewPathProvider', function($viewPathProvider) {
  $viewPathProvider.override('system/views/index.html', 'projects/views/index.html');
}]);
