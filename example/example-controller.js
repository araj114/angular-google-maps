(function () {
    var module = angular.module("angular-google-maps-example", ["google-maps"]);
}());

var rndAddToLatLon = function () {
    return Math.floor(((Math.random() < 0.5 ? -1 : 1) * 2) + 1)
}

function ExampleController($scope, $timeout, $log, $http, Logger) {
    Logger.doLog = true
    // Enable the new Google Maps visuals until it gets enabled by default.
    // See http://googlegeodevelopers.blogspot.ca/2013/05/a-fresh-new-look-for-maps-api-for-all.html
    google.maps.visualRefresh = true;

    versionUrl = window.location.host === "rawgithub.com" ? "http://rawgithub.com/nlaplante/angular-google-maps/master/package.json" : "/package.json";

    $http.get(versionUrl).success(function (data) {
        if (!data)
            console.error("no version object found!!");
        $scope.version = data.version;
    });

    onMarkerClicked = function (marker) {
        marker.showWindow = true;
        //window.alert("Marker: lat: " + marker.latitude + ", lon: " + marker.longitude + " clicked!!")
    };

    genRandomMarkers = function (numberOfMarkers, scope) {
        var markers = [];
        for (var i = 0; i < numberOfMarkers; i++) {
            markers.push(createRandomMarker(i, scope.map.bounds))
        }
        scope.map.randomMarkers = markers;
    };

    createRandomMarker = function (i, bounds, idKey) {
        var lat_min = bounds.southwest.latitude,
                lat_range = bounds.northeast.latitude - lat_min,
                lng_min = bounds.southwest.longitude,
                lng_range = bounds.northeast.longitude - lng_min;

        if(idKey == null)
            idKey = "id";

        latitude = lat_min + (Math.random() * lat_range);
        longitude = lng_min + (Math.random() * lng_range);
        var ret =  {
            latitude: latitude,
            longitude: longitude,
            title: 'm' + i
        };
        ret[idKey] = i;
        return ret;
    };

    angular.extend($scope, {
        example2: {
            doRebuildAll: false
        },
        clickWindow: function () {
        	$log.info('CLICK CLICK');
        	Logger.info('CLICK CLICK');
        },
        map: {
            version: "uknown",
            heatLayerCallback: function (layer) {
                //set the heat layers backend data
                var mockHeatLayer = new MockHeatLayer(layer);
            },
            showTraffic: true,
            showBicycling: false,
            showWeather: false,
            showHeat: false,
            center: {
                latitude: 45,
                longitude: -73
            },
            options: {
                streetViewControl: false,
                panControl: false,
                maxZoom: 20,
                minZoom: 3
            },
            zoom: 3,
            dragging: false,
            bounds: {},
            markers: [
                {
                    id:1,
                    latitude: 45,
                    longitude: -74,
                    showWindow: false,
                    title: 'Marker 2'
                },
                {
                    id:2,
                    latitude: 15,
                    longitude: 30,
                    showWindow: false,
                    title: 'Marker 2'
                },
                {
                    id:3,
                    icon: 'plane.png',
                    latitude: 37,
                    longitude: -122,
                    showWindow: false,
                    title: 'Plane'
                }
            ],
            markers2: [
                {
                    id:1,
                    latitude: 46,
                    longitude: -77,
                    showWindow: false,
                    title: '[46,-77]'
                },
                {
                    id:2,
                    latitude: 33,
                    longitude: -77,
                    showWindow: false,
                    title: '[33,-77]'
                },
                {
                    id:3,
                    icon: 'plane.png',
                    latitude: 35,
                    longitude: -125,
                    showWindow: false,
                    title: '[35,-125]'
                }
            ],
            mexiIdKey: 'mid',
            mexiMarkers: [
                {
                    mid:1,
                    latitude: 29.302567,
                    longitude: -106.248779
                },
                {
                    mid:2,
                    latitude: 30.369913,
                    longitude: -109.434814
                },
                {
                    mid:3,
                    latitude: 26.739478,
                    longitude: -108.61084
                }
            ],
            dynamicMarkers: [],
            randomMarkers: [],
            doClusterRandomMarkers: true,
            doUgly: true, //great name :)
            clusterOptions: {title: 'Hi I am a Cluster!', gridSize: 60, ignoreHidden: true, minimumClusterSize: 2,
                imageExtension: 'png', imagePath: 'http://localhost:3000/example/cluster', imageSizes: [72]},
            clickedMarker: {
                title: 'You clicked here',
                latitude: null,
                longitude: null
            },
            events: {
                tilesloaded: function (map, eventName, originalEventArgs) {
                },
                click: function (mapModel, eventName, originalEventArgs) {
                    // 'this' is the directive's scope
                    $log.log("user defined event: " + eventName, mapModel, originalEventArgs);

                    var e = originalEventArgs[0];

                    if (!$scope.map.clickedMarker) {
                        $scope.map.clickedMarker = {
                            title: 'You clicked here',
                            latitude: e.latLng.lat(),
                            longitude: e.latLng.lng()
                        };
                    }
                    else {
                        var marker = {
                            latitude: e.latLng.lat(),
                            longitude: e.latLng.lng()
                        };
                        $scope.map.clickedMarker = marker;
                    }
                    //scope apply required because this event handler is outside of the angular domain
                    $scope.$apply();
                },
                dragend: function () {
                    self = this;
                    $timeout(function () {
//                        modified = _.map($scope.map.mexiMarkers, function (marker) {
//                            return {
//                                latitude: marker.latitude + rndAddToLatLon(),
//                                longitude: marker.longitude + rndAddToLatLon()
//                            }
//                        })
//                        $scope.map.mexiMarkers = modified;
                        var markers = [];
                        var id = 0;
                        if($scope.map.mexiMarkers !== null && $scope.map.mexiMarkers.length > 0){
                            var maxMarker = _.max($scope.map.mexiMarkers, function(marker){
                                return marker.mid;
                            });
                            id = maxMarker.mid;
                        }
                        for (var i = 0; i < 4; i++) {
                            id++;
                            markers.push(createRandomMarker(id, $scope.map.bounds,"mid"));
                        }
                        $scope.map.mexiMarkers = markers.concat($scope.map.mexiMarkers);
                    });
                }
            },
            infoWindow: {
                coords: {
                    latitude: 36.270850,
                    longitude: -44.296875
                },
                options:{
                    disableAutoPan:true
                },
                show: false
            },
            templatedInfoWindow: {
                coords: {
                    latitude: 48.654686,
                    longitude: -75.937500
                },
                options:{
                    disableAutoPan:true
                },
                show: true,
                templateUrl: 'templates/info.html',
                templateParameter: {
                    message: 'passed in from the opener'
                }
            },
            polygons: [
	            {
	            	id: 1,
                    path: [
                        {
                            latitude: 50,
                            longitude: -80
                        },
                        {
                            latitude: 30,
                            longitude: -120
                        },
                        {
                            latitude: 20,
                            longitude: -95
                        }
                    ],
                    stroke: {
                        color: '#6060FB',
                        weight: 3
                    },
                    editable: true,
                    draggable: true,
                    geodesic: false,
                    visible: true,
                    fill: {
                    	color: '#ff0000',
                    	opacity: 0.8
                    }
                }
            ],
            polylines: [
                {
                    path: [
                        {
                            latitude: 45,
                            longitude: -74
                        },
                        {
                            latitude: 30,
                            longitude: -89
                        },
                        {
                            latitude: 37,
                            longitude: -122
                        },
                        {
                            latitude: 60,
                            longitude: -95
                        }
                    ],
                    stroke: {
                        color: '#6060FB',
                        weight: 3
                    },
                    editable: true,
                    draggable: false,
                    geodesic: false,
                    visible: true
                },
                {
                    path: [
                        {
                            latitude: 47,
                            longitude: -74
                        },
                        {
                            latitude: 32,
                            longitude: -89
                        },
                        {
                            latitude: 39,
                            longitude: -122
                        },
                        {
                            latitude: 62,
                            longitude: -95
                        }
                    ],
                    stroke: {
                        color: '#6060FB',
                        weight: 3
                    },
                    editable: true,
                    draggable: true,
                    geodesic: true,
                    visible: true
                }
            ]
        },
        toggleColor: function (color) {
            return color == 'red' ? '#6060FB' : 'red';
        }

    });

    _.each($scope.map.markers, function (marker) {
        marker.closeClick = function () {
            marker.showWindow = false;
        };
        marker.onClicked = function () {
            onMarkerClicked(marker);
        };
    });

    _.each($scope.map.markers2, function (marker) {
        marker.closeClick = function () {
            marker.showWindow = false;
        };
        marker.onClicked = function () {
            onMarkerClicked(marker);
        };
    });

    $scope.removeMarkers = function () {
        $log.info("Clearing markers. They should disappear from the map now");
        $scope.map.markers = [];
        $scope.map.markers2 = [];
        $scope.map.dynamicMarkers = [];
        $scope.map.randomMarkers = [];
        $scope.map.mexiMarkers = [];
        $scope.map.polylines = [];
        $scope.map.clickedMarker = null;
        $scope.searchLocationMarker = null;
        $scope.map.infoWindow.show = false;
        $scope.map.templatedInfoWindow.show = false;
        // $scope.map.infoWindow.coords = null;
    };
    $scope.map.clusterOptionsText = JSON.stringify($scope.map.clusterOptions);
    $scope.$watch('map.clusterOptionsText', function (newValue, oldValue) {
        if (newValue !== oldValue)
            $scope.map.clusterOptions = angular.fromJson($scope.map.clusterOptionsText);
    });

    $scope.$watch('map.doUgly', function (newValue, oldValue) {
        var json;
        if (newValue !== oldValue) {
            if (newValue)
                json = {title: 'Hi I am a Cluster!', gridSize: 60, ignoreHidden: true, minimumClusterSize: 2,
                    imageExtension: 'png', imagePath: 'http://localhost:3000/example/cluster', imageSizes: [72]};
            else
                json = {title: 'Hi I am a Cluster!', gridSize: 60, ignoreHidden: true, minimumClusterSize: 2};
            $scope.map.clusterOptions = json;
            $scope.map.clusterOptionsText = angular.toJson(json);
        }
    });

    $scope.genRandomMarkers = function (numberOfMarkers) {
        genRandomMarkers(numberOfMarkers, $scope);
    };

    $scope.searchLocationMarker = {
        coords: {
            latitude: 40.1451,
            longitude: -99.6680
        },
        options: { draggable: true },
        events: {
            dragend: function (marker, eventName, args) {
                $log.log('marker dragend');
                $log.log(marker.getPosition().lat());
                $log.log(marker.getPosition().lng());
            }
        }
    }
    $scope.onMarkerClicked = onMarkerClicked

    $timeout(function () {
        $scope.map.infoWindow.show = true;
        dynamicMarkers = [
            {
                id: 1,
                latitude: 46,
                longitude: -79,
                showWindow: false
            },
            {
                id: 2,
                latitude: 33,
                longitude: -79,
                showWindow: false
            },
            {
                id: 3,
                icon: 'plane.png',
                latitude: 35,
                longitude: -127,
                showWindow: false
            }
        ];
        _.each(dynamicMarkers, function (marker) {
            marker.closeClick = function () {
                marker.showWindow = false;
            };
            marker.onClicked = function () {
                onMarkerClicked(marker);
            };
        });
        $scope.map.dynamicMarkers = dynamicMarkers;
    }, 2000);
}
