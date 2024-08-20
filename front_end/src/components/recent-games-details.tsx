import { Dropdown } from 'primereact/dropdown';
import React, { useEffect, useState } from 'react';
import { getFullTeamName } from '../types/types';
import { parseJSONWithNaN } from '../utils/utils';
import { RenderEventSummary } from './event-summary';
import './tailwind.css';
import { TabMenu } from 'primereact/tabmenu';
import ArsenalStats from './arsenal';
import CountStats from './count';
import Progression from './progression';
import HitOutcome from './hit-result';
import PlayerCard from './player-card';
interface TabItem {
    label: string;
    command?: () => void;
}
interface RecentGamesDetailsProps {
    pitcher_id: string;
    chosenPitcherData: any;
}
interface GameOption {
    label: string;
    value: number;
}
interface PlotZoneProps {
    xCoords: number[];
    yCoords: number[];
    sz_top: number[];
    sz_bot: number[];
    types: any[];
}
interface GameData {
    details: any[];
    game_date: string;
    opponent: string;
}
const gameOptionTemplate = (option: GameOption) => {
    return (
        <div className="flex justify-between w-full py-2 pl-3 pr-4 ">
            <span>{option.label.split(',\u00A0')[0]}</span>
            <span>{option.label.split(',\u00A0')[1]}</span>
        </div>
    );
};
const PlotZone: React.FC<PlotZoneProps> = ({ xCoords, yCoords, sz_top, sz_bot, types }) => {
    const width = 1000;
    const height = 640;
    const strikeZoneWidth = 288; // Width of the strike zone in pixels
    const strikeZoneHeight = 384; // Height of the strike zone in pixels
    const strikeZoneXRange = 1; // Horizontal range in feet
    // Function to convert feet to pixels for the strike zone
    const scaleToPlotAreaX = (value: number) => {
        return ((value) / (strikeZoneXRange)) * (strikeZoneWidth / 2);
    };

    const scaleToPlotAreaY = (value: number) => {
        return (value / (5)) * height;
    };
    const maxOpacity = 0.8;
    const minOpacity = 0.3;
    const maxLength = 1000;
    const normalizedLength = Math.min(xCoords.length, maxLength);
    const fillOpacity = minOpacity + ((maxLength - normalizedLength) / maxLength) * (maxOpacity - minOpacity);

    // Center the strike zone within the container
    const centerX = width / 2;

    // Function to get fill color based on type
    const getFillColor = (type: string) => {
        switch (type) {
            case "strike":
                return "red";
            case "swinging":
                return "darkred";
            case "ball":
                return "green";
            case "badBalls":
                return "#013220";
            case "hit":
                return "gray";
            default:
                return "white";
        }
    };

    // Convert coordinates and position plot points
    const plotPoints = xCoords.map((x, index) => {
        const fillColor = getFillColor(types[index]);
        return (
            <circle
                key={index}
                cx={centerX + scaleToPlotAreaX(x)}
                cy={height - scaleToPlotAreaY(yCoords[index])}
                r="15"
                fill={fillColor}
                fillOpacity={fillOpacity}
            />
        );
    });

    return (
        <svg width={width} height={height} className="absolute inset-0 z-10">
            {plotPoints}
        </svg>
    );
};


const RecentGamesDetails: React.FC<RecentGamesDetailsProps> = ({ pitcher_id, chosenPitcherData }) => {
    const [playerNames, setPlayerNames] = useState<Record<number, string>>({});
    const [selectedGame, setSelectedGame] = useState<GameOption | null>(null);
    const [gameData, setGameData] = useState<Record<string, GameData>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [recentGames, setRecentGames] = useState<GameOption[]>([]);
    const [pitcherId, setPitcherId] = useState<string>(pitcher_id);
    const [fetchedPlayerIds, setFetchedPlayerIds] = useState<Set<number>>(new Set());
    const aggregateEventCounts = (details: any[]) => {
        const eventCounts: Record<string, number> = {};

        // Define sets for categorizing event types
        const strikeouts = new Set(['strikeout']);
        const walks = new Set(['walk', 'hit_by_pitch']);
        const hits = new Set(['single', 'double', 'triple', 'home_run']);
        const strikes = new Set(['called_strike', 'swinging_strike', 'foul', 'foul_tip', 'hit_into_play']);
        const balls = new Set(['ball', 'blocked_ball']);

        let strikeOutCount = 0;
        let walksCount = 0;
        let hitCount = 0;
        let hardHitCount = 0;

        const aggregatedCounts = {
            balls: 0,
            ballsPercentage: 0.0,
            strikes: 0,
            strikesPercentage: 0.0,
        };

        details.forEach((event) => {
            const descriptionType = event.description;
            const eventType = event.events;
            const launchSpeed = event.launch_speed;

            // Count strikes and balls
            if (descriptionType) {
                if (strikes.has(descriptionType)) {
                    aggregatedCounts.strikes++;
                } else if (balls.has(descriptionType)) {
                    aggregatedCounts.balls++;
                }
            }

            // Count hard hits (exit velocity of 95+ mph)
            if (launchSpeed && descriptionType !== "foul") {
                if (launchSpeed >= 95) {
                    hardHitCount++;
                }
            }

            // Count strikeouts, walks, and hits
            if (eventType) {
                if (strikeouts.has(eventType)) {
                    strikeOutCount++;
                } else if (walks.has(eventType)) {
                    walksCount++;
                }
                if (hits.has(eventType)) {
                    hitCount++;
                }
            }
        });

        // Calculate the strikeout-to-walk ratio and round to two decimal places
        const ratio = walksCount > 0 ? (strikeOutCount / walksCount).toFixed(2) : 'Infinity';

        // Store the results in the eventCounts object
        eventCounts["Hits"] = hitCount;
        eventCounts["Hit hard"] = hardHitCount;
        eventCounts["Strike outs"] = strikeOutCount;
        eventCounts["Walks"] = walksCount;
        eventCounts["K to walk Ratio"] = parseFloat(ratio);

        // Calculate the total number of relevant events (balls + strikes)
        const totalEvents = aggregatedCounts.balls + aggregatedCounts.strikes;

        // Calculate ball and strike percentages, rounded to one decimal place
        if (totalEvents > 0) {
            aggregatedCounts.ballsPercentage = parseFloat(((aggregatedCounts.balls / totalEvents) * 100).toFixed(1));
            aggregatedCounts.strikesPercentage = parseFloat(((aggregatedCounts.strikes / totalEvents) * 100).toFixed(1));
        }
        Object.assign(eventCounts, aggregatedCounts);

        return eventCounts;
    };

    const groupByAtBatNumber = (details: any[]) => {
        // Group data by at_bat_number
        const atBats: Record<number, any[]> = {};

        details.forEach((event) => {
            const atBatNumber = event.at_bat_number;
            if (!atBats[atBatNumber]) {
                atBats[atBatNumber] = [];
            }
            atBats[atBatNumber].push(event);
        });

        return atBats;
    };

    const fetchPlayerNames = async (ids: number[]) => {
        const newIds = ids.filter((id) => !fetchedPlayerIds.has(id)); // Filter out already fetched IDs
        if (newIds.length === 0) return; // Exit if there are no new IDs to fetch
        try {
            const response = await fetch(`http://127.0.0.1:5000/get/name?ids=${ids.join(',')}`);
            const data = await response.json();

            if (response.ok) {
                setPlayerNames((prevPlayerNames) => ({
                    ...prevPlayerNames,
                    ...data.player_names,
                }));
                setFetchedPlayerIds((prevFetchedPlayerIds) => {
                    const updatedSet = new Set(prevFetchedPlayerIds);
                    newIds.forEach((id) => updatedSet.add(id));
                    return updatedSet;
                });
            } else {
                console.error('Error fetching player names:', data.error);
            }
        } catch (error) {
            console.error('Failed to fetch player names:', error);
        }
    };
    useEffect(() => {
        if (selectedGame === null || selectedGame === undefined) {
            setSelectedAtBat(null);
        }
    }, [selectedGame]);

    const details = selectedGame === null || selectedGame === undefined
        ? Object.values(gameData).flatMap((game: any) => game.details)
        : gameData[String(selectedGame)].details;

    // Aggregate event and description counts
    const eventCounts = aggregateEventCounts(details);
    const atBatResults = groupByAtBatNumber(details);
    useEffect(() => {
        // Collect all batter IDs from the atBatResults
        const batterIds = details.map((event: any) => event.batter).filter((id: number) => id !== undefined);

        if (batterIds.length > 0) {
            fetchPlayerNames(batterIds);
        }
    }, [details]);

    const atBatArray = Object.entries(atBatResults).map(([atBatNumber, events]) => ({
        atBatNumber: parseInt(atBatNumber, 10),
        events,
    }));

    const onAtBatClick = (atBatNumber: number) => {
        if (atBatNumber == selectedAtBat) {
            setSelectedAtBat(null);
        } else {
            setSelectedAtBat(atBatNumber);
        }
    };
    const convertEventToAbbreviation = (event: { events: string; description: string; bb_type: string; hit_location: string; }) => {
        switch (event.events) {
            case "strikeout":
                return event.description === "called_strike" ? "ꓘ" : "K";
            case "field_out":
            case "force_out":
                return "FO";
            case "single":
                return "1B";
            case "double":
                return "2B";
            case "triple":
                return "3B";
            case "home_run":
                return "HR";
            case "grounded_into_double_play":
            case "double_play":
                return "DP";
            case "walk":
                return "BB";
            case "hit_by_pitch":
                return "HBP";
            case "sac_fly":
                return "SF";
            case "sac_bunt":
                return "SH";
            case "balk":
                return "BK";
            case "fielder_choice":
                return "FC";
            case "wild_pitch":
                return "WP";
            case "passed_ball":
                return "PB";
            case "stolen_base":
                return "SB";
            case "error":
            case "field_error":
                return "E";
            case "bunt":
                return "B";
            case "line_drive":
                return "L";
            case "unassisted":
                return "U";
            case "foul_fly":
                return "F";
            case "intentional_walk":
                return "IBB";
            default:
                return event.events;
        }
    };
    const [selectedAtBat, setSelectedAtBat] = useState<number | null>(null);

    // Filter coordinates based on the selected at-bat
    const aggregateCoordinates = (atBatNumber: number | null) => {

        if (atBatNumber === null) {
            // Aggregate coordinates for all at-bats
            return atBatArray.reduce(
                (acc, atBat) => {
                    atBat.events.forEach(event => {
                        const strike = new Set(['called_strike']);
                        const strikesSwinging = new Set(['swinging_strike', 'foul', 'foul_tip', "swinging_strike_blocked", "foul_bunt"]);
                        const balls = new Set(['ball',]);
                        const badBalls = new Set(['blocked_ball', "hit_by_pitch"]);
                        const hit = new Set(["hit_into_play"]);

                        if (event.plate_x !== undefined && event.plate_z !== undefined && event.sz_top !== undefined && event.sz_bot !== undefined && event.description !== undefined) {
                            acc.x.push(event.plate_x);
                            acc.y.push(event.plate_z);
                            acc.sz_top.push(event.sz_top);
                            acc.sz_bot.push(event.sz_bot);

                            if (strike.has(event.description)) {
                                acc.types.push("strike");
                            } else if (balls.has(event.description)) {
                                acc.types.push("ball");
                            } else if (strikesSwinging.has(event.description)) {
                                acc.types.push("swinging");
                            } else if (hit.has(event.description)) {
                                acc.types.push("hit");
                            } else if (badBalls.has(event.description)) {
                                acc.types.push("badBalls");
                            } else {
                                acc.types.push("unknown");
                            }

                        }
                    });
                    return acc;
                },
                { x: [], y: [], sz_top: [], sz_bot: [], types: [] } as { x: number[]; y: number[]; sz_top: number[]; sz_bot: number[]; types: string[] }
            );

        } else {
            // Aggregate coordinates for the selected at-bat
            const atBat = atBatArray.find(atBat => atBat.atBatNumber === atBatNumber);
            if (!atBat) return { x: [], y: [], types: [] };
            return atBat.events.reduce(
                (acc, event) => {
                    const strike = new Set(['called_strike']);
                    const strikesSwinging = new Set(['swinging_strike', 'foul', 'foul_tip', "swinging_strike_blocked", "foul_bunt"]);
                    const balls = new Set(['ball',]);
                    const badBalls = new Set(['blocked_ball', "hit_by_pitch"]);
                    const hit = new Set(["hit_into_play"]);

                    if (event.plate_x !== undefined && event.plate_z !== undefined && event.sz_top !== undefined && event.sz_bot !== undefined && event.description !== undefined) {
                        acc.x.push(event.plate_x);
                        acc.y.push(event.plate_z);
                        acc.sz_top.push(event.sz_top);
                        acc.sz_bot.push(event.sz_bot);

                        if (strike.has(event.description)) {
                            acc.types.push("strike");
                        } else if (balls.has(event.description)) {
                            acc.types.push("ball");
                        } else if (strikesSwinging.has(event.description)) {
                            acc.types.push("swinging");
                        } else if (hit.has(event.description)) {
                            acc.types.push("hit");
                        } else if (badBalls.has(event.description)) {
                            acc.types.push("badBalls");
                        } else {
                            acc.types.push("unknown");
                        }

                    }
                    return acc;
                },
                { x: [], y: [], sz_top: [], sz_bot: [], types: [] } as { x: number[]; y: number[]; sz_top: number[]; sz_bot: number[]; types: string[] }
            );
        }
    };
    const { x, y, sz_top, sz_bot, types } = aggregateCoordinates(selectedAtBat);
    const formatGameLabel = (gamePk: string, data: any): string => {
        const fullTeamName = getFullTeamName(data[gamePk].opponent);
        const gameDate = new Date(data[gamePk].game_date);
        const formattedDate = gameDate.toLocaleString('en-US', { month: 'short', day: 'numeric' });
        return `${fullTeamName},\u00A0${formattedDate}`;
    };
    const fetchRecentGames = async () => {
        if (!pitcherId) return;

        try {
            const response = await fetch(`http://127.0.0.1:5000/stats/pitcher/recent/${pitcherId}`);
            const text = await response.text();

            if (response.ok) {
                const data = parseJSONWithNaN(text);

                const sortedGameKeys = Object.keys(data).sort((a, b) => {
                    const dateA = new Date(data[a].game_date);
                    const dateB = new Date(data[b].game_date);
                    return dateB.getTime() - dateA.getTime();
                });

                const gameOptions: GameOption[] = sortedGameKeys.map((gamePk) => ({
                    label: formatGameLabel(gamePk, data),
                    value: parseInt(gamePk, 10),
                }));

                setRecentGames(gameOptions);
                setGameData(data);
            } else {
                console.error('Error:', response.statusText);
                setError('An error occurred');
            }
        } catch (err) {
            console.error('Failed to fetch recent games.', err);
            setError('Failed to fetch recent games.');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchRecentGames();
    }, [pitcherId]);
    const [selectedComponent, setSelectedComponent] = useState<'arsenal' | 'count' | 'progression' | 'hit'>('arsenal');
    const [activeIndex, setActiveIndex] = useState<number>(0); // To track the active tab index
    const [key, setKey] = useState(0);


    const renderSelectedComponent = () => {
        switch (selectedComponent) {
            case 'arsenal':
                return pitcherId && <ArsenalStats pitcherId={pitcherId} />;
            case 'count':
                return pitcherId && <CountStats pitcherId={pitcherId} />;
            case 'progression':
                return pitcherId && <Progression pitcherId={pitcherId} />;
            case 'hit':
                return pitcherId && <HitOutcome pitcherId={pitcherId} />;
            default:
                return null;
        }
    };
    const items: TabItem[] = [
        {
            label: 'Arsenal Stats',
            command: () => handleButtonClick('arsenal', 0),
        },
        {
            label: 'Count Stats',
            command: () => handleButtonClick('count', 1),
        },
        {
            label: 'Hit Result',
            command: () => handleButtonClick('hit', 2),
        },
        {
            label: 'Distribution & Progression',
            command: () => handleButtonClick('progression', 3),
        },
    ];

    const handleButtonClick = (component: 'arsenal' | 'count' | 'progression' | 'hit', index: number) => {
        setSelectedComponent(component);
        setActiveIndex(index);
        setKey(prev => prev + 1);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex w-full pt-4 px-4 flex-row">
                <PlayerCard name={chosenPitcherData.Name} pitcher_id={pitcher_id} chosenPitcherData={chosenPitcherData} />
                <div className="ml-4 w-full py-6 px-8 bg-card text-white rounded-lg">
                    <h2 className="text-2xl border-b border-gray-600 w-full pb-2 mb-2">Season Statistics</h2>
                    <div className="grid grid-cols-3 gap-y-2 gap-x-20 w-full">
                        <div className="flex justify-between items-center">
                            <span className="">Wins:</span>
                            <span>{chosenPitcherData.W}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="">Losses:</span>
                            <span>{chosenPitcherData.L}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="">Win-Loss %:</span>
                            <span>{chosenPitcherData["W-L%"]}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="">Games:</span>
                            <span>{chosenPitcherData.G}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="">Earned Runs:</span>
                            <span>{chosenPitcherData.ER}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="">ERA:</span>
                            <span>{chosenPitcherData.ERA}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="">Batters Faced:</span>
                            <span>{chosenPitcherData.BF}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="">Innings Pitched:</span>
                            <span>{chosenPitcherData.IP}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="">Walks:</span>
                            <span>{chosenPitcherData.BB}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="">BB/9:</span>
                            <span>{chosenPitcherData.BB9}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="">Hits Allowed:</span>
                            <span>{chosenPitcherData.H}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="">Hits per 9 Innings:</span>
                            <span>{chosenPitcherData.H9}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="">Strikeouts:</span>
                            <span>{chosenPitcherData.SO}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="">SO/9:</span>
                            <span>{chosenPitcherData.SO9}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="">Strikeout/Walk Ratio:</span>
                            <span>{chosenPitcherData["SO/W"]}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="">WHIP:</span>
                            <span>{chosenPitcherData.WHIP}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col w-full pt-4 px-4">
                <div className="h-full w-full bg-card rounded-lg flex flex-col p-4">
                    <div className="flex flex-row justify-center items-center h-14  mb-2">
                        <TabMenu model={items} activeIndex={activeIndex} key={key} className="custom-tab-menu" />
                    </div>
                    {renderSelectedComponent()}
                </div>
            </div>
            <div className="flex flex-row p-4 justify-start">
                <div className="flex flex-col">
                    <div className="w-80 flex flex-col  bg-card p-4 rounded-lg">
                        <h2 className="text-xl text-white mb-2">All Games</h2>
                        <Dropdown
                            value={selectedGame}
                            onChange={(e) => setSelectedGame(e.value)}
                            options={recentGames}
                            optionLabel="label"
                            placeholder="Select a game"
                            showClear
                            itemTemplate={gameOptionTemplate}
                            className="w-full md:w-14rem"
                            style={{ padding: '5px', border: '1px solid lightgray', borderRadius: "10px", backgroundColor: "white" }}
                        />

                    </div>
                    {selectedGame !== null && selectedGame !== undefined && (
                        <div>
                            <RenderEventSummary eventCounts={eventCounts} />
                            <div className="flex flex-col  rounded-lg bg-card p-4 space-y-2 mt-4 h-80 overflow-y-auto">
                                {atBatArray.reduce((acc: JSX.Element[], result, index) => {
                                    const inning = result.events[0].inning;
                                    const isFirstAtBatOfInning = index === 0 || atBatArray[index - 1].events[0].inning !== inning;

                                    if (isFirstAtBatOfInning && index >= 0) {
                                        acc.push(
                                            <div key={`separator-${inning}`} className="flex items-center">
                                                <hr className="flex-grow border-t-2 border-gray-300" />
                                                <span className="mx-2  text-off-white">Inning {inning}</span>
                                                <hr className="flex-grow border-t-2 border-gray-300" />
                                            </div>
                                        );
                                    }


                                    acc.push(
                                        <button
                                            key={result.atBatNumber}
                                            onClick={() => onAtBatClick(result.atBatNumber)}
                                            className={`${selectedAtBat == result.atBatNumber ? "bg-blue" : "bg-slate-gray"}  text-black py-2 px-4 flex flex-row justify-between rounded ${selectedAtBat == result.atBatNumber ? "hover:bg-blue" : "hover:bg-slate-gray-hover"}`}
                                        >
                                            <div>{playerNames[result.events[0].batter] || 'Loading...'}</div>
                                            <div>{convertEventToAbbreviation(result.events[0])}</div>
                                        </button>
                                    );

                                    return acc;
                                }, [])}
                            </div>
                        </div>
                    )}
                </div>
                <div className=" ml-4 text-off-white flex items-center justify-center rounded-lg bg-card w-full">
                    <div className="h-custom-xl relative flex items-center justify-center bg-transparent  rounded-xl" style={{ "width": "1000px" }}>
                        <div className="h-64 w-48 border-4 border-gray-200 grid grid-cols-3 grid-rows-3">
                            <div className="flex items-center border justify-center"></div>
                            <div className="flex items-center border justify-center"></div>
                            <div className="flex items-center border justify-center"></div>
                            <div className="flex items-center border justify-center"></div>
                            <div className="flex items-center border justify-center"></div>
                            <div className="flex items-center border justify-center"></div>
                            <div className="flex items-center border justify-center"></div>
                            <div className="flex items-center border justify-center"></div>
                            <div className="flex items-center border justify-center"></div>
                            <PlotZone xCoords={x} yCoords={y} sz_top={sz_top} sz_bot={sz_bot} types={types} />
                        </div>
                        <div className="bg-gray-200 rounded-t-md w-48  absolute h-10 bottom-0 z-0">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecentGamesDetails;
