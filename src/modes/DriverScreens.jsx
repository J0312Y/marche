/**
 * DriverScreens — Chunk livreur (lazy loaded)
 * Utilise useApp() au lieu de props
 */
import { useApp } from "../context/AppContext";
import { DrDashboardScr, DrDeliveryScr, DrConfirmScr, DrChatVendorScr, DrChatClientScr, DrHistoryScr, DrDeliveriesScr, DrWalletScr, DrNotifScr, DrProfileScr, DrVehicleScr, DrZonesScr, DrRateVendorScr, DrStatsScr, DrSettingsScr, DrDocumentsScr } from "../screens/driver";
import { PasswordScr } from "../screens/buyer";
import { SettingsScr, HelpScr, AboutScr, TermsScr, PrivacyScr } from "../screens/common";
import Icon from "../components/Icon";

export default function DriverScreens() {
  const { screen, dTab, setDTab, go, pop, switchTo, logout, setScreen, setHistory , lang } = useApp();

  if (!screen) {
    if (dTab === 0) return <DrDashboardScr go={go} />;
    if (dTab === 1) return <DrDeliveriesScr go={go} onBack={() => setDTab(0)} />;
    if (dTab === 2) return <DrWalletScr go={go} onBack={() => setDTab(0)} />;
    if (dTab === 3) return <DrNotifScr onBack={() => setDTab(0)} />;
    return <DrProfileScr go={go} onSwitch={() => switchTo("buyer")} onLogout={logout} />;
  }

  const { type, data } = screen;
  const back = pop;

  switch (type) {
    case "drDelivery": return <DrDeliveryScr delivery={data} go={go} onBack={back} />;
    case "drConfirm": return <DrConfirmScr delivery={data} go={go} onBack={() => { setScreen(null); setDTab(0); setHistory([]); }} />;
    case "drChatVendor": return <DrChatVendorScr delivery={data} onBack={back} />;
    case "drChatClient": return <DrChatClientScr delivery={data} onBack={back} />;
    case "drHistory": return <DrHistoryScr onBack={back} />;
    case "drWallet": return <DrWalletScr go={go} onBack={back} />;
    case "drNotif": return <DrNotifScr onBack={back} />;
    case "drVehicle": return <DrVehicleScr onBack={back} go={go} />;
    case "drRateVendor": return <DrRateVendorScr onBack={back} vendor={data} />;
    case "drZones": return <DrZonesScr onBack={back} />;
    case "drStats": return <DrStatsScr onBack={back} />;
    case "drSettings": return <DrSettingsScr onBack={back} go={go} />;

    case "drDocuments": return <DrDocumentsScr onBack={back} />;
    case "drHelp": return <HelpScr onBack={back} audience="driver" />;
    case "password": return <PasswordScr onBack={back} />;
    case "terms": return <TermsScr onBack={back} />;
    case "privacy": return <PrivacyScr onBack={back} />;
    case "help": return <HelpScr onBack={back} />;
    case "about": return <AboutScr onBack={back} />;
    default: return null;
  }
}
