'use strict';

(function () {
    describe('Test test case', function () {
        it('1 should be equals to 1', function () {
            expect(1).toBe(1);
        });
    });

    //Projects Controller Spec
    describe('MEAN controllers', function () {
        describe('ProjectsController', function () {
            beforeEach(function () {
                jasmine.addMatchers({
                    toEqualData: function () {
                        return {
                            compare: function (actual, expected) {
                                return {
                                    pass: angular.equals(actual, expected)
                                };
                            }
                        };
                    }
                });
            });

            beforeEach(function () {
                module('mean');
                module('mean.system');
                module('mean.projects');
                module('authMock');
            });

            var ProjectsController,
                    scope,
                    $httpBackend,
                    $stateParams,
                    $location,
                    MeanUser;

            beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _MeanUser_) {
                MeanUser = _MeanUser_;
                scope = $rootScope.$new();

                ProjectsController = $controller('ProjectsController', {
                    $scope: scope,
                    MeanUser : MeanUser
                });

                $stateParams = _$stateParams_;

                $httpBackend = _$httpBackend_;

                $location = _$location_;

            }));

            it('$scope.find() should create an array with at least one project object ' +
                    'fetched from XHR', function () {

                       MeanUser.login();
                        $httpBackend.expectGET('api\/projects').respond([{
                                title: 'Human rights'
                            }]);

                        // run controller
                        scope.find();
                        console.log(scope.projects);
                        $httpBackend.flush();
                        expect(scope.projects).toEqualData([{
                                "title": "Human rights"
                            }]);
                    });

            it('$scope.findOne() should create an array with one project object fetched ' +
                      'from XHR using a projectId URL parameter', function() {
                        // fixture URL parament
                        $stateParams.projectId = '525a8422f6d0f87f0e407a33';

                        // fixture response object
                        var testProjectData = function() {
                          return {
                            title: 'Human rights'
                          };
                        };

                        // test expected GET request with response object
                        $httpBackend.expectGET(/api\/projects\/([0-9a-fA-F]{24})$/).respond(testProjectData());

                        // run controller
                        scope.findOne();
                        $httpBackend.flush();

                        // test scope value
                        expect(scope.project).toEqualData(testProjectData());

                      });
        });
    });
}());

// Mocked service to check if user is logged in
angular.module('authMock', [])
.provider('MeanUser', function () {
    this.checkLoggedin = false;
    this.$get = function() {
      return  {
        login: function() {
          this.checkLoggedin = true;
        },
        logout: function() {
          this.checkLoggedin = false;
        },
        isLoggedIn: function() {
          return this.checkLoggedin;
        }
      };
    };
});
