'use strict';

/* jshint -W098 */
angular.module('mean.search').controller('SearchController', ['$scope', '$stateParams',
    '$http', '$window', '$location', '$q', '$filter', 'Global', 'Search', 'OrgSearch', 'ThemeSearch', 'MeanUser',
    function ($scope, $stateParams, $http, $window, $location, $q, $filter, Global, Search, OrgSearch, ThemeSearch, MeanUser) {
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
        $scope.searchProj = [];
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
         * Performs project search operation for projects. The parameters are
         * fetched from the URL.
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
            $scope.searchProj = JSON.parse(searchBy);
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
         * Performs payment search operation for payments. The parameters are
         * fetched from the URL.
         */
        $scope.searchPayments = function () {
            var search = $location.search();

            if (typeof search.searchBy === 'undefined' ||
                    typeof search.choice === 'undefined') {
                $scope.payments = [];
                return;
            }

            $scope.searchPay = JSON.parse(search.searchBy);
            $scope.choice = JSON.parse(search.choice);

            Search.searchPayments({
                "searchBy": search.searchBy,
                "choice": search.choice
            }, function (results) {
                $scope.payments = results;
            });
        };

        /**
         * Performs organisation search operation. The parameters are fetched
         * from the URL.
         */
        $scope.searchOrgs = function () {

            var searchBy = $location.search().searchBy;

            if (typeof searchBy === 'undefined') {
                $scope.organisations = [];
                return;
            }

            $scope.searchOrg = JSON.parse(searchBy);

            Search.searchOrgs({
                "searchBy": searchBy
            }, function (results) {
                $scope.organisations = results;

                /**
                 * Column order and headers for csv
                 *
                 */
                $scope.csvColOrder = ['name', 'representative',
                    'exec_manager', 'communications_rep', 'address', 'tel',
                    'email', 'website', 'legal_status', 'description',
                    'int_links', 'nat_local_links', 'other_funding_budget',
                    'accounting_audit', 'background', 'special_notes'];

                $scope.orgHeaders = ['Nimi', 'Edustaja', 'Vastuullinen johtaja',
                    'Viestintävastaava', 'Osoite', 'Puhelinnumero',
                    'Sähköpostiosoite', 'Websivut',
                    'Hallintomalli ja henkilöstö',
                    'Tavoitteet ja keskeiset toimintatavat',
                    'Kansainväliset yhteydet', 'Kansalliset yhteydet',
                    'Muut rahoittajat ja budjetti',
                    'Taloushallinto ja tilintarkastus',
                    'Oleelliset taustatiedot', 'Erityishuomiot'];
            });
        };

        /**
         * The project document fields selected for CSV export at the project
         * search page.
         */
        $scope.exportFields = {ref: true, title: true, state: true,
            security_level: false, coordinator: false, country: true,
            region: false, dac: true, reg_date: true, applied_local: false,
            applied_eur: true, granted_eur: true, duration: true,
            org_name: true, org_rep: false, org_addr: false, org_tel: false,
            org_email: false, org_www: false, themes: false, description: false,
            activities: false, context: false, goal: false, target_group: false,
            human_resources: false, equality: false, vulnerable_groups: false,
            planned_results: false, risk_control: false, indicators: false,
            reporting_evaluation: false, budget: false, other_funding: false,
            referees: false, background_check: false
        };

        /**
         * The state of a master checkbox contolling all the basic field
         * checkboxes in the project search result export form.
         */
        $scope.basicFieldsToggle = false;

        /**
         * List of the basic fields in the project search result export form.
         */
        $scope.basicFieldsArray = ['ref', 'title', 'state', 'security_level',
            'coordinator', 'country', 'region', 'dac', 'reg_date',
            'applied_local', 'applied_eur', 'duration', 'granted_eur'];

        /**
         * The state of a master checkbox contolling all the organisation field
         * checkboxes in the project search result export form.
         */
        $scope.orgFieldsToggle = false;

        /**
         * List of the organisation fields in the project search result export
         * form.
         */
        $scope.orgFieldsArray = ['org_name', 'org_rep', 'org_addr', 'org_tel',
            'org_email', 'org_www'];

        /**
         * The state of a master checkbox contolling all the extra field
         * checkboxes in the project search result export form.
         */
        $scope.extraFieldsToggle = false;

        /**
         * List of the extra fields in the project search result export form.
         */
        $scope.extraFieldsArray = ['themes', 'description', 'activities',
            'context', 'goal', 'target_group', 'human_resources', 'equality',
            'vulnerable_groups', 'planned_results', 'risk_control',
            'indicators', 'reporting_evaluation', 'budget', 'other_funding',
            'referees', 'background_check'];

        /**
         * Sets the states of the given field selections to match the given
         * state (<tt>true</tt> or <tt>false</tt>). This function is used by the
         * master checkboxes of the project search result export form.
         *
         * @param {type} fields The fields whose state is to be changed.
         * @param {type} state  The state which will be applied to all given
         * fields.
         * @returns {undefined}
         */
        $scope.setStates = function (fields, state) {
            fields.forEach(function (x) {
                $scope.exportFields[x] = state;
            });
        };

        /**
         * Formats the project field selection string used by mongoose at server
         * side controller. This function is used in the project search result
         * csv export feature.
         *
         * @returns {String} Mongoose-compatible selection string.
         */
        $scope.projFieldSel = function () {
            var fields = $scope.exportFields;
            var selection = "organisation ";
            Object.keys(fields).forEach(function (field) {
                if (fields[field]) {
                    switch (field) {
                        case "ref":
                            selection += "project_ref ";
                            break;
                        case "applied_local":
                            selection += "funding.applied_curr_local ";
                            selection += "funding.curr_local_unit ";
                            break;
                        case "applied_eur":
                            selection += "funding.applied_curr_eur ";
                            break;
                        case "granted_eur":
                            selection += "approved.granted_sum_eur ";
                            break;
                        case "duration":
                            selection += "duration_months ";
                            break;
                        case "org_name":
                        case "org_rep":
                        case "org_addr":
                        case "org_tel":
                        case "org_email":
                        case "org_www":
                            break;
                        case "themes":
                            selection += "approved.themes ";
                            break;
                        case "activities":
                            selection += "methods ";
                            break;
                        case "goal":
                            selection += "project_goal ";
                            break;
                        case "equality":
                            selection += "gender_aspect ";
                            break;
                        default:
                            selection += field + " ";
                            break;
                    }
                }
            });
        };

        /**
         * Formats the organisation field selection string used by Mongoose for
         * populating organisation fields at the server side controller. This
         * function is used in the project search result csv export feature.
         */
        $scope.orgFieldSel = function () {
            var fields = $scope.exportFields;
            var selection = "";
            Object.keys(fields).forEach(function (field) {
                if (fields[field]) {
                    switch (field) {
                        case "org_name":
                            selection += "name ";
                            break;
                        case "org_rep":
                            selection += "representative ";
                            break;
                        case "org_addr":
                            selection += "address ";
                            break;
                        case "org_tel":
                            selection += "tel ";
                            break;
                        case "org_email":
                            selection += "email ";
                            break;
                        case "org_www":
                            selection += "website ";
                            break;
                    }
                }
            });
            return selection;
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
            $scope.searchProj = JSON.parse(searchBy);

            var projFields =
                    Search.searchAllProjects({"searchBy": searchBy, "projFields":
                                $scope.projFieldSel(), "orgFields": $scope.orgFieldSel()
                    },
                    function (results) {
                        $scope.global.exportResults = results;
                        $scope.global.exportFields = $scope.exportFields;
                        $location.path('search/export');
                    });
        };


        /**
         * Creates project query object from each $scope.field/
         * $scope.value pair
         */
        $scope.addQuery = function () {
            $scope.searchProj.push({});
        };

        $scope.removeQuery = function () {
            $scope.searchProj.splice(-1, 1);
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
            $window.location = '/search?searchBy='
                    + JSON.stringify($scope.searchProj)
                    + '&ordering=' + $scope.ordering
                    + '&ascending=' + $scope.ascending
                    + '&page=' + $scope.page;
        };

        /**
         * Reloads payment search view.
         *
         */
        $scope.updateSearch = function () {
            var search = {"choice": $scope.searchChoice};
            $window.location = '/search/payments?searchBy='
                    + JSON.stringify($scope.searchPay)
                    + '&choice=' + JSON.stringify(search);
        };

        /**
         * Reloads organisation search view.
         *
         */
        $scope.updateOrgSearch = function () {
            $window.location = '/search/orgs?searchBy='
                    + JSON.stringify($scope.searchOrg);
        };

        /**
         * Updates the page number and reloads the view.
         *
         * @param {String} page New page number.
         */
        $scope.updatePage = function (page) {
            $window.location = '/search?searchBy='
                    + JSON.stringify($scope.searchProj)
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
            $window.location = '/search?searchBy='
                    + JSON.stringify($scope.searchProj)
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
         * Specifies the header row for project search result csv export
         * feature.
         */
        $scope.csvHeader = [];

        /**
         * Specifies the column order for project search result csv export
         * feature.
         */
        $scope.csvColOrder = [];

        /**
         * Flattens the given project. In other words, returns an object of
         * depth one. Every subobject will be replaced with a flattened version
         * having a delimiting underscore ('_') in their keys. For example,
         * consider object {"foo": {"bar": "baz"}}. The flattened version of
         * this object will be {"foo_bar": "baz"}. This function is a slightly
         * modified version of the original that was copied from github at
         * <a href="https://gist.github.com/penguinboy/762197">https://gist.github.com/penguinboy/762197</a> in 26th of May 2016. Thank you very much,
         * penguinboy!
         *
         * @param {Object} project  The project object to be flattened.
         * @returns {Object}        The flattened version of the given object.
         */
        $scope.flattenObject = function (project) {
            // Some pre-flattening for certain fields is needed:
            if (typeof project.organisation !== "undefined") {
                if (typeof project.organisation.representative !== "undefined") {
                    project.organisation.representative =
                            project.organisation.representative.name + ", " +
                            project.organisation.representative.email + ", " +
                            project.organisation.representative.phone;
                }
                if (typeof project.organisation.address !== "undefined") {
                    project.organisation.address =
                            project.organisation.address.street + ", " +
                            project.organisation.address.postal_code + ", " +
                            project.organisation.address.city + ", " +
                            project.organisation.address.country;
                }
            }
            if (typeof project.approved !== "undefined") {
                if (typeof project.approved.themes !== "undefined" &&
                        project.approved.themes.length > 0) {
                    var str = "";
                    project.approved.themes.forEach(function (theme) {
                        str += theme + ", ";
                    });
                    project.approved.themes = str.substring(0, str.length - 2);
                }
            }

            var toReturn = {};
            for (var i in project) {
                if (!project.hasOwnProperty(i))
                    continue;

                if ((typeof project[i]) === "object") {
                    var flatObject = $scope.flattenObject(project[i]);
                    for (var x in flatObject) {
                        if (!flatObject.hasOwnProperty(x))
                            continue;

                        toReturn[i + '_' + x] = flatObject[x];
                    }
                } else {
                    toReturn[i] = project[i];
                }
            }
            return toReturn;
        };

        /**
         * Parses search results to exportable format. Puts parsed data to
         * $scope.parsedData -array.
         */
        $scope.getCsvData = function () {
            var results = $scope.global.exportResults;
            $scope.global.exportResults = [];
            results.forEach(function (result) {
                var flat = $scope.flattenObject(result);
                Object.keys(flat).forEach(function (field) {
                    if (typeof flat[field] === "undefined") {
                        flat[field] = " ";
                    }
                });
                $scope.global.exportResults.push(flat);
            });
            results = $scope.global.exportResults;
            var fields = $scope.global.exportFields;
            var header = $scope.csvHeader;
            var colOrder = $scope.csvColOrder;
            $http.get("projects/assets/json/projectConstants.json").success(
                    function (response) {
                        var fieldNames = response.field_names;
                        Object.keys(fields).forEach(function (field) {
                            if (fields[field]) {
                                switch (field) {
                                    case "ref":
                                        header.push(fieldNames["project_ref"]);
                                        colOrder.push("project_ref");
                                        break;
                                    case "applied_local":
                                        header.push(fieldNames["funding_applied_curr_local"]);
                                        header.push(fieldNames["funding_curr_local_unit"]);
                                        colOrder.push("funding_applied_curr_local");
                                        colOrder.push("funding_curr_local_unit");
                                        break;
                                    case "applied_eur":
                                        header.push(fieldNames["funding_applied_curr_eur"]);
                                        colOrder.push("funding_applied_curr_eur");
                                        break;
                                    case "granted_eur":
                                        header.push(fieldNames["approved_granted_sum_eur"]);
                                        colOrder.push("approved_granted_sum_eur");
                                        break;
                                    case "duration":
                                        header.push(fieldNames["duration_months"]);
                                        colOrder.push("duration_months");
                                        break;
                                    case "org_name":
//                                        header.push(fieldNames["organisation_name"]);
                                        header.push("Järjestön nimi");
                                        colOrder.push("organisation_name");
                                        break;
                                    case "org_rep":
//                                        header.push(fieldNames["organisation_representative"]);
                                        header.push("Järjestön edustaja");
                                        colOrder.push("organisation_representative");
                                        break;
                                    case "org_addr":
//                                        header.push(fieldNames["organisation_address"]);
                                        header.push("Järjestön osoite");
                                        colOrder.push("organisation_address");
                                        break;
                                    case "org_tel":
//                                        header.push(fieldNames["organisation_tel"]);
                                        header.push("Järjestön puh.");
                                        colOrder.push("organisation_tel");
                                        break;
                                    case "org_email":
//                                        header.push(fieldNames["organisation_email"]);
                                        header.push("Järjestön spostios.");
                                        colOrder.push("organisation_email");
                                        break;
                                    case "org_www":
//                                        header.push(fieldNames["organisation_www"]);
                                        header.push("Järjestön www-sivut");
                                        colOrder.push("organisation_website");
                                        break;
                                    case "themes":
                                        header.push(fieldNames["approved_themes"]);
                                        colOrder.push("approved_themes");
                                        break;
                                    case "activities":
                                        header.push(fieldNames["methods"]);
                                        colOrder.push("methods");
                                        break;
                                    case "goal":
                                        header.push(fieldNames["project_goal"]);
                                        colOrder.push("project_goal");
                                        break;
                                    case "equality":
                                        header.push(fieldNames["gender_aspect"]);
                                        colOrder.push("gender_aspect");
                                        break;
                                    default:
                                        header.push(fieldNames[field]);
                                        colOrder.push(field);
                                        break;
                                }
                            }
                        });
                    }
            );
        };
    }
]);
