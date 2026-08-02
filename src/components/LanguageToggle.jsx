import { useLanguage } from '../context/LanguageContext'

function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <button className="lang-toggle" type="button" onClick={toggleLanguage}>
      {language === 'hi' ? 'English' : 'हिंदी'}
    </button>
  )
}

export default LanguageToggle
