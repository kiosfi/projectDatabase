'use strict';

angular.module('mean.projects').controller('ProjectsController', ['$scope',
    '$stateParams', '$location', '$window', '$q', '$http', '$filter', 'Global',
    'Projects', 'OrgProjects', 'MeanUser', 'Circles', 'Organisations',
    function ($scope, $stateParams, $location, $window, $q, $http, $filter,
            Global, Projects, OrgProjects, MeanUser, Circles, Organisations) {
        $scope.global = Global;

        $http.get("projects/assets/json/projectConstants.json").success(
                function (response) {
                    $scope.securityLevels       = response.security_levels;
                    $scope.authorities          = response.authorities;
                    $scope.currencyUnits        = response.currency_units;
                    $scope.themes               = response.themes;
                    $scope.methodNames          = response.method_names;
                    $scope.methodLevels         = response.method_levels;
                    $scope.rejCategories        = response.rej_categories;
                    $scope.fieldNames           = response.field_names;
                    $scope.appendixCategories   = response.appendix_categories;
                    $scope.grades               = response.grades;
                }
        );

        $scope.addedMethods         = [];
        $scope.plannedPayments      = [];
        $scope.deadlines            = [];
        $scope.themeSelection       = [];
        $scope.objectiveComments    = [];
        $scope.addedRejections      = [];
        $scope.currentDate          = new Date();

        $scope.dateOptions = {         
            formatDayTitle: 'MMM yyyy',
            startingDay: 1
        };

        $scope.registerdate = { opened: false };
        $scope.paymentdate = { opened: false };
        $scope.boardnotifieddate = { opened: false };
        $scope.approveddate = { opened: false };
        $scope.signeddate = { opened: false };
        $scope.intrdateappr = { opened: false };
        $scope.endrdateappr = { opened: false };
        $scope.auditdate = { opened: false };
        $scope.endnofifieddate = { opened: false };
        $scope.enddate = { opened: false };
        
        /**
         * Show date picker.
         */
        $scope.openDatePicker = function(picker) {
            picker.opened = true;
        };

        /**
         * This function converts a number to a Finnish string representation
         * (i.e. ',' for decimal separator and '.' for grouping. If the number
         * is undefined, the string "-" will be returned.
         *
         * @param {Number} number   The number to be converted.
         * @returns {String}        The string representation of that number.
         */
        $scope.numberToString = function (number) {
            if ((typeof number) === "undefined") {
                return "-";
            }
            var string = $filter('currency')(number, '', 2);
            string = string.replace(/,/g, ";");
            string = string.replace(".", ",");
            return string.replace(/;/g, " ");
        };

        /**
         * Returns a string where enclosing asterisks have been replaced with
         * span tags for highlighting text. For example
         * $scope.handleEmphasis('foo *bar*') yields
         * 'foo <span class="bg-danger">bar</span>'.
         *
         * @param {String} text The text to be transformed.
         * @returns {String}    The transformed text.
         */
        $scope.handleEmphasis = function (text) {
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
            return transformed.replace(/\_\_/g, "<br/>&nbsp;&nbsp;&nbsp;&nbsp;");
        };

        $scope.toggleThemeSelection = function toggleThemeSelection(theme) {
            var idx = $scope.themeSelection.indexOf(theme);
            // is currently selected
            if (idx > -1) {
                $scope.themeSelection.splice(idx, 1);
            }
            // is newly selected
            else {
                $scope.themeSelection.push(theme);
            }
        };

        /**
         * Creates a Date object with the given parameters.
         *
         * @param {type} day    Day of month (1-31).
         * @param {type} month  Month of year (1-12).
         * @param {type} year   Year.
         * @returns {Date}      A new Date object.
         */
        $scope.convertDate = function (day, month, year) {
            var parsed = new Date(year, month - 1, day).toISOString();
            return parsed;
        };

        /**
         * Creates a human-readable date string in the Finnish date format from
         * the given Date object.
         *
         * @param {type} date   The Date object.
         * @returns {String}    A date string in the format "dd.mm.YYYY".
         */
        $scope.dateToString = function (date) {
            date = new Date(date);
            return date.getDate() + "." + (date.getMonth() + 1) + "." +
                    date.getFullYear();
        };

        /**
         * Calculates a time interval as a Date object.
         *
         * @param {Date} start  The start date for the interval.
         * @param {Date} end    The end date for the interval.
         * @returns {Date}      The interval.
         */
        $scope.dateInterval = function (start, end) {
            var a = new Date(end);
            a.setMinutes(a.getMinutes() - a.getTimezoneOffset());
            var b = new Date(start);
            b.setMinutes(b.getMinutes() - b.getTimezoneOffset());
            return a - b;
        };

        $scope.hasAuthorization = function (project) {
            if (!project)
                return false;
            return MeanUser.isAdmin;
        };

        var now = new Date();

        /**
         * This date field is used in the payment addition form at the
         * project view. The default value correspond to the current date
         * (generated during runtime).
         */
        
        $scope.payment_date = now;
        
        /**
         * These date fields are used in the state transition form at the
         * project view. The default value correspond to the current date
         * (generated during runtime).
         */
        $scope.board_notified_date = now;
        $scope.approved_date = now;
        $scope.signed_date = now;
        $scope.intr_approved_date = now;
        $scope.audit_date = now;
        $scope.er_approved_date = now;
        $scope.end_notified_date = now;
        $scope.end_date = now;

        $scope.initNewProject = function() {

            /**
             * This date field is used in the project creation form. The default
             * value corresponds to the current date (generated during runtime).
             */           
            $scope.register_date = now;

            $scope.project = new Projects();
            $scope.project.security_level = "Julkinen";
        }

        /**
         * Creates new project by checking if organisation already exists (i.e. organisation
         * has been selected from dropdown list) or if organisation is new.
         * If organisation is new, first creates new organisation by calling
         * organisation server-side controller and after that creates project.
         * If organisation is selected from list, uses existing organisation._id and
         * creates project.
         *
         * @param {type} isValid checks if project creation form is valid
         * @returns {undefined}
         */
        $scope.create = function (isValid) {
            if (isValid) {
                var project = new Projects($scope.project);
                // set value to midnight on picked date
                project.reg_date = $scope.register_date;
                project.reg_date.setHours(0, 0, 0, 0);

                if ($scope.newOrg) {
                    var org = new Organisations($scope.project.organisation);
                    org.schema_version = 3;
                    org.nat_local_links = "-";
                    org.$save(function (response) {
                        var orgId = response._id;
                        project.organisation = orgId;
                        project.$save(function (response) {
                            $location.path('projects/' + response._id);
                        });
                        $scope.project = {};
                    });
                } else {
                    project.organisation = $scope.project.listOrganisation;
                    project.methods = $scope.addedMethods;
                    project.$save(function (response) {
                        $location.path('projects/' + response._id);
                    });
                    $scope.project = {};
                }
            } else {
                $scope.submitted = true;
            }
        };

        /**
         * Updates project as per edit form and goes to project view if form is
         * valid.
         * @param {type} isValid checkes if form is valid
         * @returns {undefined}
         */
        $scope.update = function (isValid) {
            if (isValid) {
                var project = $scope.project;

                project.methods = [];
                angular.forEach($scope.addedMethods, function (obj) {
                    project.methods.push({
                        name: obj.name, level: obj.level, comment: obj.comment
                    });
                });

                if ((typeof project.approved) !== 'undefined') {
                    if ($scope.projectEditForm.approvedDate.$dirty) {
                        project.approved.approved_date = $scope.approved_date;
                        project.approved.approved_date.setHours(0, 0, 0, 0);
                    }

                    if ($scope.projectEditForm.boardNotifiedDate.$dirty) {
                        project.approved.board_notified = $scope.notified_date;
                        project.approved.board_notified.setHours(0, 0, 0, 0);
                    }

                    project.approved.themes = $scope.themeSelection;
                }

                if ((typeof project.signed) !== 'undefined') {
                    if ($scope.projectEditForm.signedDate.$dirty) {
                        project.signed.signed_date = $scope.signed_date;
                        project.signed.signed_date.setHours(0, 0, 0, 0);
                    }

                    project.signed.intreport_deadlines = [];
                    angular.forEach($scope.deadlines, function (obj) {
                        var deadline_date = obj.date;
                        deadline_date.setHours(0, 0, 0, 0);
                        project.signed.intreport_deadlines.push({
                            report: obj.report,
                            date:   deadline_date
                        });
                    });

                    project.signed.planned_payments = [];
                    angular.forEach($scope.plannedPayments, function (obj) {
                        var payment_date = obj.date;
                        payment_date.setHours(0, 0, 0, 0);
                        project.signed.planned_payments.push({
                            date: payment_date,
                            sum_eur: obj.sum_eur
                        });
                    });
                }

                if (project.intermediary_reports &&
                        project.intermediary_reports.length > 0) {
                    project.intermediary_reports = [];

                    angular.forEach($scope.int_reports, function (report) {
                        var report_date = report.date;
                        report_date.setHours(0, 0, 0, 0);
                        project.intermediary_reports.push({
                            methods: report.methods,
                            overall_rating_kios: report.overall_rating_kios,
                            objectives: report.objectives,
                            communication: report.communication,
                            evaluation: report.evaluation,
                            budget: report.budget,
                            comments: report.comments,
                            approved_by: report.approved_by,
                            date_approved: report_date,
                            reportNumber: report.reportNumber,
                            user: report.user,
                            date: report.date});
                    });
                }

                if (project.end_report &&
                        (typeof project.end_report.date) !== 'undefined') {

                    if ($scope.projectEditForm.audit_date.$dirty) {
                        project.end_report.audit.date = $scope.audit_date;
                        project.end_report.audit.date.setHours(0, 0, 0, 0);
                    }

                    if ($scope.projectEditForm.er_approved_date.$dirty) {
                        project.end_report.approved_date = $scope.er_approved_date;
                        project.end_report.approved_date.setHours(0, 0, 0, 0);
                    }
                }

                if ((typeof project.ended) !== 'undefined') {

                    if ($scope.projectEditForm.endNotifiedDate.$dirty) {
                        project.ended.board_notified = $scope.end_notified_date;
                        project.ended.board_notified.setHours(0, 0, 0, 0);
                    }

                    if ($scope.projectEditForm.endDate.$dirty) {
                        project.ended.end_date = $scope.end_date;
                        project.ended.end_date.setHours(0, 0, 0, 0);
                    }    
                }

                if (!project.updated) {
                    project.updated = [];
                }

                project.updated.push({time: Date.now(), user: MeanUser.user.name});
                project.$update(function () {
                    $location.path('projects/' + project._id);
                });
            } else {
                $scope.printInvalidFields($scope.projectEditForm);
                $scope.submitted = true;
            }
        };

        /**
         * Removes the fields related to states whose information can't be
         * present when modifying the project in its current state. This is a
         * bugfix for the problem where registered projects couldn't be modified
         * because they had the field for approved state with invalid data, so
         * Angular wouldn't accept the modification and the user couldn't access
         * the appropriate form fields due to state restrictions.
         *
         * @param {type} project    The project to be edited.
         * @returns {undefined}
         */
        $scope.removeFutureStates = function (project) {
            switch (project.state) {
                case "rekisteröity":
                    project.in_review = undefined;
                case "käsittelyssä":
                    project.approved = undefined;
                case "hyväksytty":
                    project.rejected = undefined;
//                    case "hylätty":
                    project.signed = undefined;
                    project.payments = undefined;
                case "allekirjoitettu":
                    project.intermediary_reports = undefined;
                case "väliraportti":
                    project.end_report = undefined;
                case "loppuraportti":
                    project.ended = undefined;
            }
        };

        /**
         * Initializes scope-arrays and dates when going to edit-form.
         *
         */
        $scope.initEditing = function () {
            // TODO: Figure out, why we need to move the data from
            // $scope.project.<var> to $scope.<var>. Looks like this bit of
            // code, and the edit form as well, could use some refactoring...
            Projects.get({
                projectID: $stateParams.projectID
            }, function (project) {
                $scope.project = project;
                $scope.addedMethods = [];
                $scope.plannedPayments = [];
                $scope.deadlines = [];
                $scope.int_reports = [];

                angular.forEach(project.methods, function (obj) {
                    $scope.addedMethods.push({name: obj.name, level: obj.level,
                        comment: obj.comment});
                });

                // Classic "quick 'n dirty" approach:
                $scope.removeFutureStates($scope.project);

                if ((typeof project.approved) !== 'undefined') {
                    $scope.board_notified_date  = new Date(project.approved.board_notified);
                    $scope.approved_date        = new Date(project.approved.approved_date);

                    angular.forEach(project.approved.themes, function (obj) {
                        $scope.themeSelection.push(obj);
                    });
                }

                if ((typeof project.signed) !== 'undefined') {
                    $scope.signed_date = new Date(project.signed.signed_date);
                    angular.forEach(project.signed.planned_payments, function (obj) {
                        var date = new Date(obj.date);
                        $scope.plannedPayments.push({
                            date:           date,
                            sum_eur:        obj.sum_eur,
                            picker:         { opened: false }
                        });
                    });
                    angular.forEach(project.signed.intreport_deadlines, function (obj) {
                        var date = new Date(obj.date);
                        $scope.deadlines.push({
                            report:         obj.report,
                            date:           date,
                            picker:         { opened: false }
                        });
                    });
                }

                if (project.intermediary_reports && project.intermediary_reports.length > 0) {
                    angular.forEach(project.intermediary_reports, function (obj) {
                        $scope.int_reports.push({
                            methods:                obj.methods,
                            objectives:             obj.objectives,
                            communication:          obj.communication,
                            evaluation:             obj.evaluation,
                            budget:                 obj.budget,
                            overall_rating_kios:    obj.overall_rating_kios,
                            comments:               obj.comments,
                            approved_by:            obj.approved_by,
                            reportNumber:           obj.reportNumber,
                            date:                   new Date(obj.date_approved),
                            user:                   obj.user,
                            intrdateappr:           { opened: false }
                        });
                    });
                    $scope.latest_intreport = project.intermediary_reports[project.intermediary_reports.length - 1];
                } else {
                    $scope.latest_intreport = {
                        methods:                "[Väliraportin tiedot puuttuvat.]",
                        objectives:             "[Väliraportin tiedot puuttuvat.]",
                        communication:          "[Väliraportin tiedot puuttuvat.]",
                        evaluation:             "[Väliraportin tiedot puuttuvat.]",
                        budget:                 "[Väliraportin tiedot puuttuvat.]",
                        overall_rating_kios:    "[Väliraportin tiedot puuttuvat.]",
                        comments:               "[Väliraportin tiedot puuttuvat.]"
                    };
                }

                if (project.end_report && (typeof project.end_report.date) !== 'undefined') {
                    $scope.audit_date       = new Date(project.end_report.audit.date);
                    $scope.er_approved_date = new Date(project.end_report.approved_date);
                }

                if ((typeof project.ended) !== 'undefined') {
                    
                    $scope.end_notified_date = new Date(project.ended.board_notified);
                    $scope.end_date = new Date(project.ended.end_date);
                }
                if (typeof project.rejected !== 'undefined') {
                    $scope.addedRejections = project.rejected.rejection_categories;
                }
            });
        };

        /**
         * Finds a single page of projects in ascending or descending order.
         *
         * @returns {undefined}
         */
        $scope.find = function () {
            var ordering = $location.search().ordering;
            var ascending = $location.search().ascending;
            var page = $location.search().page;
            if ((typeof ordering) === 'undefined') {
                ordering = 'project_ref';
            }
            if ((typeof ascending) === 'undefined') {
                ascending = 'true';
            }
            if ((typeof page) === 'undefined') {
                page = 1;
            }
            $scope.ordering = ordering;
            $scope.ascending = ascending === 'true';
            $scope.page = page;
            Projects.query({
                ordering: ordering,
                ascending: ascending,
                page: page
            },
                    function (results) {
                        $scope.now = new Date().toISOString();
                        $scope.projects = results;
                    }
            );
        };

        /**
         * Finds project with its _id
         * @returns project-object from server
         */
        $scope.findOne = function () {
            Projects.get({
                projectID: $stateParams.projectID
            }, function (project) {
                $scope.project = project;
                $scope.ensureCompatibility(project);
                var appendices = $scope.project.appendices;
                if (appendices !== undefined && appendices.length > 0) {
                    appendices.forEach(function (appendix) {
                        if (appendix.custom_category ===
                                "TJ:n päätös uudesta hankkeesta") {
                            $scope.regRepExists = true;
                        } else if (appendix.custom_category === "Loppuraportti") {
                            $scope.endRepExists = true;
                        } else if (appendix.category === "Talousraportti") {
                            $scope.financialRepExists = true;
                            if (appendix.mime_type !== "application/pdf") {
                                $scope.nonPDFfinancialRep = true;
                            }
                        }
                    });
                }
                $scope.previousIntReport = undefined;
                if (project.intermediary_reports.length > 0)
                {
                    $scope.previousIntReport = project.intermediary_reports[
                        project.intermediary_reports.length - 1];
                    $scope.addedMethods = $scope.previousIntReport.methods;
                }
                if (typeof $scope.previousIntReport == "undefined")
                {
                    $scope.previousIntReport = {
                        objectives:             "[Väliraportin tiedot puuttuvat.]",
                        communication:          "[Väliraportin tiedot puuttuvat.]",
                        evaluation:             "[Väliraportin tiedot puuttuvat.]",
                        budget:                 "[Väliraportin tiedot puuttuvat.]",
                        overall_rating_kios:    "[Väliraportin tiedot puuttuvat.]",
                        comments:               "[Väliraportin tiedot puuttuvat.]"
                    };
                }
                $scope.project.intermediary_report = $scope.previousIntReport;
                project.end_report.objective            = $scope.previousIntReport.objectives;
                project.end_report.methods              = $scope.previousIntReport.methods;
                project.end_report.indicators           = $scope.previousIntReport.communication;
            });
        };

        /**
         * Like <tt>findOne</tt>, but intended for regreport view only.
         *
         * @returns {undefined}
         */
        $scope.findOneForRegReport = function () {
            Projects.get({
                projectID: $stateParams.projectID
            }, function (project) {
                $scope.project = project;
                OrgProjects.findProjects($scope.project.organisation._id)
                        .success(function (projects) {
                            var pid = $scope.project._id;
                            var projs = [];
                            projects.forEach(function (proj) {
                                if (proj._id !== pid) {
                                    projs.push(proj);
                                }
                            });
                            $scope.other_projects = projs;
                        });
            });
        };

        $scope.duration;

        /**
         * Finds project's intermediary report and puts the given report to
         * $scope.report so that report's details can be shown on intreport.html
         */
        $scope.findOneForIntReport = function () {
            Projects.get({
                projectID: $stateParams.projectID
            }, function (project) {
                $scope.project = project;
                $scope.report = project.intermediary_reports[$stateParams.reportId - 1];
            });
        };

        /**
         * Like findOne, but calculates additionally the duration of the project
         * and writes a string indicating the duration to $scope.duration. This
         * function is used for initializing the data for the end report view.
         *
         * @returns {undefined}
         */
        $scope.findOneForEndReport = function () {
            Projects.get({
                projectID: $stateParams.projectID
            }, function (project) {
                $scope.project = project;
                // We don't need to call ensureCompatibility, because it should
                // be already called because the user should have arrived to the
                // end report view via the project view.
                var signed = $scope.project.signed.date;
                if (!$scope.project.ended) {
                    $scope.duration = $scope.dateToString(signed) + " -";
                } else {
                    var ended = $scope.project.ended.date;
                    var interval = $scope.dateInterval(signed, ended);
                    $scope.duration = $scope.dateToString(signed) + " - " +
                            $scope.dateToString(ended) + " (" +
                            Math.floor(interval / 31536000000) + " v " +
                            Math.round(interval / 2592000000) + " kk)";
                }
                if (project.intermediary_reports.length > 0)
                {
                    var previousIntReport = project.intermediary_reports[
                        project.intermediary_reports.length - 1];
                    $scope.addedMethods = previousIntReport.methods;
                    if (typeof $scope.project.intermediary_report == "undefined")
                    {
                        $scope.project.intermediary_report = {};
                    }
                }
            });
        };

        $scope.other_projects;

        /**
         * Makes sure that the given project conforms to the latest version of
         * the Project schema. If it doesn't, the project will be converted and
         * updated.
         *
         * @param {Project} project The project to be checked.
         * @returns {undefined}
         */
        $scope.ensureCompatibility = function (project) {
            if ((typeof project.schema_version) === "undefined") {
                project.security_level = "Julkinen";
                project.schema_version = 0;
            }
            if (project.schema_version < 0) {
                project.schema_version = 0;
            }
            switch (project.schema_version) {
                case 0: case 1: case 2: case 3: {
                    // The name of this field was changed to prevent confusion
                    // with the similarly named fields in end report state:
                    project.target_group = project.beneficiaries;
                    project.beneficiaries = undefined;
                }
                case 4: {
                    // The name of this field was changed to prevent confusion with
                    // the field "background_check":
                    project.context = project.background;
                    project.background = undefined;
                    if (project.approved && project.approved.approved_by &&
                            project.approved.approved_by === "Halko") {
                        project.approved.approved_by = "Hallituksen kokous";
                    }
                }
                case 5: case 6: {
                    // This field was removed in schema version 7:
                    if (project.approved && project.approved.presented_by) {
                        project.approved.presented_by = undefined;
                    }
                    // The name of this field was changed:
                    if (project.end_report && project.end_report.comments) {
                        project.end_report.proposition = project.end_report.comments;
                        project.end.report.comments = undefined;
                    }
                }
                case 7: case 8: {
                    project.indicators = project.sustainability_risks;
                    project.sustainability_risks = undefined;
                    project.country = project.region;
                    project.region = "";
                }
                case 9: {
                    if (project.state === "loppuraportti") {
                        project.end_report.planned_results =
                                project.end_report.planned_results
                                ? project.end_report.planned_results : "";
                        project.end_report.indicators =
                                project.end_report.indicators
                                ? project.end_report.indicators : "";
                    }
                }
                case 10: {
                    if (project.intermediary_reports) {
                        project.intermediary_reports.forEach(function (intreport) {
                            intreport.objectiveComments = intreport.objectives ?
                                    intreport.objectives[0] : "";
                            intreport.objectives = undefined;
                        });
                    }
                }
                case 11: {
                    if (project.approved) {
                        project.approved.themes_disambiguation = "";
                    }
                    project.schema_version = 12;
                    project.$update(function () {
                    });
                }
            }
            // This is a bugfix for adding payments:
            if (project.approved &&
                    project.approved.granted_sum_eur && !(project.funding.left_eur)) {
                project.funding.left_eur = project.approved.granted_sum_eur;
                project.$update(function () {
                });
            }
        };

        /**
         * Fetches states
         *
         * @param {String}
         * @returns {undefined}
         */
        $scope.findState = function () {
            Projects.get({
                projectID: $stateParams.projectID}, function (project) {
                $http.get('/api/states').success(function (data) {
                    data.forEach(function (state) {
                        if (state.current_state === project.state) {
                            $scope.state = state;
                        }
                    });
                });
            });
        };

        /**
         * Asks for confirmation for project removal. If the user approves the
         * action, the project will be removed (wich cannot be undone).
         *
         * @param {type} project The project to be removed.
         */
        $scope.confirmProjectDeletion = function (project) {
            if (confirm('Haluatko varmasti poistaa hankkeen "' + project.title +
                    '"?')) {
                $scope.remove(project);
            }
        };

        /**
         *
         * @param {type} paymentNumber
         * @param {type} ordinal
         * @returns {undefined}
         */
        $scope.confirmPaymentDeletion = function (paymentNumber, ordinal) {
            if (confirm("Haluatko varmasti poistaa " + ordinal +
                    ". maksun?")) {
                var project = $scope.project;
                var index = project.payments.findIndex(function (payment) {
                    return payment.payment_number === paymentNumber;
                });
                var removed = project.payments.splice(index, 1)[0];
                project.funding.paid_eur -= removed.sum_eur;
                project.funding.left_eur += removed.sum_eur;
                for (; index < project.payments.length; ++index) {
                    project.payments[index].payment_number--;
                }
                project.$update(function (response) {
                });
            }
        };

        /**
         * Asks for confirmation for appendix removal. If the user approves the
         * action, the appendix will be removed (wich cannot be undone).
         *
         * @param {type} url   The URL for appendix access page.
         * @returns {undefined}
         */
        $scope.confirmAppendixDeletion = function (name, url) {
            name = name.trim();
            if (confirm("Haluatko varmasti poistaa liitteen \"" + name + "\"?")) {
                $window.location = url + "&action=delete";
            }
        };

        $scope.remove = function (project) {
            if (project) {
                project.$remove(function (response) {
                    for (var i in $scope.projects) {
                        if ($scope.projects[i] === project) {
                            $scope.projects.splice(i, 1);
                        }
                    }
                    $location.path('projects');
                });
            } else {
                $scope.project.$remove(function (response) {
                    $location.path('projects');
                    $window.location.reload();
                });
            }
        };

        $scope.createIfNotExistent = function (stateObjectName) {
            if (typeof $scope.project[stateObjectName] === "undefined") {
                $scope.project[stateObjectName] = {};
            }
        }

        /**
         * Updates project with "in review" state data
         *
         * @param {type} isValid checks if project creation form is valid
         * @returns {undefined}
         */
        $scope.addReviewState = function (isValid) {
            if (isValid) {
                var project = $scope.project;
                $scope.createIfNotExistent("in_review");
                project.in_review.date = Date.now();
                project.state = $scope.global.newState;
                project.$addReview(function (response) {
                    $location.path('projects/' + response._id);
                });
            }
            else
            {
                alert("Lomakkeen tiedot ovat virheelliset.");
            }
        };

        /**
         * Updates project with "approved" state data
         *
         * @param {type} isValid checks if project creation form is valid
         * @returns {undefined}
         */
        $scope.addApprovedState = function (isValid) {
            if (isValid) {
                var project = $scope.project;
                $scope.createIfNotExistent("approved");
                project.approved.date = Date.now();
                project.approved.approved_date = $scope.approved_date;
                project.approved.approved_date.setHours(0, 0, 0, 0);
                project.approved.board_notified = $scope.board_notified_date;
                project.approved.board_notified.setHours(0, 0, 0, 0);
                project.approved.themes = $scope.themeSelection;
                project.funding.left_eur = project.approved.granted_sum_eur;
                project.state = $scope.global.newState;
                project.$addApproved(function (response) {
                    $location.path('projects/' + response._id)
                });
            }
            else
            {
                alert("Lomakkeen tiedot ovat virheelliset.");
            }
        };

        /**
         * Updates project with "rejected" state data
         *
         * @param {type} isValid checks if project creation form is valid
         * @returns {undefined}
         */
        $scope.addRejectedState = function (isValid) {
            if (isValid) {
                var project = $scope.project;
                $scope.createIfNotExistent("rejected");
                project.rejected.date = Date.now();
                project.rejected.rejection_categories = $scope.addedRejections;
                project.state = $scope.global.newState;
                project.$addRejected(function (response) {
                    $location.path('projects/' + response._id);
                });
            }
            else
            {
                alert("Lomakkeen tiedot ovat virheelliset.");
            }
        };

        /**
         * Updates project with data related to the state "signed".
         *
         * @param {type} isValid checks if project creation form is valid
         * @returns {undefined}
         */
        $scope.addSignedState = function (isValid) {
            if (isValid) {
                var project = $scope.project;
                $scope.createIfNotExistent("signed");
                project.signed.signed_date = $scope.signed_date;
                project.signed.signed_date.setHours(0, 0, 0, 0);

                project.signed.date = Date.now();
                $scope.parsedDeadlines = [];
                $scope.parsedPlannedPayments = [];
                var plpms = $scope.plannedPayments;
                for (var i = 0; i < plpms.length; i++) {
                    var payment_date = plpms[i].date;
                    payment_date.setHours(0, 0, 0, 0);
                    $scope.parsedPlannedPayments.push({
                        date: payment_date,
                        sum_eur: plpms[i].sum_eur,
                        sum_local: plpms[i].sum_local
                    });
                }
                project.signed.planned_payments = $scope.parsedPlannedPayments;
                var dls = $scope.deadlines;
                for (var i = 0; i < dls.length; i++) {
                    var deadline_date = dls[i].date;
                    deadline_date.setHours(0, 0, 0, 0);
                    $scope.parsedDeadlines.push({
                        report: dls[i].report,
                        date: deadline_date
                    });
                }
                project.signed.intreport_deadlines = $scope.parsedDeadlines;

                project.state = $scope.global.newState;
                project.$addSigned(function (response) {

                    $location.path('projects/' + response._id);
                });
            }
            else
            {
                alert("Lomakkeen tiedot ovat virheelliset.");
            }
        };

        /**
         * Adds payment to project
         *
         * @param {type} isValid checks if project creation form is valid
         * @returns {undefined}
         */
        $scope.addPaymentInfo = function (isValid) {
            if (isValid) {
                var project = $scope.project;
                project.payment.payment_date = $scope.payment_date;
                project.payment.payment_date.setHours(0, 0, 0, 0);

                var index = project.payments.length;
                if (index === undefined) {
                    project.payment.payment_number = 1;
                } else {
                    project.payment.payment_number = project.payments.length + 1;
                }
                project.$addPayment(function (response) {
                });
            }
            else
            {
                alert("Lomakkeen tiedot ovat virheelliset.");
            }
        };

        // TODO: Make this stuff work instead of direct HTTP requests in order
        // enable access control through client-side services and server-side
        // routes:
//        $scope.addAppendix = function (valid) {
//            if (valid) {
//                $scope.project.$addAppendix();
//            }
//        }
//
//        $scope.accessAppendix = function (url) {
////            $scope.project.$accessAppendix(url + "&action=download");
//        }

        /**
         * Updates project with "int report" state data
         *
         * @param {type} isValid checks if project creation form is valid
         * @returns {undefined}
         */
        $scope.addIntReportState = function (isValid) {
            if (isValid) {
                var project = $scope.project;
                project.intermediary_report.date = Date.now();

                if (typeof $scope.intr_approved_date !== 'undefined') {
                    project.intermediary_report.date_approved = $scope.intr_approved_date;
                    project.intermediary_report.date_approved.setHours(0, 0, 0, 0);
                }

                project.state = $scope.global.newState;
                project.intermediary_report.methods = $scope.addedMethods;
                var index = project.intermediary_reports.length;
                if (index === undefined || index === 0) {
                    project.intermediary_report.reportNumber = 1;
                } else {
                    project.intermediary_report.reportNumber =
                            project.intermediary_reports.length + 1;
                }

                project.$addIntReport(function (response) {
                    $location.path('projects/' + response._id);
                });
            }
            else
            {
                alert("Lomakkeen tiedot ovat virheelliset.");
            }
        };

        /**
         * Updates project with "end report" state data
         *
         * @param {type} isValid checks if project creation form is valid
         * @returns {undefined}
         */
        $scope.addEndReportState = function (isValid) {
            if (isValid) {
                var project = $scope.project;
                $scope.createIfNotExistent("end_report");
                project.end_report.date = Date.now();
                project.state = $scope.global.newState;

                if (typeof $scope.audit_date !== 'undefined') {
                    var aDate = $scope.audit_date;
                    aDate.setHours(0, 0, 0, 0);
                    project.end_report.audit = {
                        date: aDate
                    }
                }

                if (typeof $scope.er_approved_date !== 'undefined') {
                    project.end_report.approved_date = $scope.er_approved_date;
                    project.end_report.approved_date.setHours(0, 0, 0, 0);
                }                

                project.$addEndReport(function (response) {
                    $location.path('projects/' + response._id);
                });
            }
            else
            {
                alert("Lomakkeen tiedot ovat virheelliset.");
            }
        };

        /**
         * Updates project with "ended" state data
         *
         * @param {type} isValid checks if project creation form is valid
         * @returns {undefined}
         */
        $scope.addEndedState = function (isValid) {
            if (isValid) {
                var project = $scope.project;
                $scope.createIfNotExistent("ended");
                project.ended.date = Date.now();

                if (typeof $scope.end_notified_date !== 'undefined') {
                    project.ended.board_notified = $scope.end_notified_date;
                    project.ended.board_notified.setHours(0, 0, 0, 0);
                }

                if (typeof $scope.end_date !== 'undefined') {
                    project.ended.end_date = $scope.end_date;
                    project.ended.end_date.setHours(0, 0, 0, 0);
                }

                project.state = $scope.global.newState;
                project.$addEnded(function (response) {
                    $location.path('projects/' + response._id);
                });
            }
            else
            {
                alert("Lomakkeen tiedot ovat virheelliset.");
            }
        };
        $scope.changeState = function (changeTo) {
            Projects.get({
                projectID: $stateParams.projectID
            }, function (project) {
                $scope.project = project;
                $scope.global.newState = changeTo;
                $location.path('projects/' + project._id + "/change");
            });
        };
        $scope.addMethod = function () {
            $scope.addedMethods.push({name: '', level: '', comment: ''});
        };
        $scope.removeMethod = function () {
            $scope.addedMethods.splice(-1, 1);
        };
        $scope.addRejection = function () {
            $scope.addedRejections.push({rejection: ''});
        };
        $scope.removeRejection = function () {
            $scope.addedRejections.splice(-1, 1);
        };
        $scope.addPlannedPayment = function () {
            $scope.plannedPayments.push({
                date: $scope.currentDate,
                sum_eur: 0,
                picker: { opened: false }
            });
        };
        $scope.removePlannedPayment = function () {
            $scope.plannedPayments.splice(-1, 1);
        };
        $scope.addDeadline = function () {
            $scope.deadlines.push({
                report: ($scope.deadlines.length + 1) + '. väliraportti',
                date: $scope.currentDate,
                picker: { opened: false }
            });
        };
        $scope.removeDeadline = function () {
            $scope.deadlines.splice(-1, 1);
        };
        $scope.addNewOrg = function () {
            $scope.newOrg = true;
            $scope.orgs = null;
        };
        $scope.addOrgFromDb = function () {
            $scope.newOrg = false;
            Organisations.getOrganisationNames(function (organisations) {
                $scope.orgs = organisations;
            });
        };

        /**
         * Checks if the given string is non empty. Undefined or "" will be
         * interpreted as an empty string.
         *
         * @param {type} string The string to check.
         * @returns {Boolean}
         */
        $scope.nonEmpty = function (string) {
            return ((typeof string) !== "undefined") && (string !== "");
        };

        /**
         * <tt>true</tt> if and only if the regreport has already been added as
         * an appendix for the current project. In that case, creating a new
         * regreport is not allowed (unless the current one is deleted first).
         * The default value for this variable is <tt>false</tt> and the value
         * is updated in the function <tt>findOne</tt>.
         */
        $scope.regRepExists = false;

        /**
         * <tt>true</tt> if and only if there exists an end report for the
         * current project as an appendix.
         */
        $scope.endRepExists = false;

        /**
         * <tt>true</tt> if and only if there exists a financial report for this
         * project and has a MIME type other than <tt>application/pdf</tt>.
         */
        $scope.nonPDFfinancialReport = false;

        /**
         * Creates a new PDF report it there isn't already a corresponding
         * report saved as an appendix.
         */
        $scope.createPDF = function (report) {
            switch (report) {
                case "reg":
                    if ($scope.regRepExists) {
                        $window.alert("Raportti on jo tallennettu. (Katso liitteet.)");
                        break;
                    }
                    $scope.project.$regRepPDF(function (response) {
                        $window.location.reload();
                    });
                    break;
                case "end":
                    if ($scope.endRepExists) {
                        $window.alert("Raportti on jo tallennettu. (Katso liitteet.)");
                        break;
                    }
                    if ($scope.nonPDFfinancialRep) {
                        $window.alert("Talousraportin tulee olla PDF-muodossa.");
                        break;
                    }
                    $scope.project.$endRepPDF(function (response) {
                        $window.location.reload();
                    });
                    break;
                case "int":
                    $window.alert("Ominaisuutta ei ole toteutettu.");
                    break;
                default:
                    break;
            }
        };

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
         * Updates the page number and reloads the view.
         *
         * @param {String} page Number of the page to be displayed.
         */
        $scope.updatePage = function (page) {
            $window.location = '/projects?ordering=' + $scope.ordering
                    + '&ascending=' + $scope.ascending
                    + '&page=' + page;
        };

        /**
         * Updates the ordering and reloads the view.
         *
         * @param {String} ordering The ordering predicate (eg. "project_ref").
         */
        $scope.updateOrdering = function (ordering) {
            $window.location = '/projects?ordering=' + ordering
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
            Projects.countProjects(function (result) {
                var numberOfPages, pagination;
                numberOfPages = Math.ceil(result.projectCount / $scope.pageSize);
                pagination = document.getElementById('pagination');
                $scope.pages = [];
                for (var i = 1; i <= numberOfPages; ++i) {
                    $scope.pages.push({number: i});
                }
            });
        };

        /**
         * The property used for sorting the appendices in their table.
         */
        $scope.property = "category";

        /**
         * <tt>true</tt> iff the order of appendices should be reversed.
         */
        $scope.reverse = false;

        /**
         * Sorts the appendices by the given property. If they were previously
         * sorted by the same property, the order will be reversed. Unlike
         * <tt>updateOrdering</tt>, this function does not cause a page reload.
         * Also, the GET parameters won't be changed.
         *
         * @param {String} property The property used for sorting
         * @returns {undefined}
         */
        $scope.sortBy = function (property) {
            $scope.reverse = ($scope.property === property) ? !$scope.reverse : false;
            $scope.property = property;
        };

        /**
         * Prints the names of the invalid fields of an input form to the
         * console.
         *
         * @param {type} form
         * @returns {undefined}
         */
        $scope.printInvalidFields = function (form) {
            var invalids = "";
            Object.keys(form).forEach(function (fieldName) {
                if (!fieldName.startsWith("$") && !fieldName.startsWith("$$") &&
                        !fieldName.startsWith("_") && form[fieldName].$invalid) {
                    invalids += fieldName + ", ";
                }
            });
            if (invalids !== "") {
                console.log("The following fields have invalid values:\n\n"
                        + invalids);
            } else {
                console.log("All fields have valid values.");
            }
        }
    }

]);
