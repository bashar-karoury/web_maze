#The Web-Based Maze Game

A simple Online Web-based Game where you are trapped in a twisting maze, your only hope is to move fast. The Chaser is always one step behind, so plan your moves carefully and escape before it closes in!


Technologies

Phaser 3 is used as web game framework with its physics arcade engine for its great gravity and collision detection.
For back-end, Flask is used as an application server to provide api interface:
POST => /api/register : for new registeration
POST => /api/login : for login
GET => /api/top_players : for a list of top 5 players
POST => /api/players_data/<username> : to post player data
GET => /api/players_data/<username>: to get player data

Link to deployed game:
[text](http://webmaze.karoury.tech/)