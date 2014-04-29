/* This file holds all highscore mappings for the games. */
gameMaps = [
  {
    "name": [
      "1943",
      "1943j",
      "1943u",
      "1943kai"
    ],
    "structure": {
      "blocks": 5,
      "fields": [
        {"name": "score", "bytes": 8, "format": "paddedAsIs"},
        {"name": "name", "bytes": 3, "format": "fromCharMap", "settings": {
            "charMap": "numericUpper",
            "special": {
              "24": " ",
              "2B": ".",
              "2C": ":",
              "3A": "&",
              "62": "♥",
              "64": "★",
              "66": "!"
            }
          }
        },
        {"name": "separator", "bytes": 5}
      ]
    }
  },
  {
    "name": [
      "altbeast",
      "altbeast2",
      "altbeast4",
      "altbeast5",
      "altbeast6",
      "mt_beast"
    ],
    "structure": {
      "blocks": 7,
      "fields": [
        {"name": "score", "bytes": 4, "format": "asIs"},
        {"name": "stage", "bytes": 1, "format": "asIs"},
        {"name": "name", "bytes": 3, "format": "ascii"}
      ]
    }
  },
  {
    "name": [
      "ark1ball",
      "arkangc",
      "arkangc2",
      "arkanoid",
      "arkanoidj",
      "arkanoidjo",
      "arkatayt",
      "arkgcbl",
      "arkgcbla"
    ],
    "structure": {
      "blocks": 5,
      "fields": [
        {"name": "score", "bytes": 3, "format": "asIs", "settings": {"append": "0"}},
        {"name": "round", "bytes": 1, "format": "asIs"},
        {"name": "name", "bytes": 3, "format": "ascii"}
      ]
    }
  },
  {
    "name": [
      "asterix",
      "asterixaad",
      "asterixeaa",
      "asterixj"
    ],
    "structure": {
      "blocks": 10,
      "fields": [
        {"name": "score", "bytes": 4, "format": "asIs"},
        {"name": "name", "bytes": 3, "format": "fromCharMap", "settings": {
            "charMap": "numericCharUpper"
          }
        },
        {"name": "character", "bytes": 1, "format": "specialOnly", "settings": {
            "special": {
              "01": "Asterix",
              "02": "Obelix"
            }
          }
        }
      ]
    }
  },
  {
    "name": [
      "avsp",
      "avspa",
      "avspd",
      "avsph",
      "avspj",
      "avspu"
    ],
    "structure": {
      "blocks": 50,
      "fields": [
        {"name": "rank", "bytes": 1},
        {"name": "trash", "bytes": 3},
        {"name": "score", "bytes": 4, "format": "asIs"},
        {"name": "name", "bytes": 3, "format": "ascii"},
        {"name": "character", "bytes": 1, "format": "specialOnly", "settings": {
            "special": {
              "00": "Predator Warrior",
              "01": "Maj. D. Schaefer",
              "02": "Predator Hunter",
              "03": "Lt. Linn Kurosawa"
            }
          }
        },
        {"name": "level", "bytes": 1, "format": "asIs"},
        {"name": "trash", "bytes": 3}
      ]
    }
  },
  {
    "name": [
      "bgaregga",
      "bgareggabl",
      "bgareggacn",
      "bgareggahk",
      "bgaregganv",
      "bgareggat2",
      "bgareggatw"
    ],
    "structure": {
      "blocks": 10,
      "fields": [
        {"name": "trash", "bytes": 3},
        {"name": "score", "bytes": 7, "format": "ascii"},
        {"name": "trash", "bytes": 1},
        {"name": "name", "bytes": 3, "format": "ascii", "settings": {
          "special": {
            "40": "‡"
            }
          }
        },
        {"name": "trash", "bytes": 3},
        {"name": "ship", "bytes": 1, "format": "specialOnly", "settings": {
           "special": {
             "61": "G-913",
             "62": "G-1026",
             "63": "G-130",
             "64": "G-1010"
            }
          }
        },
        {"name": "trash", "bytes": 6}
      ]
    }
  },
  {
    "name": [
      "blazeon"
    ],
    "structure": {
      "blocks": 10,
      "fields": [
        {"name": "score", "bytes": 8, "format": "bcd"},
        {"name": "name", "bytes": 3, "format": "fromCharMap", "settings": {
            "charMap": "upper",
            "special": {
              "1A": " ",
              "1B": ".",
              "1C": "-",
              "20": " "
            }
          }
        },
        {"name": "trash", "bytes": 1}
      ]
    }
  },
  {
    "name": [
      "blktiger",
      "blktigera",
      "blktigerb1",
      "blktigerb2"
    ],
    "structure": {
      "blocks": 5,
      "fields": [
        {"name": "trash", "bytes": 1},
        {"name": "score", "bytes": 7, "format": "bcd", "settings": {"append": "0"}},
        {"name": "trash", "bytes": 4},
        {"name": "name", "bytes": 3, "format": "ascii"},
        {"name": "trash", "bytes": 1}
      ]
    }
  },
  {
    "name": [
      "bubl2000"
    ],
    "structure": {
      "blocks": 5,
      "fields": [
        {"name": "score", "bytes": 4, "format": "hexToDecimal", "settings": {
            "append": "00"
          }
        },
        {"name": "trash", "bytes": 1},
        {"name": "name", "bytes": 9, "format": "ascii", "settings": {
            "ignoreBytes": [1, 3, 5, 7]
          }
        },
        {"name": "trash", "bytes": 2}
      ]
    }
  },
  {
    "name": [
      "bublbobl",
      "bub68705"
    ],
    "structure": {
      "blocks": 5,
      "fields": [
        {"name": "score", "bytes": 3, "format": "asIs", "settings": {"append": "0"}},
        {"name": "round", "bytes": 1, "format": "hexToDecimal", "settings":{"add": 1}},
        {"name": "name", "bytes": 3, "format": "ascii"}
      ]
    }
  },
  {
    "name": [
      "ddonpach"
    ],
    "fileType": "hi",
    "structure": { 
      "custom": true
    }
  },
  {
    "name": [
      "dino",
      "dinoj",
      "dinou",
      "dinohunt"
    ],
    "structure": {
      "blocks": 10,
      "fields": [
        {"name": "score", "bytes": 4, "format": "asIs"},
        {"name": "name", "bytes": 3, "format": "ascii"},
        {"name": "trash", "bytes": 1},
        {"name": "character", "bytes": 1, "format": "specialOnly", "settings": {
            "special": {
              "00": "Jack Tenrec",
              "01": "Mustapha Cairo",
              "02": "Hannah Dundee",
              "03": "Mess O'Bredovic"
            }
          }
        },
        {"name": "level", "bytes": 1, "format": "asIs"},
        {"name": "trash", "bytes": 6}
      ]
    }
  },
  {
    "name": [
      "dkong",
      "dkongjo",
      "dkongj",
      "dkongo",
      "dkongjo1",
      "dkongf"
    ],
    "structure": {
      "blocks": 5,
      "fields": [
        {"name": "UnusedA", "bytes": 2},
        {"name": "Rank", "bytes": 1},
        {"name": "UnusedB", "bytes": 4},
        {"name": "score", "bytes": 6, "format": "bcd"},
        {"name": "UnusedC", "bytes": 2},
        {"name": "name", "bytes": 3, "format": "fromCharMap", "settings": {
            "charMap": "upper",
            "offset": "11",
            "special": {
              "2B": ".",
              "2C": ":"
            }
          }
        },
        {"name": "UnusedD", "bytes": 11},
        {"name": "ShortScore", "bytes": 3},
        {"name": "UnusedE", "bytes": 2}
      ]
    }
  },
  {
    "name": [
      "elvactr",
      "elvactrj",
      "elvact2u"
    ],
    "structure": {
      "blocks": 10,
      "fields": [
        {"name": "garbage", "bytes": 1},
        {"name": "score", "bytes": 3, "format": "hexToDecimal"},
        {"name": "comments", "bytes": 4},
        {"name": "name", "bytes": 3, "format": "ascii"},
        {"name": "trash", "bytes": 1}
      ]
    }
  },
  {
    "name": [
      "ffightj1",
      "ffightj2",
      "ffightj1",
      "ffightua",
      "ffightu",
      "ffight",
      "ffightj",
      "ffightjh",
      "ffightbl"
    ],
    "structure": {
      "skip": 20,
      "blocks": 3,
      "fields": [
        {"name": "score", "bytes": 4, "format": "asIs"},
        {"name": "name", "bytes": 3, "format": "ascii"},
        {"name": "trash", "bytes": 1}
      ]
    }
  },
  {
    "name": [
      "galaga88",
      "galaga88j"
    ],
    "structure": {
      "skip": 6,
      "blocks": 8,
      "fields": [
        {"name": "score", "bytes": 5, "format": "asIs"},
        {"name": "trash", "bytes": 1},
        {"name": "stage", "bytes": 1, "format": "asIs"},
        {"name": "trash", "bytes": 1},
        {"name": "dimension", "bytes": 1, "format": "asIs"},
        {"name": "name", "bytes": 3, "format": "fromCharMap", "settings": {
            "charMap": "upper",
            "offset": 1,
            "special": {
              "1B": "."
            }
          }
        }
      ]
    }
  },
  {
    "name": [
      "hcastle",
      "hcastlej",
      "hcastleo"
    ],
    "structure": {
      "blocks": 10,
      "fields": [
        {"name": "score", "bytes": 2, "format": "asIs", "settings":{ "append": "00"}},
        {"name": "stage", "bytes": 1, "format": "asIs"},
        {"name": "name", "bytes": 3, "format": "fromCharMap", "settings": {
            "charMap": "upper",
            "offset": "11"
          }
        }
      ]
    }
  },
  {
    "name": [
      "inthunt",
      "inthuntu",
      "kaiteids"
    ],
    "structure": {
      "blocks": 10,
      "fields": [
        {"name": "score", "bytes": 4, "format": "reverseDecimal"},
        {"name": "stars", "bytes": 1, "format": "hexToDecimal"},
        {"name": "trash", "bytes": 1},
        {"name": "stage", "bytes": 1, "format": "specialOnly", "settings": {
            "special": {
              "00": "1",
              "02": "2",
              "04": "3",
              "06": "4"
            }
          }
        },
        {"name": "trash", "bytes": 1},
        {"name": "name", "bytes": 5, "format": "ascii", "settings": {"ignoreBytes": [1, 3]}},
        {"name": "trash", "bytes": 3}
      ]
    }
  },
  {
    "name": [
      "jjack"
    ],
    "structure": {
      "blocks": 10,
      "fields": [
        {"name": "score", "bytes": 3, "format": "asIs"},
        {"name": "name", "bytes": 3, "format": "ascii"},
        {"name": "trash", "bytes": 2}
      ]
    }
  },
  {
    "name": [
      "kungfub",
      "kungfub2",
      "kungfum",
      "kungfumd"
    ],
    "structure": {
      "blocks": 20,
      "fields": [
        {"name": "score", "bytes": 3, "format": "asIs", "settings": { "append": "0"}},
        {"name": "name", "bytes": 3, "format": "ascii"}
      ]
    }
  },
  {
    "name": [
      "lwings",
      "lwings2",
      "lwingsb",
      "lwingsj"
    ],
    "structure": {
      "blocks": 7,
      "fields": [
        {"name": "score", "bytes": 3, "format": "asIs", "settings": { "append": "0"}},
        {"name": "name", "bytes": 10, "format": "ascii", "settings": {
            "special": {
              "2E": " "
            }
          }
        }
      ]
    }
  },
  {
    "name": [
      "mslug2"
    ],
    "structure": {
      "blocks": 10,
      "fields": [
        {"name": "score", "bytes": 4, "format": "asIs"},
        {"name": "name", "bytes": 3, "format": "ascii"},
        {"name": "trash", "bytes": 3}
      ]
    }
  },
  {
    "name": [
      "motos"
    ],
    "structure": {
      "skip": 5,
      "blocks": 5,
      "fields": [
        {"name": "score", "bytes": 7, "format": "ascii"},        
        {"name": "trash", "bytes": 6},
        {"name": "name", "bytes": 8, "format": "ascii"},
        {"name": "trash", "bytes": 11},
      ]
    }
  },
  {
    "name": [
      "mmatrix",
      "mmatrixd",
      "mmatrixj"
    ],
    "structure": {
      "blocks": 20,
      "fields": [
        {"name": "name", "bytes": 3, "format": "ascii"},
        {"name": "trash", "bytes": 1},
        {"name": "score", "bytes": 6, "format": "asIs"},
        {"name": "exp", "bytes": 4, "format": "asIs"},
        {"name": "stage", "bytes": 1, "format": "specialOnly", "settings": {
            "special": {
              "00": "1",
              "01": "2",
              "02": "3",
              "03": "4",
              "04": "5",
              "05": "6",
              "06": "ALL"
            }
          }
        },
        {"name": "ship", "bytes": 1, "format": "specialOnly", "settings": {
            "special": {
              "00": "Mosquito 01",
              "01": "Mosquito 02"
            }
          }
        }
      ]
    }
  },
  {
    "name": [
      "mslugx"
    ],
    "structure": {
      "blocks": 9,
      "fields": [
        {"name": "score", "bytes": 4, "format": "asIs"},
        {"name": "name", "bytes": 3, "format": "ascii"},
        {"name": "trash", "bytes": 1}
      ]
    }
  },
  {
    "name": [
      "nspirit",
      "nspiritj"
    ],
    "structure": {
      "blocks": 10,
      "fields": [
        {"name": "score", "bytes": 3, "format": "reverseDecimal", "settings": {"append": "00"}},
        {"name": "name", "bytes": 9, "format": "ascii"}
      ]
    }
  },
  {
    "name": [
      "mt_orun",
      "outrun",
      "outrunb",
      "outrundx",
      "outruno",
      "outrunra"
    ],
    "structure": {
      "blocks": 20,
      "fields": [
        {"name": "score", "bytes": 4, "format": "asIs"},
        {"name": "name", "bytes": 3, "format": "ascii", "settings": {
            "special": {
              "5B": "."
            }
          }
        },
        {"name": "route", "bytes": 3},
        {"name": "record", "bytes": 4}
      ]
    }
  },
  {
    "name": [
      "pacmania",
      "pacmaniaj",
      "sc4pmani",
      "sc4pmania"
    ],
    "structure": {
      "blocks": 10,
      "fields": [
        {"name": "score", "bytes": 4, "format": "asIs", "settings": {"append": "0"}},
        {"name": "stage", "bytes": 1, "format": "asIs"},
        {"name": "name", "bytes": 3, "format": "ascii"}
      ]
    }
  },
  {
    "name": [
      "quartet",
      "quarteta",
      "quartet2a",
      "quartet2"
    ],
    "structure": {
      "blocks": 99,
      "fields": [
        {"name": "score", "bytes": 4, "format": "asIs"},
        {"name": "name", "bytes": 3, "format": "ascii"},
        {"name": "trash", "bytes": 1}
      ]
    }
  },
  {
    "name": [
      "pang",
      "pangba"
    ],
    "structure": {
      "blocks": 10,
      "fields": [
        {"name": "score", "bytes": 3, "format": "asIs", "settings": {"append": "0"}},
        {"name": "name", "bytes": 3, "format": "ascii",  "settings": {
            "special": {
              "7B": "·"
            }
          }},
        {"name": "stage", "bytes": 1, "format": "asIs"},
        {"name": "trash", "bytes": 9}
      ]
    }
  },
  {
    "name": [
      "rtype",
      "rtypeb",
      "rtypej",
      "rtypejp",
      "rtypeu"
    ],
    "structure": {
      "skip": 3,
      "blocks": 10,
      "fields": [
        {"name": "trash", "bytes": 1},
        {"name": "score", "bytes": 3, "format": "reverseDecimal", "settings": {"append": "00"}},
        {"name": "name", "bytes": 7, "format": "ascii", "settings": {
            "special": {
              "3E": "♥"
            }
          }
        }
      ]
    }
  },
  {
    "name": [
      "rtypeleo",
      "rtypeleoj"
    ],
    "structure": {
      "blocks": 7,
      "fields": [
        {"name": "score", "bytes": 3, "format": "reverseDecimal", "settings": {"append": "0"}},
        {"name": "name", "bytes": 5, "format": "ascii"}
      ]
    }
  },
  {
    "name": [
      "rtype2",
      "rtype2j",
      "rtype2jc"
    ],
    "structure": {
      "skip": 20,
      "blocks": 10,
      "fields": [
        {"name": "score", "bytes": 3, "format": "reverseDecimal"},
        {"name": "skip", "bytes": 1},
        {"name": "name", "bytes": 7, "format": "ascii"}
      ]
    }
  },
  {
    "name": [
      "simpsons"
    ],
    "structure": {
      "blocks": 10,
      "fields": [
        {"name": "name", "bytes": 3, "format": "fromCharMap", "settings":{
            "charMap": "upper",
            "offset": "41",
            "special": {
              "62": "$",
              "60": "@",
              "5F": "&",
              "5C": "_",
              "5B": ".",
              "5D": "?",
              "40": " ",
              "61": "★",
              "5E": "!"
            }
          }
        },
        {"name": "score", "bytes": 2, "format": "asIs"},
        {"name": "trash", "bytes": 3}
      ]
    }
  },
  {
    "name": [
      "splatter",
      "splatterj",
      "splattero"
    ],
    "structure": {
      "blocks": 8,
      "fields": [
        {"name": "score", "bytes": 3, "format": "asIs", "settings": {"append": "00"}},
        {"name": "stage", "bytes": 1, "format": "asIs"},
        {"name": "name", "bytes": 3, "format": "ascii"},
        {"name": "trash", "bytes": 1}
      ]
    }
  },
  {
    "name": [
      "spf2th",
      "spf2t",
      "spf2xj",
      "spf2xjd",
      "spf2ta",
      "spf2td"
    ],
    "structure": {
      "blocks": 5,
      "fields": [
        {"name": "score", "bytes": 4, "format": "hexToDecimal"},
        {"name": "name", "bytes": 3, "format": "fromCharMap", "settings": {
            "charMap": "upperNumeric",
            "special": {
              "29": "♥",
              "28": ",",
              "27": "-",
              "26": ".",
              "25": "?",
              "24": "!",
              "2A": "←",
              "2B": "&",
              "2C": "=",
              "2D": " "
            }
          }
        },
        {"name": "trash", "bytes": 1},
        {"name": "char", "bytes": 1, "format": "specialOnly", "settings": {
            "special": {
              "00": "Morrigan",
              "01": "Chun-Li",
              "02": "Ryu",
              "03": "Ken",
              "04": "Hsien-ko",
              "05": "Donovan",
              "06": "Felicia",
              "07": "Sakura"
            }
          }
        },
        {"name": "trash", "bytes": 2},
        {"name": "level", "bytes": 1, "format": "specialOnly", "settings": {
            "special": {
              "00": "easy",
              "01": "normal",
              "02": "hard"
            }
          }
        },
        {"name": "trash", "bytes": 4}
      ]
    }
  },
  {
    "name": [
      "bigbang",
      "tdragon2",
      "tdragon2a"
    ],
    "structure": {
      "blocks": 9,
      "fields": [
        {"name": "name", "bytes": 5, "format": "fromCharMap", "settings": {
            "charMap": "upper",
            "ignoreBytes": [1, 3]
          }
        },
        {"name": "trash", "bytes": 1},
        {"name": "score", "bytes": 5, "format": "asIs"},
        {"name": "trash", "bytes": 1}
      ]
    }
  },
  {
    "name": [
      "tgm2"
    ],
    "structure": {
      "blocks": 3,
      "skip": 172,
      "fields": [
        {"name": "name", "bytes": 3, "format": "ascii"},
        {"name": "trash", "bytes": 2},
        {"name": "score", "bytes": 3, "format": "hexToDecimal"},
      ]
    }
  },
  {
    "name": [
      "pc_trjan",
      "trojan",
      "trojanj",
      "trojanr"
    ],
    "structure": {
      "blocks": 7,
      "fields": [
        {"name": "score", "bytes": 3, "format": "asIs", "settings": {"append": "0"}},
        {"name": "name", "bytes": 10, "format": "ascii"}
      ]
    }
  },
  {
    "name": [
      "unsquad"
    ],
    "structure": {
      "blocks": 5,
      "fields": [
        {"name": "trash", "bytes": 3},
        {"name": "score", "bytes": 5, "format": "bcd", "settings": {"append": "0"}},
        {"name": "name", "bytes": 3, "format": "ascii"},
        {"name": "trash", "bytes": 5}
      ]
    }
  },
  {
    "name": [
      "varth",
      "varthj",
      "varthr1",
      "varthu"
    ],
    "structure": {
      "blocks": 10,
      "fields": [
        {"name": "score", "bytes": 4, "format": "asIs"},
        {"name": "name", "bytes": 3, "format": "ascii"},
        {"name": "stage", "bytes": 1, "format": "asIs"}
      ]
    }
  },
  {
    "name": [
      "willow",
      "willowj",
      "willowo"
    ],
    "structure": {
      "blocks": 10,
      "fields": [
        {"name": "score", "bytes": 4, "format": "asIs"},
        {"name": "name", "bytes": 3, "format": "ascii"},
        {"name": "trash", "bytes": 1}
      ]
    }
  },
  {
    "name": [
      "xexex",
      "xexexa",
      "xexexj"
    ],
    "structure": {
      "blocks": 10,
      "fields": [
        {"name": "score", "bytes": 3, "format": "asIs", "settings": {"append": "0"}},
        {"name": "name", "bytes": 3, "format": "ascii", "settings": {
            "special": {
              "3D": "."
            }
          }
        },
        {"name": "trash", "bytes": 4}
      ]
    }
  },
  {
    "name": [
      "youjyudn"
    ],
    "structure": {
      "blocks":5,
      "fields": [
        {"name": "score", "bytes": 3, "format": "reverseDecimal", "settings": {"append": "0"}},
        {"name": "name", "bytes": 8, "format": "ascii", "settings": {
            "special": {
              "64": " ",
              "5E": "♀",
              "5D": "♂",
              "5C": "!",
              "5B": "."
            }
          }
        }
      ]
    }
  },
  {
    "name": [
      "zedblade"
    ],
    "structure": {
      "blocks":5,
      "fields": [
        {"name": "score", "bytes": 4, "format": "asIs"},
        {"name": "trash", "bytes": 1},
        {"name": "stage", "bytes": 1, "format": "asIs"},
        {"name": "trash", "bytes": 5},
        {"name": "name", "bytes": 5, "format": "fromCharMap", "settings": {
            "charMap": "upper",
            "ignoreBytes": [1, 3],
            "special": {
              "1A": ".",
              "1B": " "
            }
          }
        }
      ]
    }
  },
  {
    "_comment": "for now uses a custom function, but need to turn into more generic version",
    "name": [
      "zerowing"
    ],
    "version": "0.108",
    "structure": { 
      "custom": true,
      "fields": [
        {"name": "score", "bytes": "2-4", "format": "asIs"},
        {"name": "score", "bytes": "6-8", "format": "asIs"},
        {"name": "score", "bytes": "10-12", "format": "asIs"},
        {"name": "score", "bytes": "2-4", "format": "asIs"},
        {"name": "score", "bytes": "2-4", "format": "asIs"},

        {"name": "name", "bytes": "2-4", "format": "asIs"},
        {"name": "name", "bytes": "2-4", "format": "asIs"},
        {"name": "name", "bytes": "2-4", "format": "asIs"},
        {"name": "name", "bytes": "2-4", "format": "asIs"},
        {"name": "name", "bytes": "2-4", "format": "asIs"},
      ] 
    }
  }
];
