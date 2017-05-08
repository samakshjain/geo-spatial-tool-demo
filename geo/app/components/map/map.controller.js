(function(){
  // Get the app module
  var geoApp = angular.module('geo');

  geoApp.controller('MapController', function MapController($scope, $http, $window) {

    // Color functions for different events
    function getColorForEarthquakes(d) {
      return d > 8   ? '#800026' :
             d > 7.5 ? '#BD0026' :
             d > 7   ? '#E31A1C' :
             d > 6.5 ? '#FC4E2A' :
             d > 6   ? '#FD8D3C' :
             d > 5.5 ? '#FEB24C' :
             d > 5   ? '#FED976' :
              '#FFEDA0';
    }
    function getColorForFloods(d) {
      return d > 8   ? '#4a1486' :
             d > 7.5 ? '#6a51a3' :
             d > 7   ? '#807dba' :
             d > 6.5 ? '#9e9ac8' :
             d > 6   ? '#bcbddc' :
             d > 5.5 ? '#dadaeb' :
             d > 5   ? '#efedf5' :
              '#fcfbfd';
    }
    function getColorForStorms(d) {
      return d > 8   ? '#8c2d04' :
             d > 7.5 ? '#d94801' :
             d > 7   ? '#f16913' :
             d > 6.5 ? '#fd8d3c' :
             d > 6   ? '#fdae6b' :
             d > 5.5 ? '#fdd0a2' :
             d > 5   ? '#fee6ce' :
              '#fff5eb';
    }
    function getColorForTsunamis(d) {
      return d > 8   ? '#005a32' :
             d > 7.5 ? '#238b45' :
             d > 7   ? '#41ab5d' :
             d > 6.5 ? '#74c476' :
             d > 6   ? '#a1d99b' :
             d > 5.5 ? '#c7e9c0' :
             d > 5   ? '#e5f5e0' :
              '#f7fcf5';
    }
    function onEachFeatureEarthquakes(feature, layer) {
        layer.bindPopup(
          "<b>Location:</b> " + feature.properties.location.trim() + ', ' +feature.properties.country.trim() + "</br>" +
          "<b>LatLng:</b> " + feature.geometry.coordinates[0] + ', ' + feature.geometry.coordinates[1] + "</br>" +
          "<b>Date:</b> " + feature.properties.start_date.trim() + ' - ' + feature.properties.end_date.trim() + "</br>" +
          "<b>Richter Scale Reading:</b> " + feature.properties.value_1.trim() +  "</br>" +
          "<b>Focal Depth:</b> " + feature.properties.value_2.trim() + "</br>" +
          "<b>Fatalities:</b> " + feature.properties.fatalities.trim() + "</br>" +
          "<b>Affected People:</b> " + feature.properties.affected_people.trim() + "</br>" +
          "<b>Economic Loss:</b> " + feature.properties.economic_loss.trim() + "</br>"
        )
    }
    function onEachFeatureFloods(feature, layer) {
        layer.bindPopup(
          "<b>Location:</b> " + feature.properties.location.trim() + ', ' +feature.properties.country.trim() + "</br>" +
          "<b>LatLng:</b> " + feature.geometry.coordinates[0] + ', ' + feature.geometry.coordinates[1] + "</br>" +
          "<b>Date:</b> " + feature.properties.start_date.trim() + ' - ' + feature.properties.end_date.trim() + "</br>" +
          "<b>Flood Magnitude:</b> " + feature.properties.value_1.trim() +  "</br>" +
          "<b>Affected area (sq km):</b> " + feature.properties.value_2.trim() + "</br>" +
          "<b>Severity class:</b> " + feature.properties.value_3.trim() + "</br>" +
          "<b>Fatalities:</b> " + feature.properties.fatalities.trim() + "</br>" +
          "<b>Affected People:</b> " + feature.properties.affected_people.trim() + "</br>" +
          "<b>Economic Loss:</b> " + feature.properties.economic_loss.trim() + "</br>"
        )
    }
    function onEachFeatureStorms(feature, layer) {
        layer.bindPopup(
          "<b>Location:</b> " + feature.properties.location.trim() + ', ' +feature.properties.country.trim() + "</br>" +
          "<b>LatLng:</b> " + feature.geometry.coordinates[0] + ', ' + feature.geometry.coordinates[1] + "</br>" +
          "<b>Date:</b> " + feature.properties.start_date.trim() + ' - ' + feature.properties.end_date.trim() + "</br>" +
          "<b>Storm Category:</b> " + feature.properties.value_1.trim() +  "</br>" +
          "<b>Max Wind Speed (kmph):</b> " + feature.properties.value_2.trim() + "</br>" +
          "<b>Fatalities:</b> " + feature.properties.fatalities.trim() + "</br>" +
          "<b>Affected People:</b> " + feature.properties.affected_people.trim() + "</br>" +
          "<b>Economic Loss:</b> " + feature.properties.economic_loss.trim() + "</br>"
        )
    }
    function onEachFeatureTsunamis(feature, layer) {
        layer.bindPopup(
          "<b>Location:</b> " + feature.properties.location.trim() + ', ' +feature.properties.country.trim() + "</br>" +
          "<b>LatLng:</b> " + feature.geometry.coordinates[0] + ', ' + feature.geometry.coordinates[1] + "</br>" +
          "<b>Date:</b> " + feature.properties.start_date.trim() + ' - ' + feature.properties.end_date.trim() + "</br>" +
          "<b>Richter Scale Reading:</b> " + feature.properties.value_1.trim() +  "</br>" +
          "<b>Focal Depth:</b> " + feature.properties.value_2.trim() + "</br>" +
          "<b>Fatalities:</b> " + feature.properties.fatalities.trim() + "</br>" +
          "<b>Affected People:</b> " + feature.properties.affected_people.trim() + "</br>" +
          "<b>Economic Loss:</b> " + feature.properties.economic_loss.trim() + "</br>"
        )
    }

    // Helper function for making a layer using a colorFunc
    function makeEventLayer(colorFunc, onEachFeature, value) {
      var pointToLayer = function(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 3,
          fillColor: colorFunc(feature.properties[value]),
          color: '#000',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
      }
      return $window.L.geoJSON(false, {
          pointToLayer: pointToLayer,
          onEachFeature: onEachFeatureEarthquakes
        })
    }

    var commonDataPoints = [
      'value_1',
      'value_2',
      'fatalities',
      'affected_people',
      'economic_loss'
    ];
    var floodDataPoints = commonDataPoints.concat(['value_3']);
    var dataPointMaps = {
      'earthquakes' : commonDataPoints,
      'floods'      : floodDataPoints,
      'storms'      : commonDataPoints,
      'tsunamis'    : commonDataPoints,
    }

    // Make layers for all the data points
    var layers = [];
    function makeLayers(dataPointMaps) {
      angular.forEach(dataPointMaps, function(val, key) {
        var colorFunc;
        var onEachFeature;
        if (key === 'earthquakes') {
          colorFunc = getColorForEarthquakes;
          onEachFeature = onEachFeatureEarthquakes;
        } else if (key === 'floods') {
          colorFunc = getColorForFloods;
          onEachFeature = onEachFeatureFloods;
        } else if (key === 'storms') {
          colorFunc = getColorForStorms;
          onEachFeature = onEachFeatureStorms;
        } else {
          colorFunc = getColorForTsunamis;
          onEachFeature = onEachFeatureTsunamis;
        }
        angular.forEach(val, function(data_point, i) {
          layers.push(makeEventLayer(colorFunc, onEachFeature, data_point));
        });
      });
    }
    makeLayers(dataPointMaps);

    // Add all layers to a layer group
    $scope.layerGroup = L.layerGroup(layers).addTo($window.mymap);


    // Function to reset all layers of a dataset
    $scope.clearDataset = function(dataset) {
      var ds_layers;
      var dpl = commonDataPoints.length;
      var fpl = floodDataPoints.length;
      // Find all the layers for the dataset
      switch (dataset) {
        case 'earthquakes':
          ds_layers = layers.slice(0, dpl);
          break;
        case 'floods':
          ds_layers = layers.slice(dpl, dpl + fpl);
          break;
        case 'storms':
          ds_layers = layers.slice(dpl+fpl, 2*dpl+fpl);
          break;
        case 'tsunamis':
          ds_layers = layers.slice(2*dpl+fpl, layers.length);
          break;
        default:
          return
      }
      angular.forEach(ds_layers, function(layer, i) {
        layer.clearLayers();
      });

    }

    $scope.toggleDataset = function (dataset, data_point) {
      // Toggle a dataset

      var base_request =  "https://api.mapbox.com/datasets/v1/zinche/";
      var datasets = {
        'earthquakes': 'cj2fxcugb00342qn2rt8zm0iv',
        'floods'     : 'cj2glqk6x000933phtqibyo95',
        'storms'     : 'cj2g1a0f0000240nzrph3zyma',
        'tsunamis'   : 'cj2f6ceth00482qo0cutjqrkg'
      };
      function returnDatasetUrl(dataset) {
         return base_request + datasets[dataset] + "/features?access_token=" + $window.mapboxAccessToken;
      }


      // Find the layer for the dataset and datapoint
      var layer;
      switch (dataset) {
        case 'earthquakes':
          layer = layers[commonDataPoints.indexOf(data_point)];
          break;
        case 'floods':
          layer = layers[floodDataPoints.indexOf(data_point) + commonDataPoints.length];
          break;
        case 'storms':
          layer = layers[commonDataPoints.indexOf(data_point) + commonDataPoints.length + floodDataPoints.length];
          break;
        case 'tsunamis':
          layer = layers[commonDataPoints.indexOf(data_point) + 2*commonDataPoints.length + floodDataPoints.length];
          break;
        default:
          return
      }

      // Remove all old layers for the dataset
      $scope.clearDataset(dataset);

      // Fetch features data and add it to the layer
      $http.get(returnDatasetUrl(dataset))
        .then(function(res) {
          var dataset_features = res.data.features;
          layer.addData(dataset_features);
        });
    };
  });

})();
