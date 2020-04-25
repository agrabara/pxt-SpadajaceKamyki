input.onButtonPressed(Button.A, function () {
    ptaszek.change(LedSpriteProperty.X, -1)
})
input.onButtonPressed(Button.B, function () {
    ptaszek.change(LedSpriteProperty.X, 1)
})
/**
 * Gra z pierwszych zajęć CoderDojo-Micto:bit zdalnie 2020.04.11 obecni: Maks, Rafał, Michał
 * 
 * Spadające kamienie
 * 
 * 1. sterowanie A/B - lewo/prawo 
 * 2. uciekamy przed spadającymi kamieniami, 
 *    które tworzą się co 3km (reszta z dzielenia km przez 3 == 0) 
 * 3. od czasu do czasu (losowanie) 
 *    pojawia sie spadająca belka z dziurą, w której trzeba się zmieścić 
 * 4. co 10km (reszta z dzielenia), prędkość kamieni przyspiesza ;-) aby było trudniej 
 * 5. liczymy ile kilometrów udało się "przelecieć"
 * 
 * TODO 1:
 * na zadanie domowe do zrobienia...
 * co 20km dodajcie "add score" - taki jakby efekt "fajerwerków"
 * 
 * TODO 2:
 * na zadanie domowe do zrobienia... 
 * Raz na np. 20km, w jeden ze spadających kamieni dmucha wiatr 
 * i przesuwa go w lewo lub prawo np. przy pomocy pickrandom(0,1) 
 * jeśli 0 to w lewo, jeśli w 1 to w prawo 
 * czyli trzeba np. pierwszemu duszkowi z tablicy "kamyki" 
 * zmienić x o jeden (-1 lub +1) w odpowiednim kierunku 
 * załóżmy, że jak już jest na krawędzi planszy (x==0 lub x==4) 
 * to nic nie robimy bo nie ma już gdzie zmuchnąć duszka (kamyk)
 * 
 * 
 */
let dziura = 0
let km = 0
let ptaszek: game.LedSprite = null
let index = 0
let kamyki: game.LedSprite[]
ptaszek = game.createSprite(2, 4)
ptaszek.set(LedSpriteProperty.Brightness, 100)
ptaszek.set(LedSpriteProperty.Blink, 300)
kamyki = []
let pauza = 1000
basic.showString("Sapadajace kamienie")
basic.pause(2000)
basic.clearScreen()
// tutaj zaczyna się główna pętla programu
basic.forever(function () {
    // sprawdzamy czy jest jakiś kamyk (length>0) i jeśli
    // jest (przynajmniej jeden) to bierzemy pierwszy z
    // tablicy (kamyki[0]) - kamyki[0] oznacza tutaj "duszka"
    // i możemy zaptać się o jego parametry np. X, Y itp
    // sprawdzamy czy już spadł na sam spód planszy (y=4)
    // i jeśli tak - usuwamy tego pierwszego duszka z tablicy kamyki (removeAt(0))
    // i kasujemy samego duszka (delete())
    while (kamyki.length > 0 && kamyki[0].get(LedSpriteProperty.Y) == 4) {
        kamyki.removeAt(0).delete()
    }

    // teraz w pętli - dla wszyskich "duszków/kamyków" z tablicy kamyki
    // zmieniamy wartość Y o 1
    // czyli każdy duszek/kamyk przesuwa się o jeden w dół (spada)
    // to specjalne wykorzystanie pętli - która potrafi nie tylko zliczać od 0 do np. 100
    // ale też używa tablicy - i po kolei bierze duszki z tablicy (wstawiając każdego do zmiennej value)
    for (let value of kamyki) {
        value.change(LedSpriteProperty.Y, 1)
    }

    // co 3 km (reszta z dzielenia km przez 3 == 0)
    if (km % 3 == 0) {
        // losujemy czy generujemy zwykły kamyk, czy belkę z dziurą
        // jeśli wylosujemy 0 wtedy belka
        if (Math.randomRange(0, 5) == 0) {
            dziura = Math.randomRange(0, 4)
            for (let index2 = 0; index2 <= 4; index2++) {
                if (index2 != dziura) {
                    kamyki.push(game.createSprite(index2, 0))
                }
            }
        } else {
            // w każdym innym przypadku (else)
            // mamy zwykły pojedynczy kamyk
            kamyki.push(game.createSprite(Math.randomRange(0, 4), 0))
        }
    }
    // spowoalniamy (pauza)
    basic.pause(pauza)

    // kolejny kilometr!!!!
    km += 1

    // tutaj sprawdzamy czy którykolwiek z kamyków uderzył nam w ptaka :-)
    // korzystamy z pętli, która przelatuje po całej tablicy 
    // wstawiając - jak poprzednio przy "spadaniu" duszka do zmiennej value
    // musimy porównać czy X i Y kamyków są takie same jak ptaka
    for (let value of kamyki) {
        if (value.get(LedSpriteProperty.X) == ptaszek.get(LedSpriteProperty.X) && value.get(LedSpriteProperty.Y) == ptaszek.get(LedSpriteProperty.Y)) {
            // no niestety - dupa zbita
            // trafił nas kamyk
            // ustawiamy wynik na tyle kilometrów co przejechaliśmy
            game.setScore(km)
            game.gameOver()
        }
    }

    // utrudniaczka
    // co 10km przyspieszamy o 100ms, aż pauza będzie 0 - level hardcore
    if (km % 10 == 0 && pauza > 100) {
        pauza += -100
    }
})
 