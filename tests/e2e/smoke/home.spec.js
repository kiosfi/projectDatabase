describe('Project test home page', function(){
  it('title should contain KIOS', function(){
    browser.get('/');    
    expect(browser.getTitle()).toMatch('KIOS');
  });
});
