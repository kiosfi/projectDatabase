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
                    MeanUser: MeanUser
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

                        $httpBackend.flush();
                        expect(scope.projects).toEqualData([{
                                "title": "Human rights"
                            }]);
                    });

            it('$scope.findOne() should create an array with one project object fetched ' +
                    'from XHR using a projectId URL parameter', function () {
                        // fixture URL parament
                        $stateParams.projectId = '525a8422f6d0f87f0e407a33';
                        // fixture response object
                        var testProjectData = function () {
                            return {
                                title: 'Human rights',
                                intermediary_reports: []
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

            it('$scope.create() with valid form data should send POST request ', function () {

                scope.project = {
                    title: 'Human rights'
                };

                var postProjectData = function () {
                    return scope.project;
                };
//                // fixture response data
                var responseProjectData = function () {
                    return {
                        _id: '525cf20451979dea2c000001',
                        title: 'Human rights'
                    };
                };

                scope.title = 'Human rights';
                // test post request is sent
                $httpBackend.expectPOST('api\/projects', postProjectData()).respond(responseProjectData());
                // Run controller
                scope.create(true);

                $httpBackend.flush();
                // test form input is reset
                expect(scope.project).toEqual({});
                // test URL location to new object'

                expect($location.path()).toEqual('/projects/' + responseProjectData()._id);
            });

            it('$scope.remove() should send a DELETE request with a valid projectId ' +
                    'and remove the project from the scope', inject(function (Projects) {

                        // fixture rideshare
                        var project = new Projects({
                            _id: '525a8422f6d0f87f0e407a33'
                        });

                        // mock rideshares in scope
                        scope.projects = [];
                        scope.projects.push(project);

                        // test expected rideshare DELETE request
                        $httpBackend.expectDELETE(/api\/projects\/([0-9a-fA-F]{24})$/).respond(204);

                        // run controller
                        scope.remove(project);
                        $httpBackend.flush();

                        // test after successful delete URL location projects list
                        expect($location.path()).toBe('/projects');
                        expect(scope.projects.length).toBe(0);

                    }));

            it('$scope.addReviewState(true) should update a valid project', inject(function (Projects) {


                // fixture rideshare
                var putProjectData = function () {
                    return {
                        _id: '525a8422f6d0f87f0e407a33',
                        in_review: {
                          comments: "This is a comment"
                        },
                        state: 'rekisteröity',
                        to: 'käsittelyssä'
                    };
                };

                // mock project object from form
                var project = new Projects(putProjectData());

                // mock project in scope
                scope.project = project;

                // test PUT happens correctly
                $httpBackend.expectPUT(/api\/projects\/rev\/([0-9a-fA-F]{24})$/).respond();

                // run controller
                scope.addReviewState(true);
                $httpBackend.flush();

                // test URL location to new object
                expect($location.path()).toBe('/projects/' + putProjectData()._id);

            }));

            it('$scope.addApprovedState(true) should update a valid project', inject(function (Projects) {


                // fixture rideshare
                var putProjectData = function () {
                    return {
                        _id: '525a8422f6d0f87f0e407a33',
                        approved: {
                          approved_date: "12.12.2015",
                          approved_by: "Toiminnanjohtaja",
                          board_notified: "22.12.2015",
                          methods: [{"name": "kapasiteetin vahvistaminen", "level": "Kansainvälinen"}],
                          themes: ["Oikeusvaltio ja demokratia"],
                          granted_sum: {"granted_curr_eur": 60000, "granted_curr_local": 80000}
                        },
                        state: 'käsittelyssä',
                        to: 'hyväksytty'
                    };
                };

                // mock project object from form
                var project = new Projects(putProjectData());

                // mock project in scope
                scope.project = project;

                // test PUT happens correctly
                $httpBackend.expectPUT(/api\/projects\/appr\/([0-9a-fA-F]{24})$/).respond();

                // run controller
                scope.addApprovedState(true);
                $httpBackend.flush();

                // test URL location to new object
                expect($location.path()).toBe('/projects/' + putProjectData()._id);

            }));

            it('$scope.addRejectedState(true) should update a valid project', inject(function (Projects) {


                // fixture rideshare
                var putProjectData = function () {
                    return {
                        _id: '525a8422f6d0f87f0e407a33',
                        rejected: {
                            rejection_categories: ["1 Hanke ei ole ihmisoikeushanke"]
                        },
                        state: 'käsittelyssä',
                        to: 'hylätty'
                    };
                };

                // mock project object from form
                var project = new Projects(putProjectData());

                // mock project in scope
                scope.project = project;
                scope.addedRejections = ["1 Hanke ei ole ihmisoikeushanke"];

                // test PUT happens correctly
                $httpBackend.expectPUT(/api\/projects\/rej\/([0-9a-fA-F]{24})$/).respond();

                // run controller
                scope.addRejectedState(true);
                $httpBackend.flush();

                // test URL location to new object
                expect($location.path()).toBe('/projects/' + putProjectData()._id);

            }));

            it('$scope.addSignedState(true) should update a valid project', inject(function (Projects) {


                // fixture rideshare
                var putProjectData = function () {
                    return {
                        _id: '525a8422f6d0f87f0e407a33',
                        signed: {
                          signed_by: 'Jaana Jantunen',
                          signed_date: '22-12-2015',
                          planned_payments: [{"date": "12-12-2015", "sum_eur": 50000, "sum_local": 80000}],
                          intreport_deadlines: [{"report": "1. väliraportti", "date": "01-04-2016"}]
                        },
                        state: 'hyväksytty',
                        to: 'allekirjoitettu'
                    };
                };

                // mock project object from form
                var project = new Projects(putProjectData());

                // mock project in scope
                scope.project = project;

                // test PUT happens correctly
                $httpBackend.expectPUT(/api\/projects\/rev\/([0-9a-fA-F]{24})$/).respond();

                // run controller
                scope.addReviewState(true);
                $httpBackend.flush();

                // test URL location to new object
                expect($location.path()).toBe('/projects/' + putProjectData()._id);

            }));

            it('$scope.addEndedState(true) should update a valid project', inject(function (Projects) {


                // fixture rideshare
                var putProjectData = function () {
                    return {
                        _id: '525a8422f6d0f87f0e407a33',
                        ended: {
                          end_date: "12.12.2015",
                          board_notified: "12.12.2015",
                          approved_by: "toimitusjohtaja",
                          other_comments: "kommentti"
                        },
                        state: 'loppuraportti',
                        to: 'päättynyt'
                    };
                };

                // mock project object from form
                var project = new Projects(putProjectData());

                // mock project in scope
                scope.project = project;

                // test PUT happens correctly
                $httpBackend.expectPUT(/api\/projects\/rev\/([0-9a-fA-F]{24})$/).respond();

                // run controller
                scope.addReviewState(true);
                $httpBackend.flush();

                // test URL location to new object
                expect($location.path()).toBe('/projects/' + putProjectData()._id);

            }));

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
