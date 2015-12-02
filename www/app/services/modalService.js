app.factory('modalService', [
    '$modal', function ($modal) {
        var self = this;
        var modalInstance = null;
        self.open = function (scope, path, callback) {
            modalInstance = $modal.open({
                templateUrl: path,
                scope: scope
            });

            if (callback) {
                modalInstance.rendered.then(function () {

                    callback();
                });
            }
        };

        self.close = function () {
            modalInstance.dismiss('close');
        };
        return self;
    }
]);