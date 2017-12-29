"use strict";

angular.module("mean.projects").config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider
                .state("all projects", {
                    url: "/projects",
                    templateUrl: "/projects/views/list.html",
                    resolve: {
                        loggedin: function (MeanUser) {
                            return MeanUser.checkLoggedin();
                        }
                    }
                })
                .state("create project", {
                    url: "/projects/create",
                    templateUrl: "/projects/views/create.html",
                    resolve: {
                        loggedin: function (MeanUser) {
                            return MeanUser.checkLoggedin();
                        }
                    }
                })
                .state("project by id", {
                    url: "/projects/:projectID",
                    templateUrl: "/projects/views/view.html",
                    resolve: {
                        loggedin: function (MeanUser) {
                            return MeanUser.checkLoggedin();
                        }
                    }
                })
                .state("edit project", {
                    url: "/projects/:projectID/edit",
                    templateUrl: "/projects/views/edit.html",
                    resolve: {
                        loggedin: function (MeanUser) {
                            return MeanUser.checkLoggedin();
                        }
                    }
                })
                .state("change project state", {
                    url: "/projects/:projectID/change",
                    templateUrl: "/projects/views/change.html",
                    resolve: {
                        loggedin: function (MeanUser) {
                            return MeanUser.checkLoggedin();
                        }
                    }
                })
                .state("registration report by id", {
                    url: "/projects/:projectID/regreport",
                    templateUrl: "/projects/views/regreport.html",
                    resolve: {
                        loggedin: function (MeanUser) {
                            return MeanUser.checkLoggedin();
                        }
                    }
                })
                .state("project report by id", {
                    url: "/projects/:projectID/intreport/:reportId",
                    templateUrl: "/projects/views/intreport.html",
                    resolve: {
                        loggedin: function (MeanUser) {
                            return MeanUser.checkLoggedin();
                        }
                    }
                })
                .state("end report by project id", {
                    url: "/projects/:projectID/endReport",
                    templateUrl: "/projects/views/endreport.html",
                    resolve: {
                        loggedin: function (MeanUser) {
                            return MeanUser.checkLoggedin();
                        }
                    }
                });
    }
]);
