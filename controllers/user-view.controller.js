'use strict';

angular.module('userApp')
    .controller('UserViewController', ['$scope', '$state', 'UserService', 'user', function($scope, $state, UserService, user) {
        $scope.user = user;

        $scope.deleteUser = () => {
            if (confirm('Are you sure you want to delete this user?')) {
                UserService.deleteUser(user.id).then(() => {
                    $state.go('users');
                }).catch((error) => {
                    if (error === 'Cannot delete admin user') {
                        $state.go('error-403');
                    }
                });
            }
        };
    }]);