import NavCard from '../components/NavCard'
import { useLanguage } from '../context/LanguageContext'

function HomePage() {
  const { language } = useLanguage()

  return (
    <section className="home-stack">
      <div className="hero-panel glass-panel accent-panel">
        <p className="eyebrow">{language === 'hi' ? 'नमस्ते!' : 'Namaste!'}</p>
        <h1>{language === 'hi' ? 'छोटी बचत, बड़े सपने' : 'Small savings, big dreams'}</h1>
        <p className="hero-copy">
          {language === 'hi'
            ? 'Bachat आपको बैंकिंग, सरकारी योजनाओं और बचत की दुनिया में सरल भाषा के साथ आगे बढ़ाता है।'
            : 'Bachat walks with you on your financial journey with simple banking, scheme, and savings guidance.'}
        </p>
      </div>

      <div className="card-grid">
        <NavCard
          to="/chat"
          icon="📘"
          title={language === 'hi' ? 'वित्तीय शिक्षा' : 'Financial Learning'}
          subtitle={language === 'hi' ? 'बैंकिंग, UPI, सुरक्षा और बचत को आसान भाषा में समझें' : 'Money basics in plain language'}
        />
        <NavCard
          to="/schemes"
          icon="🏛️"
          title={language === 'hi' ? 'आपके लिए सरकारी योजनाएं' : 'Government Schemes for You'}
          subtitle={language === 'hi' ? 'आपकी प्रोफाइल के अनुसार टॉप 5 योजनाएं देखें' : 'Get top 5 scheme matches based on your profile'}
        />
        <NavCard
          to="/savings-game"
          icon="🪙"
          title={language === 'hi' ? 'बचत खेल' : 'Savings Game'}
          subtitle={language === 'hi' ? 'पान मसाला या सोना? छोटे खर्च की बड़ी ताकत देखें' : 'Paan Masala or Gold? See the power of small daily choices'}
        />
      </div>
    </section>
  )
}

export default HomePage
