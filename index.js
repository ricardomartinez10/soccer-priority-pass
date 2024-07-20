const xlsx = require('xlsx');
// Read excel file
const workbook = xlsx.readFile('lista.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
// Transform excel file to json
const inputData = xlsx.utils.sheet_to_json(worksheet);
const NUMER_OF_PLAYERS = 3;

// Internal data base
const dataBase = [
    {
        name: 'ricardo martinez',
        team: 'gray',
        assists: 5
    },
    {
        name: 'marcel sandoval',
        team: 'gray',
        assists: 1
    },
    {
        name: 'david alzate',
        team: 'gray',
        assists: 7
    },
    {
        name: 'luis carlos',
        assists: 3,
        team: 'gray'
    },
    {
        name: 'yeison meza',
        assists: 8,
        team: 'orange'
    },
    {
        name:'william valencia',
        assists: 10,
        team:'orange'
    }
]

/**
 * All the array modification is based on inputData array (which comes from execel file)
 * Builds an array of priority players taking into account this conditions:
 *
 *  1. For each inputPlayer search the database index player accoring to the name, then map the object
 *  by adding the assist number from database.
 *  2. Sort the list of players according to the number of assists.
 * 
 * @returns array of priority players
 */
function getPriorityPlayers() {
        const priorityPlayers = inputData
            .map((player, index) => {
                const playerIndex = dataBase.findIndex(booPlayer => booPlayer.name === normalizeName(player['Nombre']));
                
                player['assists'] = playerIndex !== -1 ?
                    dataBase[playerIndex].assists :
                    0;
                player['team'] = playerIndex !== -1 ?
                    dataBase[playerIndex].team :
                    index % 2 === 0 ?
                        'gray' :
                        'orange';

                return player;
            })
            .sort((a,b) => b.assists - a.assists);

        return priorityPlayers;
}

/**
 * Return player list in text message format
 * @param {array} playerList 
 * @returns 
 */
function buildList(playerList) {
    const teamGrey = generatePlayerByTeam('gray', playerList).slice(0,NUMER_OF_PLAYERS);
    const teamOrange = generatePlayerByTeam('orange', playerList).slice(0,NUMER_OF_PLAYERS);
    const waitListPlayers = generatePlayerByTeam('gray', playerList).slice(NUMER_OF_PLAYERS).concat(generatePlayerByTeam('orange', playerList).slice(NUMER_OF_PLAYERS));

    const list = `
Fútbol próximo Jueves ⚽
Lugar: Canchas 5-0 atrás de Palmetto
Hora: 6:45 pm.  - Importante llegar temprano
Recibe William 
Valor: 15.000

Enviar dinero al Nequi de William Gio Valencia y anotarse en la lista con el emoji 💵

Código QR en la foto de perfil o enviar a 318 8990695

Equipo gris:
${messageTextFormat(teamGrey)}

Equipo naranja:
${messageTextFormat(teamOrange)}

En espera:
${messageTextFormat(waitListPlayers)}
    `
    return list;
}

/**
 * Generates list of players according to the team
 * @param {string} team 
 * @param {array} playerList 
 * @returns 
 */
function generatePlayerByTeam(team, playerList) {
    return playerList
        .filter(player => player.team === team);
}

/**
 * Formats player list as a message text
 * @param {array} players 
 * @returns 
 */
function messageTextFormat(players) {
    return players.map((player, index) => {
        return `A${index + 1}. ${player['Nombre']} \n`
    }).toString().replaceAll(',','');
}

/**
 * Function to transform text name to lower case and remove accent marks
 * @param {string} name 
 * @returns 
 */
function normalizeName(name) {
    return name.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}


console.log(buildList(getPriorityPlayers()));
