requirejs.config({
    'baseUrl': '../lib/leaflet.wms/lib',
    'paths': {
        'leaflet.wms': '../dist/leaflet.wms' //.js'
    }
});

define(['leaflet', 'leaflet.wms'],
function(L, wms) {

//var overlayMap = createMap('overlay-map', false);
//var tiledMap = createMap('tiled-map', true);
var tiledMap = createMap('mapid', true);

function createMap(div, tiled) {
    // Map configuration
    var map = L.map(div,  {
        center: [0, 0],
        zoom: 3,
        // Values are x and y here instead of lat and long elsewhere.
        maxBounds: [
            [-120, -220],
            [120, 220]
        ]
    });
    map.fitBounds([[36.533333, -83.683333], [39.466667, -75.25]]);

    var basemaps = {
        'Basemap': basemap().addTo(map)//,
        //'Reference': reference_layer().addTo(map)
    };

    var MySource = wms.Source.extend({
        'showFeatureInfo': function(latlng, info) {
            console.log("info:");
            console.log(info);
            // Hook to handle displaying parsed AJAX response to the user
            if (!this._map) {
              return;
            }
            this._map.openPopup(info, latlng);
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
            "tiled": tiled
        }
    var mbps3 = new MySource( "https://www.broadbandmap.gov/geoserver/gwc/service/wms", props).getLayer("fcc:wl_down_5_f2014");
    var mbps6 = new MySource( "https://www.broadbandmap.gov/geoserver/gwc/service/wms", props).getLayer("fcc:wl_down_6_f2014");
    var mbps10 = new MySource( "https://www.broadbandmap.gov/geoserver/gwc/service/wms", props).getLayer("fcc:wl_down_7_f2014");
    var mbps25 = new MySource( "https://www.broadbandmap.gov/geoserver/gwc/service/wms", props).getLayer("fcc:wl_down_8_f2014");
    var mbps50 = new MySource( "https://www.broadbandmap.gov/geoserver/gwc/service/wms", props).getLayer("fcc:wl_down_9_f2014");
    var mbps100 = new MySource( "https://www.broadbandmap.gov/geoserver/gwc/service/wms", props).getLayer("fcc:wl_down_10_f2014");
    var gbps1 = new MySource( "https://www.broadbandmap.gov/geoserver/gwc/service/wms", props).getLayer("fcc:wl_down_11_f2014");

    var placeLabels = wms.tileLayer("https://services.nationalmap.gov/arcgis/services/geonames/MapServer/WMSServer", {
      'format': "image/png",
      'layers': '5',
      'transparent': true
    });

    var layers = {
        '3-6 MBPS': mbps3,
        '6-10 MBPS': mbps6,
        '10-25 MBPS': mbps10,
        '25-50 MBPS': mbps25,
        '50-100 MBPS': mbps50,
        '100 MBPS - 1 GBPS': mbps100,
        '1 GBPS+': gbps1,
        'places': placeLabels
    };

    // Create layer control
    L.control.layers(basemaps, layers).addTo(map);

    //source.setOpacity(0.6);

    basemap().addTo(map)
    //reference_layer().addTo(map)

    return map;
}

function basemap() {
  return L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>  contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
      id: 'mapbox.streets'
    })
}

function reference_layer(){
  //Right now this does not work because it is a different projection.  Need to integrate proj4leaflet
  var template =
    "https://map1b.vis.earthdata.nasa.gov/wmts-webmerc/wmts.cgi?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=Reference_Features&STYLE=&TILEMATRIXSET=EPSG4326_250m&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fpng"
  return L.tileLayer(template, {
    name: 'Borders and Roads *',
    product: 'Reference_Features',
    resolution: '250m',
    format: 'png',
    maxNativeZoom: 7,
    tileSize: 512,
    projection: "EPSG:4326",
    attribution:
    "<a href='https://wiki.earthdata.nasa.gov/display/GIBS'>" +
        "NASA EOSDIS GIBS</a>&nbsp;&nbsp;&nbsp;" +
        "<a href='https://github.com/nasa-gibs/web-examples/blob/release/examples/leaflet/webmercator-epsg3857.js'>" +
        "View Source" +
        "</a>"
});

}

// Export maps for console experimentation
return {
    'maps': {
        'tiled': tiledMap
    }
};

});
