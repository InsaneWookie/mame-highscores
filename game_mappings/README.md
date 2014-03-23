#### MAMA: GLobal Leaderboard Mappings

##### Add a game

1. Fork this repository
2. Add the information about a game to _gameInfo.js_ One entry for each slug. See the Comments in _gameInfo.js_ for details about which fields are mandatory and how the structure of an entry should look like.
3. Add the Higscore structure to _gameMaps.js_ Check the comments in _gameMaps.js_ for details about all the fields.
4. If the game uses a special character Map add it to _charMaps.js_
5. Commit your changes and submit a pull request. When submitting a Pull request add a screenshot of the highscore screen and the stringified data from the games *.hi file. Make sure that the names in the submitted highscore screens include, numbers, upper/lower case letters and special symbols if available. This makes testing on my side a lot easier. Also include if a new formatter needs to be written.

##### Available Formatters

* _asIs_: Mainly used for scores. _0x00013538_ is decoded to: _13538_.
* _reverseDecimal_: Mainly used for scores. _0x000412_ is decoded to: _120400_.
* _bcd_: Mainly used for scores. _0x01FF03_ is decoded to: _12563_.
* _fromCharMap_: Mainly used for names. If this format is set, the field also needs a setting with the used char map. _0x01_ is decoded to the first character of the Char map _0x05_ to the fifth and so on.
* _ascii_: mainly used for names. Default ASCII encoded. _0x41313f_ is decoded to _A1?_.
* _hexToDecimal_: Plain hex to decimal conversion. _0x027616_ is decoded to _161302_.
* _specialOnly_: Only use special mappings. Special mappings need to be provided int the settings.

##### Available Settings
* _append_: Mainly used for scores. Appends the given characters after formatting.
* _ignoreBytes_: Ignore specific bytes of a range. Mainly used for spaced names.
* _add_: Add an integer to a formatted value.
