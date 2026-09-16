/* Service worker : rend l'outil utilisable sans connexion.
   Strategie « cache d'abord, rafraichissement en arriere-plan » :
   - hors ligne, la page se sert du cache
   - en ligne, elle s'affiche tout de suite ET se met a jour pour la fois suivante */
const CACHE = "pnd-v1";
const FICHIERS = ["./", "./index.html"];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(noms => Promise.all(noms.filter(n => n !== CACHE).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(enCache => {
      const reseau = fetch(e.request).then(rep => {
        if (rep && rep.ok && rep.type === "basic") {
          const copie = rep.clone();
          caches.open(CACHE).then(c => c.put(e.request, copie));
        }
        return rep;
      }).catch(() => enCache);
      return enCache || reseau;
    })
  );
});
