const scoreWeight = {
  state: 30,
  occupation: 20,
  socialCategory: 20,
  age: 15,
  income: 15,
}

function normalize(value) {
  return String(value ?? '').trim().toLowerCase()
}

function parseIncomeLimit(eligibilityText) {
  const match = eligibilityText.match(/(less than|not exceed|below|under)\s*₹?\s*([\d,]+)/i)
  if (!match) return null
  return Number(match[2].replace(/,/g, ''))
}

function parseAgeRange(eligibilityText) {
  const match = eligibilityText.match(/(\d{1,2})\s*[-to]{1,3}\s*(\d{1,2})\s*years?/i)
  if (!match) return null
  return { min: Number(match[1]), max: Number(match[2]) }
}

function buildApplicationSteps(applicationProcess) {
  const fromStepMarkers = applicationProcess
    .split(/step\s*\d+\s*[:.-]/i)
    .map((item) => item.trim())
    .filter(Boolean)

  if (fromStepMarkers.length > 1) {
    return fromStepMarkers.slice(0, 6)
  }

  return applicationProcess
    .split(/\.(?=\s+[A-Z0-9]|\s*$)/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 6)
}

function toPlainSummary(description, language) {
  const firstSentence = String(description ?? '').split('.').find(Boolean) ?? ''
  const summary = firstSentence.trim().slice(0, 160)
  if (language === 'hi') {
    return summary ? `यह योजना: ${summary}${summary.endsWith('.') ? '' : '.'}` : 'यह योजना उपयोगी सरकारी सहायता देती है।'
  }

  return summary || 'This scheme provides useful government support.'
}

function buildOfficialUrl(scheme) {
  if (scheme.official_url) return scheme.official_url
  return `https://www.myscheme.gov.in/search?query=${encodeURIComponent(scheme.scheme_name)}`
}

export function rankSchemesForUser(user, schemes, language) {
  const userState = normalize(user.state)
  const userOccupation = normalize(user.occupation)
  const userCategory = normalize(user.social_category)
  const userIncome = Number(user.monthly_income || 0)
  const userAge = Number(user.age || 0)

  const scored = schemes.map((scheme) => {
    let score = 0
    const reasons = []
    const schemeState = normalize(scheme.state)
    const eligibilityText = normalize(scheme.eligibility)

    if (
      schemeState.includes(userState) ||
      schemeState.includes('all india') ||
      schemeState.includes('central')
    ) {
      score += scoreWeight.state
      reasons.push(language === 'hi' ? 'आपके राज्य से मेल खाती है' : 'Matches your state')
    }

    if (eligibilityText.includes(userOccupation) || normalize(scheme.category).includes(userOccupation)) {
      score += scoreWeight.occupation
      reasons.push(language === 'hi' ? 'आपके काम से संबंधित है' : 'Relevant to your occupation')
    }

    if (eligibilityText.includes(userCategory) || normalize(scheme.category).includes(userCategory)) {
      score += scoreWeight.socialCategory
      reasons.push(language === 'hi' ? 'सामाजिक श्रेणी से जुड़ी शर्तें मिलती हैं' : 'Aligned with social category conditions')
    }

    const ageRange = parseAgeRange(String(scheme.eligibility ?? ''))
    if (ageRange && userAge >= ageRange.min && userAge <= ageRange.max) {
      score += scoreWeight.age
      reasons.push(language === 'hi' ? 'उम्र मानदंड के भीतर है' : 'Fits age criteria')
    }

    const incomeLimit = parseIncomeLimit(String(scheme.eligibility ?? ''))
    if (incomeLimit && userIncome <= incomeLimit) {
      score += scoreWeight.income
      reasons.push(language === 'hi' ? 'आय मानदंड के अनुरूप है' : 'Fits income criteria')
    }

    if (score === 0) {
      score += 5
      reasons.push(language === 'hi' ? 'सामान्य पात्रता के आधार पर सुझाव' : 'Suggested on broad eligibility')
    }

    return {
      ...scheme,
      score,
      plainSummary: toPlainSummary(scheme.description, language),
      qualificationReason: reasons.join(language === 'hi' ? ' | ' : ' | '),
      applicationSteps: buildApplicationSteps(String(scheme.application_process ?? '')),
      officialUrl: buildOfficialUrl(scheme),
    }
  })

  return scored.sort((a, b) => b.score - a.score).slice(0, 5)
}
