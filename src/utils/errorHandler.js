/**
 * errorHandler.js — Global error management for the entire app
 * 
 * Provides:
 * - safeFetch() : wrapper around fetch with timeout + retry + toast on error
 * - safeAsync() : wrapper for any async function with error handling
 * - registerGlobalErrors() : catches uncaught errors and shows user-friendly toasts
 * - getErrorMessage() : converts technical errors into user-friendly French messages
 */

import toast from "./toast";

// ═══════════════════════════════════════════════════════
//  USER-FRIENDLY ERROR MESSAGES
// ═══════════════════════════════════════════════════════

const ERROR_MESSAGES = {
  // Network errors
  NetworkError: "Pas de connexion Internet. Vérifiez votre réseau.",
  TimeoutError: "Délai dépassé. Le serveur ne répond pas.",
  AbortError: "Requête annulée.",
  TypeError: "Problème de connexion. Réessayez.",
  
  // HTTP status codes
  400: "Requête invalide.",
  401: "Vous devez vous reconnecter.",
  403: "Accès refusé.",
  404: "Élément introuvable.",
  408: "Délai dépassé.",
  429: "Trop de tentatives. Patientez quelques instants.",
  500: "Erreur serveur. Réessayez plus tard.",
  502: "Serveur indisponible.",
  503: "Service en maintenance.",
  504: "Le serveur met trop de temps à répondre.",
  
  // Custom
  OFFLINE: "Vous êtes hors ligne. Vérifiez votre connexion.",
  UPLOAD_FAILED: "Échec du téléversement. Réessayez.",
  IMAGE_LOAD_FAILED: "Image impossible à charger.",
  PAYMENT_FAILED: "Le paiement n'a pas pu être traité.",
  PERMISSION_DENIED: "Permission refusée.",
  UNKNOWN: "Une erreur est survenue. Réessayez.",
};

export function getErrorMessage(error) {
  if (!error) return ERROR_MESSAGES.UNKNOWN;
  
  // Offline detection
  if (!navigator.onLine) return ERROR_MESSAGES.OFFLINE;
  
  // HTTP errors
  if (error.status && ERROR_MESSAGES[error.status]) {
    return ERROR_MESSAGES[error.status];
  }
  
  // Named errors
  if (error.name && ERROR_MESSAGES[error.name]) {
    return ERROR_MESSAGES[error.name];
  }
  
  // Custom codes
  if (error.code && ERROR_MESSAGES[error.code]) {
    return ERROR_MESSAGES[error.code];
  }
  
  // Message matching
  const msg = error.message?.toLowerCase() || "";
  if (msg.includes("network") || msg.includes("fetch")) return ERROR_MESSAGES.NetworkError;
  if (msg.includes("timeout") || msg.includes("delai")) return ERROR_MESSAGES.TimeoutError;
  if (msg.includes("abort")) return ERROR_MESSAGES.AbortError;
  
  return ERROR_MESSAGES.UNKNOWN;
}

// ═══════════════════════════════════════════════════════
//  SAFE FETCH — with timeout, retry, error handling
// ═══════════════════════════════════════════════════════

export async function safeFetch(url, options = {}) {
  const {
    timeout = 15000,
    retries = 1,
    silent = false,
    ...fetchOptions
  } = options;

  // Check offline first
  if (!navigator.onLine) {
    const err = new Error("Offline");
    err.code = "OFFLINE";
    if (!silent) toast.error(getErrorMessage(err));
    throw err;
  }

  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const err = new Error(`HTTP ${response.status}`);
        err.status = response.status;
        err.response = response;
        throw err;
      }
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error;
      
      // Don't retry on auth errors or aborts
      if (error.status === 401 || error.status === 403 || error.name === "AbortError") {
        break;
      }
      
      // Last attempt
      if (attempt === retries) break;
      
      // Wait before retry (exponential backoff)
      await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
    }
  }

  // Show toast if not silent
  if (!silent) toast.error(getErrorMessage(lastError));
  throw lastError;
}

// ═══════════════════════════════════════════════════════
//  SAFE ASYNC — wrap any async function with error handling
// ═══════════════════════════════════════════════════════

export async function safeAsync(fn, { silent = false, fallback = null } = {}) {
  try {
    return await fn();
  } catch (error) {
    console.error("safeAsync caught:", error);
    if (!silent) toast.error(getErrorMessage(error));
    return fallback;
  }
}

// ═══════════════════════════════════════════════════════
//  GLOBAL ERROR LISTENERS — uncaught errors, rejections
// ═══════════════════════════════════════════════════════

let isRegistered = false;

export function registerGlobalErrors() {
  if (isRegistered) return;
  isRegistered = true;

  // Uncaught JS errors
  window.addEventListener("error", (e) => {
    // Ignore ResizeObserver errors (browser quirk)
    if (e.message?.includes("ResizeObserver")) return;
    
    console.error("Uncaught error:", e.error);
    // Don't toast for every minor error to avoid spam
    if (e.error && (e.error.code || e.error.status)) {
      toast.error(getErrorMessage(e.error));
    }
  });

  // Uncaught promise rejections
  window.addEventListener("unhandledrejection", (e) => {
    console.error("Unhandled promise rejection:", e.reason);
    if (e.reason && (e.reason.code || e.reason.status)) {
      toast.error(getErrorMessage(e.reason));
    }
  });

  // Offline / online events
  window.addEventListener("offline", () => {
    toast.error("Vous êtes hors ligne", { duration: 4000 });
  });

  window.addEventListener("online", () => {
    toast.success("Connexion rétablie", { duration: 2000 });
  });
}

// ═══════════════════════════════════════════════════════
//  IMAGE LOAD ERROR HELPER
// ═══════════════════════════════════════════════════════

export function handleImageError(event, fallback) {
  const img = event.target;
  // Prevent infinite loop if fallback also fails
  if (img.dataset.fallbackUsed) {
    img.style.display = "none";
    return;
  }
  img.dataset.fallbackUsed = "true";
  if (fallback) {
    img.src = fallback;
  } else {
    img.style.display = "none";
  }
}

export default { safeFetch, safeAsync, getErrorMessage, registerGlobalErrors, handleImageError };
