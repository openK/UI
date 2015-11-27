app.factory('modalService', [
    '$modal', function ($modal) {
        var self = this;
        var modalInstance = null;
        self.open = function (scope, path) {
            modalInstance = $modal.open({
                templateUrl: path,
                scope: scope
            });
        };

        self.close = function () {
            modalInstance.dismiss('close');
        };
        return self;
        }
]);