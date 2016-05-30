'use strict';
(function () {
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
                        $httpBackend.expectGET('api\/organisations?ascending=true&ordering=name&page=1').respond([{
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
                    'from XHR using a projectID URL parameter', function () {
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

            it('$scope.remove() should send a DELETE request with a valid organisationId ' +
                    'and remove the organisation from the scope', inject(function (Organisations) {

                        // fixture rideshare
                        var organisation = new Organisations({
                            _id: '525a8422f6d0f87f0e407a33'
                        });

                        // mock rideshares in scope
                        scope.organisations = [];
                        scope.organisations.push(organisation);

                        // test expected rideshare DELETE request
                        $httpBackend.expectDELETE(/api\/organisations\/([0-9a-fA-F]{24})$/).respond(204);

                        // run controller
                        scope.remove(organisation);
                        $httpBackend.flush();

                        // test after successful delete URL location projects list
                        expect($location.path()).toBe('/organisations');
                        expect(scope.organisations.length).toBe(0);

                    }));

            // TODO: update-function is using MeanUser.user.name to get
            // user's name for updated-array and test fails there.
//            it('$scope.update(true) should a valid project', inject(function (Organisations) {
//
//
//                // fixture rideshare
//                var testOrganisationData = function () {
//                    return {
//                        updated: {
//                            time: Date.now(),
//                            user: "test user"
//                        },
//                        title: 'Human rights',
//                        to: 'Children rights'
//                    };
//                };
//                
//                // mock project object from form
//                var organisation = new Organisations(testOrganisationData());
//
//                // mock project in scope
//                scope.organisation = organisation;
//
//                // test PUT happens correctly
//                $httpBackend.expectPUT(/api\/organisations\/([0-9a-fA-F]{24})$\/edit/).respond();
//
//                // run controller
//                scope.update(true);
//                $httpBackend.flush();
//
//                // test URL location to new object
//                expect($location.path()).toBe('/organisations/' + testOrganisationData()._id);
//            }));

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
