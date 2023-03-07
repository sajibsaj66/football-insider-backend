const router = require('express').Router();
const { fetchEvents } = require('../schedular/eventsApi');
const { fetchLineups } = require('../schedular/lineups');
const { getClubTeams } = require('../controllers/clubteam/clubTeamsController');
const { addFavouriteLeague, getFavouriteLeague, removeFavouriteLeague, favouriteLeagueMatches } = require('../controllers/favourite/favouriteLeagues');
const { addFavouritePlayer, removeFavouritePlayer } = require('../controllers/favourite/favouritePlayer');
const { addFavouriteTeam, getFavouriteTeams, removeFavouriteTeam } = require('../controllers/favourite/favouriteTeam');
const { getTeams, fixtures, liveBet, lineup, statistics } = require('../controllers/footballApi/footballApiControllers');
const { getLeagues, leaguesSuggestions, leagueDetails } = require('../controllers/league/leaguesController');
const { getNationalTeams } = require('../controllers/nationalTeam/nationalTeamControllers');
const authorize = require('../middlewares/authorize');
const { fetchLeagues } = require('../utils/leaguesApiCalls');
const { fetchNationalTeams } = require('../utils/nationalTeamApiCalls');
const { fetchClubTeams } = require('../utils/popularTeamApiCalls');
const { standings } = require('../controllers/standings/Standings');
const { playerProfile, playerMatches } = require('../controllers/player/player');
const { playerStats } = require('../controllers/player/playerStats');

const { datewiseFixtures } = require('../controllers/fixture/datewiseFixture');
const { eventDetails } = require('../controllers/fixture/eventDetails');
const { getLives } = require('../controllers/fixture/liveMatch');
const { headToHead } = require('../controllers/fixture/headToHead');
const { lineupDetails } = require('../controllers/fixture/lineupDetails');
const { matchDetails } = require('../controllers/fixture/matchDetails');
const { matchStats } = require('../controllers/fixture/matchStat');
const { search } = require('../controllers/search/search');
const { teamNextMatch, teamPreviousMatch } = require('../controllers/teams/teamOverview');
const { transfers } = require('../controllers/transfers/transfer');

// DB interactions
router.get('/search', search)
router.get('/getClubTeams', getClubTeams)
router.get('/getNationalTeams', getNationalTeams)
router.get('/leagues', getLeagues);
router.get('/leagueDetails/:leagueId', leagueDetails);

router.get('/getLives', getLives);
router.get('/datewiseMatch', datewiseFixtures);
router.get('/matchDetails/:id', matchDetails);
router.get('/matchStats/:fixtureId', matchStats);
router.get('/eventDetails/:fixtureId', eventDetails);
router.get('/lineupDetails/:fixtureId', lineupDetails);
router.get('/headtohead', headToHead);
router.get('/standings', standings);

router.get('/teamOverview/next-match', teamNextMatch);
router.get('/teamOverview/previous-match', teamPreviousMatch);
router.get('/transfers', transfers)

router.get('/leagueSuggestions', leaguesSuggestions)
router.get('/favouriteLeagues', authorize, getFavouriteLeague)
router.get('/favouriteLeagues/fixture', favouriteLeagueMatches)
router.get('/favouriteTeams', authorize, getFavouriteTeams)
router.post('/followLeague', authorize, addFavouriteLeague)
router.patch('/unfollowLeague', authorize, removeFavouriteLeague)
router.post('/followTeam', authorize, addFavouriteTeam)
router.patch('/unfollowTeam', authorize, removeFavouriteTeam)
router.post('/followPlayer', authorize, addFavouritePlayer)
router.patch('/unfollowPlayer', authorize, removeFavouritePlayer)

router.get('/player/:playerId', playerProfile)
router.get('/playerMatches', playerMatches)
router.get('/playerStats', playerStats)

// internal call to store data in DB
router.get('/fetchClubTeamsToDB', fetchClubTeams)
router.get('/fetchNationalTeamsToDB', fetchNationalTeams)
router.get('/fetchLeaguesToDB', fetchLeagues)
router.get('/fetchEventsToDB', fetchEvents)
router.get('/fetchLineupsToDB', fetchLineups)


module.exports = router;