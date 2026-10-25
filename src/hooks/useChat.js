/**
 * useChat — conversation réelle entre deux utilisateurs (aucune réponse simulée)
 *
 * target :
 *   { convId }                                   conversation existante
 *   { establishment_id }                         client → boutique
 *   { order_id, with: 'vendor'|'driver'|'client' } conversation liée à une commande
 *
 * Les nouveaux messages sont récupérés toutes les 5 s tant que l'écran est ouvert.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import chatAPI from '../api/chat';

const POLL_MS = 5000;

const fmtTime = (d) => {
  const t = d ? new Date(String(d).replace(' ', 'T')) : new Date();
  if (isNaN(t)) return '';
  return `${t.getHours()}:${String(t.getMinutes()).padStart(2, '0')}`;
};

const mapMessage = (m) => ({
  id: m.id,
  from: m.is_mine ? 'user' : 'other',
  text: m.content,
  type: m.type || 'text',
  fileUrl: m.file_url || null,
  time: fmtTime(m.created_at),
  read: String(m.is_read) === '1',
});

export function useChat(target) {
  const [convId, setConvId] = useState(target?.convId || null);
  const [other, setOther] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const alive = useRef(true);
  const key = JSON.stringify(target || {});

  // 1. Ouvrir (ou retrouver) la conversation
  useEffect(() => {
    alive.current = true;
    setError(null);
    setLoading(true);
    if (target?.convId) { setConvId(target.convId); return; }
    if (!target || (!target.establishment_id && !target.order_id)) {
      setLoading(false);
      setError('Conversation indisponible');
      return;
    }
    chatAPI.create(target)
      .then((res) => {
        if (!alive.current) return;
        setConvId(res?.conversation?.id || null);
        setOther(res?.other || null);
      })
      .catch((err) => {
        if (!alive.current) return;
        setError(err.message || 'Impossible d\'ouvrir la conversation');
        setLoading(false);
      });
    return () => { alive.current = false; };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  // 2. Charger les messages puis rafraîchir périodiquement
  const refresh = useCallback(async () => {
    if (!convId) return;
    try {
      const list = await chatAPI.getMessages(convId);
      if (!alive.current) return;
      setMessages((Array.isArray(list) ? list : list?.messages || []).map(mapMessage));
      setError(null);
    } catch (err) {
      if (alive.current) setError(err.message || 'Impossible de charger les messages');
    } finally {
      if (alive.current) setLoading(false);
    }
  }, [convId]);

  useEffect(() => {
    if (!convId) return;
    alive.current = true;
    refresh();
    chatAPI.markRead(convId).catch(() => {});
    const timer = setInterval(refresh, POLL_MS);
    return () => { clearInterval(timer); alive.current = false; };
  }, [convId, refresh]);

  // 3. Envoyer : le message n'apparaît comme envoyé qu'une fois accepté par le serveur
  const send = useCallback(async (text) => {
    const content = (text || '').trim();
    if (!content || !convId) return false;
    const tempId = 'tmp-' + Date.now();
    setMessages((p) => [...p, { id: tempId, from: 'user', text: content, time: fmtTime(), pending: true }]);
    setSending(true);
    try {
      const res = await chatAPI.send(convId, content);
      setMessages((p) => p.map((m) => (m.id === tempId ? { ...m, id: res?.id ?? tempId, pending: false } : m)));
      return true;
    } catch (err) {
      setMessages((p) => p.map((m) => (m.id === tempId ? { ...m, pending: false, failed: true } : m)));
      setError(err.message || 'Message non envoyé');
      return false;
    } finally {
      setSending(false);
    }
  }, [convId]);

  return { convId, other, messages, loading, error, sending, send, refresh };
}

export default useChat;
