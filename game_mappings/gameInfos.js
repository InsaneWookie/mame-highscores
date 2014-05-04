/* This file holds all necesary infomations about games.
 *
 * The structure is straigt forward. All attributes listed here are mandatory.
 *
 * name: The name of the game AKA the slug
 * fullName: The full name of the game
 * letter: The starting letter of the game or "special" if not a letter.
 * order: an array of field names, they will be printed in the listed order.
 * sort: Holds information about the sorting of the scores
 *   by: the field to initially sort by
 *   order: Sorting order may be asc or desc
 */
gameInfos = [
  {
    "name": "1943",
    "fullName": "1943 - The Battle of Midway (US)",
    "letter": "special",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "1943j",
    "fullName": "1943 - The Battle of Midway (JAPAN)",
    "letter": "special",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "1943u",
    "fullName": "1943 - The Battle of Midway (US)",
    "letter": "special",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "1943kai",
    "fullName": "1943 Kai",
    "letter": "special",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "airbustr",
    "fullName": "Air Buster: Trouble Specialty Raid Unit (World)",
    "letter": "a",
    "order": ["score", "name", "phase"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "altbeast",
    "fullName": "Altered Beast (set 8, 8751 317-0078)",
    "letter": "a",
    "order": ["score", "name", "stage"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "altbeast2",
    "fullName": "Altered Beast (set 2, MC-8123B 317-0066)",
    "letter": "a",
    "order": ["score", "name", "stage"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "altbeast4",
    "fullName": "Altered Beast (set 4, MC-8123B 317-0066))",
    "letter": "a",
    "order": ["score", "name", "stage"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "altbeast5",
    "fullName": "Altered Beast (set 5, FD1094 317-0069)",
    "letter": "a",
    "order": ["score", "name", "stage"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "altbeast6",
    "fullName": "Altered Beast (set 6, 8751 317-0076)",
    "letter": "a",
    "order": ["score", "name", "stage"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "ark1ball",
    "fullName": "Arkanoid (bootleg with MCU, harder)",
    "letter": "a",
    "order": ["score", "name", "round"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "arkangc",
    "fullName": "Arkanoid (Game Corporation bootleg, set 1)",
    "letter": "a",
    "order": ["score", "name", "round"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "arkangc2",
    "fullName": "Arkanoid (Game Corporation bootleg, set 2)",
    "letter": "a",
    "order": ["score", "name", "round"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "arkanoid",
    "fullName": "Arkanoid (World)",
    "letter": "a",
    "order": ["score", "name", "round"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "arkanoidj",
    "fullName": "Arkanoid (Japan)",
    "letter": "a",
    "order": ["score", "name", "round"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "arkanoidjo",
    "fullName": "Arkanoid (Japan, older)",
    "letter": "a",
    "order": ["score", "name", "round"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "arkatayt",
    "fullName": "Arkanoid (Tayto bootleg)",
    "letter": "a",
    "order": ["score", "name", "round"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "arkgcbl",
    "fullName": "Arkanoid (bootleg on Block hardware, set 1)",
    "letter": "a",
    "order": ["score", "name", "round"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "arkgcbla",
    "fullName": "Arkanoid (bootleg on Block hardware, set 2)",
    "letter": "a",
    "order": ["score", "name", "round"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "asterix",
    "fullName": "Asterix (ver EAD)",
    "letter": "a",
    "order": ["score", "name", "character"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "asterixaad",
    "fullName": "Asterix (ver AAD)",
    "letter": "a",
    "order": ["score", "name", "character"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "asterixeaa",
    "fullName": "Asterix (ver EAA)",
    "letter": "a",
    "order": ["score", "name", "character"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "asterixj",
    "fullName": "Asterix (ver JAD)",
    "letter": "a",
    "order": ["score", "name", "character"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "avsp",
    "fullName": "Alien vs. Predator (Euro 940520)",
    "letter": "a",
    "order": ["score", "name", "character", "level"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "avspa",
    "fullName": "Alien vs. Predator (Asia 940520)",
    "letter": "a",
    "order": ["score", "name", "character", "level"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "avspd",
    "fullName": "Alien vs. Predator (Euro 940520 Phoenix Edition) (bootleg)",
    "letter": "a",
    "order": ["score", "name", "character", "level"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "avsph",
    "fullName": "Alien vs. Predator (Hispanic 940520)",
    "letter": "a",
    "order": ["score", "name", "character", "level"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "avspj",
    "fullName": "Alien vs. Predator (Japan 940520)",
    "letter": "a",
    "order": ["score", "name", "character", "level"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "avspu",
    "fullName": "Alien vs. Predator (USA 940520)",
    "letter": "a",
    "order": ["score", "name", "character", "level"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "bgaregga",
    "fullName": "Battle Garegga (Europe/USA/Japan/Asia) (Sat Feb 3 1996)",
    "letter": "b",
    "order": ["score", "name", "ship"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "bgareggabl",
    "fullName": "1945 Part-2 (Chinese hack of Battle Garegga)",
    "letter": "b",
    "order": ["score", "name", "ship"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "bgareggacn",
    "fullName": "Battle Garegga - Type 2 (Denmark/China) (Tue Apr 2 1996)",
    "letter": "b",
    "order": ["score", "name", "ship"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "bgareggahk",
    "fullName": "Battle Garegga (Austria/Hong Kong) (Sat Feb 3 1996)",
    "letter": "b",
    "order": ["score", "name", "ship"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "bgaregganv",
    "fullName": "Battle Garegga - New Version (Austria/Hong Kong) (Sat Mar 2 1996)",
    "letter": "b",
    "order": ["score", "name", "ship"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "bgareggat2",
    "fullName": "Battle Garegga - Type 2 (Europe/USA/Japan /Asia) (Sat Mar 2 1996)",
    "letter": "b",
    "order": ["score", "name", "ship"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "bgareggatw",
    "fullName": "Battle Garegga (Taiwan/Germany) (Thu Feb 1 1996)",
    "letter": "b",
    "order": ["score", "name", "ship"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "bigbang",
    "fullName": "Big Bang (9th Nov. 1993)",
    "letter": "b",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "blazeon",
    "fullName": "Blaze On (Japan)",
    "letter": "b",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "blktiger",
    "fullName": "Black Tiger",
    "letter": "b",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "blktigera",
    "fullName": "Black Tiger (older)",
    "letter": "b",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "blktigerb1",
    "fullName": "Black Tiger (bootleg set 1)",
    "letter": "b",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "blktigerb2",
    "fullName": "Black Tiger (bootleg set 2)",
    "letter": "b",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "bubl2000",
    "fullName": "Bubble 2000",
    "letter": "b",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "bublbobl",
    "fullName": "Bubble Bobble",
    "letter": "b",
    "order": ["score", "name", "round"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "bub68705",
    "fullName": "Bubble Bobble (bootleg with 68705)",
    "letter": "b",
    "order": ["score", "name", "round"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "dino",
    "fullName": "Cadillacs and Dinosaurs (World 930201)",
    "letter": "c",
    "order": ["score", "name", "character", "level"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "dinoj",
    "fullName": "Cadillacs: Kyouryuu Shin Seiki (Japan 930201)",
    "letter": "c",
    "order": ["score", "name", "character", "level"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "dinou",
    "fullName": "Cadillacs and Dinosaurs (USA 930201)",
    "letter": "c",
    "order": ["score", "name", "character", "level"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "dinohunt",
    "fullName": "Dinosaur Hunter (Chinese bootleg of Cadillacs and Dinosaurs)",
    "letter": "d",
    "order": ["score", "name", "character", "level"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "ddonpach",
    "fullName": "DoDonPachi (International, Master Ver. 97/02/05)",
    "letter": "d",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "dkong",
    "fullName": "Donkey Kong (US set 1)",
    "letter": "d",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "dkongf",
    "fullName": "Donkey Kong Foundry (hack)",
    "letter": "d",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "dkongj",
    "fullName": "Donkey Kong (Japan set 1)",
    "letter": "d",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "dkongjo",
    "fullName": "Donkey Kong (Japan set 2)",
    "letter": "d",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "dkongjo1",
    "fullName": "Donkey Kong (Japan set 3)",
    "letter": "d",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "dkongo",
    "fullName": "Donkey Kong (US set 2)",
    "letter": "d",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "elvactr",
    "fullName": "Elevator Action Returns (Ver 2.2O 1995/02/20)",
    "letter": "e",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "elvactrj",
    "fullName": "Elevator Action Returns (Ver 2.2J 1995/02/20)",
    "letter": "e",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "elvact2u",
    "fullName": "Elevator Action II (Ver 2.2A 1995/02/20)",
    "letter": "e",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "ffightj1",
    "fullName": "Final Fight (Japan 900112)",
    "letter": "f",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "ffightj2",
    "fullName": "Final Fight (Japan 900305)",
    "letter": "f",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "ffightua",
    "fullName": "Final Fight (USA 900112)",
    "letter": "f",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "ffightu",
    "fullName": "Final Fight (USA, set 1)",
    "letter": "f",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "ffightub",
    "fullName": "Final Fight (USA 900613)",
    "letter": "f",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "ffightu1",
    "fullName": "Final Fight (USA, set 2)",
    "letter": "f",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "ffighta",
    "fullName": "Final Fight (World, set 2)",
    "letter": "f",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "ffight",
    "fullName": "Final Fight (World, set 1)",
    "letter": "f",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "ffightj",
    "fullName": "Final Fight (Japan)",
    "letter": "f",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "ffightjh",
    "fullName": "Street Smart / Final Fight (Japan, hack)",
    "letter": "f",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "ffightbl",
    "fullName": "Final Fight (bootleg)",
    "letter": "f",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "galaga88",
    "fullName": "Galaga '88",
    "letter": "g",
    "order": ["score", "name", "stage", "dimension"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "galaga88j",
    "fullName": "Galaga '88 (Japan)",
    "letter": "g",
    "order": ["score", "name", "stage", "dimension"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "hcastle",
    "fullName": "Haunted Castle (version M)",
    "letter": "h",
    "order": ["score", "name", "stage"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "hcastlej",
    "fullName": "Akuma-Jou Dracula (Japan version P)",
    "letter": "h",
    "order": ["score", "name", "stage"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "hcastleo",
    "fullName": "Haunted Castle (version K)",
    "letter": "h",
    "order": ["score", "name", "stage"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "inthunt",
    "fullName": "In The Hunt (World)",
    "letter": "i",
    "order": ["score", "name", "stars", "stage"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "inthuntu",
    "fullName": "In The Hunt (US)",
    "letter": "i",
    "order": ["score", "name", "stars", "stage"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "jjack",
    "fullName": "Jumping Jack",
    "letter": "j",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "kaiteids",
    "fullName": "Kaitei Daisensou (Japan)",
    "letter": "k",
    "order": ["score", "name", "stars", "stage"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "kungfub",
    "fullName": "Kung-Fu Master (bootleg set 1)",
    "letter": "k",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "asc"
    }
  },
  {
    "name": "kungfub2",
    "fullName": "Kung-Fu Master (bootleg set 2)",
    "letter": "k",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "asc"
    }
  },
  {
    "name": "kungfum",
    "fullName": "Kung-Fu Master",
    "letter": "k",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "asc"
    }
  },
  {
    "name": "kungfumd",
    "fullName": "Kung-Fu Master (Data East)",
    "letter": "k",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "asc"
    }
  },
  {
    "name": "lwings",
    "fullName": "Legendary Wings (US set 1)",
    "letter": "l",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "lwings2",
    "fullName": "Legendary Wings (US set 2)",
    "letter": "l",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "lwingsb",
    "fullName": "Legendary Wings (bootleg)",
    "letter": "l",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "lwingsj",
    "fullName": "Ares no Tsubasa (Japan)",
    "letter": "l",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "mmatrix",
    "fullName": "Mars Matrix: Hyper Solid Shooting (USA 000412)",
    "letter": "m",
    "order": ["score", "name", "exp", "stage", "ship"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "mmatrixd",
    "fullName": "Mars Matrix: Hyper Solid Shooting (USA 000412 Phoenix Edition) (bootleg)",
    "letter": "m",
    "order": ["score", "name", "exp", "stage", "ship"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "mmatrixj",
    "fullName": "Mars Matrix: Hyper Solid Shooting (Japan 000412)",
    "letter": "m",
    "order": ["score", "name", "exp", "stage", "ship"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "motos",
    "fullName": "Motos",
    "letter": "m",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "mslugx",
    "fullName": "Metal Slug X - Super Vehicle-001 (NGM-2500)(NGH-2500)",
    "letter": "m",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "mslug2",
    "fullName": "Metal Slug 2 - Super Vehicle-001/II (NGM-2410)(NGH-2410)",
    "letter": "m",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "mt_beast",
    "fullName": "Altered Beast (Mega-Tech)",
    "letter": "a",
    "order": ["score", "name", "stage"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "mt_orun",
    "fullName": "Out Run (Mega-Tech, SMS based)",
    "letter": "o",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "nspirit",
    "fullName": "Ninja Spirit",
    "letter": "n",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "nspiritj",
    "fullName": "Saigo no Nindou (Japan)",
    "letter": "n",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "outrun",
    "fullName": "Out Run (sitdown/upright, Rev B)",
    "letter": "o",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "outrunb",
    "fullName": "Out Run (bootleg)",
    "letter": "o",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "outrundx",
    "fullName": "Out Run (deluxe sitdown)",
    "letter": "o",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "outruno",
    "fullName": "Out Run (sitdown/upright)",
    "letter": "o",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "outrunra",
    "fullName": "Out Run (sitdown/upright, Rev A)",
    "letter": "o",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "pacmania",
    "fullName": "Pac-Mania",
    "letter": "p",
    "order": ["score", "name", "stage"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "pacmaniaj",
    "fullName": "Pac-Mania (Japan)",
    "letter": "p",
    "order": ["score", "name", "stage"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "pang",
    "fullName": "Pang (World)",
    "letter": "p",
    "order": ["score", "name", "stage"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "pangba",
    "fullName": "Pang (bootleg, set 3)",
    "letter": "p",
    "order": ["score", "name", "stage"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "pc_trjan",
    "fullName": "Trojan (PlayChoice-10)",
    "letter": "t",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
    {
    "name": "quartet",
    "fullName": "Quartet (Rev A, 8751 315-5194)",
    "letter": "q",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "quarteta",
    "fullName": "Quartet (8751 315-5194)",
    "letter": "q",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "quartet2a",
    "fullName": "Quartet 2 (unprotected)",
    "letter": "q",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "quartet2",
    "fullName": "Quartet 2 (8751 317-0010)",
    "letter": "q",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "rtype",
    "fullName": "R-Type (World)",
    "letter": "r",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "rtypeb",
    "fullName": "R-Type (World bootleg)",
    "letter": "r",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "rtypej",
    "fullName": "R-Type (Japan)",
    "letter": "r",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "rtypejp",
    "fullName": "R-Type (Japan prototype)",
    "letter": "r",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "rtypeleo",
    "fullName": "R-Type Leo (World)",
    "letter": "r",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "rtypeleoj",
    "fullName": "R-Type Leo (Japan)",
    "letter": "r",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "rtypeu",
    "fullName": "R-Type (US)",
    "letter": "r",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    },
  },
  {
    "name": "rtype2",
    "fullName": "R-Type II",
    "letter": "r",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "rtype2j",
    "fullName": "R-Type II (Japan)",
    "letter": "r",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "rtype2jc",
    "fullName": "R-Type II (Japan, revision C)",
    "letter": "r",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
   }
  },
  {
    "name": "sc4pmani",
    "fullName": "Pac Mania (Mazooma) (Scorpion 4) (set 1)",
    "letter": "p",
    "order": ["score", "name", "stage"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "sc4pmania",
    "fullName": "Pac Mania (Mazooma) (Scorpion 4) (set 2)",
    "letter": "p",
    "order": ["score", "name", "stage"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "simpsons",
    "fullName": "The Simpsons (4 Players World, set 1)",
    "letter": "s",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "splatter",
    "fullName": "Splatter House (World new version)",
    "letter": "s",
    "order": ["score", "name", "stage"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "splatterj",
    "fullName": "Splatter House (Japan)",
    "letter": "s",
    "ordner": ["score", "name", "stage"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "splattero",
    "fullName": "Splatter House (World old version)",
    "letter": "s",
    "order": ["score", "name", "stage"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "spf2th",
    "fullName": "Super Puzzle Fighter II Turbo (Hispanic 960531)",
    "letter": "s",
    "order": ["score", "name", "level", "char"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "spf2t",
    "fullName": "Super Puzzle Fighter II Turbo (US 960620)",
    "letter": "s",
    "order": ["score", "name", "level", "char"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "spf2xj",
    "fullName": "Super Puzzle Fighter II Turbo (Japan 960531)",
    "letter": "s",
    "order": ["score", "name", "level", "char"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "spf2xjd",
    "fullName": "Super Puzzle Fighter II X (Japan 960531 Phoenix Edition) (bootleg)",
    "letter": "s",
    "order": ["score", "name", "level", "char"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "spf2ta",
    "fullName": "Super Puzzle Fighter II Turbo (Asia 960529)",
    "letter": "s",
    "order": ["score", "name", "level", "char"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "spf2td",
    "fullName": "Super Puzzle Fighter II Turbo (USA 960620 Phoenix Edition) (bootleg)",
    "letter": "s",
    "order": ["score", "name", "level", "char"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "tdragon2",
    "fullName": "Thunder Dragon 2 (9th Nov. 1993)",
    "letter": "t",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "tdragon2a",
    "fullName": "Thunder Dragon 2 (1st Oct. 1993)",
    "letter": "t",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "tgm2",
    "fullName": "Tetris The Absolute The Grand Master 2",
    "letter": "t",
    "order": ["mode", "score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "trojan",
    "fullName": "Trojan (US)",
    "letter": "t",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "trojanj",
    "fullName": "Tatakai no Banka (Japan)",
    "letter": "t",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "trojanr",
    "fullName": "Trojan (Romstar)",
    "letter": "t",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "unsquad",
    "fullName": "U.N. Squadron (USA)",
    "letter": "u",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "varth",
    "fullName": "Varth: Operation Thunderstorm (World 920714)",
    "letter": "v",
    "order": ["score", "name", "stage"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "varthj",
    "fullName": "Varth: Operation Thunderstorm (World 920714)",
    "letter": "v",
    "order": ["score", "name", "stage"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "varthr1",
    "fullName": "Varth: Operation Thunderstorm (World 920612)",
    "letter": "v",
    "order": ["score", "name", "stage"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "varthu",
    "fullName": "Varth: Operation Thunderstorm (USA 920612)",
    "letter": "v",
    "order": ["score", "name", "stage"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "willow",
    "fullName": "Willow (USA)",
    "letter": "w",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "willowj",
    "fullName": "Willow (Japan)",
    "letter": "w",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "willowo",
    "fullName": "Willow (USA Old Ver.)",
    "letter": "w",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "xexex",
    "fullName": "Xexex (ver EAA)",
    "letter": "x",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "xexexa",
    "fullName": "Xexex (ver AAA)",
    "letter": "x",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "xexexj",
    "fullName": "Xexex (ver JAA)",
    "letter": "x",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    },
  },
   {
    "name": "youjyudn",
    "fullName": "Youjyuden (Japan)",
    "letter": "y",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "zedblade",
    "fullName": "Zed Blade / Operation Ragnarok",
    "letter": "z",
    "order": ["score", "name", "stage"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },
  {
    "name": "zerowing",
    "fullName": "Zerowing",
    "letter": "z",
    "order": ["score", "name"],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  }
];
