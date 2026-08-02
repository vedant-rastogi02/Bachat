export function calculateSavingsProjection(dailySpend, annualReturnRate = 0.08) {
  const monthlyInvestment = dailySpend * 30
  const years = [10, 20, 30]

  return years.map((year) => {
    const months = year * 12
    const monthlyRate = annualReturnRate / 12
    const futureValue = monthlyInvestment * (((1 + monthlyRate) ** months - 1) / monthlyRate)
    const spentValue = dailySpend * 365 * year

    return {
      year,
      spent: Math.round(spentValue),
      goldInvestment: Math.round(futureValue),
    }
  })
}

export function getRelatableLine(amount, language) {
  if (language !== 'hi') {
    if (amount >= 1500000) {
      return 'With this amount, you could plan a down payment for a small-town home.'
    }
    if (amount >= 600000) {
      return 'With this amount, you could buy a good second-hand car or start a small business.'
    }
    if (amount >= 250000) {
      return 'This could cover a scooter, emergency fund, and some education expenses.'
    }
    return 'Even small savings can become a strong safety net over time.'
  }

  if (amount >= 1500000) {
    return 'इतनी राशि से आप छोटे शहर में घर की डाउन पेमेंट की योजना बना सकते हैं।'
  }
  if (amount >= 600000) {
    return 'इतनी राशि से आप एक अच्छी सेकेंड-हैंड कार या व्यापार की शुरुआत कर सकते हैं।'
  }
  if (amount >= 250000) {
    return 'इतने पैसे से आप स्कूटी, इमरजेंसी फंड और कुछ शिक्षा खर्च संभाल सकते हैं।'
  }
  return 'थोड़ी-थोड़ी बचत भी समय के साथ मजबूत सुरक्षा जाल बनाती है।'
}
