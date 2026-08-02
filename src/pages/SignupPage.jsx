import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

const indianStates = [
  'Andhra Pradesh', 'Bihar', 'Chhattisgarh', 'Delhi', 'Gujarat', 'Haryana', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab',
  'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
]

function SignupPage() {
  const { language } = useLanguage()
  const { signUpWithProfile } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    full_name: '',
    age: '',
    gender: '',
    monthly_income: '30000',
    occupation: '',
    state: '',
    social_category: '',
    email: '',
    password: '',
    consent: false,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const consentText = useMemo(() => (
    language === 'hi'
      ? 'मैं सहमति देता/देती हूँ कि मेरी जानकारी केवल सरकारी योजना सुझाव बेहतर करने के लिए उपयोग होगी। मेरी जानकारी निजी रखी जाएगी और मेरी अनुमति के बिना किसी तीसरे पक्ष के साथ साझा नहीं की जाएगी।'
      : 'I consent that my data will be used only to improve government scheme recommendations. My information will remain private and will not be shared with third parties without my consent.'
  ), [language])

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signUpWithProfile({
        email: form.email,
        password: form.password,
        profile: {
          full_name: form.full_name,
          age: Number(form.age),
          gender: form.gender,
          monthly_income: Number(form.monthly_income),
          occupation: form.occupation,
          state: form.state,
          social_category: form.social_category,
          preferred_language: language,
          consent: form.consent,
        },
      })

      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card glass-panel auth-card-wide">
        <p className="eyebrow">{language === 'hi' ? 'अपना प्रोफाइल बनाएं' : 'Build your profile'}</p>
        <h2>{language === 'hi' ? 'साइनअप और प्रोफाइल' : 'Signup and Profile'}</h2>
        <p className="lead-text auth-lead">{language === 'hi' ? 'यह जानकारी आपको सही बैंकिंग और सरकारी योजनाएं दिखाने में मदद करती है।' : 'This information helps us show banking guidance and better scheme matches.'}</p>
        <form className="profile-form" onSubmit={onSubmit}>
          <label>{language === 'hi' ? 'नाम' : 'Name'}<input required value={form.full_name} onChange={(e) => updateField('full_name', e.target.value)} /></label>
          <label>{language === 'hi' ? 'उम्र' : 'Age'}<input type="number" min="18" max="100" required value={form.age} onChange={(e) => updateField('age', e.target.value)} /></label>
          <label>{language === 'hi' ? 'लिंग' : 'Gender'}
            <select required value={form.gender} onChange={(e) => updateField('gender', e.target.value)}>
              <option value="">{language === 'hi' ? 'चुनें' : 'Select'}</option>
              <option value="male">{language === 'hi' ? 'पुरुष' : 'Male'}</option>
              <option value="female">{language === 'hi' ? 'महिला' : 'Female'}</option>
              <option value="other">{language === 'hi' ? 'अन्य' : 'Other'}</option>
            </select>
          </label>
          <label>{language === 'hi' ? 'मासिक आय (₹)' : 'Monthly Income (₹)'}<input type="number" min="1000" required value={form.monthly_income} onChange={(e) => updateField('monthly_income', e.target.value)} /></label>
          <label>{language === 'hi' ? 'काम/पेशा' : 'Occupation'}<input required value={form.occupation} onChange={(e) => updateField('occupation', e.target.value)} placeholder={language === 'hi' ? 'जैसे: factory worker' : 'e.g. factory worker'} /></label>
          <label>{language === 'hi' ? 'राज्य' : 'State'}
            <select required value={form.state} onChange={(e) => updateField('state', e.target.value)}>
              <option value="">{language === 'hi' ? 'राज्य चुनें' : 'Select state'}</option>
              {indianStates.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </label>
          <label>{language === 'hi' ? 'सामाजिक श्रेणी' : 'Social Category'}<input required value={form.social_category} onChange={(e) => updateField('social_category', e.target.value)} placeholder={language === 'hi' ? 'जैसे: OBC/SC/ST/General' : 'e.g. OBC/SC/ST/General'} /></label>
          <label>{language === 'hi' ? 'ईमेल' : 'Email'}<input type="email" required value={form.email} onChange={(e) => updateField('email', e.target.value)} /></label>
          <label>{language === 'hi' ? 'पासवर्ड' : 'Password'}<input type="password" minLength="6" required value={form.password} onChange={(e) => updateField('password', e.target.value)} /></label>
          <label className="consent">
            <input type="checkbox" checked={form.consent} onChange={(e) => updateField('consent', e.target.checked)} required />
            <span>{consentText}</span>
          </label>
          <button type="submit" className="primary-btn" disabled={loading}>{loading ? (language === 'hi' ? 'सेव हो रहा है...' : 'Saving...') : (language === 'hi' ? 'खाता बनाएं' : 'Create Account')}</button>
          {error && <p className="error-text">{error}</p>}
        </form>
      </div>
    </section>
  )
}

export default SignupPage
