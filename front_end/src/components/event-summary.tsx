import React from 'react';

interface RenderEventSummaryProps {
    eventCounts: Record<string, number>;
}

export const RenderEventSummary: React.FC<RenderEventSummaryProps> = ({
    eventCounts
}) => {
    return (
        <div className="mt-4">
            <div className="flex flex-col w-full bg-card rounded-xl p-4">
                <h2 className="text-xl font-semibold mb-2">Game Summary</h2>
                <div className="flex flex-row justify-between my-2">
                    <div>
                        Strikeouts: {eventCounts['Strike outs']}
                    </div>
                    <div>
                        Walks: {eventCounts['Walks']}
                    </div>
                </div>
                <div className="flex flex-row justify-between my-2">
                    <div>
                        Strikes: {eventCounts['strikes']} ({eventCounts['strikesPercentage']}%)
                    </div>
                    <div>
                        Balls: {eventCounts['balls']} ({eventCounts['ballsPercentage']}%)
                    </div>
                </div>
                <div className="flex flex-row justify-between w-full my-1">
                    <div>
                        Hits: {eventCounts['Hits']}
                    </div>
                    <div>
                        Hit hard: {eventCounts['Hit hard']}
                    </div>
                </div>
                <div className="flex flex-row justify-between w-full my-2">
                    <div>
                        K:W: {eventCounts['K to walk Ratio']}
                    </div>
                    <div>
                        Pitches: {eventCounts['strikes']+eventCounts['balls']}
                    </div>
                </div>
            </div>
        </div>
    );
};
