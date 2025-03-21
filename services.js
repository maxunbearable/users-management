'use strict';

angular.module('userApp')
    .service('UserService', ['$q', '$timeout', function($q, $timeout) {

        const STORAGE_KEY = 'userAppUsers';
        let lastId = 0;

        function getStoredUsers() {
            const storedUsers = localStorage.getItem(STORAGE_KEY);
            if (storedUsers) {
                const users = JSON.parse(storedUsers);
                lastId = Math.max(...users.map(user => user.id), 0);
                return users;
            }
            return [];
        }

        function storeUsers(users) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
        }

        function simulateDelay() {
            return $timeout(() => {}, 300);
        }

        if (!localStorage.getItem(STORAGE_KEY)) {
            const initialUsers = [
                {
                    id: 1,
                    username: 'admin',
                    first_name: 'Admin',
                    last_name: 'User',
                    email: 'admin@example.com',
                    password: 'password123',
                    user_type: 'Admin'
                },
                {
                    id: 2,
                    username: 'driver1',
                    first_name: 'John',
                    last_name: 'Doe',
                    email: 'john@example.com',
                    password: 'password123',
                    user_type: 'Driver'
                }
            ];
            storeUsers(initialUsers);
            lastId = 2;
        }

        return {
            getUsers: () => {
                const deferred = $q.defer();

                simulateDelay().then(() => {
                    deferred.resolve(getStoredUsers());
                });

                return deferred.promise;
            },

            getUser: (id) => {
                const deferred = $q.defer();
                id = parseInt(id, 10);

                simulateDelay().then(() => {
                    const users = getStoredUsers();
                    const user = users.find(u => u.id === id);

                    if (user) {
                        deferred.resolve(user);
                    } else {
                        deferred.reject('User not found');
                    }
                });

                return deferred.promise;
            },

            createUser: (userData) => {
                const deferred = $q.defer();

                simulateDelay().then(() => {
                    const users = getStoredUsers();

                    const existingUser = users.find(u => u.username === userData.username);
                    if (existingUser) {
                        deferred.reject({
                            username: ['Username already exists']
                        });
                        return;
                    }

                    const newUser = {
                        ...userData,
                        id: ++lastId
                    };

                    users.push(newUser);
                    storeUsers(users);
                    deferred.resolve(newUser);
                });

                return deferred.promise;
            },

            updateUser: (userData) => {
                const deferred = $q.defer();

                simulateDelay().then(() => {
                    const users = getStoredUsers();
                    const userIndex = users.findIndex(u => u.id === userData.id);

                    if (userIndex === -1) {
                        deferred.reject('User not found');
                        return;
                    }

                    const usernameExists = users.some(u =>
                        u.username === userData.username && u.id !== userData.id
                    );

                    if (usernameExists) {
                        deferred.reject({
                            username: ['Username already exists']
                        });
                        return;
                    }

                    users[userIndex] = userData;
                    storeUsers(users);
                    deferred.resolve(userData);
                });

                return deferred.promise;
            },

            deleteUser: (id) => {
                const deferred = $q.defer();
                id = parseInt(id, 10);

                simulateDelay().then(() => {
                    let users = getStoredUsers();
                    const user = users.find(u => u.id === id);
                    if (user && user.user_type === 'Admin') {
                        deferred.reject('Cannot delete admin user');
                        return;
                    }
                    const initialLength = users.length;
                    users = users.filter(u => u.id !== id);

                    if (users.length === initialLength) {
                        deferred.reject('User not found');
                        return;
                    }

                    storeUsers(users);
                    deferred.resolve();
                });

                return deferred.promise;
            }
        };
    }]);