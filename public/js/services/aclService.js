angular.module('aclService', [])
  .factory('Acl', function($http) {
    return {
      get: function() {
        return $http.get('/api/acl');
      },
      create: function(aclData) {
        return $http.post('/api/acl', aclData);
      },
      delete: function() {
        return $http.delete('/api/acl/' + '1');
      }
    }
  });