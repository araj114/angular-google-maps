(function () {
    var module = angular.module("angular-google-maps-example", ["google-maps"]);
}());

var rndAddToLatLon = function () {
    return Math.floor(((Math.random() < 0.5 ? -1 : 1) * 2) + 1)
}

function DebugController($scope, $timeout, $log, $http) {
    // Enable the new Google Maps visuals until it gets enabled by default.
    // See http://googlegeodevelopers.blogspot.ca/2013/05/a-fresh-new-look-for-maps-api-for-all.html
    google.maps.visualRefresh = true;

    versionUrl = window.location.host === "rawgithub.com" ? "http://rawgithub.com/nlaplante/angular-google-maps/master/package.json" : "/package.json";

    $http.get(versionUrl).success(function (data) {
        if (!data)
            console.error("no version object found!!");
        $scope.version = data.version;
    });


    angular.extend($scope, {
        map:{
            control:{},
            center: {
                latitude: 45,
                longitude: -74
            },
            marker: {
                latitude: 45,
                longitude: -74,
                options:{
                    visible:false
                }
            },
            marker2: {
                latitude: 45.2,
                longitude: -74.5
            },
//            dragging:false, //appears to be required
            zoom: 7,
            options: {
                disableDefaultUI: true,
                panControl: false,
                navigationControl: false,
                scrollwheel: false,
                scaleControl: false
            },
            refresh: function(){
                $scope.map.control.refresh(origCenter);
            }
        },
        map2:{
            control:{},
            center: {
                latitude: 70,
                longitude: -76
            },
            marker: {
                latitude: 70,
                longitude: -76,
                options:{
                    visible:true
                }
            },
            marker2: {
                latitude: 50.2,
                longitude: -80.5
            },
            zoom: 7,
            refresh: function(){
                $scope.map2.control.refresh({latitude:32.779680,longitude:-79.935493});
            }
        }
    });

    var origCenter = {latitude:$scope.map.center.latitude,longitude:$scope.map.center.longitude};
}
