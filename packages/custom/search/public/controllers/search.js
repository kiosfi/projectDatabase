'use strict';

/* jshint -W098 */
angular.module('mean.search').controller('SearchController', ['$scope', '$stateParams',
    '$http', '$window', '$location', '$q', '$filter', 'Global', 'Search', 'OrgSearch', 'ThemeSearch', 'MeanUser',
    function ($scope, $stateParams, $http, $window, $location, $q, $filter, Global, Search, OrgSearch, ThemeSearch, MeanUser) {
        $scope.global = Global;

        /**
         * Returns a string where certain special character sequences are 
         * replaced with html tags, and the length is truncated to 200 
         * characters. This function was copied and modified from the Projects 
         * package.
         *
         * @param {String} text The text to be transformed.
         * @returns {String}    The transformed text.
         */
        $scope.handleDescription = function (text) {
            if (!text) {
                return "";
            }
            var pieces = text.split("**");
            var transformed = "";
            for (var i = 1, max = pieces.length; i < max; i += 2) {
                pieces[i] = '<mark>' + pieces[i] + '</mark>';
            }
            pieces.forEach(function (x) {
                transformed += x;
            });
            pieces = transformed.split("!!");
            transformed = "";
            for (var i = 1, max = pieces.length; i < max; i += 2) {
                pieces[i] = '<h5>' + pieces[i] + '</h5>';
            }
            pieces.forEach(function (x) {
                transformed += x;
            });
            transformed = transformed.replace(/\_\_/g, "<br/>&nbsp;&nbsp;&nbsp;&nbsp;");
            return transformed.length > 200 ? transformed.substring(0, 197) + "..." : transformed;
        };

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
        };

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
         * The sorting predicate used in project/organisation listing.
         */
        $scope.ordering;

        /**
         * <tt>true</tt> iff the search results will be listed in ascending
         * order.
         */
        $scope.ascending;

        /**
         * Current page number.
         */
        $scope.page;

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
            if ((typeof searchBy) === 'undefined') {
                $scope.results = [];
                return;
            }
            if ((typeof ordering) === 'undefined') {
                ordering = 'project_ref';
            }
            if ((typeof ascending) === 'undefined') {
                ascending = 'true';
            }
            if ((typeof page) === 'undefined') {
                page = 1;
            }
            $scope.searchProj = JSON.parse(searchBy);
            $scope.ordering = ordering;
            $scope.ascending = ascending === 'true';
            $scope.page = page;

            Search.countProjects({"searchBy": searchBy}, function (result) {
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
            if (((typeof search.searchBy) === 'undefined') ||
                    ((typeof search.choice) === 'undefined')) {
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
            var ordering = $location.search().ordering;
            var ascending = $location.search().ascending;
            var page = $location.search().page;
            if ((typeof searchBy) === 'undefined') {
                $scope.organisations = [];
                return;
            }
            if ((typeof ordering) === 'undefined') {
                ordering = 'name';
            }
            if ((typeof ascending) === 'undefined') {
                ascending = 'true';
            }
            if ((typeof page) === 'undefined') {
                page = 1;
            }

            $scope.searchOrg = JSON.parse(searchBy);
            $scope.ordering = ordering;
            $scope.ascending = ascending === 'true';
            $scope.page = page;

            Search.countOrganisations({"searchBy": searchBy}, function (result) {
                $scope.numberOfResults = result.organisationCount;
                $scope.paginate();
            });

            Search.searchOrgs({
                "searchBy": searchBy,
                "ordering": ordering,
                "ascending": ascending,
                "page": page
            }, function (results) {
                $scope.organisations = results;
            });
        };

        /**
         * The project document fields selected for CSV export at the project
         * search page.
         */
        $scope.projExportFields = {ref: true, title: true, state: true,
            security_level: false, coordinator: false, country: true,
            region: false, dac: true, reg_date: true, applied_local: false,
            applied_eur: true, granted_eur: true, duration: true,
            org_name: true, org_rep: false, org_addr: false, org_tel: false,
            org_email: false, org_www: false, themes: false, description: false,
            activities: false, context: false, goal: false, target_group: false,
            human_resources: false, equality: false, vulnerable_groups: false,
            planned_results: false, risk_control: false, indicators: false,
            reporting_evaluation: false, budget: false, other_funding: false,
            referees: false, background_check: false, special_notes: false
        };

        /**
         * The organisation document fields selected for CSV export at the
         * organisation search page.
         */
        $scope.orgExportFields = {org_name: true, org_rep: true,
            org_addr: true, org_tel: true, org_email: true, org_www: true,
            org_exec_man: false, org_comm_rep: false, org_legal_status: true,
            org_description: true, org_int_links: false,
            org_nat_local_links: false, org_other_funding_budget: false,
            org_accounting_audit: false, org_background: false,
            org_bank_account: true, org_special_notes: false
        };

        /**
         * The state of the master checkbox contolling all the basic field
         * checkbox states in the project search result export form.
         */
        $scope.basicCBToggle = false;

        /**
         * Array of the basic field checkbox identifiers in the project search
         * result export form.
         */
        $scope.basicCBArray = ['ref', 'title', 'state', 'security_level',
            'coordinator', 'country', 'region', 'dac', 'reg_date',
            'applied_local', 'applied_eur', 'duration', 'granted_eur'];

        /**
         * The state of the master checkbox contolling all the organisation
         * field checkbox states in the project search result export form.
         */
        $scope.orgCBToggle = false;

        /**
         * Array of the organisation field checkbox identifiers in the project
         * search result export form.
         */
        $scope.orgCBArray = ['org_name', 'org_rep', 'org_addr', 'org_tel',
            'org_email', 'org_www'];

        /**
         * The state of the master checkbox contolling all the extra field
         * checkbox states in the project search result export form.
         */
        $scope.extraCBToggle = false;

        /**
         * Array of the extra field checkbox identifiers in the project search
         * result export form.
         */
        $scope.extraCBArray = ['themes', 'description', 'activities',
            'context', 'goal', 'target_group', 'human_resources', 'equality',
            'vulnerable_groups', 'planned_results', 'risk_control',
            'indicators', 'reporting_evaluation', 'budget', 'other_funding',
            'referees', 'background_check', 'special_notes'];

        /**
         * The state of the master checkbox controlling all the basic field
         * checkbox states in the organisation search result export form.
         */
        $scope.orgBasicCBToggle = false;

        /**
         * Array of organisation basic field checkbox identifiers in the
         * organisation search result export form.
         */
        $scope.orgBasicCBArray = ['org_name', 'org_rep', 'org_addr', 'org_tel',
            'org_email', 'org_www', 'org_exec_man', 'org_comm_rep',
            'org_bank_account'];

        /**
         * The state of the master checkbox controlling all the extra field
         * checkbox states in the organisation search result export form.
         */
        $scope.orgExtraCBToggle = false;

        /**
         * An array containing the rest of organisation field checkbox
         * identifiers.
         */
        $scope.orgExtraCBArray = ['org_legal_status', 'org_description',
            'org_int_links', 'org_nat_local_links', 'org_other_funding_budget',
            'org_accounting_audit', 'org_background', 'org_special_notes'];

        /**
         * Sets the states of the given field selections to match the given
         * state (<tt>true</tt> or <tt>false</tt>). This function is used by the
         * master checkboxes of the project/organisation search result export
         * form.
         *
         * @param {type} form       The form whose state is to be changed. The
         * options are "proj" and "org".
         * @param {type} checkboxes The checkboxes whose state is to be changed.
         * @param {type} state      The state which will be applied to all given
         * fields.
         * @returns {undefined}
         */
        $scope.setStates = function (form, checkboxes, state) {
            checkboxes.forEach(function (x) {
                $scope[form + 'ExportFields'][x] = state;
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
            var fields = $scope.projExportFields;
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
         * function is used in the project/organisation search result csv export
         * feature.
         *
         * @param {Array} fields The organisation fields to be added to the
         * selection string.
         */
        $scope.orgFieldSel = function (fields) {
            var selection = "";
            Object.keys(fields).forEach(function (field) {
                if (fields[field]) {
                    switch (field) {
                        case "org_rep":
                            selection += "representative ";
                            break;
                        case "org_exec_man":
                            selection += "exec_manager ";
                            break;
                        case "org_comm_rep":
                            selection += "communications_rep ";
                            break;
                        case "org_addr":
                            selection += "address ";
                            break;
                        case "org_www":
                            selection += "website ";
                            break;
                        default:
                            selection += field.substring(4) + " ";
                    }
                }
            });
            return selection;
        };

        /**
         * Fetches search parameters from URL and redirects the browser to the
         * CSV export page.
         *
         * @param {String} collection The collection being searched for CSV
         * export (<tt>"proj"</tt> for projects or <tt>"org"</tt> for
         * organisations).
         * @returns {undefined}
         */
        $scope.getDataForCSV = function (collection) {
            var searchBy = $location.search().searchBy;
            if ((typeof searchBy) === 'undefined') {
                $scope.global.exportResults = [];
                return;
            }

            switch (collection) {
                case "proj":
                    $scope.searchProj = JSON.parse(searchBy);
                    Search.searchAllProjects({
                        "searchBy": searchBy,
                        "projFields": $scope.projFieldSel(),
                        "orgFields": $scope.orgFieldSel($scope.projExportFields)
                    },
                            function (results) {
                                $scope.global.exportResults = results;
                                $scope.global.exportFields = $scope.projExportFields;
                                $scope.global.collection = "proj";
                                $location.path('search/export');
                            }
                    );
                    break;
                case "org":
                    $scope.searchOrg = JSON.parse(searchBy);
                    Search.searchAllOrganisations({
                        "searchBy": searchBy,
                        "fields": $scope.orgFieldSel($scope.orgExportFields)
                    },
                            function (results) {
                                $scope.global.exportResults = results;
                                $scope.global.exportFields = $scope.orgExportFields;
                                $scope.global.collection = "org";
                                $location.path('search/export');
                            });
                    break;
            }
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
            var ordering = ((typeof $scope.ordering) === "undefined"
                    ? "title" : $scope.ordering);
            var ascending = ((typeof $scope.ascending) === "undefined"
                    ? "true" : $scope.ascending);
            var page = ((typeof $scope.page) === "undefined"
                    ? "1" : $scope.page);
            $window.location = '/search?searchBy='
                    + JSON.stringify($scope.searchProj)
                    + '&ordering=' + ordering
                    + '&ascending=' + ascending
                    + '&page=' + page;
        };

        /**
         * Reloads payment search view.
         *
         */
        $scope.updatePaymentSearch = function () {
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
            var ordering = ((typeof $scope.ordering) === "undefined"
                    ? "title" : $scope.ordering);
            var ascending = ((typeof $scope.ascending) === "undefined"
                    ? "true" : $scope.ascending);
            var page = ((typeof $scope.page) === "undefined"
                    ? "1" : $scope.page);
            $window.location = '/search/orgs?searchBy='
                    + JSON.stringify($scope.searchOrg)
                    + '&ordering=' + ordering
                    + '&ascending=' + ascending
                    + '&page=' + page;
        };

        /**
         * Updates the page number and reloads the view.
         *
         * @param {String} collection   <tt>"proj"</tt> for projects or
         * <tt>"org"</tt> for organisations.
         * @param {String} page New page number.
         */
        $scope.updatePage = function (collection, page) {
            switch (collection) {
                case "proj":
                    $window.location = '/search?searchBy='
                            + JSON.stringify($scope.searchProj)
                            + '&ordering=' + $scope.ordering
                            + '&ascending=' + $scope.ascending
                            + '&page=' + page;
                    break;
                case "org":
                    $window.location = '/search/orgs?searchBy='
                            + JSON.stringify($scope.searchOrg)
                            + '&ordering=' + $scope.ordering
                            + '&ascending=' + $scope.ascending
                            + '&page=' + page;
                    break;
            }
        };

        /**
         * Updates the ordering and reloads the view.
         *
         * @pstsm {String} collection   The collection whose search results will
         * be sorted (<tt>"proj"</tt> for projects or <tt>"org"</tt> for
         * organisations).
         * @param {String} ordering     The ordering predicate.
         */
        $scope.updateOrdering = function (collection, ordering) {
            switch (collection) {
                case "proj":
                    $window.location = '/search?searchBy='
                            + JSON.stringify($scope.searchProj)
                            + '&ordering=' + ordering
                            + '&ascending=' + (ordering === $scope.ordering
                                    ? !$scope.ascending : true)
                            + '&page=' + $scope.page;
                    break;
                case "org":
                    $window.location = '/search/orgs?searchBy='
                            + JSON.stringify($scope.searchOrg)
                            + '&ordering=' + ordering
                            + '&ascending=' + (ordering === $scope.ordering
                                    ? !$scope.ascending : true)
                            + '&page=' + $scope.page;
                    break;
            }
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
         * Flattens the given project/organisation. In other words, returns an
         * object of depth one. Every subobject will be replaced with a
         * flattened version having a delimiting underscore ('_') in their keys.
         * For example, consider object {"foo": {"bar": "baz"}}. The flattened
         * version of this object will be {"foo_bar": "baz"}. This function is a
         * slightly modified version of the original that was copied from github
         * at
         * <a href="https://gist.github.com/penguinboy/762197">https://gist.github.com/penguinboy/762197</a> in 26th of May 2016. Thank you very much, penguinboy!
         *
         * @param {Object} object   The project/organisation object to be
         * flattened.
         * @returns {Object}        The flattened version of the given object.
         */
        $scope.flattenObject = function (object) {
            if (!object) {
                return {};
            }

            // Some pre-flattening for certain projecct fields is needed:
            if ((typeof object.organisation) !== "undefined") {
                if ((typeof object.organisation.representative) !== "undefined") {
                    object.organisation.representative =
                            object.organisation.representative.name + ", " +
                            object.organisation.representative.email + ", " +
                            object.organisation.representative.phone;
                }
                if ((typeof object.organisation.address) !== "undefined") {
                    object.organisation.address =
                            object.organisation.address.street + ", " +
                            object.organisation.address.postal_code + ", " +
                            object.organisation.address.city + ", " +
                            object.organisation.address.country;
                }
            }
            if ((typeof object.approved) !== "undefined") {
                if ((typeof object.approved.themes) !== "undefined" &&
                        object.approved.themes.length > 0) {
                    var str = "";
                    object.approved.themes.forEach(function (theme) {
                        str += theme + ", ";
                    });
                    object.approved.themes = str.substring(0, str.length - 2);
                }
            }

            // Pre-flattening for organisation fields:
            if ((typeof object.representative) !== "undefined") {
                object.representative = object.representative.name + ", " +
                        object.representative.email + ", " +
                        object.representative.phone;
            }
            if ((typeof object.address) !== "undefined") {
                object.address = object.address.street + ", " +
                        object.address.postal_code + ", " +
                        object.address.city + ", " +
                        object.address.country;
            }

            return $scope.flattenSubObject(object);
        };

        $scope.flattenSubObject = function (subObject) {
            var toReturn = {};
            if (!!subObject) {
                for (var i in subObject) {
                    if (!subObject.hasOwnProperty(i))
                        continue;

                    var subSubObject = subObject[i];
                    switch (typeof subSubObject) {
                        case "object":
                            var flatObject = $scope.flattenSubObject(subSubObject);
                            for (var x in flatObject) {
                                if (!flatObject.hasOwnProperty(x))
                                    continue;

                                toReturn[i + '_' + x] = flatObject[x];
                            }
                            break;
                        case "number":
                            var string = $filter('currency')(subSubObject, '', 2);
                            string = string.replace(/,/g, ";");
                            string = string.replace(".", ",");
                            toReturn[i] = string.replace(/;/g, " ");
                            break;
                        case "string":
                            if (subSubObject.match(/^\d{4}(-\d{2}){2}T(\d{2}:){2}\d{2}\.\d{3}Z$/)) {
                                var datePieces = subSubObject.split("T");
                                if (datePieces.length === 2) {
                                    datePieces = datePieces[0].split("-");
                                    toReturn[i] = datePieces[2].replace(/^0/, "") +
                                            "." + datePieces[1].replace(/^0/, "") +
                                            "." + datePieces[0];
                                }
                                break;
                            }
                        default:
                            toReturn[i] = subSubObject;
                    }
                }
            }
            return toReturn;
        };

        /**
         * Parses search results to exportable format. Puts parsed data to
         * $scope.parsedData -array.
         */
        $scope.getCSVData = function () {
            var results = $scope.global.exportResults;
            $scope.global.exportResults = [];
            results.forEach(function (result) {
                var flat = $scope.flattenObject(result);
                Object.keys(flat).forEach(function (field) {
                    if ((typeof flat[field]) === "undefined") {
                        flat[field] = " ";
                    }
                });
                $scope.global.exportResults.push(flat);
            });
            results = $scope.global.exportResults;
            var fields = $scope.global.exportFields;
            var header = $scope.csvHeader;
            var colOrder = $scope.csvColOrder;
            if ($scope.global.collection === "proj") {
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
                                            header.push("Järjestön verkkosivut");
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
            } else {
                Object.keys(fields).forEach(function (field) {
                    if (fields[field]) {
                        switch (field) {
                            case "org_name":
                                header.push("Järjestö");
                                colOrder.push(field.substring(4));
                                break;
                            case "org_rep":
                                header.push("Edustaja");
                                colOrder.push("representative");
                                break;
                            case "org_exec_man":
                                header.push("Vastaava johtaja");
                                colOrder.push("exec_manager");
                                break;
                            case "org_comm_rep":
                                header.push("Viestintävastaava");
                                colOrder.push("communications_rep");
                                break;
                            case "org_addr":
                                header.push("Osoite");
                                colOrder.push("address");
                                break;
                            case "org_tel":
                                header.push("Puhelinnumero");
                                colOrder.push(field.substring(4));
                                break;
                            case "org_email":
                                header.push("Sähköpostiosoite");
                                colOrder.push(field.substring(4));
                                break;
                            case "org_www":
                                header.push("Verkkosivut");
                                colOrder.push("website");
                                break;
                            case "org_legal_status":
                                header.push("Hallintomalli ja henkilöstö");
                                colOrder.push(field.substring(4));
                                break;
                            case "org_description":
                                header.push("Tavoitteet ja keskeiset toimintatavat");
                                colOrder.push(field.substring(4));
                                break;
                            case "org_int_links":
                                header.push("Kansainväliset yhteydet");
                                colOrder.push(field.substring(4));
                                break;
                            case "org_nat_local_links":
                                header.push("Kansalliset ja paikalliset yhteydet");
                                colOrder.push(field.substring(4));
                                break;
                            case "org_other_funding_budget":
                                header.push("Muut rahoittajat ja budjetti");
                                colOrder.push(field.substring(4));
                                break;
                            case "org_accounting_audit":
                                header.push("Taloushallinto ja tilintarkastus");
                                colOrder.push(field.substring(4));
                                break;
                            case "org_background":
                                header.push("Oleelliset taustatiedot");
                                colOrder.push(field.substring(4));
                                break;
                            case "org_bank_account_bank_contact_details":
                                header.push("Pankki");
                                colOrder.push(field.substring(4));
                                break;
                            case "org_bank_account_iban":
                                header.push("Pankkitilin IBAN");
                                colOrder.push(field.substring(4));
                                break;
                            case "org_bank_account_swift":
                                header.push("Pankkitilin SWIFT");
                                colOrder.push(field.substring(4));
                                break;
                            case "org_bank_account_holder_name":
                                header.push("Pankkitilin haltija");
                                colOrder.push(field.substring(4));
                                break;
                            case "org_special_notes":
                                header.push("Erityishuomiot");
                                colOrder.push(field.substring(4));
                                break;
                        }
                    }
                });
            }
        };
    }
]);
