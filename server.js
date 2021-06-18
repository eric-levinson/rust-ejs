// server.js
// load the things we need
var express = require('express');
var app = express();
request = require('request-json');
var serverId = '4562'
var client = request.createClient('https://api.rust-servers.info/info/4562');
var players = request.createClient('https://api.rust-servers.info/players/4562')
const humanizeDuration = require("humanize-duration");
var _ = require('lodash');
const https = require("https"),
  fs = require("fs"),
  helmet = require("helmet");

const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/rustdeez.com/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/rustdeez.com/fullchain.pem"),
  dhparam: fs.readFileSync("/etc/letsencrypt/live/rustdeez.com/dh-strong.pem")
};

app.use(helmet());

// set the view engine to ejs
app.set('view engine', 'ejs');



// use res.render to load up an ejs view file


var response
var pResponse
var modNames = ['Backpacks', 'BetterLoot', 'BuildingGrades', 'Clans', 'CupboardNoDecay', 'DeathNotes', 'FriendlyFire', 'FurnaceSplitter', 'GatherManager', 'HelpText', 'ImageLibrary', 'InfoPanel', 'InstantCraft', 'Kits', 'LootBouncer', 'NTeleportation', 'QuickSmelt', 'QuickSort', 'RemoverTool', 'ServerInfo', 'SkipNightUI', 'SortButton', 'StackSizeController', 'Trade', 'VehicleDecayProtection']
var commandList = ['/backpack - opens your backpack', '/up [grade] [filter] -- Upgrade each block which is attached to the building you are looking at by one grade or to selected grade', '/down [grade] [filter] -- Downgrade each block which is attached to the building you are looking at by one grade or to selected grade', '/c <message> - Send a message to all clan members', '/a <message> - Send a message to all clan members and allied clans', '/clanhelp - Displays help', '/clanhelp member - Displays commands for clan members', '/clanhelp moderator - Displays commands for clan moderators', '/clanhelp owner - Displays commands for clan owners', '/clan create <tag> - Create a new clan', '/clan join <tag> - Join a clan if you have a invite', '/clan leave- Leave you current clan', '/clan invite <partialname> - Invite a player to join your clan', '/clan invite cancel <partialname/ID> - Cancel a pending invite', '/clan kick <partialname/ID> - Kick a player from your clan', '/clan promote <partialname/ID> - Promote a clan member to clan moderator', '/clan demote <partialname/ID> - Demote a clan moderator to clan member', '/clan disband - Disband your clan', '/clan ally request <tag> - Request an alliance with another clan', '/clan ally accept <tag> - Accept an alliance invite', '/clan ally decline <tag> - Decline a alliance request', '/clan ally cancel <tag> - End a clan alliance', '/ff -- Displays your current friendly fire status', '/ff on|off -- Toggles friendly fire on or off (default)', '/fs -- Shows the status and help options', '/fs on -- To enable Furnace Splitter', '/fs off -- To diable Furnace Splitter', '/gather -- Show current settings to players, and show available console commands to admin', '/help - Displays help information for compatible plugins', '/ipanel - Show the available commands', '/ipanel hide - Hide the Info Panel', '/ipanel show - Show the Info Panel', '/ipanel clock game - The clock will show the in-game time.', '/ipanel clock server < /-hours> - The clock will show the RL time. You can add or remove hours.', '/ipanel timeformat - Show the available time formats.', '/ipanel timeformat - Select your favorite time format from the list.', '/kit -- see the full list of available kits for you', '/kit <name> -- choose a kit', '/home add NAME - Saves your current position as the location NAME. (alias sethome)', '/home list - Shows you a list of all the locations you have saved. (alias listhomes)', '/home remove NAME - Removes the location NAME from your saved homes. (alias removehome)', '/home NAME - Teleports you to the home location.', '/tpr - Sends a teleport request to the player.', '/tpa - Accepts an incoming teleport request.', '/tpc - Cancel teleport or request.', '/tpinfo - Shows limits and cooldowns.', '/tphelp - Shows help.', '/qs <help | h> - show commands list.', '/qs - toggle QuickSort UI.', '/qs auto - toggle automated looting.', '/qs style "center/lite/right/custom" - change UI style.', '/qs container "main/wear/belt" - add/remove container type from the sort (if they are enabled in the configuration).', '/remove [time (seconds)] -- Enable/Disable RemoverTool', '/remove <help | h> -- View help', '/info -- Show available info to self', '/voteday - Used to cast your vote', '/sb - Enable/Disable Sort Button.', '/sb <sort | type> - change sort type.', '/trade "partial or full player name" -- Send a trade request to specified player', '/trade accept -- Accept the most recent trade request']
var online
var max
var ip
var port
var ut
var deez
var uptime
var playerList

// info func
function infoFunc() {
  client.get('', function (err, res, data) {
    response = data;
    //console.log(response)
  });
  //console.log(response)
  if (response !== undefined) {
    online = response.players_cur
    max = response.players_max
    ip = response.ip
    port = response.port
    ut = response.uptime * 1000
    deez = parseFloat(ut).toFixed(0);
    uptime = humanizeDuration(deez, {
      units: ["d", "h", "m"],
      round: true
    });
    //console.log('info worked ', response);
  } else {
    console.log('info no work')
  }
}

//players func
function playerFunc() {
  players.get('', function (err, res, data) {
    pResponse = data;
  });
  if (pResponse !== undefined) {
    playerList = _.map(pResponse, 'name')
    //console.log('player', pResponse)
  } else {
    console.log('player no work')
  }
}

infoFunc();
playerFunc();

setInterval(function () {
  infoFunc();
  playerFunc();
}, 20000);

// index page
app.get('/', function (req, res) {

  infoFunc();

  res.render('pages/index', {

    online: online,
    max: max,
    ip: ip,
    port: port,
    uptime: uptime

  });
});

// about page
app.get('/about', function (req, res) {
  res.render('pages/about');
});

app.get('/details', function (req, res) {

  playerFunc();

  res.render('pages/details', {

    playerList: playerList,
    modNames: modNames,
    commandList

  });
});

app.use(express.static("public"));

app.listen(80);
https.createServer(options, app).listen(443);
console.log('443 is the magic port');

