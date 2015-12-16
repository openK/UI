app.factory('modalService', [
    '$modal', function ($modal) {
        var self = this;
        var modalInstance = null;
        self.open = function (scope, path, callback , controller, size) {
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
        };
        return self;
    }
]);