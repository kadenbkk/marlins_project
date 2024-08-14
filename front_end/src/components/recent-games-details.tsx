import React, { useEffect, useState } from 'react';

interface RecentGamesDetailsProps {
    data: any;
}
interface PlotZoneProps {
    xCoords: number[];
    yCoords: number[];
    sz_top: number[];
    sz_bot: number[];
    types: any[];
}
const PlotZone: React.FC<PlotZoneProps> = ({ xCoords, yCoords, sz_top, sz_bot, types }) => {
    const width = 640;
    const height = 640;
    const strikeZoneWidth = 288; // Width of the strike zone in pixels
    const strikeZoneHeight = 384; // Height of the strike zone in pixels
    const strikeZoneXRange = 1; // Horizontal range in feet
    console.log("xCoords: ", xCoords);
    console.log("yCoords: ", yCoords);
    // Function to convert feet to pixels for the strike zone
    const scaleToPlotAreaX = (value: number) => {
        return ((value) / (strikeZoneXRange)) * (strikeZoneWidth / 2);
    };

    const scaleToPlotAreaY = (value: number) => {
        return (value / (5)) * height;
    };

    // Center the strike zone within the container
    const centerX = width / 2;

    // Function to get fill color based on type
    const getFillColor = (type: string) => {
        switch (type) {
            case "strike":
                return "red";
            case "ball":
                return "green";
            case "hit":
                return "gray";
            default:
                return "gray";
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
                fillOpacity={0.8}
            />
        );
    });

    return (
        <svg width={width} height={height} className="absolute inset-0 z-10">
            {plotPoints}
        </svg>
    );
};


const RecentGamesDetails: React.FC<RecentGamesDetailsProps> = ({ data }) => {
    const [playerNames, setPlayerNames] = useState<Record<number, string>>({});

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
        try {
            const response = await fetch(`http://127.0.0.1:5000/get/name?ids=${ids.join(',')}`);
            const data = await response.json();

            if (response.ok) {
                setPlayerNames(data.player_names); // Update playerNames state
            } else {
                console.error('Error fetching player names:', data.error);
            }
        } catch (error) {
            console.error('Failed to fetch player names:', error);
        }
    };

    const { details } = data;

    // Aggregate event and description counts
    const eventCounts = aggregateEventCounts(details);
    const atBatResults = groupByAtBatNumber(details);
    console.log("details: ", details);
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
        setSelectedAtBat(atBatNumber);
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
                return "DP";
            case "walk":
                return "BB";
            case "hit_by_pitch":
                return "HP";
            case "sac_fly":
                return "SF";
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
                        const strikes = new Set(['called_strike', 'swinging_strike', 'foul', 'foul_tip']);
                        const balls = new Set(['ball', 'blocked_ball']);

                        if (event.plate_x !== undefined && event.plate_z !== undefined && event.sz_top !== undefined && event.sz_bot !== undefined && event.description !== undefined) {
                            acc.x.push(event.plate_x);
                            acc.y.push(event.plate_z);
                            acc.sz_top.push(event.sz_top);
                            acc.sz_bot.push(event.sz_bot);

                            if (strikes.has(event.description)) {
                                acc.types.push("strike");
                            } else if (balls.has(event.description)) {
                                acc.types.push("ball");
                            } else {
                                acc.types.push("hit");
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
                    const strikes = new Set(['called_strike', 'swinging_strike', 'foul', 'foul_tip']);
                    const balls = new Set(['ball', 'blocked_ball']);

                    if (event.plate_x !== undefined && event.plate_z !== undefined && event.sz_top !== undefined && event.sz_bot !== undefined && event.description !== undefined) {
                        acc.x.push(event.plate_x);
                        acc.y.push(event.plate_z);
                        acc.sz_top.push(event.sz_top);
                        acc.sz_bot.push(event.sz_bot);

                        if (strikes.has(event.description)) {
                            acc.types.push("strike");
                        } else if (balls.has(event.description)) {
                            acc.types.push("ball");
                        } else {
                            acc.types.push("hit");
                        }
                    }
                    return acc;
                },
                { x: [], y: [], sz_top: [], sz_bot: [], types: [] } as { x: number[]; y: number[]; sz_top: number[]; sz_bot: number[]; types: string[] }
            );
        }
    };

    const { x, y, sz_top, sz_bot, types } = aggregateCoordinates(selectedAtBat);

    return (
        <div className="flex flex-row">
            <div className="w-full bg-gray-700 text-white flex items-center justify-center h-screen">
                <div className="h-custom-xl w-custom-xl relative flex items-center justify-center">
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
                    <div className="bg-gray-200 rounded-t-md w-48 absolute h-10 bottom-0 z-0">

                    </div>
                </div>
            </div>
            <div className="flex flex-col p-4 bg-gray-100 w-96 border border-gray-300">
                <h2 className="text-xl font-semibold mb-2">Game Summary</h2>
                <ul>
                    {Object.entries(eventCounts).map(([eventType, count]) => (
                        <li key={eventType} className="py-1">
                            <span className="font-semibold">{eventType}:</span> {count}
                        </li>
                    ))}
                </ul>
                <div className="flex flex-col space-y-2 h-64 overflow-y-auto">
                    {atBatArray.reduce((acc: JSX.Element[], result, index) => {
                        const inning = result.events[0].inning;
                        const isFirstAtBatOfInning = index === 0 || atBatArray[index - 1].events[0].inning !== inning;

                        if (isFirstAtBatOfInning && index >= 0) {
                            acc.push(
                                <div key={`separator-${inning}`} className="flex items-center">
                                    <hr className="flex-grow border-t-2 border-gray-300" />
                                    <span className="mx-2 font-semibold text-gray-700">Inning {inning}</span>
                                    <hr className="flex-grow border-t-2 border-gray-300" />
                                </div>
                            );
                        }


                        acc.push(
                            <button
                                key={result.atBatNumber}
                                onClick={() => onAtBatClick(result.atBatNumber)}
                                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                            >
                                {index + 1}. {playerNames[result.events[0].batter] || 'Loading...'} {convertEventToAbbreviation(result.events[0])}
                            </button>
                        );

                        return acc;
                    }, [])}
                </div>
            </div>
        </div>
    );
};

export default RecentGamesDetails;
