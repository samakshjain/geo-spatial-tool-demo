(function(){
  // Get the app module
  var geoApp = angular.module('geo');

  geoApp.controller('MapController', function MapController($scope, $http, $window) {
    var datasets = {
      'earthquakes': 'cj2fxcugb00342qn2rt8zm0iv',
      'floods': 'cj2g106tk00372qn2weyrtiy7',
      'storms': 'cj2g1a0f0000240nzrph3zyma',
      'tusnamis': 'cj2f6ceth00482qo0cutjqrkg'
    };

    var base_request =  "https://api.mapbox.com/datasets/v1/zinche/"
    function returnDatasetUrl(dataset) {
       return base_request + datasets[dataset] + "/features?access_token=" + $window.mapboxAccessToken;
    }

    $scope.layerGroup = L.layerGroup().addTo($window.mymap);

    $scope.toggleDataset = function (dataset) {
      // TODO: toggle a dataset
      // if $scope.layerGroup.hasLayer()

      $http.get(returnDatasetUrl(dataset))
        .then(function(res) {
          var dataset_features = res.data.features;
          function getColor(d) {
              return d > 8   ? '#800026' :
                     d > 7.5 ? '#BD0026' :
                     d > 7   ? '#E31A1C' :
                     d > 6.5 ? '#FC4E2A' :
                     d > 6   ? '#FD8D3C' :
                     d > 5.5 ? '#FEB24C' :
                     d > 5   ? '#FED976' :
                      '#FFEDA0';
          }

          function pointToLayer(feature, latlng) {
            return L.circleMarker(latlng, {
              radius: 2,
              fillColor: getColor(feature.properties.value_1),
              color: getColor(feature.properties.value_1),
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8
            });
          }
          var layer = $window.L.geoJSON(dataset_features, {
            pointToLayer: pointToLayer
          });
          $scope.layerGroup.addLayer(layer);
        });
    };

  });

})();
