var MapHelper = {
    config: myConfig,
    userLoc: {
        lat: '37.7942',
        lng: '-122.4070',
    },
    wayPointLoc: {
        lat: '',
        lng: '',
    },
    marker:{
        user:       false,
        wayPoint:   false,
    },

    getConfigParams: function () {
        return 'app_id='+this.config.maps.appId+'&app_code='+this.config.maps.appCode;
    },
    getPlacesParams: function (form, query) {
        return this.config.maps.placesApiUrl+'?at='+form+'&q='+encodeURIComponent(query)+'&'+this.getConfigParams();
    },
    getRouteParams: function (way1, way2) {
        var mode = encodeURIComponent('fastest;car;traffic:enabled;');
        return this.config.maps.routeApiUrl+'?waypoint0='+way1+'&waypoint1='+way2+'&mode='+mode+'&'+this.getConfigParams();
    },

    findUserLoc: function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.setUserPos);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    },
    setUserPos: function(position) {
        MapHelper.userLoc.lat = position.coords.latitude;
        MapHelper.userLoc.lng = position.coords.longitude;
        MapHelper.marker.user = new H.map.Marker(MapHelper.userLoc);
        window[myConfig.maps.nameSpace]['mapGroup'].addObject(MapHelper.marker.user);
        MapHelper.mapCenter();
    },
    setToPos: function(position) {
        MapHelper.wayPointLoc.lat = position[0];
        MapHelper.wayPointLoc.lng = position[1];
        if (MapHelper.marker.wayPoint) {
            window[myConfig.maps.nameSpace]['mapGroup'].removeObject(MapHelper.marker.wayPoint);
        }
        MapHelper.marker.wayPoint = new H.map.Marker(MapHelper.wayPointLoc);
        window[myConfig.maps.nameSpace]['mapGroup'].addObject(MapHelper.marker.wayPoint);
        MapHelper.mapCenter();
    },
    mapCenter: function() {
        window[myConfig.maps.nameSpace].map.setCenter(window[myConfig.maps.nameSpace]['mapGroup'].getBounds().getCenter());
        window[myConfig.maps.nameSpace].map.setZoom(11);
    },
    getCurLogString: function() {
        return this.userLoc.lat+','+this.userLoc.lng;
    },
    init: function(exports, ctx) {
        exports[myConfig.maps.nameSpace] = [];
        var _myRf = exports[myConfig.maps.nameSpace];

        // Initialize the platform object:
        var platform = new H.service.Platform({
            app_id: myConfig.maps.appId,
            app_code: myConfig.maps.appCode
        });

        // Obtain the default map types from the platform object
        var defaultLayers = platform.createDefaultLayers();

        // Instantiate the map:
        exports[myConfig.maps.nameSpace]['map'] = new H.Map(
            document.getElementById(myConfig.maps.container),
            defaultLayers.normal.map,
            {
                zoom: 10,
                center: { lng: myConfig.maps.initialCoord.lng, lat: myConfig.maps.initialCoord.lat }
            });

        // Create the default UI:
        exports[myConfig.maps.nameSpace]['ui'] = H.ui.UI.createDefault(_myRf.map, defaultLayers);

        exports[myConfig.maps.nameSpace]['mapEvents'] = new H.mapevents.MapEvents(_myRf.map);

        // Add event listeners:
        _myRf.map.addEventListener('tap', function(evt) {});

        // Instantiate the default behavior, providing the mapEvents object:
        var behavior = new H.mapevents.Behavior(_myRf.mapEvents);

        exports[myConfig.maps.nameSpace]['mapGroup'] = new H.map.Group();
        _myRf.map.addObject(_myRf.mapGroup);

        this.findUserLoc();
    }
};

MapHelper.init(window, document);