(function(){
  // Get the app module
  var geoApp = angular.module('geo');

  geoApp.controller('MapController', function MapController($scope, $http, $window) {


    function getRangeBreaks(min, max) {
      var NO_OF_RANGES = 7;
      // For a rough estimate, giving the range a room of 1.25*boundary
      var BOUNDARY_ROUND_OFF = 1.25
      r_max = Math.round(BOUNDARY_ROUND_OFF*max); // 75 -> 90
      r_min = Math.round(min/BOUNDARY_ROUND_OFF); // 6 -> 0
      r_max = Math.round(r_max + r_max%10); // Round up
      r_min = Math.round(r_min - r_min%10); // Round down
      range_width = Math.floor((r_max - r_min) / NO_OF_RANGES);
      breakpoints = [r_min];
      for (var i = 0; i < 5; i++) {
        breakpoints.push(breakpoints[i] + range_width);
      }
      breakpoints.push(r_max);
      return breakpoints;
    }

    // Color functions for different events
    function getColorForEarthquakes(d, min, max) {
      rangeBreaks = getRangeBreaks(min, max);
      return d > rangeBreaks[6] ? '#800026' :
             d > rangeBreaks[5] ? '#BD0026' :
             d > rangeBreaks[4] ? '#E31A1C' :
             d > rangeBreaks[3] ? '#FC4E2A' :
             d > rangeBreaks[2] ? '#FD8D3C' :
             d > rangeBreaks[1] ? '#FEB24C' :
             d > rangeBreaks[0] ? '#FED976' :
              '#FFEDA0';
    }
    function getColorForFloods(d, min, max) {
      rangeBreaks = getRangeBreaks(min, max);
      return d > rangeBreaks[6] ? '#4a1486' :
             d > rangeBreaks[5] ? '#6a51a3' :
             d > rangeBreaks[4] ? '#807dba' :
             d > rangeBreaks[3] ? '#9e9ac8' :
             d > rangeBreaks[2] ? '#bcbddc' :
             d > rangeBreaks[1] ? '#dadaeb' :
             d > rangeBreaks[0] ? '#efedf5' :
              '#fcfbfd';
    }
    function getColorForStorms(d, min, max) {
      rangeBreaks = getRangeBreaks(min, max);
      return d > rangeBreaks[6] ? '#8c2d04' :
             d > rangeBreaks[5] ? '#d94801' :
             d > rangeBreaks[4] ? '#f16913' :
             d > rangeBreaks[3] ? '#fd8d3c' :
             d > rangeBreaks[2] ? '#fdae6b' :
             d > rangeBreaks[1] ? '#fdd0a2' :
             d > rangeBreaks[0] ? '#fee6ce' :
              '#fff5eb';
    }
    function getColorForTsunamis(d, min, max) {
      rangeBreaks = getRangeBreaks(min, max);
      return d > rangeBreaks[6] ? '#005a32' :
             d > rangeBreaks[5] ? '#238b45' :
             d > rangeBreaks[4] ? '#41ab5d' :
             d > rangeBreaks[3] ? '#74c476' :
             d > rangeBreaks[2] ? '#a1d99b' :
             d > rangeBreaks[1] ? '#c7e9c0' :
             d > rangeBreaks[0] ? '#e5f5e0' :
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
    function makeEventLayer(colorFunc, onEachFeature, value, data_point_details) {
      var pointToLayer = function(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 3,
          fillColor: colorFunc(feature.properties[value], data_point_details.min, data_point_details.max),
          color: '#000',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
      }
      return $window.L.geoJSON(false, {
          pointToLayer: pointToLayer,
          onEachFeature: onEachFeature
        })
    }

    function createDataPoints(min_max_array, extra_data_points) {
      var baseDataPoints = {
        'value_1': {},
        'value_2': {},
        'fatalities': {},
        'affected_people': {},
        'economic_loss': {}
      };
      angular.forEach(baseDataPoints, function (val, key) {
        val.min = min_max_array[Object.keys(baseDataPoints).indexOf(key)][0]
        val.max = min_max_array[Object.keys(baseDataPoints).indexOf(key)][1]
      })
      if (extra_data_points !== undefined) {
        angular.forEach(extra_data_points, function(val, key) {
          baseDataPoints[key] = val;
        });
      }
      return baseDataPoints;
    }

    var earthquakes_min_max_array = [
      [1.6, 9.1],
      [0, 678],
      [1, 86000],
      [0, 5621790],
      [0, 30000000000]
    ];
    var floods_min_max_array = [
      [1.8190580436, 8.4078522747],
      [24.3252, 4814280.64],
      [0, 266],
      [0, 300000],
      [0, 60000000000]
    ];
    var storms_min_max_array = [
      [1, 5],
      [95, 295],
      [1, 3042],
      [0, 0],
      [0, 158000000000]
    ];
    var tsunamis_min_max_array = [
      [4.4, 8.8],
      [5, 156],
      [1, 316000],
      [0, 461823],
      [300000, 86000000000]
    ];
    var extra_flood_data_points = {
      'value_3': {
        'min': 1,
        'max': 2
      }
    }
    var earthquakeDataPoints = createDataPoints(earthquakes_min_max_array);
    var floodDataPoints = createDataPoints(floods_min_max_array, extra_flood_data_points);
    var stormsDataPoints = createDataPoints(storms_min_max_array);
    var tsunamisDataPoints = createDataPoints(tsunamis_min_max_array);
    var dataPointMaps = {
      'earthquakes' : earthquakeDataPoints,
      'floods'      : floodDataPoints,
      'storms'      : stormsDataPoints,
      'tsunamis'    : tsunamisDataPoints
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
        angular.forEach(val, function(data_point_details, data_point_key) {
          layers.push(makeEventLayer(colorFunc, onEachFeature, data_point_key, data_point_details));
        });
      });
    }
    makeLayers(dataPointMaps);

    // Add all layers to a layer group
    $scope.layerGroup = L.layerGroup(layers).addTo($window.mymap);


    // Function to reset all layers of a dataset
    $scope.clearDataset = function(dataset) {
      var ds_layers;
      var dpl = Object.keys(earthquakeDataPoints).length;
      var fpl = Object.keys(floodDataPoints).length;
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
      var common_keys = Object.keys(earthquakeDataPoints);
      var flood_keys = Object.keys(floodDataPoints);
      switch (dataset) {
        case 'earthquakes':
          layer = layers[common_keys.indexOf(data_point)];
          break;
        case 'floods':
          layer = layers[flood_keys.indexOf(data_point) + common_keys.length];
          break;
        case 'storms':
          layer = layers[common_keys.indexOf(data_point) + common_keys.length + flood_keys.length];
          break;
        case 'tsunamis':
          layer = layers[common_keys.indexOf(data_point) + 2*common_keys.length + flood_keys.length];
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
