import { useLanguage } from '../context/LanguageContext'

function PrivacyPolicyPage() {
  const { language } = useLanguage()

  const content = language === 'hi'
    ? {
        title: 'गोपनीयता नीति',
        heading: 'हिंदी',
        paragraphs: [
          'हम आपका नाम, उम्र, आय, पेशा, राज्य और सामाजिक श्रेणी जैसी जानकारी लेते हैं ताकि आपके लिए उपयुक्त सरकारी योजनाएं सुझा सकें।',
          'आपका डेटा सुरक्षित रखा जाता है और आपकी अनुमति के बिना किसी तीसरे पक्ष के साथ साझा नहीं किया जाता।',
          'चैट और योजना क्लिक डेटा केवल सेवा सुधार और उपयोग समझने के लिए उपयोग होता है।',
          'आप कभी भी प्रोफाइल अपडेट या खाता हटाने का अनुरोध कर सकते हैं।',
        ],
      }
    : {
        title: 'Privacy Policy',
        heading: 'English',
        paragraphs: [
          'We collect profile details such as name, age, income, occupation, state, and social category to provide better scheme recommendations.',
          'Your data is stored securely and is not shared with third parties without your consent.',
          'Chat and scheme-click logs are used only to improve product quality and support.',
          'You may request profile updates or account deletion at any time.',
        ],
      }

  return (
    <section>
      <h2>{content.title}</h2>
      <div className="policy-grid">
        <article>
          <h3>{content.heading}</h3>
          {content.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </article>
      </div>
    </section>
  )
}

export default PrivacyPolicyPage
