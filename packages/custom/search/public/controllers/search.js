'use strict';

/* jshint -W098 */
angular.module('mean.search').controller('SearchController', ['$scope', '$stateParams',
    '$http', '$window', '$location', 'Global', 'Search', 'OrgSearch', 'ThemeSearch', 'MeanUser',
    function ($scope, $stateParams, $http, $window, $location, Global, Search, OrgSearch, ThemeSearch, MeanUser) {
        $scope.global = Global;
        $scope.fields = [{"name": "title", "fi": "Nimi"},
            {"name": "coordinator", "fi": "Koordinaattori"},
            {"name": "description", "fi": "Kuvaus"},
            {"name": "description_en", "fi": "Kuvaus (EN)"},
            {"name": "background", "fi": "Hankkeen tausta"},
            {"name": "beneficiaries", "fi": "Hyödynsaajat"},
            {"name": "gender_aspect", "fi": "Gender-näkökulmat"},
            {"name": "project_goal", "fi": "Päätavoite"},
            {"name": "sustainability_risks", "fi": "Kestävyys ja riskit"},
            {"name": "reporting_evaluation", "fi": "Raportointi ja evaluointi"},
            {"name": "other_donors_proposed", "fi": "Muut rahoittajat"},
            {"name": "dac", "fi": "DAC-koodi"},
            {"name": "region", "fi": "Alue"},
            {"name": "in_review.comments", "fi": "Käsittelyvaiheen kommentit"},
            {"name": "approved.themes", "fi": "Teemat"},
            {"name": "rejected.rejection_comments", "fi": "Hylkäyskommentit"},
            {"name": "signed.signed_by", "fi": "Allekirjoittaja"},
            {"name": "end_report.audit.review", "fi": "Tilintarkastuksen arvio"},
            {"name": "end_report.approved_by", "fi": "Loppuraportin hyväksyjä"},
            {"name": "end_report.general_review", "fi": "Loppuraportin KIOSin yleisarvio"},
            {"name": "end_report.objective", "fi": "Loppuraportin arvio tavoitteen toteutumisesta"},
            {"name": "end_report.comments", "fi": "Loppuraportin muut kommentit"},
            {"name": "ended.approved_by", "fi": "Päättämisen hyväksyjä"},
            {"name": "ended.other_comments", "fi": "Päättämisen kommentit"}];

        $scope.stringParams = ["title", "coordinator", "description", "description_en",
            "background", "beneficiaries", "gender_aspect", "project_goal", "sustainability_risk",
            "reporting_evaluation", "other_donors_proposed", "dac", "region", "in_review.comments",
            "rejected.rejection_comments", "signed.signed_by", "end_report.audit.review",
            "end_report.approved_by", "end_report.general_review", "end_report.objective",
            "end_report.comments", "ended.approved_by", "ended.other_comments"];

        $scope.themes = ['Oikeusvaltio ja demokratia', 'TSS-oikeudet', 'Oikeus koskemattomuuteen ja inhimilliseen kohteluun',
            'Naisten oikeudet ja sukupuolten välinen tasa-arvo', 'Lapsen oikeudet',
            'Haavoittuvien ryhmien, dalitien ja vammaisten henkilöiden oikeudet', 'Etniset vähemmistöt ja alkuperäiskansat',
            'LHBTIQ', 'Ihmisoikeuspuolustajat'];

        $scope.states = ['rekisteröity', 'käsittelyssä', 'hyväksytty', 'hylätty', 'allekirjoitettu', 'väliraportti', 'loppuraportti', 'päättynyt'];

        /**
         =======
         /**
         * Creates search query object
         =======
         /**
         >>>>>>> Stashed changes
         * Contains the search results.
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
         * Creates query object from each $scope.field/
         * $scope.value pair
         */
        $scope.addQuery = function () {
            $scope.searchBy.push({});
        };

        $scope.removeQuery = function () {
            $scope.searchBy.splice(-1, 1);
        };

        $scope.update = function () {
            $window.location = '/search?searchBy=' + JSON.stringify($scope.searchBy)
                    + '&ordering=' + $scope.ordering
                    + '&ascending=' + $scope.ascending
                    + '&page=' + $scope.page;
        };

        $scope.updatePage = function (page) {
            $window.location = '/search?searchBy=' + JSON.stringify($scope.searchBy)
                    + '&ordering=' + $scope.ordering
                    + '&ascending=' + $scope.ascending
                    + '&page=' + page;
        };

        /**
         * Updates the ordering and reloads the view.
         *
         * @param {String} ordering The ordering predicate (eg. "project_ref").
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

    }
]);
