/* 
Nota: a differenza di quanto visto finora negli esempi, per accedere all'API utilizzare utilizzare l'url base:
https://boolean-spec-frontend.vercel.app/freetestapi
al posto di:
https://freetestapi.com/api/v1

Ad esempio:
https://boolean-spec-frontend.vercel.app/freetestapi/users
per chiamare l'endpoint /users
In questo esercizio, utilizzerai Promise.all() per creare la funzione getDashboardData(query), che accetta una città come input
e recupera simultaneamente:
Nome completo della città e paese da  /destinations?search=[query]
(result.name, result.country, nelle nuove proprietà city e country).
Il meteo attuale da /weathers?search={query}
(result.temperature e result.weather_description nella nuove proprietà temperature e weather).
Il nome dell’aeroporto principale da /airports?search={query}
(result.name nella nuova proprietà airport).
Utilizzerai Promise.all() per eseguire queste richieste in parallelo e poi restituirai un oggetto con i dati aggregati.
Attenzione: le chiamate sono delle ricerche e ritornano un’array ciascuna, di cui devi prendere il primo risultato (il primo elemento).
Note del docente
Scrivi la funzione getDashboardData(query), che deve:
Essere asincrona (async).
Utilizzare Promise.all() per eseguire più richieste in parallelo.
Restituire una Promise che risolve un oggetto contenente i dati aggregati.
Stampare i dati in console in un messaggio ben formattato.
Testa la funzione con la query "london"
Esempio di utilizzo
getDashboardData('london')
    .then(data => {
        console.log('Dasboard data:', data);
        console.log(
            `${data.city} is in ${data.country}.\n` +
            `Today there are ${data.temperature} degrees and the weather is ${data.weather}.\n`+
            `The main airport is ${data.airport}.\n`
        );
    })
    .catch(error => console.error(error));
Esempio di output atteso
// Risposta API
{
  city: "London",
  country: "United Kingdom",
  temperature: 18,
    weather: "Partly cloudy",
  airport: "London Heathrow Airport"
}
​
// Output in console
London is in United Kingdom. 
Today there are 18 degrees and the weather is Partly cloudy.
The main airport is London Heathrow Airport.

Bonus 1 - Risultato vuoto
Se l’array di ricerca è vuoto, invece di far fallire l'intera funzione, 
semplicemente i dati relativi a quella chiamata verranno settati a null e  la frase relativa non viene stampata.
Testa la funzione con la query “vienna” (non trova il meteo).*/


async function fetchJson(url) {
    const res = await fetch(url)
    const obj = await res.json()
    return obj
}

async function getDashboardData(query) {
    try {
        const destinationsPromise = fetchJson(`https://boolean-spec-frontend.vercel.app/freetestapi/destinations?search=${query}`)
        const weatersPromise = fetchJson(`https://boolean-spec-frontend.vercel.app/freetestapi/weathers?search=${query}`)
        const airportsPromise = fetchJson(`https://boolean-spec-frontend.vercel.app/freetestapi/airports?search=${query}`)

        const promises = [destinationsPromise, weatersPromise, airportsPromise]
        const [destinations, weathers, airports] = await Promise.all(promises)
        console.log([destinations, weathers, airports]);

        const destinationRes = destinations.length > 0 ? destinations.find(destination => destination.name.toLowerCase() === query.toLowerCase()) : null
        const weatherRes = weathers.length > 0 ? weathers.find(weather => weather.city.toLowerCase().includes(query.toLowerCase())) : null
        const airportRes = airports.length > 0 ? airports.find(airport => airport.name.toLowerCase().includes(query.toLowerCase())) : null


        return {
            city: destinationRes ? destinationRes.name : null,
            country: destinationRes ? destinationRes.country : null,
            temperature: weatherRes ? weatherRes.temperature : null,
            weather: weatherRes ? weatherRes.weather_description : null,
            airport: airportRes ? airportRes.name : null
        }

    } catch (error) {
        throw new Error(`Errore nel recupero dei dati: ${error.message}`);
    }


}


getDashboardData('vienna')
    .then(data => {
        console.log('Dasboard data:', data);
        if (data.city && data.country) {
            console.log(`${data.city} is in ${data.country}.`)
        }
        if (data.temperature !== null && data.weather) {
            console.log(`Today there are ${data.temperature} degrees and the weather is ${data.weather}.`);

        }
        if (data.airport) {
            console.log(
                `The main airport is ${data.airport}.`
            )
        }

    })
    .catch(error => console.error(error));

