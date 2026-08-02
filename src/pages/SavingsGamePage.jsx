import { useMemo, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { calculateSavingsProjection, getRelatableLine } from '../utils/savings'

const GOLD_RETURN_RATE = 0.08

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
    style: 'currency',
    currency: 'INR',
  }).format(value)
}

function SavingsGamePage() {
  const { language } = useLanguage()
  const [dailySpend, setDailySpend] = useState(10)
  const [showResult, setShowResult] = useState(false)

  const data = useMemo(() => calculateSavingsProjection(dailySpend, GOLD_RETURN_RATE), [dailySpend])
  const maxValue = Math.max(...data.map((item) => Math.max(item.spent, item.goldInvestment)))
  const finalAmount = data[data.length - 1]?.goldInvestment ?? 0

  return (
    <section>
      <h2>{language === 'hi' ? 'बचत खेल: पान मसाला या सोना?' : 'Savings Game: Paan Masala or Gold?'}</h2>
      <p className="lead-text">
        {language === 'hi' ? 'रोज का छोटा खर्च समय के साथ कितनी बड़ी राशि बन सकता है।' : 'See how a small daily spend can become a big long-term amount.'}
      </p>

      <div className="calculator-box">
        <label htmlFor="daily-slider">
          {language === 'hi' ? `रोज का खर्च: ₹${dailySpend}` : `Daily spend: ₹${dailySpend}`}
        </label>
        <input
          id="daily-slider"
          type="range"
          min="10"
          max="500"
          step="10"
          value={dailySpend}
          onChange={(event) => setDailySpend(Number(event.target.value))}
        />
        <button type="button" className="primary-btn" onClick={() => setShowResult(true)}>
          {language === 'hi' ? 'देखें' : 'See Results'}
        </button>
      </div>

      {showResult ? (
        <div className="chart-grid">
          {data.map((item) => (
            <div className="chart-card" key={item.year}>
              <h4>{item.year} {language === 'hi' ? 'साल' : 'Years'}</h4>
              <div className="bar-wrap">
                <div
                  className="bar spent"
                  style={{ height: `${(item.spent / maxValue) * 180}px` }}
                  title={formatCurrency(item.spent)}
                ></div>
                <div
                  className="bar gold"
                  style={{ height: `${(item.goldInvestment / maxValue) * 180}px` }}
                  title={formatCurrency(item.goldInvestment)}
                ></div>
              </div>
              <p>{language === 'hi' ? 'खर्च' : 'Spent'}: {formatCurrency(item.spent)}</p>
              <p>{language === 'hi' ? 'सोना निवेश' : 'Gold investment'}: {formatCurrency(item.goldInvestment)}</p>
            </div>
          ))}

          <div className="insight">
            <h4>{language === 'hi' ? '30 साल बाद' : 'After 30 years'}</h4>
            <p>{formatCurrency(finalAmount)}</p>
            <p>{getRelatableLine(finalAmount, language)}</p>
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default SavingsGamePage
