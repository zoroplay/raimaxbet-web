export const periods = [
    {value: 'today', label: 'Today'},
    {value: '1hour', label: '1 <br /> hr'},
    {value: '3hour', label: '3 <br /> hrs'},
    {value: '24hour', label: '24 <br /> hrs'},
    {value: '72hour', label: '72 <br /> hrs'},
    {value: 'all', label: 'All'}
];

export const LiveEventsOverview = [
    {
        sport: "Soccer",
        id: 1,
        markets: [
            {
                id: 110,
                name: '1X2',
                outcomes: [
                    {name: '1', id: 1},
                    {name: 'X', id: 2},
                    {name: '2', id: 3},
                ]
            },
            {
                id: 302,
                name: 'GG/NG',
                outcomes: [
                    {name: 'GG', id: 1},
                    {name: 'NG', id: 2},
                ]
            },
            {
                id: 160,
                name: 'Over/Under',
                hasSpread: true,
                outcomes: [
                    {name: 'Over', id: 1},
                    {name: 'Under', id: 2},
                ]
            }
        ]
    }, {
        sport: "Basketball",
        id: 2,
        markets: [
            {
                name: 'Winner',
                id: '',
                outcomes: [
                    {name: '1', id: 1},
                    {name: '2', id: 2},
                ]
            },
            {
                name: 'Over/Under',
                id: 160,
                hasSpread: true,
                outcomes: [
                    {name: 'Over', id: 1},
                    {name: 'Under', id: 2},
                ]
            },
            {
                name: 'Handicap',
                id: 305,
                outcomes: [
                    {name: '1 H', id: 1},
                    {name: '2 H', id: 2},
                ]
            }
        ]
    },
    {
        sport: "Ice Hockey",
        id: 4,
        markets: [
            {
                name: '1X2',
                id: '',
                outcomes: [
                    {name: '1', id: 1},
                    {name: 'X', id: 2},
                    {name: '2', id: 3},
                ]
            },
            {
                name: 'Total goals',
                id: 160,
                hasSpread: true,
                outcomes: [
                    {name: 'Over', id: 1},
                    {name: 'Under', id: 2},
                ]
            },
            {
                name: 'Next goal',
                id: 195,
                outcomes: [
                    {name: '1', id: 1},
                    {name: 'X', id: 2},
                    {name: '2', id: 3},
                ]
            },
        ]
    },
    {
        sport: "Tennis",
        id: 5,
        markets: [
            {
                name: 'Winner',
                id: '',
                outcomes: [
                    {name: '1', id: 1},
                    {name: '2', id: 2},
                ]
            },
            {
                name: 'Over/Under',
                id: 160,
                hasSpread: true,
                outcomes: [
                    {name: 'Over', id: 1},
                    {name: 'Under', id: 2},
                ]
            },
            {
                name: 'Set 2: Who Wins the Game',
                id: 305,
                outcomes: [
                    {name: '1 H', id: 1},
                    {name: '2 H', id: 2},
                ]
            },
        ]
    },
    {
        sport: "Handball",
        id: 6,
        markets: [
            {
                id: 110,
                name: '1X2',
                outcomes: [
                    {name: '1', id: 1},
                    {name: 'X', id: 2},
                    {name: '2', id: 3},
                ]
            },
            {
                id: 302,
                name: 'Total goals, regular time only',
                outcomes: [
                    {name: 'GG', id: 1},
                    {name: 'NG', id: 2},
                ]
            },
            {
                id: 160,
                name: 'Total goals home team',
                hasSpread: true,
                outcomes: [
                    {name: 'Over', id: 1},
                    {name: 'Under', id: 2},
                ]
            }
        ]
    },
    {
        sport: "Football",
        id: 16,
        markets: [
            {
                id: 110,
                name: '1X2',
                outcomes: [
                    {name: '1', id: 1},
                    {name: 'X', id: 2},
                    {name: '2', id: 3},
                ]
            },
            {
                id: 302,
                name: 'Total goals, regular time only',
                outcomes: [
                    {name: 'GG', id: 1},
                    {name: 'NG', id: 2},
                ]
            },
            {
                id: 160,
                name: 'Total goals home team',
                hasSpread: true,
                outcomes: [
                    {name: 'Over', id: 1},
                    {name: 'Under', id: 2},
                ]
            }
        ]
    },
    {
        sport: "Cricket",
        id: 21,
        markets: [
            {
                id: 9841,
                name: 'Winner',
                outcomes: [
                    {name: '1', id: 1},
                    {name: '2', id: 2},
                ]
            },
            {
                id: 302,
                name: 'Next dismissal (caught / not caught)',
                outcomes: [
                    {name: 'Caught', id: 1},
                    {name: 'Not caught', id: 2},
                ]
            },
            {
                id: 160,
                name: 'Total runs',
                hasSpread: true,
                outcomes: [
                    {name: 'Over', id: 1},
                    {name: 'Under', id: 2},
                ]
            }
        ]
    },
    {
        sport: "Volleyball",
        id: 23,
        markets: [
            {
                id: 110,
                name: 'Winner',
                outcomes: [
                    {name: '1', id: 1},
                    {name: '2', id: 2},
                ]
            },
            {
                id: 302,
                name: 'Total Points',
                hasSpread: true,
                outcomes: [
                    {name: 'Over', id: 1},
                    {name: 'Under', id: 2},
                ]
            },
            {
                id: 160,
                name: 'Which team will win the set?',
                outcomes: [
                    {name: 'Over', id: 1},
                    {name: 'Under', id: 2},
                ]
            }
        ]
    },
    {
        sport: "Futsal",
        id: 29,
        markets: [
            {
                id: 110,
                name: '1X2',
                outcomes: [
                    {name: '1', id: 1},
                    {name: '1', id: 2},
                    {name: '2', id: 3},
                ]
            },
            {
                id: 302,
                name: 'Total Goals',
                hasSpread: true,
                outcomes: [
                    {name: 'Over', id: 1},
                    {name: 'Under', id: 2},
                ]
            },
            {
                id: 160,
                name: 'Asian Handicap',
                outcomes: [
                    {name: '1 AH', id: 1},
                    {name: '2 AH', id: 2},
                ]
            }
        ]
    },
    {
        sport: "ESport Dota 2",
        id: 112,
        markets: [
            {
                id: 9388,
                name: 'Winner',
                outcomes: [
                    {name: '1', id: 1},
                    {name: '2', id: 3},
                ]
            },
            {
                id: 10020,
                name: 'Map - Which team will win',
                outcomes: [
                    {name: '1', id: 1},
                    {name: '2', id: 2},
                ]
            },
            {
                id: 10016,
                name: 'Total Maps',
                hasSpread: true,
                outcomes: [
                    {name: 'Over', id: 1},
                    {name: 'Under', id: 2},
                ]
            }
        ]
    },
    {
        sport: "ESport League of Legends",
        id: 111,
        markets: [
            {
                id: 9388,
                name: 'Winner',
                outcomes: [
                    {name: '1', id: 1},
                    {name: '2', id: 2},
                ]
            },
            {
                id: 10020,
                name: 'Map - Which team will win',
                outcomes: [
                    {name: '1', id: 1},
                    {name: '2', id: 2},
                ]
            },
            {
                id: 10016,
                name: 'Total Maps',
                hasSpread: true,
                outcomes: [
                    {name: 'Over', id: 1},
                    {name: 'Under', id: 2},
                ]
            }
        ]
    },
    {
        sport: "Rugby",
        id: 254,
        markets: [
            {
                id: 9388,
                name: '1X2',
                outcomes: [
                    {name: '1', id: 1},
                    {name: 'X', id: 2},
                    {name: '2', id: 3},
                ]
            },
            {
                id: 10020,
                name: 'Over/Under',
                hasSpread: true,
                outcomes: [
                    {name: 'Over', id: 1},
                    {name: 'Under', id: 2},
                ]
            },
            {
                id: 10016,
                name: 'Total Goals Home',
                outcomes: [
                    {name: 'Over', id: 1},
                    {name: 'Under', id: 2},
                ]
            }
        ]
    }
]

export const matchStatus = (status) => {
    switch (status) {
        case 0:
            return 'Not Set';
            break;
        case 3:
            return '1st Period';
            break;
        case 4:
            return '2nd Period';
            break;
        case 8:
            return '1st Set';
            break;
        case 9:
            return '2nd Set';
            break;
        case 10:
            return '3rd Set';
            break;
        case 11:
            return '4th Set';
            break;
        case 15:
            return '1st Quarter';
            break;
        case 16:
            return '2nd Quarter';
            break;
        case 17:
            return '3rd Quarter';
            break;
        case 18:
            return '4th Quarter';
        case 26:
            return 'Overtime';
        case 30:
            return '2nd Period Overtime';
            break;
        case 90:
            return 'In Progress';
            break;
        case 104:
            return 'Lunch Break';
        case 107:
            return 'Injury Break';
            break;
        case 118:
            return '1st Game';
            break;
        case 119:
            return '2nd Game';
            break;
        case 120:
            return '3rd Game';
            break;
        default:
            break;
    }
    if(status === 3){
        return '1st Half';
    }else if(status === 4){
        return '2nd Half';
    }else{
        return 'Not Set';
    }
}
