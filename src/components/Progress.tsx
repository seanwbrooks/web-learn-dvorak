import React, { JSX, useState } from 'react'
import { Attempt } from '../history'
import './Progress.css'

interface ProgressProps {
  attempts: Attempt[]
  personalBest: number | null
}

const WIDTH = 600
const HEIGHT = 200
const PAD = { top: 16, right: 64, bottom: 28, left: 40 }
const PLOT_W = WIDTH - PAD.left - PAD.right
const PLOT_H = HEIGHT - PAD.top - PAD.bottom

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })

// Round the axis top up to a clean step so ticks read 0 / 20 / 40 ...
function niceMax(value: number): number {
  const step = value > 100 ? 50 : value > 40 ? 20 : 10
  return Math.max(step, Math.ceil(value / step) * step)
}

function Progress({
  attempts,
  personalBest,
}: ProgressProps): JSX.Element | null {
  const [hovered, setHovered] = useState<number | null>(null)

  if (attempts.length < 2) return null

  const yMax = niceMax(
    Math.max(personalBest ?? 0, ...attempts.map(({ wpm }) => wpm))
  )
  const x = (i: number) => PAD.left + (i / (attempts.length - 1)) * PLOT_W
  const y = (wpm: number) => PAD.top + PLOT_H - (wpm / yMax) * PLOT_H
  const ticks = [0, yMax / 2, yMax]

  const path = attempts
    .map(({ wpm }, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(wpm)}`)
    .join(' ')
  const last = attempts.length - 1
  // Skip the end label when it would sit on top of the Personal Best label
  const endLabelCollides =
    personalBest !== null &&
    Math.abs(y(attempts[last].wpm) - y(personalBest)) < 14

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const box = e.currentTarget.getBoundingClientRect()
    const svgX = ((e.clientX - box.left) / box.width) * WIDTH
    const i = Math.round(((svgX - PAD.left) / PLOT_W) * last)
    setHovered(Math.min(last, Math.max(0, i)))
  }

  const hoveredAttempt = hovered === null ? null : attempts[hovered]

  return (
    <div className="progress">
      <h3>WPM over your last {attempts.length} Attempts</h3>
      <div className="progress-chart">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label={`WPM trend over ${attempts.length} Attempts, latest ${attempts[last].wpm}`}
          onPointerMove={onPointerMove}
          onPointerLeave={() => setHovered(null)}
        >
          {ticks.map((tick) => (
            <g key={tick}>
              <line
                className="progress-grid"
                x1={PAD.left}
                x2={PAD.left + PLOT_W}
                y1={y(tick)}
                y2={y(tick)}
              />
              <text
                className="progress-tick"
                x={PAD.left - 8}
                y={y(tick)}
                textAnchor="end"
                dominantBaseline="middle"
              >
                {tick}
              </text>
            </g>
          ))}

          {personalBest !== null && (
            <g>
              <line
                className="progress-best"
                x1={PAD.left}
                x2={PAD.left + PLOT_W}
                y1={y(personalBest)}
                y2={y(personalBest)}
              />
              <text
                className="progress-label"
                x={PAD.left + PLOT_W + 8}
                y={y(personalBest)}
                dominantBaseline="middle"
              >
                Best {personalBest}
              </text>
            </g>
          )}

          <path className="progress-line" d={path} />

          {hoveredAttempt && hovered !== null && (
            <line
              className="progress-crosshair"
              x1={x(hovered)}
              x2={x(hovered)}
              y1={PAD.top}
              y2={PAD.top + PLOT_H}
            />
          )}

          <circle
            className="progress-dot"
            cx={x(hovered ?? last)}
            cy={y(attempts[hovered ?? last].wpm)}
            r={4}
          />
          {hovered === null && !endLabelCollides && (
            <text
              className="progress-label"
              x={x(last) + 8}
              y={y(attempts[last].wpm)}
              dominantBaseline="middle"
            >
              {attempts[last].wpm}
            </text>
          )}

          <text
            className="progress-tick"
            x={PAD.left}
            y={HEIGHT - 6}
            textAnchor="start"
          >
            {formatDate(attempts[0].date)}
          </text>
          <text
            className="progress-tick"
            x={PAD.left + PLOT_W}
            y={HEIGHT - 6}
            textAnchor="end"
          >
            {formatDate(attempts[last].date)}
          </text>
        </svg>

        {hoveredAttempt && hovered !== null && (
          <div
            className="progress-tooltip"
            style={{
              left: `${(x(hovered) / WIDTH) * 100}%`,
              top: `${(y(hoveredAttempt.wpm) / HEIGHT) * 100}%`,
            }}
          >
            <strong>{hoveredAttempt.wpm} WPM</strong>
            <span>
              Attempt {hovered + 1} · {formatDate(hoveredAttempt.date)}
            </span>
          </div>
        )}
      </div>

      <details className="progress-table">
        <summary>Show as table</summary>
        <table>
          <thead>
            <tr>
              <th>Attempt</th>
              <th>Date</th>
              <th>WPM</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((attempt, i) => (
              <tr key={attempt.date}>
                <td>{i + 1}</td>
                <td>{formatDate(attempt.date)}</td>
                <td>{attempt.wpm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  )
}

export default Progress
