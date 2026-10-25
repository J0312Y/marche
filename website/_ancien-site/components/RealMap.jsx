import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Brazzaville coordinates
const VENDOR = [-4.2634, 15.2429]   // Bacongo area
const CLIENT = [-4.2780, 15.2820]   // Poto-Poto area
const DRIVER = [-4.2710, 15.2650]   // In between

export default function RealMap() {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)

  useEffect(() => {
    if (mapInstance.current) return

    const map = L.map(mapRef.current, {
      center: [-4.2710, 15.2630],
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map)

    // Vendor marker (green)
    const vendorIcon = L.divIcon({
      className: 'map-marker-custom',
      html: `<div style="
        width:32px;height:32px;border-radius:50%;
        background:#008060;border:3px solid #fff;
        box-shadow:0 2px 8px rgba(0,0,0,.3);
        display:flex;align-items:center;justify-content:center;
      "><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    })

    // Client marker (red)
    const clientIcon = L.divIcon({
      className: 'map-marker-custom',
      html: `<div style="
        width:32px;height:32px;border-radius:50%;
        background:#ef4444;border:3px solid #fff;
        box-shadow:0 2px 8px rgba(0,0,0,.3);
        display:flex;align-items:center;justify-content:center;
      "><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    })

    // Driver marker (dark, pulsing)
    const driverIcon = L.divIcon({
      className: 'map-marker-custom',
      html: `<div class="driver-marker-pulse"><div style="
        width:36px;height:36px;border-radius:50%;
        background:#171717;border:3px solid #fff;
        box-shadow:0 2px 12px rgba(0,0,0,.4);
        display:flex;align-items:center;justify-content:center;
        position:relative;z-index:2;
      "><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg></div></div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    })

    L.marker(VENDOR, { icon: vendorIcon }).addTo(map)
      .bindTooltip('Vendeur', { permanent: true, direction: 'top', className: 'map-tooltip', offset: [0, -18] })

    L.marker(CLIENT, { icon: clientIcon }).addTo(map)
      .bindTooltip('Vous', { permanent: true, direction: 'top', className: 'map-tooltip', offset: [0, -18] })

    const driverMarker = L.marker(DRIVER, { icon: driverIcon }).addTo(map)
      .bindTooltip('Livreur — ETA 12 min', { permanent: true, direction: 'top', className: 'map-tooltip map-tooltip-driver', offset: [0, -20] })

    // Route line
    L.polyline([VENDOR, DRIVER, CLIENT], {
      color: '#008060',
      weight: 3,
      opacity: 0.7,
      dashArray: '8, 8',
    }).addTo(map)

    // Animate driver
    let progress = 0
    const animateDriver = () => {
      progress += 0.002
      if (progress > 0.6) progress = 0.3
      const lat = VENDOR[0] + (CLIENT[0] - VENDOR[0]) * progress
      const lng = VENDOR[1] + (CLIENT[1] - VENDOR[1]) * progress
      driverMarker.setLatLng([lat, lng])
    }
    const interval = setInterval(animateDriver, 100)

    mapInstance.current = map
    return () => {
      clearInterval(interval)
      map.remove()
      mapInstance.current = null
    }
  }, [])

  return <div ref={mapRef} className="real-map" />
}
