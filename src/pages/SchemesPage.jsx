import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SchemeCard from '../components/SchemeCard'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { supabase } from '../config/supabaseClient'
import { rankSchemesForUser } from '../utils/matching'

function SchemesPage() {
  const { language } = useLanguage()
  const { user, userProfile } = useAuth()
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSchemes = async () => {
      const { data } = await supabase
        .from('schemes')
        .select('id, scheme_name, description, eligibility, benefits, application_process, state, category, official_url')
      setSchemes(data ?? [])
      setLoading(false)
    }

    fetchSchemes()
  }, [])

  const matchedSchemes = useMemo(() => {
    if (!userProfile || schemes.length === 0) return []
    return rankSchemesForUser(userProfile, schemes, language)
  }, [userProfile, schemes, language])

  if (!user) {
    return (
      <section className="empty-state">
        <h2>{language === 'hi' ? 'पहले लॉगिन करें' : 'Please login first'}</h2>
        <p>{language === 'hi' ? 'योजनाएं देखने के लिए आपका प्रोफाइल जरूरी है।' : 'You need your profile to see personalized schemes.'}</p>
        <Link className="primary-btn inline-btn" to="/login">{language === 'hi' ? 'लॉगिन' : 'Login'}</Link>
      </section>
    )
  }

  return (
    <section>
      <h2>{language === 'hi' ? 'आपके लिए सरकारी योजनाएं' : 'Government Schemes for You'}</h2>
      <p className="lead-text">{language === 'hi' ? 'प्रोफाइल के आधार पर सबसे उपयुक्त 5 योजनाएं।' : 'Top 5 likely-eligible schemes based on your profile.'}</p>
      <p className="disclaimer">
        {language === 'hi'
          ? 'डिस्क्लेमर: ये सुझाव केवल जानकारी हेतु हैं। अंतिम पात्रता और आवेदन जानकारी myscheme.gov.in पर सत्यापित करें।'
          : 'Disclaimer: These are informational recommendations. Verify final eligibility and application details on myscheme.gov.in.'}
      </p>

      {loading ? <p>{language === 'hi' ? 'लोड हो रहा है...' : 'Loading...'}</p> : null}
      {!loading && matchedSchemes.length === 0 ? (
        <p>{language === 'hi' ? 'अभी योजना डेटा उपलब्ध नहीं है।' : 'No scheme data available yet.'}</p>
      ) : null}

      <div className="scheme-list">
        {matchedSchemes.map((scheme) => (
          <SchemeCard key={scheme.id} scheme={scheme} language={language} />
        ))}
      </div>
    </section>
  )
}

export default SchemesPage
