import './Performance.css'

function Performance({ wpm, bestScore, badKeys, isComplete, onRestart }) {
    if (!wpm) return null

    const getColor = () => {
        if (wpm >= 60) return 'green'
        if (wpm >= 40) return 'orange'
        return 'red'
    }

    const getMotivationalMessage = () => {
        if (!bestScore || wpm > bestScore) {
            return '🎉 New Personal Best!'
        }
        const diff = bestScore - wpm
        if (diff === 0) {
            return '🔥 Tied your best score!'
        }
        if (diff <= 5) {
            return `💪 Almost there! Just ${diff} WPM to beat your best!`
        }
        if (diff <= 10) {
            return `⚡ Getting close! ${diff} WPM away from your best!`
        }
        return `🎯 Your best is ${bestScore} WPM - Keep practicing!`
    }

    return (
        <div className="performance">
            <div className="wpm" style={{ color: getColor() }}>
                {wpm} wpm
            </div>

            {bestScore && (
                <div className="best-score">Best: {bestScore} WPM</div>
            )}

            {isComplete && (
                <div className="completion-message">
                    <div className="motivational-message">
                        {getMotivationalMessage()}
                    </div>
                    <button className="restart-button" onClick={onRestart}>
                        Try Again
                    </button>
                </div>
            )}
            {badKeys && (
                <div className="bad-keys">
                    <h3>Keys to Practice:</h3>
                    <ul>
                        {Object.entries(badKeys)
                            .filter(([key, count]) => count > 0)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 5)
                            .map(([key, count]) => (
                                <li key={key}>
                                    {key.toUpperCase()} {count} missed
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default Performance
