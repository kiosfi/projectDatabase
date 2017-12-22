'use strict';

angular.module('mean.projects').controller('ProjectsController', ['$scope',
    '$stateParams', '$location', '$window', '$q', '$http', '$filter', 'Global',
    'Projects', 'OrgProjects', 'MeanUser', 'Circles', 'Organisations',
    function ($scope, $stateParams, $location, $window, $q, $http, $filter,
            Global, Projects, OrgProjects, MeanUser, Circles, Organisations) {
        $scope.global = Global;

        $http.get("projects/assets/json/projectConstants.json").success(
                function (response) {
                    $scope.securityLevels = response.security_levels;
                    $scope.currencyUnits = response.currency_units;
                    $scope.themes = response.themes;
                    $scope.methodNames = response.method_names;
                    $scope.methodLevels = response.method_levels;
                    $scope.rejCategories = response.rej_categories;
                    $scope.fieldNames = response.field_names;
                    $scope.appendixCategories = response.appendix_categories;
                }
        );

        $scope.addedMethods = [];
        $scope.plannedPayments = [];
        $scope.deadlines = [];
        $scope.themeSelection = [];
        $scope.objectiveComments = [];
        $scope.addedRejections = [];
        $scope.currentDate = new Date();

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
         * These date fields are used in the project creation form. The default
         * values correspond to the current date (generated during runtime).
         */
        $scope.register_year = now.getFullYear();
        $scope.register_month = now.getMonth() + 1;
        $scope.register_day = now.getDate();

        /**
         * These date fields are used in the payment addition form at the
         * project view. The default values correspond to the current date
         * (generated during runtime).
         */
        $scope.payment_year = now.getFullYear();
        $scope.payment_month = now.getMonth() + 1;
        $scope.payment_day = now.getDate();

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
                project.schema_version = 8;

                var reg_date = $scope.convertDate(
                        $scope.register_day,
                        $scope.register_month,
                        $scope.register_year
                );
                project.reg_date = reg_date;

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
                    if ($scope.projectEditForm.approved_day.$dirty
                            || $scope.projectEditForm.approved_month.$dirty
                            || $scope.projectEditForm.approved_year.$dirty) {
                        project.approved.approved_date = $scope.convertDate(
                                $scope.approved_day,
                                $scope.approved_month,
                                $scope.approved_year
                        );
                    }

                    if ($scope.projectEditForm.board_notified_day.$dirty
                            || $scope.projectEditForm.board_notified_month.$dirty
                            || $scope.projectEditForm.board_notified_year.$dirty) {
                        project.approved.board_notified = $scope.convertDate(
                                $scope.notified_day,
                                $scope.notified_month,
                                $scope.notified_year
                        );
                    }

                    project.approved.themes = $scope.themeSelection;
                }

                if ((typeof project.signed) !== 'undefined') {
                    if ($scope.projectEditForm.signed_date_day.$dirty
                            || $scope.projectEditForm.signed_date_day.$dirty
                            || $scope.projectEditForm.signed_date_day.$dirty) {
                        project.signed.signed_date = $scope.convertDate(
                                $scope.signed_day,
                                $scope.signed_month,
                                $scope.signed_year
                        );
                    }

                    project.signed.intreport_deadlines = [];
                    angular.forEach($scope.deadlines, function (obj) {
                        project.signed.intreport_deadlines.push({
                            report: obj.report,
                            date: $scope.convertDate(
                                    obj.deadline_day,
                                    obj.deadline_month,
                                    obj.deadline_year
                            )
                        });
                    });

                    project.signed.planned_payments = [];
                    angular.forEach($scope.plannedPayments, function (obj) {
                        project.signed.planned_payments.push({
                            date: $scope.convertDate(
                                    obj.planned_day,
                                    obj.planned_month,
                                    obj.planned_year
                            ),
                            sum_eur: obj.sum_eur
                        });
                    });
                }

                if (project.intermediary_reports &&
                        project.intermediary_reports.length > 0) {
                    project.intermediary_reports = [];

                    angular.forEach($scope.int_reports, function (report) {
                        project.intermediary_reports.push({
                            methods: report.methods,
                            overall_rating_kios: report.overall_rating_kios,
                            objectives: report.objectives,
                            communication: report.communication,
                            evaluation: report.evaluation,
                            budget: report.budget,
                            comments: report.comments,
                            approved_by: report.approved_by,
                            date_approved: $scope.convertDate(
                                    report.date_day,
                                    report.date_month,
                                    report.date_year
                            ),
                            reportNumber: report.reportNumber,
                            user: report.user,
                            date: report.date});
                    });
                }

                if (project.end_report &&
                        (typeof project.end_report.date) !== 'undefined') {
                    if ($scope.projectEditForm.audit_day.$dirty
                            || $scope.projectEditForm.audit_month.$dirty
                            || $scope.projectEditForm.audit_year.$dirty) {
                        project.end_report.audit.date = $scope.convertDate(
                                $scope.audit_day,
                                $scope.audit_month,
                                $scope.audit_year
                        );
                    }

                    if ($scope.projectEditForm.er_approved_day.$dirty ||
                            $scope.projectEditForm.er_approved_month.$dirty
                            || $scope.projectEditForm.er_approved_year.$dirty) {

                        project.end_report.approved_date = $scope.convertDate(
                                $scope.er_approved_day,
                                $scope.er_approved_month,
                                $scope.er_approved_year
                        );
                    }
                }

                if ((typeof project.ended) !== 'undefined') {
                    if ($scope.projectEditForm.endNotifiedDay.$dirty
                            || $scope.projectEditForm.endNotifiedMonth.$dirty ||
                            $scope.projectEditForm.endNotifiedYear.$dirty) {
                        project.ended.board_notified = $scope.convertDate(
                                $scope.end_notified_day,
                                $scope.end_notified_month,
                                $scope.end_notified_year
                        );
                    }

                    if ($scope.projectEditForm.endDay.$dirty
                            || $scope.projectEditForm.endMonth.$dirty
                            || $scope.projectEditForm.endYear.$dirty) {
                        project.ended.end_date = $scope.convertDate(
                                $scope.end_day,
                                $scope.end_month,
                                $scope.end_year
                        );
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
                    var date = new Date(project.approved.approved_date);
                    $scope.approved_day = date.getDate();
                    $scope.approved_month = date.getMonth() + 1;
                    $scope.approved_year = date.getFullYear();

                    var notified_date = new Date(project.approved.board_notified);
                    $scope.notified_day = notified_date.getDate();
                    $scope.notified_month = notified_date.getMonth() + 1;
                    $scope.notified_year = notified_date.getFullYear();

                    angular.forEach(project.approved.themes, function (obj) {
                        $scope.themeSelection.push(obj);
                    });
                }

                if ((typeof project.signed) !== 'undefined') {
                    var date = new Date(project.signed.signed_date);
                    $scope.signed_day = date.getDate();
                    $scope.signed_month = date.getMonth() + 1;
                    $scope.signed_year = date.getFullYear();

                    angular.forEach(project.signed.planned_payments, function (obj) {
                        var date = new Date(obj.date);
                        $scope.plannedPayments.push({
                            planned_day: date.getDate(),
                            planned_month: date.getMonth() + 1,
                            planned_year: date.getFullYear(),
                            sum_eur: obj.sum_eur
                        });
                    });
                    angular.forEach(project.signed.intreport_deadlines, function (obj) {
                        var date = new Date(obj.date);
                        $scope.deadlines.push({
                            report: obj.report,
                            deadline_day: date.getDate(),
                            deadline_month: date.getMonth() + 1,
                            deadline_year: date.getFullYear()
                        });
                    });
                }

                if (project.intermediary_reports && project.intermediary_reports.length > 0) {
                    angular.forEach(project.intermediary_reports, function (obj) {
                        var date = new Date(obj.date_approved);
                        $scope.int_reports.push({
                            methods: obj.methods,
                            objectives: obj.objectives,
                            communication: obj.communication,
                            evaluation: obj.evaluation,
                            budget: obj.budget,
                            overall_rating_kios: obj.overall_rating_kios,
                            comments: obj.comments,
                            approved_by: obj.approved_by,
                            date_day: date.getDate(),
                            date_month: date.getMonth() + 1,
                            date_year: date.getFullYear(),
                            reportNumber: obj.reportNumber,
                            date: obj.date,
                            user: obj.user
                        });
                    });
                }

                if (project.end_report && (typeof project.end_report.date) !== 'undefined') {
                    var date = new Date(project.end_report.approved_date);
                    $scope.er_approved_day = date.getDate();
                    $scope.er_approved_month = date.getMonth() + 1;
                    $scope.er_approved_year = date.getFullYear();

                    var audit_date = new Date(project.end_report.audit.date);
                    $scope.audit_day = audit_date.getDate();
                    $scope.audit_month = audit_date.getMonth() + 1;
                    $scope.audit_year = audit_date.getFullYear();
                }

                if ((typeof project.ended) !== 'undefined') {
                    var date = new Date(project.ended.end_date);
                    $scope.end_day = date.getDate();
                    $scope.end_month = date.getMonth() + 1;
                    $scope.end_year = date.getFullYear();

                    var notified_date = new Date(project.ended.board_notified);
                    $scope.end_notified_day = notified_date.getDate();
                    $scope.end_notified_month = notified_date.getMonth() + 1;
                    $scope.end_notified_year = notified_date.getFullYear();
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
                if (project.intermediary_reports.length > 0)
                {
                    var previousIntReport = project.intermediary_reports[
                        project.intermediary_reports.length - 1];
                    $scope.addedMethods = previousIntReport.methods;
                    if (typeof $scope.project.intermediary_report == "undefined")
                    {
                        $scope.project.intermediary_report = {};
                    }
                    $scope.project.intermediary_report.objectiveComments = 
                            previousIntReport.objectiveComments;
                    $scope.project.intermediary_report.communication =
                            previousIntReport.communication;
                    $scope.project.intermediary_report.budget =
                            previousIntReport.budget;
                    $scope.project.intermediary_report.evaluation =
                            previousIntReport.evaluation;
                }
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
            }
            if (project.schema_version < 4) {
                // The name of this field was changed to prevent confusion with
                // the similarly named fields in end report state:
                project.target_group = project.beneficiaries;
                project.beneficiaries = undefined;
            }
            if (project.schema_version < 5) {
                // The name of this field was changed to prevent confusion with
                // the field "background_check":
                project.context = project.background;
                project.background = undefined;
                if (project.approved && project.approved.approved_by &&
                        project.approved.approved_by === "Halko") {
                    project.approved.approved_by = "Hallituksen kokous";
                }
            }
            if (project.schema_version < 7) {
                // This field was removed in schema version 7:
                if (project.approved.presented_by) {
                    project.approved.presented_by = undefined;
                }
                // The name of this field was changed:
                if (project.end_report.comments) {
                    project.end_report.proposition = project.end_report.comments;
                    project.end.report.comments = undefined;
                }
            }
            if (project.schema_version < 9) {
                project.schema_version = 9;
                project.indicators = project.sustainability_risks;
                project.sustainability_risks = undefined;
                project.country = project.region;
                project.region = "";
            }
            if (project.schema_version < 10) {
                if (project.state === "loppuraportti") {
                    project.end_report.planned_results =
                            project.end_report.planned_results
                            ? project.end_report.planned_results : "";
                    project.end_report.indicators =
                            project.end_report.indicators
                            ? project.end_report.indicators : "";
                }
            }
            if (project.schema_version < 11) {
                if (project.intermediary_reports) {
                    project.intermediary_reports.forEach(function (intreport) {
                        intreport.objectiveComments = intreport.objectives ? 
                                intreport.objectives[0] : "";
                        intreport.objectives = undefined;
                    });
                }
                project.schema_version = 11;
                project.$update(function () {
                });
            }
            // This is a bugfix for adding payments:
            if (project.approved.granted_sum_eur && !(project.funding.left_eur)) {
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

        /**
         * Updates project with "in review" state data
         *
         * @param {type} isValid checks if project creation form is valid
         * @returns {undefined}
         */
        $scope.addReviewState = function (isValid) {
            if (isValid) {
                var project = $scope.project;
                project.in_review.date = Date.now();
                project.state = $scope.global.newState;
                project.$addReview(function (response) {
                    $location.path('projects/' + response._id);
                });
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
                project.approved.date = Date.now();
                if (((typeof $scope.approved_day) !== 'undefined') &&
                        ((typeof $scope.approved_month) !== 'undefined') &&
                        ((typeof $scope.approved_year) !== 'undefined')) {
                    project.approved.approved_date = $scope.convertDate(
                            $scope.approved_day,
                            $scope.approved_month,
                            $scope.approved_year
                    );
                }

                if (((typeof $scope.notified_day) !== 'undefined') &&
                        ((typeof $scope.notified_month) !== 'undefined') &&
                        ((typeof $scope.notified_year) !== 'undefined')) {
                    project.approved.board_notified = $scope.convertDate(
                            $scope.notified_day,
                            $scope.notified_month,
                            $scope.notified_year
                    );
                }
                project.approved.themes = $scope.themeSelection;
                project.funding.left_eur = project.approved.granted_sum_eur;
                project.state = $scope.global.newState;
                project.$addApproved(function (response) {
                    $location.path('projects/' + response._id)
                });
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
                project.rejected.date = Date.now();
                project.rejected.rejection_categories = $scope.addedRejections;
                project.state = $scope.global.newState;
                project.$addRejected(function (response) {
                    $location.path('projects/' + response._id);
                });
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

                if (((typeof $scope.signed_day) !== 'undefined') &&
                        ((typeof $scope.signed_month) !== 'undefined') &&
                        ((typeof $scope.signed_year) !== 'undefined')) {
                    project.signed.signed_date = $scope.convertDate(
                            $scope.signed_day,
                            $scope.signed_month,
                            $scope.signed_year
                    );
                }

                project.signed.date = Date.now();
                $scope.parsedDeadlines = [];
                $scope.parsedPlannedPayments = [];
                var plpms = $scope.plannedPayments;
                for (var i = 0; i < plpms.length; i++) {
                    var pp = $scope.convertDate(
                            plpms[i].day, plpms[i].month, plpms[i].year
                    );
                    $scope.parsedPlannedPayments.push({
                        date: pp, sum_eur: plpms[i].sum_eur,
                        sum_local: plpms[i].sum_local
                    });
                }
                project.signed.planned_payments = $scope.parsedPlannedPayments;
                var dls = $scope.deadlines;
                for (var i = 0; i < dls.length; i++) {
                    var dl = $scope.convertDate(
                            dls[i].day, dls[i].month, dls[i].year
                    );
                    $scope.parsedDeadlines.push({report: dls[i].report, date: dl});
                }
                project.signed.intreport_deadlines = $scope.parsedDeadlines;
                project.state = $scope.global.newState;
                project.$addSigned(function (response) {

                    $location.path('projects/' + response._id);
                });
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
                var payment_date = $scope.convertDate(
                        $scope.payment_day,
                        $scope.payment_month,
                        $scope.payment_year
                );
                project.payment.payment_date = payment_date;
                var index = project.payments.length;
                if (index === undefined) {
                    project.payment.payment_number = 1;
                } else {
                    project.payment.payment_number = project.payments.length + 1;
                }
                project.$addPayment(function (response) {
                });
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

                if (((typeof $scope.intRDateAppr_day) !== 'undefined') &&
                        ((typeof $scope.intRDateAppr_month) !== 'undefined') &&
                        ((typeof $scope.intRDateAppr_year) !== 'undefined')) {
                    project.intermediary_report.date_approved = $scope.convertDate(
                            $scope.intRDateAppr_day,
                            $scope.intRDateAppr_month,
                            $scope.intRDateAppr_year
                    );
                }

                project.state = $scope.global.newState;
                project.intermediary_report.methods = $scope.addedMethods;
                project.intermediary_report.objectives = $scope.objectiveComments;
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
                project.end_report.date = Date.now();
                project.state = $scope.global.newState;

                if (((typeof $scope.er_approved_day) !== 'undefined') &&
                        ((typeof $scope.er_approved_month) !== 'undefined') &&
                        ((typeof $scope.er_approved_year) !== 'undefined')) {
                    project.end_report.approved_date = $scope.convertDate(
                            $scope.er_approved_day,
                            $scope.er_approved_month,
                            $scope.er_approved_year
                    );
                }

                if (((typeof $scope.audit_day) !== 'undefined') &&
                        ((typeof $scope.audit_month) !== 'undefined') &&
                        ((typeof $scope.audit_year) !== 'undefined')) {
                    project.end_report.audit.date = $scope.convertDate(
                            $scope.audit_day,
                            $scope.audit_month,
                            $scope.audit_year
                    );
                }

                project.$addEndReport(function (response) {
                    $location.path('projects/' + response._id);
                });
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
                project.ended.date = Date.now();

                if (((typeof $scope.end_day) !== 'undefined') &&
                        ((typeof $scope.end_month) !== 'undefined') &&
                        ((typeof $scope.end_year) !== 'undefined')) {
                    project.ended.end_date = $scope.convertDate(
                            $scope.end_day,
                            $scope.end_month,
                            $scope.end_year
                    );
                }

                if (((typeof $scope.notified_day) !== 'undefined') &&
                        ((typeof $scope.notified_month) !== 'undefined') &&
                        ((typeof $scope.notified_year) !== 'undefined')) {
                    project.ended.board_notified = $scope.convertDate(
                            $scope.end_notified_day,
                            $scope.end_notified_month,
                            $scope.end_notified_year
                    );
                }

                project.state = $scope.global.newState;
                project.$addEnded(function (response) {
                    $location.path('projects/' + response._id);
                });
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
                day: $scope.currentDate.getDate(),
                month: $scope.currentDate.getMonth() + 1,
                year: $scope.currentDate.getFullYear(),
                sum_eur: 0
            });
        };
        $scope.removePlannedPayment = function () {
            $scope.plannedPayments.splice(-1, 1);
        };
        $scope.addDeadline = function () {
            $scope.deadlines.push({
                report: ($scope.deadlines.length + 1) + '. väliraportti',
                day: $scope.currentDate.getDate(),
                month: $scope.currentDate.getMonth() + 1,
                year: $scope.currentDate.getFullYear()
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
