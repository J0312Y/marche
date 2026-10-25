import { Capacitor, SystemBars, SystemBarsStyle } from "@capacitor/core";

/** Icônes de la barre d'état : blanches (fond sombre) ou foncées (fond clair). Sans effet sur le web. */
export function setBarsOnDark(dark) {
  if (!Capacitor.isNativePlatform()) return;
  SystemBars.setStyle({ style: dark ? SystemBarsStyle.Dark : SystemBarsStyle.Light, bar: "StatusBar" }).catch(() => {});
}
