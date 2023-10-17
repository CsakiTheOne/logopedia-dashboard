# Időpont foglalás

## Szabályok

- Egy foglalkozás vagy admin által jelölt szabadság foglalt időtartamnak számít
- A foglalt időtartamok nem vághatnak egybe
- Foglalkozás időpontot csak admin által beállított munkaidőben lehet foglalni
- Egy héten egy típusú foglalkozásból csak admin által beállított mennyiség lehet
- A foglalt időpontok között kell minimum egy számított értéknyi idő (delta)
- A foglalt időpontok között kell minimum admin által beállított szünet idő (ha a delta valamiért nagyon rövid, illetve a szünet idő is kell a delta számításhoz)
- Ha egy napon még vannak szabad helyek, de a delta már nem engedi, kevésbé szigorúbb szűrés lép életbe, hogy a szabad helyek is eltűnjenek
  - A szünet idő még itt is figyelembe van véve

## Delta számítási módszerek

- Legrövidebb, a héten foglalható foglalkozás időtartama + szünetek előtte, utána
- A héten még foglalható foglalkozások időtartamának átlaga + 2 szünet
