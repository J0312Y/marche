/**
 * VendorScreens — Chunk vendeur (lazy loaded)
 * Utilise useApp() au lieu de props
 */
import { useApp } from "../context/AppContext";
import { VDashboardScr, VOrdersScr, VOrderDetailScr, VProductsScr, VProductFormScr, VStatsScr, VClientsScr, VReviewsScr, VPromosScr, VNotifScr, VSettingsScr, VProfileScr, ShopTeamTab, VAnalyticsScr, VMessagesScr, VChatScr, VDriverChatScr } from "../screens/vendor";
import VStatementsScr from "../screens/vendor/VStatementsScr";
import VDriversScr from "../screens/vendor/VDriversScr";
import VSectionsScr from "../screens/vendor/VSectionsScr";
import VQuestionsScr from "../screens/vendor/VQuestionsScr";

import { SettingsScr, HelpScr, AboutScr, TermsScr, PrivacyScr } from "../screens/common";
import Icon from "../components/Icon";

export default function VendorScreens() {
  const { screen, vTab, setVTab, go, pop, switchTo, vendorPlan, setVendorPlan, logout, lang } = useApp();

  if (!screen) {
    if (vTab === 0) return <VDashboardScr go={go} />;
    if (vTab === 1) return <VOrdersScr go={go} />;
    if (vTab === 2) return <VProductsScr go={go} />;
    if (vTab === 3) return <VMessagesScr go={go} />;
    return <VProfileScr go={go} onSwitch={() => switchTo("buyer")} vendorPlan={vendorPlan} onLogout={logout} />;
  }

  const { type, data } = screen;
  const back = pop;

  switch (type) {
    case "vOrderDetail": return <VOrderDetailScr order={data} onBack={back} go={go} />;
    case "vOrdersList": return <VOrdersScr go={go} onBack={back} />;
    case "vProducts": return <VProductsScr go={go} onBack={back} />;
    case "vSections": return <VSectionsScr onBack={back} />;
    case "vQuestions": return <VQuestionsScr onBack={back} />;
    case "vAddProduct": return <VProductFormScr onBack={back} />;
    case "vEditProduct": return <VProductFormScr product={data} onBack={back} />;
    case "vStats": return <VAnalyticsScr onBack={back} />; // statistiques réelles (ouvert à tous les plans)
    case "vReviews": return <VReviewsScr onBack={back} />;
    case "vStatements": return <VStatementsScr onBack={back} />;
    case "vDrivers": return <VDriversScr onBack={back} />;
    case "vChat": return <VChatScr chat={data} onBack={back} />;
    case "vDriverChat": return <VDriverChatScr delivery={data} onBack={back} />;
    case "vPromos": return <VPromosScr go={go} onBack={back} />;
    case "vNotif": return <VNotifScr onBack={back} go={go} />;
    case "vClients": return <VClientsScr go={go} onBack={back} />;
    case "vSettings": return <VSettingsScr onBack={back} go={go} />;

    case "terms": return <TermsScr onBack={back} />;
    case "privacy": return <PrivacyScr onBack={back} />;
    case "help": return <HelpScr onBack={back} />;
    case "about": return <AboutScr onBack={back} />;
    default: return null;
  }
}
