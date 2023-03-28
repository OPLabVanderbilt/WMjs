const bindingTrials = [
    {
        "ProbeType": "Word",
        "TrialN": 1,
        "Load": 2,
        "Probe": "actor",
        "CorrRes": 16,
        "Pairs": [['actor', 16], ['drum', 43]]
    },
    {
        "ProbeType": "Word",
        "TrialN": 2,
        "Load": 2,
        "Probe": "game",
        "CorrRes": 84,
        "Pairs": [['ruler', 96], ['game', 84]]
    },
    {
        "ProbeType": "Word",
        "TrialN": 3,
        "Load": 3,
        "Probe": "lamp",
        "CorrRes": 96,
        "Pairs": [['salad', 36], ['ruler', 81], ['lamp', 96]]
    },
    {
        "ProbeType": "Number",
        "TrialN": 4,
        "Load": 3,
        "Probe": 26,
        "CorrRes": "ruler",
        "Pairs": [['ruler', 26], ['gift', 83], ['drum', 68]]
    },
    {
        "ProbeType": "Word",
        "TrialN": 5,
        "Load": 3,
        "Probe": "camera",
        "CorrRes": 86,
        "Pairs": [['salad', 36], ['camera', 86], ['apple', 61]]
    },
    {
        "ProbeType": "Number",
        "TrialN": 6,
        "Load": 3,
        "Probe": 36,
        "CorrRes": "dawn",
        "Pairs": [['dawn', 36], ['actor', 43], ['ruler', 59]]
    },
    {
        "ProbeType": "Number",
        "TrialN": 7,
        "Load": 4,
        "Probe": 59,
        "CorrRes": "drum",
        "Pairs": [['material', 79], ['camera', 43], ['lamp', 21], ['drum', 59]]
    },
    {
        "ProbeType": "Number",
        "TrialN": 8,
        "Load": 4,
        "Probe": 40,
        "CorrRes": "salad",
        "Pairs": [['salad', 40], ['game', 86], ['lamp', 84], ['gift', 23]]
    },
    {
        "ProbeType": "Number",
        "TrialN": 9,
        "Load": 4,
        "Probe": 59,
        "CorrRes": "camera",
        "Pairs": [['camera', 59], ['dawn', 25], ['pepper', 21], ['apple', 84]]
    },
    {
        "ProbeType": "Word",
        "TrialN": 10,
        "Load": 4,
        "Probe": "rice",
        "CorrRes": 41,
        "Pairs": [['dawn', 43], ['gift', 81], ['rice', 41], ['apple', 16]]
    },
    {
        "ProbeType": "Word",
        "TrialN": 11,
        "Load": 4,
        "Probe": "actor",
        "CorrRes": 61,
        "Pairs": [['dawn', 86], ['material', 25], ['actor', 61], ['gift', 59]]
    },
    {
        "ProbeType": "Number",
        "TrialN": 12,
        "Load": 5,
        "Probe": 79,
        "CorrRes": "phone",
        "Pairs": [['phone', 79], ['train', 25], ['drum', 21], ['snake', 68], ['actor', 40]]
    },
    {
        "ProbeType": "Number",
        "TrialN": 13,
        "Load": 5,
        "Probe": 81,
        "CorrRes": "brain",
        "Pairs": [['phone', 23], ['pepper', 79], ['brain', 81], ['camera', 89], ['drum', 97]]
    },
    {
        "ProbeType": "Word",
        "TrialN": 14,
        "Load": 5,
        "Probe": "phone",
        "CorrRes": 25,
        "Pairs": [['rice', 32], ['drum', 97], ['gift', 84], ['brain', 96], ['phone', 25]]
    },
    {
        "ProbeType": "Number",
        "TrialN": 15,
        "Load": 5,
        "Probe": 36,
        "CorrRes": "material",
        "Pairs": [['train', 16], ['phone', 89], ['material', 36], ['brain', 61], ['lamp', 81]]
    },
    {
        "ProbeType": "Word",
        "Load": 6,
        "TrialN": 16,
        "Pairs": [['material', 28], ['pepper', 79], ['salad', 35], ['crate', 43], ['drum', 40], ['phone', 61]],
        "Foils": [[16, 26], [36, 59], [86, 23], [16, 84], [81, 83], [25, 97]]
    },
    {
        "ProbeType": "Word",
        "Load": 6,
        "TrialN": 22,
        "Pairs": [['brain', 31], ['lamp', 47], ['train', 51], ['rice', 82], ['gift', 63], ['camera', 21]],
        "Foils": [[61, 96], [81, 84], [86, 23], [16, 23], [84, 59], [89, 59]]
    }
]

const oSpanTrials = [
    {
        "TrialN": -1,
        "Load": 3,
        "Operations": [
            "7 + 9 = 16",
            "10 + 7 = 18",
            "7 + 7 = 17"
        ],
        "Letters": [
            "n",
            "l",
            "p"
        ]
    },
    {
        "TrialN": -1,
        "Load": 4,
        "Operations": [
            "1 + 8 = 9",
            "8 + 9 = 19",
            "7 - 2 = 5",
            "4 - 4 = 2"
        ],
        "Letters": [
            "b",
            "w",
            "m",
            "x"
        ]
    },
    {
        "TrialN": -1,
        "Load": 5,
        "Operations": [
            "2 - 2 = 2",
            "6 + 6 = 12",
            "5 - 6 = -1",
            "8 + 5 = 14",
            "5 + 10 = 15"
        ],
        "Letters": [
            "p",
            "b",
            "x",
            "v",
            "c"
        ]
    },
    {
        "TrialN": 1,
        "Load": 4,
        "Operations": [
            "7 - 2 = 6",
            "5 + 3 = 11",
            "4 + 7 = 11",
            "10 - 2 = 10"
        ],
        "Letters": [
            "h",
            "b",
            "s",
            "g"
        ]
    },
    {
        "TrialN": 2,
        "Load": 4,
        "Operations": [
            "5 + 10 = 15",
            "8 + 8 = 16",
            "5 + 8 = 16",
            "4 - 7 = -3"
        ],
        "Letters": [
            "t",
            "p",
            "s",
            "l"
        ]
    },
    {
        "TrialN": 3,
        "Load": 4,
        "Operations": [
            "6 + 6 = 12",
            "4 - 7 = -2",
            "6 + 5 = 13",
            "2 - 8 = -5"
        ],
        "Letters": [
            "l",
            "f",
            "g",
            "s"
        ]
    },
    {
        "TrialN": 4,
        "Load": 5,
        "Operations": [
            "1 - 1 = 0",
            "5 + 5 = 10",
            "5 + 10 = 17",
            "3 - 1 = 3",
            "10 - 2 = 8"
        ],
        "Letters": [
            "l",
            "g",
            "n",
            "t",
            "m"
        ]
    },
    {
        "TrialN": 5,
        "Load": 5,
        "Operations": [
            "7 + 3 = 10",
            "4 - 8 = -4",
            "5 - 9 = -1",
            "9 + 4 = 14",
            "8 - 6 = 2"
        ],
        "Letters": [
            "x",
            "p",
            "t",
            "v",
            "k"
        ]
    },
    {
        "TrialN": 6,
        "Load": 5,
        "Operations": [
            "6 + 7 = 13",
            "5 + 6 = 11",
            "9 + 8 = 18",
            "8 + 5 = 16",
            "2 + 4 = 7"
        ],
        "Letters": [
            "x",
            "z",
            "b",
            "f",
            "q"
        ]
    },
    {
        "TrialN": 7,
        "Load": 6,
        "Operations": [
            "8 + 5 = 14",
            "4 + 6 = 10",
            "9 + 6 = 17",
            "5 + 9 = 17",
            "3 + 10 = 16",
            "4 - 7 = -3"
        ],
        "Letters": [
            "q",
            "k",
            "b",
            "h",
            "z",
            "d"
        ]
    },
    {
        "TrialN": 8,
        "Load": 6,
        "Operations": [
            "10 - 5 = 5",
            "4 - 6 = -2",
            "8 + 7 = 15",
            "7 + 4 = 14",
            "7 - 1 = 8",
            "9 + 8 = 18"
        ],
        "Letters": [
            "j",
            "k",
            "s",
            "b",
            "x",
            "p"
        ]
    },
    {
        "TrialN": 9,
        "Load": 6,
        "Operations": [
            "5 - 1 = 7",
            "8 - 5 = 3",
            "3 + 3 = 6",
            "8 + 3 = 11",
            "2 + 5 = 9",
            "5 + 2 = 10"
        ],
        "Letters": [
            "t",
            "h",
            "p",
            "l",
            "n",
            "r"
        ]
    },
    {
        "TrialN": 10,
        "Load": 7,
        "Operations": [
            "5 - 1 = 5",
            "1 + 7 = 11",
            "7 + 9 = 16",
            "9 + 0 = 9",
            "4 - 2 = 3",
            "2 + 6 = 8",
            "6 + 0 = 9"
        ],
        "Letters": [
            "j",
            "b",
            "r",
            "v",
            "z",
            "q",
            "g"
        ]
    },
    {
        "TrialN": 11,
        "Load": 7,
        "Operations": [
            "4 + 7 = 13",
            "2 + 9 = 11",
            "10 + 0 = 11",
            "2 + 0 = 2",
            "4 + 0 = 5",
            "9 - 7 = 5",
            "8 + 7 = 15"
        ],
        "Letters": [
            "b",
            "r",
            "h",
            "t",
            "m",
            "d",
            "p"
        ]
    },
    {
        "TrialN": 12,
        "Load": 7,
        "Operations": [
            "7 - 6 = 2",
            "9 + 4 = 15",
            "1 + 9 = 13",
            "7 + 4 = 11",
            "4 - 8 = -4",
            "6 + 3 = 11",
            "5 - 9 = -4"
        ],
        "Letters": [
            "p",
            "g",
            "d",
            "q",
            "c",
            "x",
            "w"
        ]
    },
    {
        "TrialN": 13,
        "Load": 8,
        "Operations": [
            "4 + 9 = 13",
            "8 + 6 = 17",
            "8 - 9 = 2",
            "9 - 1 = 8",
            "3 - 4 = -1",
            "10 - 6 = 7",
            "6 - 4 = 4",
            "5 + 4 = 9"
        ],
        "Letters": [
            "c",
            "b",
            "f",
            "v",
            "h",
            "m",
            "t",
            "n"
        ]
    },
    {
        "TrialN": 14,
        "Load": 8,
        "Operations": [
            "8 + 0 = 11",
            "9 - 1 = 8",
            "10 - 4 = 9",
            "8 - 8 = 0",
            "4 - 4 = 0",
            "7 + 6 = 16",
            "9 - 3 = 6",
            "4 - 2 = 2"
        ],
        "Letters": [
            "p",
            "m",
            "f",
            "h",
            "n",
            "g",
            "d",
            "s"
        ]
    },
    {
        "TrialN": 15,
        "Load": 8,
        "Operations": [
            "2 - 8 = -6",
            "1 + 4 = 5",
            "7 + 7 = 15",
            "10 - 3 = 7",
            "2 - 4 = -2",
            "6 - 1 = 8",
            "10 - 1 = 9",
            "3 + 9 = 12"
        ],
        "Letters": [
            "n",
            "z",
            "x",
            "g",
            "t",
            "d",
            "f",
            "b"
        ]
    }
]