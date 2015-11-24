var jasmineReporters = require('jasmine-reporters');


exports.config = {
    baseUrl: 'http://localhost:3002',
    framework: 'jasmine2',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: [
        '../../e2e/helpers.e2e.js', '../../e2e/**/*.spec.js'
    ],
    multiCapabilities: [
//        {
//            browserName: 'chrome'
//        },
        {
            browserName: 'firefox'
        }
    ],
    onPrepare: function () {
        //Creates independent results files for each browser
        //Otherwise they run at the same time and overwrite each other
        browser.manage().window().maximize();

        var capsPromise = browser.getCapabilities();

        return capsPromise.then(function (caps) {
            var browserName = caps.caps_.browserName;
            var browserVersion = caps.caps_.version;
            var browserPrefix = browserName + '-' + browserVersion + '-';
            jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
                savePath: 'tests/results/e2e/junit',
                filePrefix: browserPrefix,
                consolidateAll: false
            }));
        });
    }
};
