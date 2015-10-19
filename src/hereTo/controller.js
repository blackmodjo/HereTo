hereApp.controller("hereAppController", function($scope, $http) {
    $scope.error = true;
    $scope.searchResults = [];

    $scope.$watch('searchFor',function() {$scope.test();});

    $scope.init = function () {
        var mapContainer = document.getElementById('mapContainer');
        mapContainer.style.height = Math.round(window.innerHeight - myConfig.maps.mapHeight) + 'px';
    }
    $scope.test = function() {
        if ($scope.searchFor && $scope.searchFor.length > 3) {
            $scope.error = false;
        }
    };

    $scope.search = function() {
        return $http.get(MapHelper.getPlacesParams(MapHelper.getCurLogString(), $scope.searchFor))
            .success(function(response) {
                if (response.results && response.results.items) {
                    $scope.searchResults = response.results.items.splice(0,4);
                }
            });
    };

    $scope.findRoute = function(position) {
        return $http.get(MapHelper.getRouteParams(MapHelper.getCurLogString(), position.join()))
            .success(function(response) {
                if (response.response.route) {
                    $scope.searchResults = [];
                }
            });
    };
});