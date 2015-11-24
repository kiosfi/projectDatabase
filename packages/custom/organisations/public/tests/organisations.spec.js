'use strict';
(function () {
    describe('Test test case', function () {
        it('1 should be equals to 1', function () {
            expect(1).toBe(1);
        });
    });
    //Projects Controller Spec
    describe('MEAN controllers', function () {
        describe('OrganisationsController', function () {
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
                module('mean.organisations');

                module('authMock');
            });

            var OrganisationsController,
                    scope,
                    $httpBackend,
                    $stateParams,
                    $location,
                    MeanUser;

            beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _MeanUser_) {
                MeanUser = _MeanUser_;
                scope = $rootScope.$new();
                OrganisationsController = $controller('OrganisationsController', {
                    $scope: scope,
                    MeanUser: MeanUser
                });

                $stateParams = _$stateParams_;
                $httpBackend = _$httpBackend_;
                $location = _$location_;
            }));

            it('$scope.find() should create an array with at least one organisation object ' +
                    'fetched from XHR', function () {

                        MeanUser.login();
                        $httpBackend.expectGET('api\/organisations?ascending=true&ordering=project_ref&page=1').respond([{
                                title: 'Human rights org'
                            }]);
                        // run controller
                        scope.find();

                        $httpBackend.flush();
                        expect(scope.organisations).toEqualData([{
                                "title": "Human rights org"
                            }]);
                    });

            it('$scope.findOne() should create an array with one organisation object fetched ' +
                    'from XHR using a projectId URL parameter', function () {
                        // fixture URL parament
                        $stateParams.organisationId = '525a8422f6d0f87f0e407a33';
                        // fixture response object
                        var testOrganisationData = function () {
                            return {
                                title: 'Human rights'
                            };
                        };
                        // test expected GET request with response object
                        $httpBackend.expectGET(/api\/organisations\/([0-9a-fA-F]{24})$/).respond(testOrganisationData());
                        // run controller
                        scope.findOne();
                        $httpBackend.flush();
                        // test scope value
                        expect(scope.organisation).toEqualData(testOrganisationData());
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
        });
