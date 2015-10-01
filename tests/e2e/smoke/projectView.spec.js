describe('Project view page', function() {
    it('should show name and details of project', function() {
        browser.get('/projects');

        var elem = element.all(by.repeater('project in projects')).
          get(0).
          element(by.linkText('{{project.title}}')).
          click();
          console.log(elem);
    })
})
