'use strict';

/* jshint -W098 */
angular.module('mean.search').controller('SearchController', ['$scope', '$stateParams',
    '$http', '$window', '$location', '$q', 'Global', 'Search', 'OrgSearch', 'ThemeSearch', 'MeanUser',
    function ($scope, $stateParams, $http, $window, $location, $q, Global, Search, OrgSearch, ThemeSearch, MeanUser) {
        $scope.global = Global;

//        $scope.fieldNames;
//        $http.get("projects/assets/json/projectConstants.json").success(
//                function (response) {
//                    $scope.fieldNames = response.field_names;
//                }
//        );

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
                $scope.orgFields = response.main_menu_org;
                $scope.paymentFields = response.payment_search;
                $scope.paymentDates = response.payment_search_dates;
            });
        }

        /**
         * Whether to show the search criteria in the HTML view or not. The
         * default behaviour is to always show the criteria.
         */
        $scope.showCriteria = true;

        /**
         * Whether to show the search results in the HTML view or not. The
         * default behaviour is to hide the results when loading the page for
         * the first time (i.e. when the search query in URL is empty).
         */
        $scope.showResults = Object.keys($location.search()).length !== 0;

        /**
         * Whether to show the export options for the search results in the HTML
         * view or not. The default behaviour is to hide the results when
         * loading the page for the first time (i.e. when the search query in
         * URL is empty).
         */
        $scope.showExport = Object.keys($location.search()).length !== 0;

        /**
         * Creates search query object
         */
        $scope.results;

        /**
         * Total number of search results.
         */
        $scope.numberOfResults = 0;

        /**
         * The search arrays for projects, payments and organisations.
         * They consist of objects having the following two
         * fields: <tt>key</tt> for the name of the key to be searched by and
         * </tt>value</tt> for the value to be matched against.
         */
        $scope.searchBy = [];
        $scope.searchPay = [];
        $scope.searchOrg = [];

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
         * Performs project search operation. The parameters are fetched from the
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
                $scope.paginate();
            });

            Search.searchProjects({
                "searchBy": searchBy,
                "ordering": ordering,
                "ascending": ascending,
                "page": page
            }, function (results) {
                $scope.results = results;
            });
        };

        /**
         * Performs payment search operation. The parameters are fetched from the
         * URL.
         *
         * @returns {JSON} response from server.
         */
        $scope.searchPayments = function () {

            var search = $location.search();

            if (typeof search.searchPay === 'undefined' ||
                    typeof search.choice === 'undefined') {
                $scope.payments = [];
                return;
            }

            $scope.searchPay = JSON.parse(search.searchPay);
            $scope.choice = JSON.parse(search.choice);

            Search.searchPayments({
                "searchPay": search.searchPay,
                "choice": search.choice
            }, function (results) {
                $scope.payments = results;
            });
        };

        /**
         * Performs organisation search operation. The parameters are fetched from the
         * URL.
         *
         * @returns {JSON} response from server.
         */
        $scope.searchOrgs = function () {

            var searchOrg = $location.search().searchOrg;

            if (typeof searchOrg === 'undefined') {
                $scope.organisations = [];
                return;
            }

            $scope.searchOrg = JSON.parse(searchOrg);

            Search.searchOrgs({
                "searchOrg": searchOrg
            }, function (results) {
                $scope.organisations = results;

                /**
                 * Column order and headers for csv
                 *
                 */
                $scope.csvColOrder = ['_id', 'name', 'representative',
                    'exec_manager', 'communications_rep', 'address', 'tel',
                    'email', 'website', 'legal_status', 'description',
                    'int_links', 'nat_local_links', 'other_funding_budget',
                    'accounting_audit'];

                $scope.orgHeaders = ['Tunnus', 'Nimi', 'Edustaja',
                    'Vastuullinen johtaja', 'Viestintävastaava', 'Osoite',
                    'Puh', 'Email', 'WWW', 'Hallintomalli ja henkilöstö',
                    'Kuvaus', 'Kansainväliset linkit',
                    'Kansalliset/paikalliset linkit',
                    'Muu rahoitus ja budjetti',
                    'Taloushallinto ja tilintarkastus'];
            });
        };

        $scope.exportFields = {ref: true, title: true, state: true,
            security_level: false, coordinator: false, region: true, dac: true,
            reg_date: true, applied_local: false, applied_eur: true,
            granted_eur: true, duration: true, org_name: true, org_rep: false,
            org_addr: false, org_tel: false, org_email: false, org_www: false,
            themes: false, description: false, activities: false,
            context: false, goal: false, target_group: false,
            human_resources: false, equality: false, vulnerable_groups: false,
            sustainability_risks: false, reporting_evaluation: false,
            budget: false, other_funding: false, referees: false,
            background_check: false
        };

        $scope.basicFieldsToggle = false;
        $scope.basicFieldsArray = ['ref', 'title', 'state', 'security_level',
            'coordinator', 'region', 'dac', 'reg_date', 'applied_local',
            'applied_eur', 'duration', 'granted_eur'];

        $scope.orgFieldsToggle = false;
        $scope.orgFieldsArray = ['org_name', 'org_rep', 'org_addr', 'org_tel',
            'org_email', 'org_www'];

        $scope.extraFieldsToggle = false;
        $scope.extraFieldsArray = ['themes', 'description', 'activities',
            'context', 'goal', 'target_group', 'human_resources', 'equality',
            'vulnerable_groups', 'sustainability_risks', 'reporting_evaluation',
            'budget', 'other_funding', 'referees', 'background_check'];

        $scope.setStates = function (fields, state) {
            fields.forEach(function (x) {$scope.exportFields[x] = state;});
        };

        $scope.prepareFieldSelection = function() {
            var fields = $scope.exportFields;
            var resolvedFields = {_id: false};
            Object.keys(fields).forEach(function (field) {
                if (fields[field]) {
                    switch (field) {
                        case "ref":
                            resolvedFields["project_ref"] = true;
                            break;
                        case "applied_local":
                            resolvedFields["funding.applied_curr_local"] = true;
                            resolvedFields["funding.curr_local_unit"] = true;
                            break;
                        case "applied_eur":
                            resolvedFields["funding.applied_curr_eur"] = true;
                            break;
                        case "granted_eur":
                            resolvedFields["approved.granted_sum_eur"] = true;
                            break;
                        case "duration":
                            resolvedFields["duration_months"] = true;
                            break;
                        case "org_name":
                            resolvedFields["organisation.name"] = true;
                            break;
                        case "org_rep":
                            resolvedFields["organisation.representative"] = true;
                            break;
                        case "org_addr":
                            resolvedFields["organisation.address"] = true;
                            break;
                        case "org_tel":
                            resolvedFields["organisation.tel"] = true;
                            break;
                        case "org_email":
                            resolvedFields["organisation.email"] = true;
                            break;
                        case "org_www":
                            resolvedFields["organisation.website"] = true;
                            break;
                        case "themes":
                            resolvedFields["approved.themes"] = true;
                            break;
                        case "activities":
                            resolvedFields["methods"] = true;
                            break;
                        case "goal":
                            resolvedFields["project_goal"] = true;
                            break;
                        case "equality":
                            resolvedFields["gender_aspect"] = true;
                            break;
                        default:
                            resolvedFields[field] = true;
                            break;
                    }
                }
            });
            return resolvedFields;
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

            Search.searchAllProjects({"searchBy": searchBy,
                "fields": $scope.prepareFieldSelection()},
            function (results) {
                $scope.global.exportResults = results;
                $scope.global.fields = $scope.exportFields;
                $location.path('search/export');
            });
        };


        /**
         * Creates project query object from each $scope.field/
         * $scope.value pair
         */
        $scope.addQuery = function () {
            $scope.searchBy.push({});
        };

        $scope.removeQuery = function () {
            $scope.searchBy.splice(-1, 1);
        };

        /**
         * Creates payment query object from each $scope.field/
         * $scope.value pair
         */
        $scope.addPayQuery = function () {
            $scope.searchPay.push({});
        };

        $scope.removePayQuery = function () {
            $scope.searchPay.splice(-1, 1);
        };

        /**
         * Creates organisation query object from each $scope.field/
         * $scope.value pair
         */
        $scope.addOrgQuery = function () {
            $scope.searchOrg.push({});
        };

        $scope.removeOrgQuery = function () {
            $scope.searchOrg.splice(-1, 1);
        };

        /**
         * Reloads project search view.
         *
         */
        $scope.update = function () {
            $window.location = '/search?searchBy=' + JSON.stringify($scope.searchBy)
                    + '&ordering=' + $scope.ordering
                    + '&ascending=' + $scope.ascending
                    + '&page=' + $scope.page;
        };

        /**
         * Reloads payment search view.
         *
         */
        $scope.updateSearch = function () {
            var search = {"choice": $scope.searchChoice}
            $window.location = '/search/payments?searchPay=' + JSON.stringify($scope.searchPay)
                    + '&choice=' + JSON.stringify(search);
        };

        /**
         * Reloads organisation search view.
         *
         */
        $scope.updateOrgSearch = function () {
            $window.location = '/search/orgs?searchOrg=' + JSON.stringify($scope.searchOrg);
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
            var fields = $scope.global.fields;
            $scope.parsedData = [];
            angular.forEach($scope.global.exportResults, function (result) {
                console.log(result);

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
                if (typeof result.in_review === 'undefined') {
                    in_review_date = ' ';
                    in_review_comments = ' ';
                } else {
                    if (typeof result.in_review.date === 'undefined') {
                        in_review_date = ' ';
                    } else {
                        in_review_date = result.in_review.date;
                    }
                    if (typeof result.in_review.comments === 'undefined') {
                        in_review_comments = ' ';
                    } else {
                        in_review_comments = result.in_review.comments;
                    }
                }

// Check if project has approved -details and add them, if not use empty string
                if (typeof result.approved === 'undefined') {
                    approved_date = ' ';
                    approved_by = ' ';
                    granted_sum_eur = ' ';
                    themes = ' ';
                } else {
                    if (typeof result.approved.approved_date === 'undefined') {
                        approved_date = ' ';
                    } else {
                        approved_date = result.approved.approved_date;
                    }
                    if (typeof result.approved.approved_by === 'undefined') {
                        approved_by = ' ';
                    } else {
                        approved_by = result.approved.approved_by;
                    }
                    if (typeof result.approved.granted_sum_eur === 'undefined') {
                        granted_sum_eur = ' ';
                    } else {
                        granted_sum_eur = result.approved.granted_sum_eur;
                    }
                    if (typeof result.approved.themes === 'undefined') {
                        themes = ' ';
                    } else {
                        themes = result.approved.themes;
                    }
                }

// Check if project has signed -details and add them, if not use empty string
                if (typeof result.signed === 'undefined') {
                    signed_date = ' ';
                    signed_by = ' ';
                } else {
                    if (typeof result.signed.date === 'undefined') {
                        signed_date = ' ';
                    } else {
                        signed_date = result.signed.signed_date;
                    }
                    if (typeof result.signed.signed_by === 'undefined') {
                        signed_by = ' ';
                    } else {
                        signed_by = result.signed.signed_by;
                    }
                }

// Check if project has rejected -details and add them, if not use empty string
                if (typeof result.rejected === 'undefined') {
                    rejected_date = ' ';
                    rejection_categories = ' ';
                    rejection_comments = ' ';
                } else {
                    if (typeof result.rejected.date === 'undefined') {
                        rejected_date = ' ';
                    } else {
                        rejected_date = result.rejected.date;
                    }
                    if (typeof result.rejected.rejection_categories === 'undefined') {
                        rejection_categories = ' ';
                    } else {
                        rejection_categories = result.rejected.rejection_categories;
                    }
                    if (typeof result.rejected.rejection_comments === 'undefined') {
                        rejection_comments = ' ';
                    } else {
                        rejection_comments = result.rejected.rejection_comments;
                    }
                }

// Check if project has end_report -details, if not use empty string
                if (typeof result.end_report === 'undefined') {
                    end_report_approved_date = ' ';
                    end_report_approved_by = ' ';
                    audit_date = ' ';
                    audit_review = ' ';
                    end_report_general_review = ' ';
                    end_report_methods = ' ';
                    end_report_objective = ' ';
                    end_report_comments = ' ';
                } else {
                    if (typeof result.end_report.approved_date === 'undefined') {
                        end_report_approved_date = ' ';
                    } else {
                        end_report_approved_date = result.end_report.approved_date;
                    }
                    if (typeof result.end_report.approved_by === 'undefined') {
                        end_report_approved_by = ' ';
                    } else {
                        end_report_approved_by = result.end_report.approved_by;
                    }
                    if (typeof result.end_report.audit === 'undefined') {
                        audit_date = ' ';
                        audit_review = ' ';
                    } else {
                        if (typeof result.end_report.audit.date === 'undefined') {
                            audit_date = ' ';
                        } else {
                            audit_date = result.end_report.audit.date;
                        }
                        if (typeof result.end_report.audit.review === 'undefined') {
                            audit_review = ' ';
                        } else {
                            audit_review = result.end_report.audit.review;
                        }
                    }
                    if (typeof result.end_report.general_review === 'undefined') {
                        end_report_general_review = ' ';
                    } else {
                        end_report_general_review = result.end_report.general_review;
                    }
                    if (typeof result.end_report.methods === 'undefined') {
                        end_report_methods = ' ';
                    } else {
                        end_report_methods = result.end_report.methods;
                    }
                    if (typeof result.end_report.objective === 'undefined') {
                        end_report_objective = ' ';
                    } else {
                        end_report_objective = result.end_report.objective;
                    }
                    if (typeof result.end_report.comments === 'undefined') {
                        end_report_comments = ' ';
                    } else {
                        end_report_comments = result.end_report.comments;
                    }
                }

                // Check if project has ended -details and add them, if not use empty string
                if (typeof result.ended === 'undefined') {
                    ended_end_date = ' ';
                    ended_board_notified = ' ';
                    ended_approved_by = ' ';
                    ended_other_comments = '  ';
                } else {
                    if (typeof result.ended.end_date === 'undefined') {
                        ended_end_date = ' ';
                    } else {
                        ended_end_date = result.ended.end_date;
                    }
                    if (typeof result.ended.board_notified === 'undefined') {
                        ended_board_notified = ' ';
                    } else {
                        ended_board_notified = result.ended.board_notified;
                    }
                    if (typeof result.ended.approved_by === 'undefined') {
                        ended_approved_by = ' ';
                    } else {
                        ended_approved_by = result.ended.approved_by;
                    }
                    if (typeof result.ended.other_comments === 'undefined') {
                        ended_other_comments = ' ';
                    } else {
                        ended_other_comments = result.ended.other_comments;
                    }
                }

                angular.forEach(result.methods, function (method) {
                    if (typeof method.comment === 'undefined') {
                        method.comment = ' ';
                    }
                    var parsedMethod = method.name + ' (' + method.level + '): ' +
                            method.comment;
                    methods.push(parsedMethod);
                });

                angular.forEach(result.signed.intreport_deadlines, function (dl) {
                    var parsedDl = dl.report + ' / ' + dl.date;
                    dls.push(parsedDl);
                });

                angular.forEach(result.signed.planned_payments, function (payment) {
                    var parsedPmnt = payment.sum_eur + ' (' + payment.date + ')';
                    plpayments.push(parsedPmnt);
                });

                angular.forEach(result.payments, function (payment) {
                    var parsedPayment = payment.sum_eur + ' (' + payment.payment_date + ')';
                    payments.push(parsedPayment);
                });

                $q.all(methods, dls, plpayments, payments, in_review_date,
                        in_review_comments, approved_date, approved_by, granted_sum_eur,
                        themes, signed_date, signed_by, rejected_date,
                        rejection_categories, rejection_comments,
                        end_report_approved_date, end_report_approved_by,
                        audit_date, audit_review, end_report_general_review,
                        end_report_methods, end_report_objective,
                        end_report_comments, ended_end_date,
                        ended_board_notified, ended_approved_by,
                        ended_other_comments).then(function () {
                    $scope.parsedData.push(
                            {project_ref: result.project_ref, state: result.state,
                                title: result.title, coordinator: result.coordinator,
                                organisation: result.organisation.name,
                                description: result.description,
                                description_en: result.description_en,
                                duration_months: result.duration_months,
                                applied_sum_eur: result.funding.applied_curr_eur,
                                granted_sum: result.approved.granted_sum_eur,
                                left_eur: result.funding.left_eur,
                                methods: methods,
                                background: result.background,
                                gender_aspect: result.gender_aspect,
                                beneficiaries: result.beneficiaries,
                                project_goal: result.project_goal,
                                reporting_evalation: result.reporting_evaluation,
                                sustainability_risks: result.sustainability_risks,
                                other_donors_proposed: result.other_donors_proposed,
                                region: result.region, dac: result.dac,
                                in_review_date: in_review_date,
                                in_review_comments: in_review_comments,
                                approved_date: approved_date,
                                approved_by: approved_by,
                                approved_themes: themes,
                                signed_date: signed_date, signed_by: signed_by,
                                intrep_dls: dls, planned_payments: plpayments,
                                rejected_date: rejected_date,
                                rejected_categories: rejection_categories,
                                rejected_comments: rejection_comments,
                                payments: payments,
                                end_report_approved_date: end_report_approved_date,
                                end_report_approved_by: end_report_approved_by,
                                audit_date: audit_date,
                                audit_review: audit_review,
                                kios_review: end_report_general_review,
                                end_report_comments: end_report_comments,
                                end_report_methods: end_report_methods,
                                end_report_objective: end_report_objective,
                                ended_end_date: ended_end_date,
                                ended_board_notified: ended_board_notified,
                                ended_approved_by: ended_approved_by,
                                ended_other_comments: ended_other_comments
                            });
                });
            });
        };
    }
]);
