/**
 * DriverScreens — Chunk livreur (lazy loaded)
 * Utilise useApp() au lieu de props
 */
import { useApp } from "../context/AppContext";
import {
  DrDashboardScr, DrDeliveryScr, DrConfirmScr, DrNavigationScr,
  DrChatVendorScr, DrChatClientScr, DrHistoryScr, DrWalletScr,
  DrNotifScr, DrProfileScr, DrVehicleScr, DrZonesScr,
  DrStatsScr, DrSettingsScr, DrHelpScr
} from "../screens/driver";
import { WithdrawScr } from "../screens/buyer";
import { SettingsScr, HelpScr, AboutScr, TermsScr, PrivacyScr } from "../screens/common";

export default function DriverScreens() {
  const { screen, dTab, setDTab, go, pop, switchTo, logout, setScreen, setHistory } = useApp();

  if (!screen) {
    if (dTab === 0) return <DrDashboardScr go={go} />;
    if (dTab === 1) return <DrHistoryScr onBack={() => setDTab(0)} />;
    if (dTab === 2) return <DrWalletScr go={go} onBack={() => setDTab(0)} />;
    if (dTab === 3) return <DrNotifScr onBack={() => setDTab(0)} />;
    return <DrProfileScr go={go} onSwitch={() => switchTo("buyer")} onLogout={logout} />;
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
    case "terms": return <TermsScr onBack={back} />;
    case "privacy": return <PrivacyScr onBack={back} />;
    case "help": return <HelpScr onBack={back} />;
    case "about": return <AboutScr onBack={back} />;
    default: return null;
  }
}
