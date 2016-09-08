'use strict';

angular
  .module('AclController', ['dndLists'])
  .controller('AclController', AclController);

function AclController($scope, $http) {
  $scope.actions = ['Deny', 'Allow'];
  $scope.cidrChoices = [32,28,24,21,16,8];
  // use to edit potential touch dnd
  $scope.hoverable = true;

  $http.get('/api/acl')
    .success(function(data) {
      $scope.acl = data;
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });

  $scope.hoverAddBtn = function(bool, index) {
    bool ? $scope.hoverIndex = index : $scope.hoverIndex = null;
  };

  $scope.closeAll = function() {
    $scope.hoverable = true;
    $scope.insertIndex = '';
  };

  $scope.dragging = function(index) {
    $scope.lastDragged = index;
  };

  $scope.insertItem = function(index) {
    $scope.hoverable = false;
    $scope.insertIndex = index;
    // $first not working?? so newItem is modified
    $scope.newItem = {action: $scope.actions[0], ip: '', cidr: $scope.cidrChoices[0]};
    $scope.currentItem = null;
  };

  $scope.editItem = function(item) {
    $scope.hoverable = false;
    $scope.addNew = false;
    $scope.insertIndex = '';
    $scope.currentItem = item;
    $scope.originalItem = angular.copy(item);
    $scope.changeItem = angular.extend({}, item);
  };

  $scope.deleteItem = function(index) {
    $http.delete('/api/acl/' + index)
      .success(function(data) {
        $scope.acl = data;
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  };

  $scope.saveItem = function(item, index) {
    $scope.hoverable = true;
    // check if there are any changes
    if ($scope.originalItem != null && item.action === $scope.originalItem.action && item.ip === $scope.originalItem.ip && item.cidr === $scope.originalItem.cidr) {
        $scope.currentItem = null;
        return;
    };
    $http.put('/api/acl', {item: item, index: index})
      .success(function(data) {
        $scope.acl = data;
      })
      .error(function(data) {
        console.log('Error: ' + data);  
      });
  };

  $scope.createItem = function(item, index) {
    $http.post('/api/acl', {item: item, index: index})
      .success(function(data) {
        $scope.acl = data;
      })
      .error(function(data) {
        console.log('Error: ' + data);  
      });
    $scope.insertIndex = '';
    $scope.newItem = null;
    $scope.hoverable = true;
  };

  $scope.dragItem = function(index) {
    if (index === $scope.lastDragged) {
        return;
    };
    $http.put('/api/acl-dnd', {index: index, lastDragged: $scope.lastDragged})
      .success(function(data) {
      // retrieve data on success might not be necessary for smoother dnd animation
        $scope.acl = data;
      })
      .error(function(data) {
        console.log('Error: ' + data);  
      });
  };

};
