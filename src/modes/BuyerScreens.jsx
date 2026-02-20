/**
 * BuyerScreens — Chunk acheteur (lazy loaded)
 * Contient tous les écrans du mode acheteur
 */
import {
  HomeScr, SearchScr, DetailScr, GalleryScr, CompareScr, ReviewsScr,
  RestoListScr, AllProductsScr, CategoriesScr, FlashScr, NearbyScr,
  CouponsScr, CartScr, CheckoutScr, OrdersScr, OrderDetailScr,
  TrackingScr, ChatScr, ChatListScr, ChatVendorScr, WishlistScr,
  NotifScr, ProfileScr, EditProfileScr, AddressesScr,
  LanguageScr, CurrencyScr, PasswordScr, RechargeScr, WithdrawScr,
  VendorScr, RoleRegScr
} from "../screens/buyer";
import { SettingsScr, HelpScr, AboutScr, TermsScr, PrivacyScr } from "../screens/common";

export default function BuyerScreens({ screen, tab, setTab, go, pop, goHome, cart, setCart, addCart, favs, toggleFav, isFav, userRole, vendorPlan, vendorStatus, driverStatus, onLogout, onRoleApproved, hasVendor, hasDriver, switchTo, setScreen, setHistory }) {
  // Tab screens (no deep screen)
  if (!screen) {
    if (tab === 0) return <HomeScr go={go} favs={favs} toggleFav={toggleFav} isFav={isFav} />;
    if (tab === 1) return <SearchScr go={go} fromTab favs={favs} toggleFav={toggleFav} isFav={isFav} />;
    if (tab === 2) return <CartScr cart={cart} setCart={setCart} go={go} />;
    if (tab === 3) return <OrdersScr go={go} />;
    return <ProfileScr go={go} userRole={userRole} vendorPlan={vendorPlan} vendorStatus={vendorStatus} driverStatus={driverStatus} onLogout={onLogout} />;
  }

  const { type, data } = screen;
  const back = pop;

  switch (type) {
    case "detail": return <DetailScr product={data} onBack={back} onAddCart={addCart} go={go} favs={favs} toggleFav={toggleFav} isFav={isFav} />;
    case "gallery": return <GalleryScr product={data} onClose={back} />;
    case "compare": return <CompareScr product={data} onBack={back} />;
    case "reviews": return <ReviewsScr product={data} onBack={back} />;
    case "vendor": return <VendorScr vendor={data} go={go} onBack={back} />;
    case "cats": return <CategoriesScr go={go} onBack={back} />;
    case "restoList": return <RestoListScr go={go} onBack={back} favs={favs} toggleFav={toggleFav} isFav={isFav} />;
    case "allProducts": return <AllProductsScr go={go} onBack={back} favs={favs} toggleFav={toggleFav} isFav={isFav} />;
    case "flash": return <FlashScr go={go} onBack={back} favs={favs} toggleFav={toggleFav} isFav={isFav} />;
    case "nearby": return <NearbyScr go={go} onBack={back} />;
    case "coupons": return <CouponsScr onBack={back} />;
    case "checkout": return <CheckoutScr onDone={goHome} />;
    case "cart": setTab(2); setScreen(null); return null;
    case "orders": setTab(3); setScreen(null); return null;
    case "search": setTab(1); setScreen(null); return null;
    case "orderDetail": return <OrderDetailScr order={data} onBack={back} go={go} />;
    case "tracking": return <TrackingScr onBack={back} go={go} />;
    case "chatDriver": return <ChatScr onBack={back} />;
    case "chatVendor": return <ChatVendorScr vendor={data} onBack={back} />;
    case "chatList": return <ChatListScr go={go} onBack={back} />;
    case "wishlist": return <WishlistScr go={go} onBack={back} favs={favs} toggleFav={toggleFav} />;
    case "notif": return <NotifScr onBack={back} />;
    case "editProfile": return <EditProfileScr onBack={back} />;
    case "addresses": return <AddressesScr onBack={back} />;
    case "settings": return <SettingsScr onBack={back} go={go} />;
    case "help": return <HelpScr onBack={back} />;
    case "about": return <AboutScr onBack={back} />;
    case "terms": return <TermsScr onBack={back} />;
    case "privacy": return <PrivacyScr onBack={back} />;
    case "language": return <LanguageScr onBack={back} />;
    case "currency": return <CurrencyScr onBack={back} />;
    case "password": return <PasswordScr onBack={back} />;
    case "recharge": return <RechargeScr onBack={back} />;
    case "roleReg": return <RoleRegScr onBack={back} onDone={(role, plan) => { onRoleApproved(role, plan); goHome(); }} />;
    case "vendorReg": return <RoleRegScr onBack={back} onDone={(role, plan) => { onRoleApproved(role, plan); goHome(); }} forceRole="vendor" />;
    case "switchVendor": if (hasVendor) { switchTo("vendor") } else { go("roleReg") }; return null;
    case "switchDriver": if (hasDriver) { switchTo("driver") } else { go("roleReg") }; return null;
    default: return null;
  }
}
