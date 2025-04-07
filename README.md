# 3js planner

## Backlog
<details>
<summary>Widok 3D i 2D</summary>

- [ ] *co?* Przycisk umożliwiający przejście z widoku 3D na 2D (i z powrotem).
- [ ] *jak?* Animacja przejścia w GSAP na widok z góry i zmiana kamery na ortograficzną.

</details>

<details>
<summary>Początkowy pokój</summary>

- [ ] *co?* Początkowy pokój ma kształt kwadratu, drzwi, okno i kilka mebli.
- [ ] *jak?* Gdzieś w kodzie trzeba to zdefiniować. Wymiary pokoju do ustalenia.

</details>

<details>
<summary>Możliwość zmiany rozmiaru pokoju</summary>

- [ ] *co?* Pokój w widoku 2D powinien mieć możliwość zmiany jego rozmiaru.
- [ ] *jak?* Podczas widoku 2D powinna być widoczna długość ścian w metrach. Kursorem można złapać za rogi i przeciągać.
</details>

<details>
<summary>Dodatkowy widok z pierwszej osoby</summary>

- [ ] *co?* Możliwość włączenia widoku z pierwszej osoby, wybrania wzrostu i przejścia się po pokoju.
- [ ] *jak?* Zmiana na inne Controls. Ewentualne stworzenie własnych jeśli by nie odpowiadały te dostępne w Three.js.
</details>

<details>
<summary>Dodawanie mebli</summary>

- [ ] *co?* UI pozwalające wybierać meble i wrzucać je do pomieszczenia, przeciągająć je kursorem.
- [ ] *jak?* Obiekt zostaje dodany do sceny. Powinien być znormalizowany.
</details>

<details>
<summary>Ruszanie mebli</summary>

- [ ] *co?* Możliwość ruszania mebli przeciągając je kursorem. Meble można przenosić przez inne meble, ale nie można ich upuścić/postawić na nich.
- [ ] *jak?* Dodanie eventu do objektu mebla.
</details>

<details>
<summary>Zmiana atrybutów mebli</summary>

- [ ] *co?* Możliwość zmiany atrybutów mebli po ich dodaniu.
- [ ] *jak?* Po kliknięciu na mebel w pomieszczeniu powinno pojawić się UI które "wyskakuje" z tego mebla. W tym UI powinna być możliwość zmiany m. in. koloru, materiału i innych parametrów. UI oprócz aktualnych atrybutów powinno też pokazywać szerokość, wysokość i głębokość mebla.
</details>

<details>
<summary>Dzień i noc</summary>

- [ ] *co?* W UI powinna być opcja zmiany pory dnia.
- [ ] *jak?* Albo zegar na którym można ustawić godzinę (wtedy tez można by było dodać toggle, który daje możliwość automatycznej zmiany czasu; np. co sekundę mija godzina w pozycji słońca), albo kilka presetów z porą dnia.
</details>