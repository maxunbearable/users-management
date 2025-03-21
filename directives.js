'use strict';

angular.module('userApp')
    .directive('userFormValidation', () => {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: (scope, element, attrs, ngModel) => {
                const validationMessages = {
                    required: 'This field is required',
                    email: 'Please enter a valid email address',
                    minlength: 'Minimum length is {{minlength}} characters',
                    passwordStrength: 'Password must contain at least one number and one letter',
                    pattern: 'Value does not match required pattern'
                };

                function getMessage(error) {
                    let message = validationMessages[error] || 'Invalid value';

                    if (error === 'minlength') {
                        message = message.replace('{{minlength}}', attrs.ngMinlength);
                    }

                    return message;
                }

                function validatePassword(value) {
                    if (!value) return true;

                    const hasLetter = /[a-zA-Z]/.test(value);
                    const hasNumber = /\d/.test(value);

                    return hasLetter && hasNumber;
                }

                if (attrs.name === 'password') {
                    ngModel.$validators.passwordStrength = validatePassword;
                }

                scope.$watch(() => ngModel.$error, () => {
                    const errors = [];

                    Object.keys(ngModel.$error).forEach(error => {
                        if (ngModel.$error[error]) {
                            errors.push(getMessage(error));
                        }
                    });

                    scope.errors = errors;
                }, true);
            }
        };
    })
    .directive('passwordMatch', () => {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                otherModelValue: '=passwordMatch'
            },
            link: (scope, element, attrs, ngModel) => {
                ngModel.$validators.passwordMatch = (modelValue) => {
                    return modelValue === scope.otherModelValue;
                };

                scope.$watch('otherModelValue', () => {
                    ngModel.$validate();
                });
            }
        };
    });