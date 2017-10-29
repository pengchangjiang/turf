var map, createType = 1;//0,1,2:point,line,polygon
var pointArr = [], layerGroup, polygonG, polylineG;
function init() {
    map = L.map('map', { center: [36.77, 111.13], zoom: 4, doubleClickZoom: false });
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    layerGroup = L.layerGroup().addTo(map);
    initMapEvent();
}
init();
/**
 * 清除
 */
function clearTest() {
    layerGroup.clearLayers();
    createType = -1;
    pointArr = [];
}
/**
 * 创建点
 */
function changeCursor(grab) {
    var mapC = L.DomUtil.get('map');
    if (grab) {
        L.DomUtil.addClass(mapC, 'leaflet-grab');
    } else {
        L.DomUtil.removeClass(mapC, 'leaflet-grab');
    }
}
function create(type) {
    changeCursor(false);
    createType = type;
}
function finishCreate() {
    changeCursor(true);
}
/**
 * 激活地图事件
 */
function initMapEvent() {

    map.on('click', function (e) {
        var latlng = e.latlng;
        switch (createType) {
            case 0:
                layerGroup.addLayer(L.marker([latlng.lat, latlng.lng]));
                break;
            case 1:
            case 2:
                pointArr.push([latlng.lng, latlng.lat]);
                break;
        }
    });
    map.on('dblclick', function (e) {
        var latlngs = pointArr.map(function (lnglat) {
            return [lnglat[1], lnglat[0]];
        });

        var geoLayer = null;
        switch (createType) {
            case 1:
                polylineG = L.polyline(latlngs, { color: '#674' });
                geoLayer = polylineG;
                break;
            case 2:
                polygonG = L.polygon(latlngs, { color: '#674' });
                geoLayer = polygonG;
                break;
        }
        layerGroup.addLayer(geoLayer);
    })
}
/**
 * along 示例
 */
function alongTest() {
    // var lnglats = [[116.45, 39.77], [112.41, 37.57], [110.91, 34.88], [112.93, 27.76]];
    var line = turf.lineString(pointArr);
    var along = turf.along(line, 200, 'miles');
    var alongMarker = L.marker(along.geometry.coordinates.reverse());
    layerGroup.addLayer(alongMarker);
}

/**
 * 计算面积
 */
function area() {
    pointArr.push(pointArr[0]);
    var polygon = turf.polygon([pointArr]);//必须闭合，首尾结合
    var area = turf.area(polygon);
    polygonG.bindPopup('面积：' + area + '平方米').openPopup();

}