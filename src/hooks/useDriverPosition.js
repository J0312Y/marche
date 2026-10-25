import { useEffect, useRef, useState } from "react";
import { Capacitor, registerPlugin } from "@capacitor/core";
import driverService from "../services/driverService";
import toast from "../utils/toast";

const EVERY_MS = 15000;
// Suivi en arrière-plan (téléphone verrouillé, autre application ouverte) : service Android avec notification
// permanente « Lamuka suit votre course » (@capacitor-community/background-geolocation)
const BackgroundGeolocation = registerPlugin("BackgroundGeolocation");

/**
 * Position GPS du livreur pendant une course : suivie en continu et envoyée au serveur
 * pour que le client et le commerce voient le livreur sur la carte.
 * Envoi immédiat de la première position, puis au plus toutes les 15 s, y compris écran verrouillé
 * (application installée) ; la dernière position est renvoyée toutes les 15 s même à l'arrêt
 * (sinon le client garderait une position périmée).
 * Retourne { lat, lng } ou null tant que la position n'est pas connue / refusée.
 */
export default function useDriverPosition(active = true) {
  const [pos, setPos] = useState(null);
  const latest = useRef(null);
  const sent = useRef(null);
  const sentAt = useRef(0);
  useEffect(() => {
    if (!active) return;
    let stop = () => {};
    const push = (force) => {
      const p = latest.current;
      if (!p) return;
      const same = sent.current && sent.current.lat === p.lat && sent.current.lng === p.lng;
      if (same && !force) return;
      sent.current = p; sentAt.current = Date.now();
      driverService.updateLocation(p.lat, p.lng).catch(() => { sent.current = null; });
    };
    const onPos = (lat, lng) => {
      const p = { lat, lng };
      latest.current = p;
      setPos(p);
      // première position tout de suite ; ensuite au plus toutes les 15 s (le minuteur peut être ralenti en arrière-plan)
      if (!sent.current || Date.now() - sentAt.current >= EVERY_MS - 1000) push();
    };

    if (Capacitor.isNativePlatform()) {
      let id = null, gone = false;
      BackgroundGeolocation.addWatcher({
        backgroundTitle: "Lamuka suit votre course",
        backgroundMessage: "Votre position est partagée avec le client jusqu'à la livraison.",
        requestPermissions: true, stale: false, distanceFilter: 10,
      }, (loc, err) => {
        if (err) {
          // Localisation refusée : le client ne verrait plus le livreur avancer
          if (err.code === "NOT_AUTHORIZED") toast.error("Autorisez la localisation de Lamuka (Réglages du téléphone) pour que le client vous suive");
          return;
        }
        if (loc) onPos(loc.latitude, loc.longitude);
      }).then((w) => { id = w; if (gone) BackgroundGeolocation.removeWatcher({ id }); }).catch(() => {});
      stop = () => { gone = true; if (id) BackgroundGeolocation.removeWatcher({ id }); };
    } else if (navigator.geolocation) {
      const wid = navigator.geolocation.watchPosition((g) => onPos(g.coords.latitude, g.coords.longitude), () => {},
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 });
      stop = () => navigator.geolocation.clearWatch(wid);
    }
    const timer = setInterval(() => push(true), EVERY_MS); // même à l'arrêt : la position reste « fraîche » pour le client
    return () => { stop(); clearInterval(timer); };
  }, [active]);
  return pos;
}
