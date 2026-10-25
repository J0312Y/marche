/**
 * BuyerScreens — Chunk acheteur (lazy loaded)
 * Utilise useApp() au lieu de props
 */
import { useEffect } from "react";
import { useApp } from "../context/AppContext";
import { HomeScr, SearchScr, DetailScr, CompareScr, ReviewsScr, AllProductsScr, FlashScr, CouponsScr, CartScr, CheckoutScr, OrdersScr, TrackingScr, ChatScr, ChatListScr, ChatVendorScr, WishlistScr, NotifScr, ProfileScr, EditProfileScr, AddressesScr, LanguageScr, PasswordScr, VendorScr, RoleRegScr, RegStatusScr, RateDriverScr, LoyaltyScr, PromosScr, StoreScr, CoursierScr, ErrandFormScr, ErrandDetailScr } from "../screens/buyer";
import { SettingsScr, HelpScr, AboutScr, TermsScr, PrivacyScr, DeliveryPolicyScr } from "../screens/common";
import Icon from "../components/Icon";
import CollectionScr from "../screens/buyer/CollectionScr";

// Redirect component — defers setState to useEffect
function Redirect({ action }) {
  useEffect(() => { action(); }, []);
  return null;
}

export default function BuyerScreens() {
  const {
    screen, tab, setTab, setScreen, setHistory,
    go, pop, goHome, switchTo,
    cart, setCart, addToCart, updateCartQty, clearCart,
    appliedCoupon, setAppliedCoupon,
    favs, toggleFav, isFav,
    userRole, vendorPlan, vendorStatus, setVendorStatus, driverStatus, setDriverStatus,
    logout, onRoleApproved, hasVendor, hasDriver,
    userName, lang,
  } = useApp();

  if (!screen) {
    // Onglets « Toters » : Accueil · Recherche · Coursier · Commandes · Compte
    if (tab === 0) return <HomeScr go={go} />;
    if (tab === 1) return <SearchScr go={go} fromTab />;
    if (tab === 2) return <CoursierScr go={go} />;
    if (tab === 3) return <OrdersScr go={go} />;
    return <ProfileScr go={go} userRole={userRole} vendorPlan={vendorPlan} vendorStatus={vendorStatus} driverStatus={driverStatus} onLogout={logout} onRoleApproved={onRoleApproved} />;
  }

  const { type, data } = screen;
  const back = pop;

  switch (type) {
    // Un article s'ouvre par-dessus la page de sa boutique (comme Toters)
    case "detail": return (data?.establishmentId || data?.establishment_id)
      ? <StoreScr key={"s" + (data.establishmentId || data.establishment_id) + "-" + data.id} vendor={{ id: data.establishmentId || data.establishment_id, name: data.vendor || data.establishment_name }} openProduct={data} onBack={back} go={go} />
      : <DetailScr product={data} onBack={back} onAddCart={addToCart} go={go} favs={favs} toggleFav={toggleFav} isFav={isFav} />;
    case "compare": return <CompareScr product={data} onBack={back} />;
    case "reviews": return <ReviewsScr product={data} onBack={back} go={go} />;
    case "vendor": return <StoreScr key={"s" + data?.id} vendor={data} go={go} onBack={back} />;
    case "allProducts": return <AllProductsScr go={go} onBack={back} favs={favs} toggleFav={toggleFav} isFav={isFav} />;
    case "flash": return <FlashScr go={go} onBack={back} favs={favs} toggleFav={toggleFav} isFav={isFav} />;
    case "coupons": return <CouponsScr onBack={back} cart={cart} appliedCoupon={appliedCoupon} onApply={(c)=>{setAppliedCoupon(c);back()}} />;
    // Un panier par boutique (comme Toters) : le paiement ne concerne que la boutique choisie
    case "checkout": return <CheckoutScr onBack={back} goHome={goHome} cart={data?.eid ? cart.filter((c) => Number(c.establishment_id) === Number(data.eid)) : cart} eidParam={data?.eid} clearCart={clearCart} appliedCoupon={appliedCoupon} setAppliedCoupon={setAppliedCoupon} go={go} />;
    case "cart": return <CartScr key={"c" + (data?.eid || "")} eid={data?.eid} go={go} onBack={back} appliedCoupon={appliedCoupon} setAppliedCoupon={setAppliedCoupon} />;
    case "coursier": return <Redirect action={() => { setTab(2); setScreen(null); setHistory([]); }} />;
    case "errand": return <ErrandFormScr type={data?.type} again={data?.again || null} onBack={back} go={go} />;
    case "errandDetail": return <ErrandDetailScr id={data?.id} onBack={() => { setTab(2); setScreen(null); setHistory([]); }} />;
    case "orders": return <Redirect action={() => { setTab(3); setScreen(null); }} />;
    case "search": return <SearchScr key={"q" + (data?.category?.id || "") + (data?.tab || "")} go={go} onBack={back} defaultTab={data?.tab} category={data?.category} />;
    case "tracking": return <TrackingScr onBack={back} go={go} orderId={data?.id} />;
    case "chatDriver": return <ChatScr data={data} onBack={back} />;
    case "chatVendor": return <ChatVendorScr vendor={data} onBack={back} />;
    case "chatList": return <ChatListScr go={go} onBack={back} />;
    case "wishlist": return <WishlistScr go={go} onBack={back} favs={favs} toggleFav={toggleFav} />;
    case "notif": return <NotifScr onBack={back} go={go} />;
    case "editProfile": return <EditProfileScr onBack={back} />;
    case "addresses": return <AddressesScr onBack={back} startAdd={!!data?.add} />;
    case "collection": return <CollectionScr data={data} go={go} onBack={back} />;
    case "settings": return <SettingsScr onBack={back} go={go} />;
    case "help": return <HelpScr onBack={back} />;
    case "deliveryPolicy": return <DeliveryPolicyScr onBack={back} />;
    case "about": return <AboutScr onBack={back} />;
    case "terms": return <TermsScr onBack={back} />;
    case "privacy": return <PrivacyScr onBack={back} />;
    case "language": return <LanguageScr onBack={back} />;
    case "password": return <PasswordScr onBack={back} />;
    case "rateDriver": return <RateDriverScr onBack={back} driver={data} onDone={goHome} />;
    case "promos": return <PromosScr onBack={back} go={go} />;
    case "loyalty": return <LoyaltyScr onBack={back} go={go} />;

    case "regStatus": return <RegStatusScr key={data?.role} onBack={back} go={go} role={data?.role || (vendorStatus==="pending"?"vendor":"driver")} sent={!!data?.sent} />;
    // Une entrée par rôle : on ne redemande jamais « commerçant ou livreur ? »
    case "vendorReg":
    case "driverReg":
    case "roleReg": { // ancien nom, = livreur
      const role = type === "vendorReg" ? "vendor" : "driver";
      const st = role === "vendor" ? vendorStatus : driverStatus;
      // Demande en cours (en attente, validée, suspendue) : on la suit. Refusée : nouvelle demande depuis le début.
      if (st && st !== "none" && st !== "rejected") return <Redirect action={() => go("regStatus", { role, replace: true })} />;
      return <RoleRegScr key={role} role={role} go={go} onBack={back} onPending={(r)=>{if(r==="vendor")setVendorStatus("pending");else setDriverStatus("pending")}} />;
    }
    case "switchVendor": return <Redirect action={() => { if (hasVendor) switchTo("vendor"); else go("vendorReg", { replace: true }); }} />;
    case "switchDriver": return <Redirect action={() => { if (hasDriver) switchTo("driver"); else go("driverReg", { replace: true }); }} />;
    default: return null;
  }
}
