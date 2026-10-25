import { useCallback, useEffect, useState } from "react";
import { social } from "../services";
import { isAuthenticated } from "../api/client";
import { useApp } from "../context/AppContext";

// Boutiques favorites (cœur sur les cartes) — cache partagé entre écrans
const store = { ids: null, listeners: new Set(), loading: false };
const emit = () => store.listeners.forEach((f) => f({}));

async function load() {
  if (store.loading || !isAuthenticated()) return;
  store.loading = true;
  try {
    const r = await social.getFollowing();
    const list = Array.isArray(r) ? r : r?.establishments || r?.following || [];
    store.ids = new Set(list.map((e) => Number(e.establishment_id || e.id)));
  } catch { store.ids = new Set(); }
  store.loading = false;
  emit();
}

export default function useFollowed() {
  const { user, requireLogin, showToast } = useApp();
  const [, force] = useState({});
  useEffect(() => {
    store.listeners.add(force);
    if (user && store.ids === null) load();
    if (!user) store.ids = null;
    return () => store.listeners.delete(force);
  }, [user]);

  const isFollowed = useCallback((id) => !!store.ids?.has(Number(id)), []);
  const toggle = useCallback((v) => {
    requireLogin("favorite", async () => {
      if (!store.ids) store.ids = new Set();
      const id = Number(v.id);
      const was = store.ids.has(id);
      was ? store.ids.delete(id) : store.ids.add(id);
      emit();
      try { await social.toggleFollow(id); showToast(was ? "Retiré de vos favoris" : "Ajouté à vos favoris"); }
      catch { was ? store.ids.add(id) : store.ids.delete(id); emit(); showToast("Impossible de modifier vos favoris", "error"); }
    });
  }, [requireLogin, showToast]);
  return { isFollowed, toggle };
}
