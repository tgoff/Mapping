requirejs.config({
    'baseUrl': '../lib/leaflet.wms/lib',
    'paths': {
        'leaflet.wms': '../dist/leaflet.wms' //.js'
    }
});

define(['leaflet', 'leaflet.wms'],
function(L, wms) {

var tiledMap = createMap('mapid', true);

function createMap(div, tiled) {
    // Map configuration
    var map = L.map(div,  {
        center: [37.0552645,-80.7815427],
        zoom: 10,
        // Values are x and y here instead of lat and long elsewhere.
        maxBounds: [
            [-120, -220],
            [120, 220]
        ]
    });
    //Create custom pane to put labels on top of everything
    map.createPane('labels');
    map.getPane('labels').style.zIndex = 650;
    map.getPane('labels').style.pointerEvents = 'none';


    var basemaps = {
        'Basemap': basemap().addTo(map)//,
        //'Reference': reference_layer().addTo(map)
    };

    var MySource = wms.Source.extend({
        'showFeatureInfo': function(latlng, info) {
          //dont display an info popup.  its pretty useless on these layers
          return;
        }
    });
    // Add WMS source/layers
    var props =
        {
            "format": "image/png",
            "transparent": "true",
            "attribution": "<a href='http://nationalatlas.gov'>NationalAtlas.gov</a>",
            "info_format": "text/html",
            "opacity" : 0.4,
            "tiled" : tiled,
            "attribution": '<a href="https://www.broadbandmap.gov/">FCC National Broadband Map</a>'
        }
    //Wired
    //  Low
    var kbps768 = new MySource( "https://www.broadbandmap.gov/geoserver/gwc/service/wms", props).getLayer("fcc:wl_down_3_f2014");
    var mbps1_5 = new MySource( "https://www.broadbandmap.gov/geoserver/gwc/service/wms", props).getLayer("fcc:wl_down_4_f2014");
    //  Medium
    var mbps3 = new MySource( "https://www.broadbandmap.gov/geoserver/gwc/service/wms", props).getLayer("fcc:wl_down_5_f2014");
    var mbps6 = new MySource( "https://www.broadbandmap.gov/geoserver/gwc/service/wms", props).getLayer("fcc:wl_down_6_f2014");
    var mbps10 = new MySource( "https://www.broadbandmap.gov/geoserver/gwc/service/wms", props).getLayer("fcc:wl_down_7_f2014");
    //  High
    var mbps25 = new MySource( "https://www.broadbandmap.gov/geoserver/gwc/service/wms", props).getLayer("fcc:wl_down_8_f2014");
    var mbps50 = new MySource( "https://www.broadbandmap.gov/geoserver/gwc/service/wms", props).getLayer("fcc:wl_down_9_f2014");
    var mbps100 = new MySource( "https://www.broadbandmap.gov/geoserver/gwc/service/wms", props).getLayer("fcc:wl_down_10_f2014");
    var gbps1 = new MySource( "https://www.broadbandmap.gov/geoserver/gwc/service/wms", props).getLayer("fcc:wl_down_11_f2014");


    var lowspeedLayers =  L.layerGroup([
         kbps768,
         mbps1_5] );
    var midspeedLayers = L.layerGroup([
         mbps3,
         mbps6]);
    var highspeedLayers = L.layerGroup([
         mbps10,
         mbps25,
         mbps50,
         mbps100,
         gbps1]);
    var placeLabels = wms.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}", {
      'format': "image/png",
      'pane': 'labels'
    });
    var displayLayers = {
        '768 KBPS - 3MBPS' : lowspeedLayers,
        '3 MBPS - 10 MBPS' : midspeedLayers,
        '10 MBPS +' : highspeedLayers,
        'labels' : placeLabels
    };

    //Add layers
    midspeedLayers.addTo(map);
    highspeedLayers.addTo(map);
    placeLabels.addTo(map);
    placeLabels.bringToFront();

    // Create layer control
    L.control.layers(basemaps, displayLayers).addTo(map);

    basemap().addTo(map)

    return map;
}

function basemap() {
  return L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png', {
      maxZoom: 18,
      attribution: 'Map data and Imagery &copy; <a href="http://www.arcgis.com">ArcGIS</a>'
    })
}

// Export maps for console experimentation
return {
    'maps': {
        'tiled': tiledMap
    }
};

});
