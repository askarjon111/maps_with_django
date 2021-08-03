const copy = '© <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
const url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const osm = L.tileLayer(url, { attribution: copy })
const map = L.map('map', { layers: [osm], minZoom: 5 })
map.locate()
    .on('locationfound', e => map.setView(e.latlng, 8))
    .on('locationerror', () => map.setView([0, 0], 5))
map.fitWorld();

async function load_markers() {
    const markers_url = `/api/markers/?in_bbox=${map.getBounds().toBBoxString()}`
    const response = await fetch(markers_url)
    const geojson = await response.json()
    return geojson
}
async function render_markers() {
    const markers = await load_markers()
    L.geoJSON(markers).bindPopup(layer => layer.feature.proporties.name).addTo(map) 
}
map.on('moveend', reder_makers)