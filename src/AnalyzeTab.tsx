import { motion } from 'framer-motion'
import type { AnalyticsData } from './useWordGraph'

interface Props {
  analytics: AnalyticsData | null
  isLoading: boolean
  onWordHover?: (word: string | null) => void
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const section = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
}

export function AnalyzeTab({ analytics, isLoading, onWordHover }: Props) {
  if (isLoading || !analytics) {
    return (
      <div className="analyze-loading">
        <span className="graph-loading-cursor">_</span>
        <span className="analyze-loading-label">COMPUTING ANALYTICS</span>
      </div>
    )
  }

  const {
    socialites, hermits, poopHorizon, articulationPoints,
    palindromes, anagramClusters, archipelago, thoroughfare, poopGravity,
  } = analytics
  const visibleAPs = articulationPoints.slice(0, 24)
  const apOverflow = articulationPoints.length - visibleAPs.length

  const hoverProps = (word: string) => ({
    onMouseEnter: () => onWordHover?.(word),
    onMouseLeave: () => onWordHover?.(null),
    style: { cursor: 'default' as const },
  })

  return (
    <motion.div
      className="analyze-tab"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {/* 01 — SOCIALITES */}
      <motion.section className="analyze-section" variants={section}>
        <div className="analyze-section-tag">01 / SOCIALITES</div>
        <h2 className="analyze-section-heading">Most Connected</h2>
        <p className="analyze-section-sub">
          Words with the highest number of valid 1-letter mutations.
        </p>
        <div className="socialite-list">
          {socialites.map((s, i) => (
            <div key={s.word} className="socialite-row" {...hoverProps(s.word)}>
              <span className="socialite-rank">0{i + 1}</span>
              <span className="socialite-word">{s.word}</span>
              <span className="socialite-degree">{s.degree}</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 02 — HERMITS */}
      <motion.section className="analyze-section" variants={section}>
        <div className="analyze-section-tag">02 / HERMITS</div>
        <h2 className="analyze-section-heading">Isolated Nodes</h2>
        <p className="analyze-section-sub">
          {hermits.length} words with zero or one valid connection.
        </p>
        <div className="hermit-list">
          {hermits.slice(0, 40).map(h => (
            <span
              key={h.word}
              className={`hermit-word hermit-word--${h.degree}`}
              {...hoverProps(h.word)}
            >
              {h.word}
            </span>
          ))}
          {hermits.length > 40 && (
            <span className="hermit-more">+{hermits.length - 40} more</span>
          )}
        </div>
      </motion.section>

      {/* 03 — POOP HORIZON */}
      <motion.section className="analyze-section analyze-section--wide" variants={section}>
        <div className="analyze-section-tag">03 / POOP HORIZON</div>
        <h2 className="analyze-section-heading">Distance to POOP</h2>
        <p className="analyze-section-sub">
          BFS from POOP across the entire graph, measuring how far each word sits from the
          destination.
        </p>
        <div className="horizon-stats">
          <div className="horizon-stat">
            <span className="horizon-stat-num">{poopHorizon.avgDistance.toFixed(1)}</span>
            <span className="horizon-stat-label">AVG STEPS</span>
          </div>
          <div className="horizon-stat">
            <span className="horizon-stat-num">{poopHorizon.maxDistance}</span>
            <span className="horizon-stat-label">MAX STEPS</span>
          </div>
          <div className="horizon-stat">
            <span className="horizon-stat-num">{poopHorizon.unreachableCount}</span>
            <span className="horizon-stat-label">UNREACHABLE</span>
          </div>
        </div>
        {poopHorizon.farthestWords.length > 0 && (
          <div className="horizon-farthest">
            <span className="horizon-farthest-label">
              FARTHEST WORD{poopHorizon.farthestWords.length > 1 ? 'S' : ''}
            </span>
            <span className="horizon-farthest-words">
              {poopHorizon.farthestWords.map((w, i) => (
                <span key={w} {...hoverProps(w)}>
                  {w}{i < poopHorizon.farthestWords.length - 1 ? ' · ' : ''}
                </span>
              ))}
            </span>
          </div>
        )}
      </motion.section>

      {/* 04 — ARTICULATION POINTS */}
      <motion.section className="analyze-section analyze-section--wide" variants={section}>
        <div className="analyze-section-tag">04 / CRITICAL VULNERABILITIES</div>
        <h2 className="analyze-section-heading analyze-section-heading--magenta">
          Lexical Bottlenecks
        </h2>
        <p className="analyze-section-sub">
          {articulationPoints.length} articulation points — words whose removal would shatter
          the graph into disconnected islands, severing certain words from POOP forever.
        </p>
        <div className="ap-list">
          {visibleAPs.map(ap => (
            <span key={ap.word} className="ap-word" {...hoverProps(ap.word)}>
              {ap.word}
              <span className="ap-degree">[{ap.degree}]</span>
            </span>
          ))}
          {apOverflow > 0 && (
            <span className="ap-more">+{apOverflow} more</span>
          )}
        </div>
      </motion.section>

      {/* 05 — PALINDROME SOCIETY */}
      <motion.section className="analyze-section" variants={section}>
        <div className="analyze-section-tag">05 / PALINDROME SOCIETY</div>
        <h2 className="analyze-section-heading">Mirror Words</h2>
        <p className="analyze-section-sub">
          {palindromes.length} words that read identically forwards and backwards.
          POOP was always destined to lead this club.
        </p>
        <div className="palindrome-stat">
          <span className="palindrome-count-num">{palindromes.length}</span>
          <span className="palindrome-count-label">PALINDROMES</span>
        </div>
        <div className="palindrome-grid">
          {palindromes.map(w => (
            <span
              key={w}
              className={`palindrome-word${w === 'POOP' ? ' palindrome-word--poop' : ''}`}
              {...hoverProps(w)}
            >
              <span className="palindrome-half">{w[0]}{w[1]}</span>
              <span className="palindrome-sep">·</span>
              <span className="palindrome-half palindrome-half--right">{w[2]}{w[3]}</span>
            </span>
          ))}
        </div>
      </motion.section>

      {/* 06 — ANAGRAM CENSUS */}
      <motion.section className="analyze-section" variants={section}>
        <div className="analyze-section-tag">06 / ANAGRAM CENSUS</div>
        <h2 className="analyze-section-heading">Doppelgangers</h2>
        <p className="analyze-section-sub">
          {anagramClusters.totalGroups} groups of words sharing identical letters,
          rearranged into separate identities.
        </p>
        <div className="anagram-total-display">
          <span className="anagram-total-num">{anagramClusters.totalGroups}</span>
          <span className="analyze-section-tag">GROUPS</span>
        </div>
        <div className="anagram-cluster-list">
          {anagramClusters.top.map(cluster => (
            <div key={cluster.letters} className="anagram-cluster">
              <span className="anagram-cluster-count">{cluster.count}×</span>
              <div className="anagram-cluster-words">
                {cluster.words.map((w, i) => (
                  <span key={w}>
                    <span className="anagram-word" {...hoverProps(w)}>{w}</span>
                    {i < cluster.words.length - 1 && (
                      <span className="anagram-sep"> · </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 07 — THE ARCHIPELAGO */}
      <motion.section className="analyze-section analyze-section--wide" variants={section}>
        <div className="analyze-section-tag">07 / THE ARCHIPELAGO</div>
        <h2 className="analyze-section-heading">Island Report</h2>
        <p className="analyze-section-sub">
          The lexicon fractures into {archipelago.componentCount} disconnected subgraphs.
          POOP anchors the largest continent.
        </p>
        <div className="horizon-stats">
          <div className="horizon-stat">
            <span className="horizon-stat-num">{archipelago.componentCount}</span>
            <span className="horizon-stat-label">TOTAL ISLANDS</span>
          </div>
          <div className="horizon-stat">
            <span className="horizon-stat-num">{archipelago.mainComponentSize}</span>
            <span className="horizon-stat-label">MAIN CLUSTER</span>
          </div>
          <div className="horizon-stat">
            <span className="horizon-stat-num">{archipelago.componentCount - 1}</span>
            <span className="horizon-stat-label">ISOLATED GROUPS</span>
          </div>
        </div>
        <div className="archipelago-feed">
          <div className="archipelago-row archipelago-row--main">
            <span className="archipelago-row-rank">[01]</span>
            <span className="archipelago-row-size">{archipelago.mainComponentSize}</span>
            <span className="archipelago-row-label">
              WORDS — MAIN CLUSTER{archipelago.mainHasPoop ? ' — POOP RESIDES HERE' : ''}
            </span>
          </div>
          {archipelago.islandSizes.map((size, i) => (
            <div key={i} className="archipelago-row">
              <span className="archipelago-row-rank">[{String(i + 2).padStart(2, '0')}]</span>
              <span className="archipelago-row-size">{size}</span>
              <span className="archipelago-row-label">WORDS — ISOLATED ISLAND</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 08 — LEXICAL THOROUGHFARE */}
      <motion.section className="analyze-section analyze-section--wide" variants={section}>
        <div className="analyze-section-tag">08 / LEXICAL THOROUGHFARE</div>
        <h2 className="analyze-section-heading">Highway Words</h2>
        <p className="analyze-section-sub">
          Sampled betweenness centrality — words appearing most often on shortest paths
          between random word pairs. The load-bearing pillars of the lexicon.
        </p>
        {thoroughfare.length > 0 && (
          <div className="thoroughfare-marquee" aria-hidden="true">
            <div className="thoroughfare-marquee-track">
              {[...thoroughfare, ...thoroughfare].map((t, i) => (
                <span key={i} className="thoroughfare-marquee-word">{t.word}</span>
              ))}
            </div>
          </div>
        )}
        <div className="thoroughfare-list">
          {thoroughfare.map((t, i) => (
            <div key={t.word} className="thoroughfare-row" {...hoverProps(t.word)}>
              <span className="thoroughfare-rank">{String(i + 1).padStart(2, '0')}</span>
              <span className="thoroughfare-word">{t.word}</span>
              <div className="thoroughfare-bar">
                <div
                  className="thoroughfare-bar-fill"
                  style={{ width: `${Math.round((t.score / thoroughfare[0].score) * 100)}%` }}
                />
              </div>
              <span className="thoroughfare-score">{t.score}</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 09 — POOP GRAVITY INDEX */}
      <motion.section className="analyze-section analyze-section--wide" variants={section}>
        <div className="analyze-section-tag">09 / POOP GRAVITY INDEX</div>
        <h2 className="analyze-section-heading analyze-section-heading--magenta">
          Gravitational Field Analysis
        </h2>
        <p className="analyze-section-sub">
          POOP exerts an inverse-square gravitational force (F&nbsp;=&nbsp;1/d²) on every
          reachable word. The total POOP Gravitational Constant is the integral of all
          lexical forces across the connected graph. This is rigorous science.
        </p>
        <div className="gravity-constant">
          <span className="gravity-label">G_POOP =</span>
          <span className="gravity-value">{poopGravity.totalConstant.toFixed(2)}</span>
          <span className="gravity-unit">POOP-UNITS</span>
        </div>
        <div className="gravity-breakdown">
          <div className="gravity-breakdown-header">
            <span>DIST</span>
            <span>WORDS</span>
            <span>FORCE/WORD</span>
            <span>SUBTOTAL</span>
          </div>
          {poopGravity.distanceBreakdown.map(row => (
            <div key={row.distance} className="gravity-breakdown-row">
              <span className="gravity-bd-dist">d={String(row.distance).padStart(2, '0')}</span>
              <span className="gravity-bd-count">{row.wordCount}</span>
              <span className="gravity-bd-force">
                ×{(1 / (row.distance ** 2)).toFixed(4)}
              </span>
              <span className="gravity-bd-total">{row.totalForce.toFixed(2)} pu</span>
            </div>
          ))}
        </div>
        <div className="gravity-footnote">
          POOP DEGREE: {poopGravity.poopDegree} DIRECT NEIGHBORS AT F=1.0000 POOP-UNITS EACH
        </div>
      </motion.section>
    </motion.div>
  )
}
