'use strict';

angular.module('userApp', ['ui.router'])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('users', {
                url: '/users',
                templateUrl: 'templates/user-list.html',
                controller: 'UserController',
                params: {
                    editId: null
                }
            })
            .state('view', {
                url: '/users/:id',
                templateUrl: 'templates/user-view.html',
                controller: 'UserViewController',
                resolve: {
                    user: ['$stateParams', 'UserService', function($stateParams, UserService) {
                        return UserService.getUser($stateParams.id);
                    }]
                }
            })
            .state('error-404', {
                url: '/404',
                templateUrl: 'templates/error-404.html'
            })
            .state('error-403', {
                url: '/403',
                templateUrl: 'templates/error-403.html'
            });

        $urlRouterProvider.otherwise('/404');
    }])
    .run(['$rootScope', '$state', function($rootScope, $state) {
        $rootScope.$on('$stateChangeError', () => {
            $state.go('error-404');
        });
    }]);