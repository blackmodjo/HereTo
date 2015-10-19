hereApp.directive('resizeMap', function($window) {
    return function(scope, element, attr) {
        var w = angular.element($window);
        w.on('resize', function() {
            var changes = {
                height: Math.round(this.innerHeight - myConfig.maps.mapHeight) + 'px',
            }
            element.css(changes);
            scope.$apply();
        });
    };
});