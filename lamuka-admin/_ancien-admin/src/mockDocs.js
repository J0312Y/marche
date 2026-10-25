// Mock document files for drivers and vendors
// SVG documents are in /public/docs/

export const DRIVER_DOCS = {
  d1: { // Jean Moukala
    id_card:   { verified: true,  file: "/docs/id_card_jean.svg",       name: "Carte d'identité — Jean Moukala", size: "245 KB", date: "2025-10-10" },
    license:   { verified: true,  file: "/docs/permis_jean.svg",        name: "Permis de conduire Cat. A+B", size: "312 KB", date: "2025-10-08" },
    insurance: { verified: true,  file: "/docs/assurance_jean.svg",     name: "Assurance véhicule AGC", size: "890 KB", date: "2025-11-01" },
    photo:     { verified: true,  file: "/docs/photo_profil_jean.svg",  name: "Photo profil", size: "180 KB", date: "2025-10-10" },
  },
  d2: { // Sylvie Massamba
    id_card:   { verified: true,  file: "/docs/id_card_jean.svg",  name: "Carte d'identité — Sylvie Massamba", size: "252 KB", date: "2025-11-01" },
    license:   { verified: true,  file: "/docs/permis_jean.svg",   name: "Permis de conduire Cat. A", size: "298 KB", date: "2025-11-01" },
    insurance: { verified: true,  file: "/docs/assurance_jean.svg",name: "Assurance Yamaha DT", size: "920 KB", date: "2025-11-05" },
    photo:     { verified: true,  file: "/docs/photo_profil_jean.svg", name: "Photo profil", size: "165 KB", date: "2025-11-02" },
  },
  d3: { // Patrick Mbou
    id_card:   { verified: true,  file: "/docs/id_card_jean.svg",  name: "Carte d'identité — Patrick Mbou", size: "238 KB", date: "2025-12-10" },
    license:   { verified: false, file: null,                      name: "Permis de conduire", size: "—", date: "Non soumis" },
    insurance: { verified: false, file: null,                      name: "Assurance véhicule", size: "—", date: "Non soumis" },
    photo:     { verified: true,  file: "/docs/photo_profil_jean.svg", name: "Photo profil", size: "172 KB", date: "2025-12-10" },
  },
  d4: { // Albert Ngoma (pending)
    id_card:   { verified: true,  file: "/docs/id_card_jean.svg",  name: "Carte d'identité — Albert Ngoma", size: "241 KB", date: "2026-02-25" },
    license:   { verified: true,  file: "/docs/permis_jean.svg",   name: "Permis de conduire Cat. A", size: "305 KB", date: "2026-02-25" },
    insurance: { verified: false, file: "/docs/assurance_jean.svg",name: "Assurance (en attente)", size: "856 KB", date: "2026-02-25" },
    photo:     { verified: false, file: null,                      name: "Photo profil", size: "—", date: "Non soumis" },
  },
  d5: { // Blaise Nkouka
    id_card:   { verified: true,  file: "/docs/id_card_jean.svg",  name: "Carte d'identité — Blaise Nkouka", size: "250 KB", date: "2025-09-20" },
    license:   { verified: true,  file: "/docs/permis_jean.svg",   name: "Permis de conduire Cat. A", size: "310 KB", date: "2025-09-20" },
    insurance: { verified: true,  file: "/docs/assurance_jean.svg",name: "Assurance Boxer", size: "875 KB", date: "2025-09-22" },
    photo:     { verified: true,  file: "/docs/photo_profil_jean.svg", name: "Photo profil", size: "168 KB", date: "2025-09-20" },
  },
};

export const VENDOR_DOCS = {
  pv1: { // Chez Mama Rose
    registre:   { verified: true,  file: "/docs/registre_mama.svg",   name: "Registre de commerce", size: "1.2 MB", date: "2026-02-20" },
    niu:        { verified: true,  file: "/docs/niu_mama.svg",        name: "NIU — Numéro d'Identification Unique", size: "450 KB", date: "2026-02-20" },
    id_card:    { verified: true,  file: "/docs/id_card_mama.svg",    name: "Pièce d'identité gérant", size: "245 KB", date: "2026-02-20" },
    photo:      { verified: true,  file: "/docs/photo_mama.svg",      name: "Photo de l'établissement", size: "1.8 MB", date: "2026-02-22" },
    sanitaire:  { verified: true,  file: "/docs/sanitaire_mama.svg",  name: "Certificat sanitaire", size: "680 KB", date: "2026-01-15" },
  },
  pv2: { // TechZone Congo
    registre:   { verified: true,  file: "/docs/registre_mama.svg",   name: "Registre de commerce", size: "1.1 MB", date: "2026-02-18" },
    niu:        { verified: true,  file: "/docs/niu_mama.svg",        name: "NIU", size: "420 KB", date: "2026-02-18" },
    id_card:    { verified: true,  file: "/docs/id_card_mama.svg",    name: "Pièce d'identité gérant", size: "238 KB", date: "2026-02-18" },
    photo:      { verified: true,  file: "/docs/photo_mama.svg",      name: "Photo de la boutique", size: "2.1 MB", date: "2026-02-19" },
    sanitaire:  { verified: false, file: null,                        name: "Non requis (boutique)", size: "—", date: "—" },
  },
  pv3: { // Pharmacie du Centre
    registre:   { verified: false, file: "/docs/registre_mama.svg",   name: "Registre de commerce (en attente)", size: "980 KB", date: "2026-02-24" },
    niu:        { verified: true,  file: "/docs/niu_mama.svg",        name: "NIU", size: "410 KB", date: "2026-02-24" },
    id_card:    { verified: false, file: null,                        name: "Pièce d'identité", size: "—", date: "Non soumis" },
    photo:      { verified: false, file: null,                        name: "Photo établissement", size: "—", date: "Non soumis" },
    sanitaire:  { verified: false, file: null,                        name: "Certificat sanitaire", size: "—", date: "Non soumis" },
  },
  pv4: { // Beauté Africaine
    registre:   { verified: true,  file: "/docs/registre_mama.svg",   name: "Registre de commerce", size: "1.0 MB", date: "2026-02-22" },
    niu:        { verified: true,  file: "/docs/niu_mama.svg",        name: "NIU", size: "435 KB", date: "2026-02-22" },
    id_card:    { verified: true,  file: "/docs/id_card_mama.svg",    name: "CNI gérant", size: "242 KB", date: "2026-02-22" },
    photo:      { verified: true,  file: "/docs/photo_mama.svg",      name: "Photo boutique", size: "1.5 MB", date: "2026-02-23" },
    sanitaire:  { verified: false, file: null,                        name: "Non requis", size: "—", date: "—" },
  },
  pv5: { // Service Express
    registre:   { verified: true,  file: "/docs/registre_mama.svg",   name: "Registre de commerce", size: "1.1 MB", date: "2026-02-20" },
    niu:        { verified: true,  file: "/docs/niu_mama.svg",        name: "NIU", size: "440 KB", date: "2026-02-20" },
    id_card:    { verified: true,  file: "/docs/id_card_mama.svg",    name: "CNI gérant", size: "248 KB", date: "2026-02-20" },
    photo:      { verified: true,  file: "/docs/photo_mama.svg",      name: "Photo local", size: "1.3 MB", date: "2026-02-21" },
    sanitaire:  { verified: false, file: null,                        name: "Non requis", size: "—", date: "—" },
  },
};

export const DOC_LABELS = {
  fr: { id_card: "Carte d'identité", license: "Permis de conduire", insurance: "Assurance véhicule", photo: "Photo profil",
        registre: "Registre de commerce", niu: "NIU", sanitaire: "Certificat sanitaire" },
  en: { id_card: "ID Card", license: "Driver License", insurance: "Vehicle Insurance", photo: "Profile Photo",
        registre: "Business License", niu: "Tax ID (NIU)", sanitaire: "Health Certificate" },
};

export const DOC_ICONS = { id_card: "🪪", license: "🚗", insurance: "🛡️", photo: "📸", registre: "📋", niu: "🏛️", sanitaire: "🏥" };
