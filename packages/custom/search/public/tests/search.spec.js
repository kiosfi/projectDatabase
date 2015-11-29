/*'use strict';
(function () {
    describe('Test test case', function () {
        it('1 should be equals to 1', function () {
            expect(1).toBe(1);
        });
    });
    //Projects Controller Spec
    describe('MEAN controllers', function () {
        describe('SearchController', function () {
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
                module('mean.search');

                module('authMock');
            });

            var SearchController,
                    scope,
                    $httpBackend,
                    $stateParams,
                    $location,
                    MeanUser;

            beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _MeanUser_) {
                MeanUser = _MeanUser_;
                scope = $rootScope.$new();
                SearchController = $controller('SearchController', {
                    $scope: scope,
                    MeanUser: MeanUser
                });

                $stateParams = _$stateParams_;
                $httpBackend = _$httpBackend_;
                $location = _$location_;
            }));

            it('$scope.searchByState() should create an array with at least one project object ' +
                    'fetched from XHR', function () {

                        scope.selectedState = "hyv%C3%A4ksytty"
                        $httpBackend.expectGET('api\/search\/state\?state=' + scope.selectedState ).respond([{
                                title: 'Disabled rights',
                                state: 'hyväksytty'
                            }]);
                        // run controller

                        scope.selectedState = "hyväksytty";
                        scope.searchByState();

                        $httpBackend.flush();
                        expect(scope.searchresults).toEqualData([{
                                "title": "Disabled rights",
                                "state": "hyväksytty"
                        }]);
            });

            it('$scope.searchByRegion() should create an array with at least one project object ' +
                    'fetched from XHR', function () {

                        scope.selectedRegion = "aasia";

                        $httpBackend.expectGET('api\/search\/region\?region=' + scope.selectedRegion ).respond([{
                                title: 'Disabled rights',
                                region: 'Itä-Aasia'
                            }]);
                        // run controller

                        scope.searchByRegion();

                        $httpBackend.flush();
                        expect(scope.searchresults).toEqualData([{
                                "title": "Disabled rights",
                                "region": "Itä-Aasia"
                        }]);
            });

        });
    });
}());

// Mocked service to check if user is logged in
angular.module('authMock', [])
        .provider('MeanUser', function () {
            this.checkLoggedin = false;
            this.$get = function () {
                return  {
                    login: function () {
                        this.checkLoggedin = true;
                    },
                    logout: function () {
                        this.checkLoggedin = false;
                    },
                    isLoggedIn: function () {
                        return this.checkLoggedin;
                    }
                };
            };
        });*/
