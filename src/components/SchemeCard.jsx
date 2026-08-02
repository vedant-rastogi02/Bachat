function SchemeCard({ scheme, language }) {
  return (
    <article className="scheme-card">
      <h3>{scheme.scheme_name}</h3>
      <p className="plain-summary">{scheme.plainSummary}</p>
      <p>
        <strong>{language === 'hi' ? 'आप क्यों योग्य हो सकते हैं:' : 'Why you may qualify:'}</strong>{' '}
        {scheme.qualificationReason}
      </p>
      <div>
        <strong>{language === 'hi' ? 'आवेदन कैसे करें:' : 'How to apply:'}</strong>
        <ol>
          {scheme.applicationSteps.map((step, index) => (
            <li key={`${scheme.id}-step-${index}`}>{step}</li>
          ))}
        </ol>
      </div>
      <a href={scheme.officialUrl} target="_blank" rel="noreferrer" className="link-button">
        {language === 'hi' ? 'आधिकारिक लिंक देखें' : 'Open official link'}
      </a>
    </article>
  )
}

export default SchemeCard
