const xlsx = require('xlsx');
// Read excel file
const workbook = xlsx.readFile('lista.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
// Transform excel file to json
const inputData = xlsx.utils.sheet_to_json(worksheet);

// Internal data base
const dataBase = [
    {
        name: 'Ricardo Martinez',
        assists: 5
    },
    {
        name: 'Marcel',
        assists: 1
    },
    {
        name: 'David Alzate',
        assists: 7
    },
    {
        name: 'Luis Carlos',
        assists: 3
    },
    {
        name: 'Yeison Meza',
        assists: 8
    }
]

/**
 * All the array modification is based on inputData array (which comes from execel file)
 * Builds an array of priority players taking into account this conditions:
 *
 *  1. For each inputPlayer search the database index player accoring to the name, then map the object
 *  by adding the assist number from database.
 *  2. Filter the array according the confirm state (Yes / No)
 *  3. Sort the list of players according to the number of assists.
 * 
 * @returns array of priority players
 */
function getPriorityPlayers() {
        const priorityPlayers = inputData
            .map((player) => {
                const playerIndex = dataBase.findIndex(booPlayer => booPlayer.name === player['Nombre']);

                return {...player, assists: dataBase[playerIndex].assists}
            })
            .filter(player => player['Confirmo'] === 'Si')
            .sort((a,b) => b.assists - a.assists);

        return priorityPlayers;
}

/**
 * Return player list in text message format
 * @param {array} playerList 
 * @returns 
 */
function buildList(playerList) {
    const players = playerList
        .map((player, index) => {
            return `A${index}. ${player['Nombre']} \n`
        }).toString().replaceAll(',','');

    const list = `
Fútbol próximo Jueves ⚽
Lugar: Canchas 5-0 atrás de Palmetto
Hora: 6:45 pm.  - Importante llegar temprano
Recibe William 
Valor: 15.000

Enviar dinero al Nequi de William Gio Valencia y anotarse en la lista con el emoji 💵

Código QR en la foto de perfil o enviar a 318 8990695

${players} 
    `
    return list;
}


console.log(buildList(getPriorityPlayers()));
console.log(getPriorityPlayers());