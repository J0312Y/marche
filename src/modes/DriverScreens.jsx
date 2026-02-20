/**
 * DriverScreens — Chunk livreur (lazy loaded)
 * Contient tous les écrans du mode livreur
 */
import {
  DrDashboardScr, DrDeliveryScr, DrConfirmScr, DrNavigationScr,
  DrChatVendorScr, DrChatClientScr, DrHistoryScr, DrWalletScr,
  DrNotifScr, DrProfileScr, DrVehicleScr, DrZonesScr,
  DrStatsScr, DrSettingsScr, DrHelpScr
} from "../screens/driver";
import { WithdrawScr } from "../screens/buyer";

export default function DriverScreens({ screen, dTab, setDTab, go, pop, switchTo, onLogout, setScreen, setHistory }) {
  if (!screen) {
    if (dTab === 0) return <DrDashboardScr go={go} />;
    if (dTab === 1) return <DrHistoryScr onBack={() => setDTab(0)} />;
    if (dTab === 2) return <DrWalletScr go={go} onBack={() => setDTab(0)} />;
    if (dTab === 3) return <DrNotifScr onBack={() => setDTab(0)} />;
    return <DrProfileScr go={go} onSwitch={() => switchTo("buyer")} onLogout={onLogout} />;
  }

  const { type, data } = screen;
  const back = pop;

  switch (type) {
    case "drDelivery": return <DrDeliveryScr delivery={data} go={go} onBack={back} />;
    case "drConfirm": return <DrConfirmScr delivery={data} go={go} onBack={() => { setScreen(null); setDTab(0); setHistory([]); }} />;
    case "drNavigation": return <DrNavigationScr delivery={data} go={go} onBack={back} />;
    case "drChatVendor": return <DrChatVendorScr delivery={data} onBack={back} />;
    case "drChatClient": return <DrChatClientScr delivery={data} onBack={back} />;
    case "drHistory": return <DrHistoryScr onBack={back} />;
    case "drWallet": return <DrWalletScr go={go} onBack={back} />;
    case "drWithdraw": return <WithdrawScr onBack={back} mode="driver" />;
    case "drNotif": return <DrNotifScr onBack={back} />;
    case "drVehicle": return <DrVehicleScr onBack={back} />;
    case "drZones": return <DrZonesScr onBack={back} />;
    case "drStats": return <DrStatsScr onBack={back} />;
    case "drSettings": return <DrSettingsScr onBack={back} go={go} />;
    case "drHelp": return <DrHelpScr onBack={back} />;
    default: return null;
  }
}
