describe('The baby-tech team', function() {
  'use strict';
  it('has adam', function() {
    var name = 'adam';
    expect(name).toEqual('adam');
  });
  it('has kelvin', function() {
    var name = 'kelvin';
    expect(name).toEqual('kelvin');
  });
  it('does not have anthony', function() {
    var name = 'anthony';
    expect(name).toNotEqual('spock');
  });
});
