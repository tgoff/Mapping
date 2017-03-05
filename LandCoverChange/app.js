requirejs.config({
    'baseUrl': 'leaflet.wms/lib',
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
    var source = new MySource(
        "https://raster.nationalmap.gov/arcgis/services/LandCover/USGS_EROS_LandCover_NLCD/MapServer/WMSServer",
        {
            "format": "image/png",
            "transparent": "true",
            "attribution": "<a href='http://nationalatlas.gov'>NationalAtlas.gov</a>",
            "info_format": "text/html",
            "tiled": tiled
        }
    );

    var layers = {
        'Land_Cover_1992': source.getLayer("1"),
        'Land_Cover_2001': source.getLayer("15"),
        'Land_Cover_2006': source.getLayer("24"),
        'Land_Cover_2011': source.getLayer("33")
    };

    // Create layer control
    L.control.layers(basemaps, layers).addTo(map);

    source.setOpacity(0.6);

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
