app.factory('modalService', ['$modal', '$filter', function ($modal, $filter) {
    var self = this;
    var modalInstance = null;
    self.open = function (scope, path, callback, controller, size) {
        modalInstance = $modal.open({
            templateUrl: path,
            scope: scope,
            size: size,
            controller: controller
        });

        if (callback) {
            modalInstance.rendered.then(function () {
                callback();
            });
        }
        return modalInstance.result;
    };

    self.close = function () {
        modalInstance.dismiss('close');
        modalInstance = null;
    };

    self.showErrorDialog = function (error) {
        var errorMessage = error;
        if (error.status) {
            errorMessage = error.statusText + ' (' + error.status + ')';
        }
        modalInstance = $modal.open({
            templateUrl: 'app/partials/error.html',
            scope: {
                modalOptions: {
                    headline: $filter('translate')('ERROR.HEADER'),
                    bodyText: errorMessage,
                    actionButtonText: $filter('translate')('OK'),
                    ok: function () {
                        self.close();
                    }
                }
            },
        });
    }
    return self;
}]);
app.service('modalServiceNew', ['$modal', '$filter', function ($modal, $filter) {
    var self = this;
    var modalDefaults = {
        backdrop: true,
        keyboard: true,
        modalFade: true,
        templateUrl: 'app/partials/modal.html'
    };

    var modalOptions = {
        closeButtonText: 'Abbrechen',
        actionButtonText: 'OK',
        headerText: 'Nachricht',
        bodyText: 'Sind Sie sicher?'
    };
    self.showModal = function (customModalDefaults, customModalOptions) {
        if (!customModalDefaults) customModalDefaults = {};
        customModalDefaults.backdrop = 'static';
        return self.show(customModalDefaults, customModalOptions);
    };

    self.show = function (customModalDefaults, customModalOptions) {
        //Create temp objects to work with since we're in a singleton service
        var tempModalDefaults = {};
        var tempModalOptions = {};

        //Map angular-ui modal custom defaults to modal defaults defined in service
        angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

        //Map modal.html $scope custom properties to defaults defined in service
        angular.extend(tempModalOptions, modalOptions, customModalOptions);

        if (!tempModalDefaults.controller) {
            tempModalDefaults.controller = function ($scope, $modalInstance) {
                $scope.modalOptions = tempModalOptions;
                $scope.modalOptions.ok = function (result) {
                    $modalInstance.close(result);
                };
                $scope.modalOptions.close = function (result) {
                    $modalInstance.dismiss('cancel');
                };
            }
        }

        return $modal.open(tempModalDefaults).result;
    };

    self.showErrorDialog = function (error) {
        var errorMessage = JSON.stringify(error);
        if (error.status && error.statusText) {
            errorMessage = error.statusText + ' (' + error.status + ')';
        }
        if (error.message) {
            errorMessage = error.message;
        }
        var modalDefaults = {
            templateUrl: 'app/partials/error.html'
        };
        var modalOptions = {
            actionButtonText: 'Ok',
            headerText: $filter('translate')('ERROR.HEADER'),
            bodyText: errorMessage
        };
        return self.showModal(modalDefaults, modalOptions);
    }

    self.showMessageDialog = function (header, message) {
        var modalDefaults = {
            templateUrl: 'app/partials/message.html'
        };
        var modalOptions = {
            actionButtonText: 'Ok',
            headerText: header,
            bodyText: message
        };
        return self.showModal(modalDefaults, modalOptions);
    }
}]);