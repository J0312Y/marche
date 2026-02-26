/**
 * VendorScreens — Chunk vendeur (lazy loaded)
 * Utilise useApp() au lieu de props
 */
import { useApp } from "../context/AppContext";
import {
  VDashboardScr, VOrdersScr, VOrderDetailScr, VProductsScr, VProductFormScr,
  VWalletScr, VStatsScr, VMessagesScr, VChatScr, VReviewsScr,
  VPromosScr, VCreatePromoScr, VAssignDriverScr, VDeliveryScr,
  VAddDriverScr, VDriverProfileScr, VTrackDeliveryScr, VDriverChatScr,
  VNotifScr, VSettingsScr, VReportsScr, VSupportScr, VProfileScr,
  VShopsScr, ShopTeamTab, VShopDetailScr, VAddShopScr,
  VApiScr, VDocScr, VUpgradePlanScr
} from "../screens/vendor";
import { WithdrawScr } from "../screens/buyer";
import { SettingsScr, HelpScr, AboutScr, TermsScr, PrivacyScr } from "../screens/common";

export default function VendorScreens() {
  const { screen, vTab, setVTab, go, pop, switchTo, vendorPlan, setVendorPlan, logout } = useApp();

  if (!screen) {
    if (vTab === 0) return <VDashboardScr go={go} />;
    if (vTab === 1) return <VOrdersScr go={go} />;
    if (vTab === 2) return <VProductFormScr onBack={() => setVTab(0)} />;
    if (vTab === 3) return <VMessagesScr go={go} />;
    return <VProfileScr go={go} onSwitch={() => switchTo("buyer")} vendorPlan={vendorPlan} onLogout={logout} />;
  }

  const { type, data } = screen;
  const back = pop;

  switch (type) {
    case "vOrderDetail": return <VOrderDetailScr order={data} onBack={back} go={go} />;
    case "vOrdersList": return <VOrdersScr go={go} onBack={back} />;
    case "vProducts": return <VProductsScr go={go} onBack={back} />;
    case "vAddProduct": return <VProductFormScr onBack={back} />;
    case "vEditProduct": return <VProductFormScr product={data} onBack={back} />;
    case "vWallet": return <VWalletScr go={go} onBack={back} />;
    case "vWithdraw": return <WithdrawScr onBack={back} mode="vendor" />;
    case "vStats": return <VStatsScr onBack={back} />;
    case "vChat": return <VChatScr chat={data} onBack={back} />;
    case "vReviews": return <VReviewsScr onBack={back} />;
    case "vPromos": return <VPromosScr go={go} onBack={back} />;
    case "vCreatePromo": return <VCreatePromoScr onBack={back} />;
    case "vDelivery": return <VDeliveryScr go={go} onBack={back} />;
    case "vAssignDriver": return <VAssignDriverScr order={data} onBack={back} go={go} />;
    case "vAddDriver": return <VAddDriverScr onBack={back} />;
    case "vUpgradePlan": return <VUpgradePlanScr onBack={back} onUpgrade={(p) => setVendorPlan(p)} />;
    case "vDriverProfile": return <VDriverProfileScr driver={data} go={go} onBack={back} />;
    case "vTrackDelivery": return <VTrackDeliveryScr delivery={data} go={go} onBack={back} />;
    case "vDriverChat": return <VDriverChatScr delivery={data} onBack={back} />;
    case "vNotif": return <VNotifScr onBack={back} />;
    case "vSettings": return <VSettingsScr onBack={back} go={go} />;
    case "vReports": return <VReportsScr onBack={back} />;
    case "vSupport": return <VSupportScr go={go} onBack={back} vendorPlan={vendorPlan} />;
    case "vShops": return <VShopsScr go={go} onBack={back} />;
    case "vShopDetail": return <VShopDetailScr shop={data} go={go} onBack={back} />;
    case "vAddShop": return <VAddShopScr onBack={back} />;
    case "vApi": return <VApiScr go={go} onBack={back} />;
    case "vDoc": return <VDocScr docKey={data} onBack={back} />;
    case "terms": return <TermsScr onBack={back} />;
    case "privacy": return <PrivacyScr onBack={back} />;
    case "help": return <HelpScr onBack={back} />;
    case "about": return <AboutScr onBack={back} />;
    default: return null;
  }
}
