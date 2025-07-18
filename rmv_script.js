// 🔑 Hier deinen echten API-Key eintragen
const accessId ='7fa2b266-89c7-4217-aa89-df51a60ff41b';
// 🚏 Hier die Haltestellen-ID eintragen (z. B. Offenbach Kaiserlei = '3000010')
const stopId = '3002507'; // Ledermuseum/Ludwigstraße

async function ladeAbfahrten() {
  const output = document.getElementById('output');
  output.innerHTML = '⏳ Lade Daten...';

  try {
    const url = `https://www.rmv.de/hapi/departureBoard?accessId=${accessId}&id=${stopId}&format=json`;
    const response = await fetch(url);

    if (!response.ok) throw new Error("API-Fehler");

    const data = await response.json();
    output.innerHTML = ''; // vorherige Daten löschen

    if (!data.Departure || data.Departure.length === 0) {
      output.innerHTML = '🚫 Keine Abfahrten gefunden.';
      return;
    }

    data.Departure.forEach((dep) => {
      const line = dep.Product.line;
      const direction = dep.direction;
      const time = new Date(dep.dateTime).toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit'
      });

      const div = document.createElement('div');
      div.classList.add('departure');
      div.textContent = `${time} – Linie ${line} nach ${direction}`;
      output.appendChild(div);
    });
  } catch (error) {
    output.innerHTML = '⚠️ Fehler beim Laden der Daten';
    console.error('Fehler:', error);
  }
}

// Beim Start laden & dann alle 60 Sekunden aktualisieren
ladeAbfahrten();
setInterval(ladeAbfahrten, 60_000);
