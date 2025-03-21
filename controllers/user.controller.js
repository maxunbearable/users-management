'use strict';

angular.module('userApp')
    .controller('UserController', ['$scope', '$rootScope', 'UserService', '$stateParams', function($scope, $rootScope, UserService, $stateParams) {
        $scope.showModal = false;
        $scope.modalTitle = 'Create new user';
        $scope.modalMode = 'create';
        $scope.currentUser = null;
        $scope.serverErrors = null;

        $scope.user = {
            username: '',
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            user_type: ''
        };

        $scope.users = [];

        function loadUsers() {
            UserService.getUsers().then((users) => {
                $scope.users = users;
                if ($stateParams.editId) {
                    $scope.openEditModal($stateParams.editId);
                }
            });
        }

        loadUsers();

        $scope.openCreateModal = () => {
            $scope.modalMode = 'create';
            $scope.modalTitle = 'Create new user';
            $scope.user = {
                username: '',
                first_name: '',
                last_name: '',
                email: '',
                password: '',
                user_type: 'Driver'
            };
            $scope.serverErrors = null;
            $scope.showModal = true;
        };

        $scope.openEditModal = (id) => {
            UserService.getUser(id).then((user) => {
                $scope.modalMode = 'edit';
                $scope.modalTitle = 'Edit user';
                $scope.user = angular.copy(user);
                $scope.currentUser = user;
                $scope.serverErrors = null;
                $scope.showModal = true;
            });
        };

        $scope.closeModal = () => {
            $scope.showModal = false;
            $scope.user = {};
            $scope.serverErrors = null;
        };

        $scope.saveUser = () => {
            if ($scope.modalMode === 'create') {
                UserService.createUser($scope.user)
                    .then(() => {
                        loadUsers();
                        $scope.closeModal();
                    })
                    .catch((errors) => {
                        $scope.serverErrors = errors;
                    });
            } else {
                UserService.updateUser($scope.user)
                    .then(() => {
                        loadUsers();
                        $scope.closeModal();
                    })
                    .catch((errors) => {
                        $scope.serverErrors = errors;
                    });
            }
        };

        $scope.deleteUser = (id) => {
            if (confirm('Are you sure you want to delete this user?')) {
                UserService.deleteUser(id).then(() => {
                    loadUsers();
                }).catch((error) => {
                    if (error === 'Cannot delete admin user') {
                        $state.go('error-403');
                    }
                });
            }
        };

        $scope.viewUser = (id) => {
            $rootScope.$broadcast('viewUser', id);
        };
    }]);