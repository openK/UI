/*
 Directives
 */

angular.module('myApp').directive('myDirective', ['$filter', '$timeout', function ($filter, $timeout) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModelController) {
            ngModelController.$parsers.push(function (data) {
                var number = data;
                if (data) {
                    //convert data from view format to model format
                    number = $filter('number')(data, 2);
                    element.val(number);
                }
                return number; //converted
            });
            ngModelController.$formatters.push(function(data) {
                //convert data from model format to view format
                var number = $filter('number')(data, 2);
                return number; //converted
            });
        }
    }
}]);
angular.module('myApp').directive('customPopover', function ($translate) {
    return {
        restrict: 'A',
        template: '<div><a class="btn btn-xs ng-scope" style="margin:5px;display:{{display}};" ><img src="/openk-theme/img/info.png"></a>{{label}}</div>',
        link: function (scope, el, attrs) {

            var stations = (attrs.popoverLabel ? JSON.parse(attrs.popoverLabel) : []);

            var showPopover = false;

            if (!stations || stations.length === 0) {
                attrs.popoverHtml = '';
                scope.label = '';
                scope.display = 'none';

            } else if (stations.length === 1) {
                scope.label = stations[0].name;
                attrs.popoverHtml = '';
                scope.display = 'none';
            } else {
                showPopover = true;

                scope.display = 'inherit';
                scope.label = '';
                scope.displayStations = '';

                stations.forEach(function (entry) {
                    scope.displayStations += entry.name;
                    scope.displayStations += '</br>';
                });

                attrs.popoverHtml = scope.displayStations;
            }

            if (showPopover) {
                $(el).popover({
                    trigger: 'hover',
                    html: true,
                    title: $translate.instant('GRID.POPUP.TITLE'),
                    content: attrs.popoverHtml,
                    placement: attrs.popoverPlacement
                });
            }
        }
    };
});

angular.module('myApp').directive('loading', ['$http', function ($http) {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs) {
            scope.isLoading = function () {
                return $http.pendingRequests.length > 0;
            };

            scope.$watch(scope.isLoading, function (v) {
                if (v) {
                    elm.show();
                } else {
                    elm.hide();
                }
            });
        }
    };

}]);

angular.module('myApp').directive('startrange', ['dateService', function (dateService) {
    return {
        require: 'ngModel',

        link: function (scope, elem, attr, ngModel) {

            ngModel.$parsers.unshift(function (value) {

                ngModel.$setValidity('daterange', (dateService.isDateValid(value) && dateService.isActualDate(value)));

                return value;
            });
        }
    };
}]);

angular.module('myApp').directive('endrange', ['dateService', function (dateService) {
    return {
        require: 'ngModel',

        link: function (scope, elem, attr, ngModel) {

            //var x = 'w';

            ngModel.$parsers.unshift(function (value) {

                ngModel.$setValidity('daterange', (dateService.isDateValid(value) && dateService.isActualDate(value)));

                return value;
            });
        }
    };
}]);

 angular.module('myApp').directive('loading', ['$http', function ($http) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        scope.isLoading = function () {
          return $http.pendingRequests.length > 0;
        };
        scope.$watch(scope.isLoading, function (value) {
          if (value) {
            element.removeClass('ng-hide');
          } else {
            element.addClass('ng-hide');
          }
        });
      }
    };
}]);