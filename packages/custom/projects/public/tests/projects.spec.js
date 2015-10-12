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


            // NB! SCOPE.CREATE TEST NOT YET WORKING

//            it('$scope.create() with valid form data should send POST request ', function () {
//                MeanUser.login();
//
//                // fixture expected POST data
//                var postProjectData = function () {
//                    console.log('postProjectDatan sisällä');
//                    return {
//                        title: 'Human rights'
////                        coordinator: 'Keijo Koo',
////                        organisation: {
////                            _id: '622cf20451979dea2c000011',
////                            name: 'HR org',
////                            representative: 'James Smith',
////                            address: 'Wallstreet',
////                            tel: '+123456678',
////                            email: 'smith@hrorg.com',
////                            website: 'www.hrorg.org',
////                            legal_status: 'non-profit',
////                            history_status: 'Org history',
////                            int_links: 'Unicef'
////                        },
////                        status: 'registered',
////                        reg_date: Date.now,
////                        funding: {
////                            applied_curr_local: 50000,
////                            applied_curr_eur: 10000
////                        },
////                        duration_months: 30,
////                        descripiton: 'Kuvaus hankkeesta',
////                        description_eng: 'Descciption in english',
////                        background: 'Background',
////                        beneficiaries: 'Children in Mosambik',
////                        gender_aspect: 'Aspects',
////                        project_goal: 'Goals',
////                        sustainability_risks: 'Some risks',
////                        reporting_evaluation: 'How to report',
////                        other_donors_proposed: 'Unicef',
////                        dac: '1234566'
//                    };
//                };
//                // fixture response data
//                var responseProjectData = function () {
//                    return {
//                        _id: '525cf20451979dea2c000001',
//                        title: 'Human rights',
////                                        coordinator: 'Keijo Koo',
////                                        organisation: '622cf20451979dea2c000011',
////                                        status: 'registered',
////                                        reg_date: Date.now,
////                                        funding: {
////                                        applied_curr_local: 50000,
////                                                applied_curr_eur: 10000
////                                        },
////                                        duration_months: 30,
////                                        descripiton: 'Kuvaus hankkeesta',
////                                        description_eng: 'Descciption in english',
////                                        background: 'Background',
////                                        beneficiaries: 'Children in Mosambik',
////                                        gender_aspect: 'Aspects',
////                                        project_goal: 'Goals',
////                                        sustainability_risks: 'Some risks',
////                                        reporting_evaluation: 'How to report',
////                                        other_donors_proposed: 'Unicef',
////                                        dac: '1234566'
//                    };
//                };
//                // fixture mock form input values
//                scope.title = 'Human rights';
////                                scope.coordinator = 'Keijo Koo';
////                                scope.project.organisation.name = 'HR org';
////                                scope.project.organisation.representative = 'James Smith';
////                                scope.project.organisation.address = 'Wallstreet';
////                                scope.project.organisation.tel = '+123456678';
////                                scope.project.organisation.email = 'smith@hrorg.com';
////                                scope.project.organisation.website = 'www.hrorg.org';
////                                scope.project.organisation.legal_status = 'non-profit';
////                                scope.project.organisation.history_status = 'Org history';
////                                scope.project.organisation.int_links = 'Unicef';
////                                scope.project.organisation.bank_account.bank_contact_details = 'EU Bank';
////                                scope.project.organisation.bank_account.iban = 'EU1234567890';
////                                scope.project.organisation.bank_account.swift = 'EUEUEUH';
////                                scope.project.organisation.bank_account.holder_name = 'HR org';
////                                scope.status = 'registered';
////                                scope.applied_curr_local = 50000;
////                                scope.applied_curr_eur = 10000;
////                                scope.duration_months = 30;
////                                scope.descripiton = 'Kuvaus hankkeesta';
////                                scope.description_eng = 'Descciption in english';
////                                scope.background = 'Background';
////                                scope.beneficiaries = 'Children in Mosambik';
////                                scope.gender_aspect = 'Aspects';
////                                scope.project_goal = 'Goals';
////                                scope.sustainability_risks = 'Some risks';
////                                scope.reporting_evaluation = 'How to report';
////                                scope.other_donors_proposed = 'Unicef';
////                                scope.dac = '1234566';
//
//                // test post request is sent
//                $httpBackend.expectPOST('api\/projects', postProjectData()).respond(responseProjectData());
//
//                // Run controller
//                console.log('responsedata: ');
//                console.log(responseProjectData());
//
//                console.log('postdata:');
//                console.log(postProjectData());
//
//                scope.create(true);
//                $httpBackend.flush();
//
//                // test form input is reset
//                expect(scope.title).toEqual('');
//
//                // test URL location to new object
//                expect($location.path()).toBe('/projects/' + responseProjectData._id);
//            });
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
