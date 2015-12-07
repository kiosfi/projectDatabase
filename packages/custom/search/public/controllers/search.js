'use strict';

/* jshint -W098 */
angular.module('mean.search').controller('SearchController', ['$scope', '$stateParams',
    '$http', '$window', '$location', '$q', 'Global', 'Search', 'OrgSearch', 'ThemeSearch', 'MeanUser',
    function ($scope, $stateParams, $http, $window, $location, $q, Global, Search, OrgSearch, ThemeSearch, MeanUser) {
        $scope.global = Global;

        /**
         * Fetches project schema attributes to populate search view
         * fields dropdown.
         */
        $scope.getProjectFields = function () {
            $http.get('search/assets/projectFields.json').success(function (response) {
                $scope.projectFields = response.main_menu;
                $scope.dateFields = response.date_fields;
                $scope.stringParams = response.string_params;
                $scope.themes = response.themes;
                $scope.levels = response.levels;
                $scope.states = response.states;
                $scope.funding = response.funding;
            });
        }

        /**
         * Creates search query object
         */

        $scope.results;

        /**
         * Total number of search results.
         */
        $scope.numberOfResults = 0;

        /**
         * The search array. Consists of objects having the following three
         * fields: <tt>key</tt> for the name of the key to be searched by,
         * </tt>value</tt> for the value to be matched against, and
         * <tt>type</tt> for distinguishing between literal string matches and
         * regular expressions.
         */
        $scope.searchBy = [];

        /**
         * The sorting predicate used in project listing. Initial value is
         * "project_ref".
         */
        $scope.ordering = 'project_ref';

        /**
         * <tt>true</tt> iff the projects will be listed in ascending order.
         */
        $scope.ascending = 'true';

        /**
         * Current page number.
         */
        $scope.page = 1;

        /**
         * The number of projects to be listed on a single page.
         */
        $scope.pageSize = 10;

        /**
         * An array containing JSON objects for pagination.
         */
        $scope.pages;

        /**
         * Performs the search operation. The parameters are fetched from the
         * URL.
         *
         * @returns {JSON} response from server.
         */
        $scope.search = function () {
            var searchBy = $location.search().searchBy;
            var ordering = $location.search().ordering;
            var ascending = $location.search().ascending;
            var page = $location.search().page;
            if (typeof searchBy === 'undefined') {
                $scope.results = [];
                return;
            }
            if (typeof ordering === 'undefined') {
                ordering = 'project_ref';
            }
            if (typeof ascending === 'undefined') {
                ascending = 'true';
            }
            if (typeof page === 'undefined') {
                page = 1;
            }
            $scope.searchBy = JSON.parse(searchBy);
            $scope.ordering = ordering;
            $scope.ascending = ascending;
            $scope.page = page;

            Search.countSearchResults({"searchBy": searchBy}, function (result) {
                $scope.numberOfResults = result.projectCount;
            });

            Search.query({
                "searchBy": searchBy,
                "ordering": ordering,
                "ascending": ascending,
                "page": page
            }, function (results) {
                $scope.results = results;
            });
        };


        /**
         * Fetches search parameters from URL when clicking button to export 
         * results.
         * 
         * @returns {JSON} response from server 
         * and changes location to export-page.
         */
        $scope.getResultsForCsv = function () {
            var searchBy = $location.search().searchBy;

            if (typeof searchBy === 'undefined') {
                $scope.global.exportResults = [];
                return;
            }

            $scope.searchBy = JSON.parse(searchBy);

            Search.searchAllProjects({"searchBy": searchBy}, function (results) {
                $scope.global.exportResults = results;
                $location.path('search/export');
            });
        };

        /**
         * Creates query object from each $scope.field/
         * $scope.value pair
         */
        $scope.addQuery = function () {
            $scope.searchBy.push({});
        };

        $scope.removeQuery = function () {
            $scope.searchBy.splice(-1, 1);
        };

        /**
         * Reloads the view.
         *
         */
        $scope.update = function () {
            $window.location = '/search?searchBy=' + JSON.stringify($scope.searchBy)
                    + '&ordering=' + $scope.ordering
                    + '&ascending=' + $scope.ascending
                    + '&page=' + $scope.page;
        };

        /**
         * Updates the page number and reloads the view.
         *
         * @param {String} page New page number.
         */
        $scope.updatePage = function (page) {
            $window.location = '/search?searchBy=' + JSON.stringify($scope.searchBy)
                    + '&ordering=' + $scope.ordering
                    + '&ascending=' + $scope.ascending
                    + '&page=' + page;
        };

        /**
         * Updates the ordering and reloads the view.
         *
         * @param {String} ordering The ordering predicate.
         */
        $scope.updateOrdering = function (ordering) {
            $window.location = '/search?searchBy=' + JSON.stringify($scope.searchBy)
                    + '&ordering=' + ordering
                    + '&ascending=' + (ordering === $scope.ordering
                            ? !$scope.ascending : true)
                    + '&page=' + $scope.page;
        };

        /**
         * Calculates the number of and links to pages and writes the output to
         * $scope.pages.
         *
         * @returns {undefined}
         */
        $scope.paginate = function () {
            var numberOfPages, pagination;
            numberOfPages = Math.ceil($scope.numberOfResults / $scope.pageSize);
            pagination = document.getElementById('pagination');
            $scope.pages = [];
            for (var i = 1; i <= numberOfPages; ++i) {
                $scope.pages.push({number: i});
            }
        };



        /**
         * Parses search results to exportable format. Puts parsed data to 
         * $scope.parsedData -array.
         */
        $scope.getCsvData = function () {

            $scope.parsedData = [];
            angular.forEach($scope.global.exportResults, function (obj) {
                var methods = [];
                var dls = [];
                var plpayments = [];
                var payments = [];

                var in_review_date;
                var in_review_comments;

                var approved_date;
                var approved_by;
                var granted_sum_eur;
                var themes;

                var signed_date;
                var signed_by;

                var rejected_date;
                var rejection_categories;
                var rejection_comments;

                var end_report_approved_date;
                var end_report_approved_by;
                var audit_date;
                var audit_review;
                var end_report_general_review;
                var end_report_methods;
                var end_report_objective;
                var end_report_comments;

                var ended_end_date;
                var ended_board_notified;
                var ended_approved_by;
                var ended_other_comments;

// Check if project has in_review -details and add them, if not use empty string
                if (typeof obj.in_review === 'undefined') {
                    in_review_date = '';
                    in_review_comments = '';
                } else {
                    if (typeof obj.in_review.date === 'undefined') {
                        in_review_date = '';
                    } else {
                        in_review_date = obj.in_review.date;
                    }
                    if (typeof obj.in_review.comments === 'undefined') {
                        in_review_comments = '';
                    } else {
                        in_review_comments = obj.in_review.comments;
                    }
                }

// Check if project has approved -details and add them, if not use empty string
                if (typeof obj.approved === 'undefined') {
                    approved_date = '';
                    approved_by = '';
                    granted_sum_eur = '';
                    themes = '';
                } else {
                    if (typeof obj.approved.approved_date === 'undefined') {
                        approved_date = '';
                    } else {
                        approved_date = obj.approved.approved_date;
                    }
                    if (typeof obj.approved.approved_by === 'undefined') {
                        approved_by = '';
                    } else {
                        approved_by = obj.approved.approved_by;
                    }
                    if (typeof obj.approved.granted_sum_eur === 'undefined') {
                        granted_sum_eur = '';
                    } else {
                        granted_sum_eur = obj.approved.granted_sum_eur;
                    }
                    if (typeof obj.approved.themes === 'undefined') {
                        themes = '';
                    } else {
                        themes = obj.approved.themes;
                    }
                }

// Check if project has signed -details and add them, if not use empty string
                if (typeof obj.signed === 'undefined') {
                    signed_date = '';
                    signed_by = '';
                } else {
                    if (typeof obj.signed.date === 'undefined') {
                        signed_date = '';
                    } else {
                        signed_date = obj.signed.signed_date;
                    }
                    if (typeof obj.signed.signed_by === 'undefined') {
                        signed_by = '';
                    } else {
                        signed_by = obj.signed.signed_by;
                    }
                }

// Check if project has rejected -details and add them, if not use empty string
                if (typeof obj.rejected === 'undefined') {
                    rejected_date = '';
                    rejection_categories = '';
                    rejection_comments = '';
                } else {
                    if (typeof obj.rejected.date === 'undefined') {
                        rejected_date = '';
                    } else {
                        rejected_date = obj.rejected.date;
                    }
                    if (typeof obj.rejected.rejection_categories === 'undefined') {
                        rejection_categories = '';
                    } else {
                        rejection_categories = obj.rejected.rejection_categories;
                    }
                    if (typeof obj.rejected.rejection_comments === 'undefined') {
                        rejection_comments = '';
                    } else {
                        rejection_comments = obj.rejected.rejection_comments;
                    }
                }

// Check if project has end_report -details, if not use empty string
                if (typeof obj.end_report === 'undefined') {
                    end_report_approved_date = '';
                    end_report_approved_by = '';
                    audit_date = '';
                    audit_review = '';
                    end_report_general_review = '';
                    end_report_methods = '';
                    end_report_objective = '';
                    end_report_comments = '';
                } else {
                    if (typeof obj.end_report.approved_date === 'undefined') {
                        end_report_approved_date = '';
                    } else {
                        end_report_approved_date = obj.end_report.approved_date;
                    }
                    if (typeof obj.end_report.approved_by === 'undefined') {
                        end_report_approved_by = '';
                    } else {
                        end_report_approved_by = obj.end_report.approved_by;
                    }
                    if (typeof obj.end_report.audit === 'undefined') {
                        audit_date = '';
                        audit_review = '';
                    } else {
                        if (typeof obj.end_report.audit.date === 'undefined') {
                            audit_date = '';
                        } else {
                            audit_date = obj.end_report.audit.date;
                        }
                        if (typeof obj.end_report.audit.review === 'undefined') {
                            audit_review = '';
                        } else {
                            audit_review = obj.end_report.audit.review;
                        }
                    }
                    if (typeof obj.end_report.general_review === 'undefined') {
                        end_report_general_review = '';
                    } else {
                        end_report_general_review = obj.end_report.general_review;
                    }
                    if (typeof obj.end_report.methods === 'undefined') {
                        end_report_methods = '';
                    } else {
                        end_report_methods = obj.end_report.methods;
                    }
                    if (typeof obj.end_report.objective === 'undefined') {
                        end_report_objective = '';
                    } else {
                        end_report_objective = obj.end_report.objective;
                    }
                    if (typeof obj.end_report.comments === 'undefined') {
                        end_report_comments = '';
                    } else {
                        end_report_comments = obj.end_report.comments;
                    }
                }

                // Check if project has ended -details and add them, if not use empty string
                if (typeof obj.ended === 'undefined') {
                    ended_end_date = '';
                    ended_board_notified = '';
                    ended_approved_by = '';
                    ended_other_comments = '';
                } else {
                    if (typeof obj.ended.end_date === 'undefined') {
                        ended_end_date = '';
                    } else {
                        ended_end_date = obj.ended.end_date;
                    }
                    if (typeof obj.ended.board_notified === 'undefined') {
                        ended_board_notified = '';
                    } else {
                        ended_board_notified = obj.ended.board_notified;
                    }
                    if (typeof obj.ended.approved_by === 'undefined') {
                        ended_approved_by = '';
                    } else {
                        ended_approved_by = obj.ended.approved_by;
                    }
                    if (typeof obj.ended.other_comments === 'undefined') {
                        ended_other_comments = '';
                    } else {
                        ended_other_comments = obj.ended.other_comments;
                    }
                }

                angular.forEach(obj.approved.methods, function (method) {
                    var parsedMethod = method.name + '(' + method.level + ')';
                    methods.push(parsedMethod);
                });

                angular.forEach(obj.signed.intreport_deadlines, function (dl) {
                    var parsedDl = dl.report + ' / ' + dl.date;
                    dls.push(parsedDl);
                });

                angular.forEach(obj.signed.planned_payments, function (payment) {
                    var parsedPmnt = payment.sum_eur + ' (' + payment.date + ')';
                    plpayments.push(parsedPmnt);
                });

                angular.forEach(obj.payments, function (payment) {
                    var parsedPayment = payment.sum_eur + ' (' + payment.payment_date + ')';
                    payments.push(parsedPayment);
                });

                $q.all(methods, dls, plpayments, payments, in_review_date, in_review_comments, approved_date, approved_by, granted_sum_eur, themes,
                        signed_date, signed_by, rejected_date, rejection_categories, rejection_comments, end_report_approved_date,
                        end_report_approved_by, audit_date, audit_review, end_report_general_review, end_report_methods, end_report_objective,
                        end_report_comments, ended_end_date, ended_board_notified, ended_approved_by, ended_other_comments).then(function () {
                    $scope.parsedData.push({project_ref: obj.project_ref, state: obj.state, title: obj.title,
                        coordinator: obj.coordinator, organisation: obj.organisation.name, description: obj.description,
                        description_en: obj.description_en, duration_months: obj.duration_months, applied_sum_eur: obj.funding.applied_curr_eur,
                        granted_sum: obj.approved.granted_sum_eur, left_eur: obj.funding.left_eur, background: obj.background,
                        gender_aspect: obj.gender_aspect, beneficiaries: obj.beneficiaries, project_goal: obj.project_goal,
                        reporting_evalation: obj.reporting_evaluation, sustainability_risks: obj.sustainability_risks,
                        other_donors_proposed: obj.other_donors_proposed, region: obj.region, dac: obj.dac, in_review_date: in_review_date,
                        in_review_comments: in_review_comments, approved_date: approved_date,
                        approved_by: approved_by, approved_methods: methods, approved_themes: themes,
                        signed_date: signed_date, signed_by: signed_by, intrep_dls: dls, planned_payments: plpayments,
                        rejected_date: rejected_date, rejected_categories: rejection_categories,
                        rejected_comments: rejection_comments, payments: payments, end_report_approved_date: end_report_approved_date,
                        end_report_approved_by: end_report_approved_by, audit_date: audit_date, audit_review: audit_review,
                        kios_review: end_report_general_review, end_report_comments: end_report_comments, end_report_methods: end_report_methods,
                        end_report_objective: end_report_objective, ended_end_date: ended_end_date, ended_board_notified: ended_board_notified,
                        ended_approved_by: ended_approved_by, ended_other_comments: ended_other_comments
                    });
                });
            });
        };
    }
]);
