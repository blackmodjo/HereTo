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
        if($scope.searchFor.length > 3) {
            return $http.get(MapHelper.getPlacesParams(MapHelper.getCurLogString(), $scope.searchFor))
                .success(function (response) {
                    if (response.results && response.results.items) {
                        $scope.searchResults = response.results.items.splice(0, 4);
                    }
                });
        }
    };

    $scope.findRoute = function(place) {
        var position = place.position;
        return $http.get(MapHelper.getRouteParams(MapHelper.getCurLogString(), position.join()))
            .success(function(response) {
                if (response.response.route) {
                    var chosenRoute = response.response.route[0];
                    $scope.searchResults = [];
                    $scope.directionsResults = [];
                    var points = [];

                    $scope.searchFor = place.title;

                    if (chosenRoute.leg && chosenRoute.leg[0] && chosenRoute.leg[0].maneuver) {
                        $scope.directionsResults = chosenRoute.leg[0].maneuver;
                        chosenRoute.leg[0].maneuver.forEach(function(entry) {
                            if (entry.position) {
                                points.push({
                                    lat: entry.position.latitude,
                                    lng: entry.position.longitude
                                });
                            }
                        });
                    }
                    if (chosenRoute.summary && chosenRoute.summary.text) {
                        $scope.directionsResults.unshift({instruction: chosenRoute.summary.text});
                    }
                    MapHelper.setToPos(position, points);
                }
            });
    };
});