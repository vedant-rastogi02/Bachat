import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../config/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { rankSchemesForUser } from '../utils/matching'

const chatCopy = {
  en: {
    title: 'Financial Learning',
    empty: 'Choose a question to see a simple answer.',
    you: 'You',
    note: 'Note: This is general information, not personal investment advice.',
    questionHeader: 'Popular questions',
    chips: [
      'How do I open a bank account?',
      'How do I deposit or withdraw cash?',
      'What is a passbook?',
      'What is an ATM card?',
      'Which government scheme can I get?',
      'What is UPI?',
      'What are SIP, PPF, and SGB?',
      'How do I save money every month?',
      'Why should I get insurance?',
      'How do I stay safe from fraud?',
    ],
    fallbackAnswers: {
      'How do I open a bank account?': 'Take your Aadhaar and mobile number to a nearby bank. Ask for a basic savings account. Fill the form and collect the passbook.',
      'How do I deposit or withdraw cash?': 'Use the cash counter or ATM, carry your passbook and card if needed, and always count cash before leaving the bank or machine.',
      'What is a passbook?': 'A passbook is a small record book that shows your bank deposits, withdrawals, and balance history.',
      'What is an ATM card?': 'An ATM card lets you withdraw cash, check balance, and use some banking services at ATMs and some machines in stores.',
      'Which government scheme can I get?': 'We will show the top schemes based on your profile. Check the schemes tab for details.',
      'What is UPI?': 'UPI is an easy way to send money instantly from your mobile. Think of it like a digital wallet. Never share your PIN.',
      'What are SIP, PPF, and SGB?': 'These are common long-term saving options. SIP is regular investing in mutual funds, PPF is a government savings account, and SGB is a gold-linked government bond. Check official sources before deciding.',
      'How do I save money every month?': 'Set aside a fixed small amount right after income arrives, keep it in a separate savings account, and automate transfers when possible.',
      'Why should I get insurance?': 'Insurance protects your family from big unexpected expenses. Health and life insurance can reduce money stress during emergencies.',
      'How do I stay safe from fraud?': 'Never share OTP, PIN, or passwords. Check links carefully, use only trusted apps, and call your bank if something looks suspicious.',
    },
    schemeIntro: 'Based on your profile, useful schemes are: ',
    schemeSuffix: 'Check the schemes page for full details.',
    defaultAnswer: 'This information is not available yet.',
    topicCards: [
      { icon: '🏦', title: 'Why a bank account?', text: 'Keep money safe, earn interest, and receive government benefits.' },
      { icon: '📲', title: 'What is UPI?', text: 'Send money instantly and free from your phone - like sending an SMS.' },
      { icon: '💰', title: 'The savings habit', text: 'Even $10 a day can become a large sum in 20 years.' },
      { icon: '🛡️', title: 'Why insurance?', text: 'Protects family in emergencies - cheap government schemes exist.' },
      { icon: '⚠️', title: 'Avoid fraud', text: 'Never share your OTP or PIN. Banks never ask for it.' },
    ],
  },
  hi: {
    title: 'वित्तीय शिक्षा',
    intro: 'बैंकिंग और बचत की आसान बातें, सरल भाषा में।',
    empty: 'सवाल चुनें और आसान जवाब देखें।',
    you: 'आप',
    note: 'नोट: यह सामान्य जानकारी है, व्यक्तिगत निवेश सलाह नहीं।',
    questionHeader: 'लोकप्रिय सवाल',
    chips: [
      'बैंक खाता कैसे खोलें?',
      'कैश जमा या निकाल कैसे करें?',
      'पासबुक क्या होती है?',
      'ATM कार्ड क्या है?',
      'मुझे कौन सी सरकारी योजना मिल सकती है?',
      'UPI क्या है?',
      'SIP, PPF और SGB क्या हैं?',
      'हर महीने बचत कैसे करें?',
      'बीमा क्यों जरूरी है?',
      'धोखाधड़ी से कैसे बचें?',
    ],
    fallbackAnswers: {
      'बैंक खाता कैसे खोलें?': 'पास के बैंक में आधार और मोबाइल नंबर लेकर जाएं। बेसिक सेविंग अकाउंट मांगें। फॉर्म भरें और पासबुक लें।',
      'कैश जमा या निकाल कैसे करें?': 'कैश काउंटर या ATM का इस्तेमाल करें। पासबुक और कार्ड साथ रखें, और बैंक या मशीन से निकलने से पहले पैसा गिन लें।',
      'पासबुक क्या होती है?': 'पासबुक बैंक की छोटी किताब होती है जिसमें जमा, निकासी और बैलेंस का रिकॉर्ड रहता है।',
      'ATM कार्ड क्या है?': 'ATM कार्ड से आप ATM पर नकद निकाल सकते हैं, बैलेंस देख सकते हैं, और कुछ जगहों पर बैंकिंग कर सकते हैं।',
      'मुझे कौन सी सरकारी योजना मिल सकती है?': 'आपकी प्रोफाइल देखकर टॉप योजनाएं बताई जाएंगी। योजनाएं टैब में जाकर देखें।',
      'UPI क्या है?': 'UPI मोबाइल से तुरंत पैसे भेजने का आसान तरीका है। इसे डिजिटल बटुआ जैसा समझें। PIN किसी से साझा न करें।',
      'SIP, PPF और SGB क्या हैं?': 'ये लंबी अवधि की बचत के आम विकल्प हैं। SIP म्यूचुअल फंड में नियमित निवेश है, PPF सरकारी बचत खाता है, SGB सोने से जुड़ा सरकारी बॉन्ड है। निर्णय से पहले आधिकारिक स्रोत जांचें।',
      'हर महीने बचत कैसे करें?': 'आय मिलते ही एक तय छोटी राशि अलग रखें, उसे सेविंग अकाउंट में डालें, और संभव हो तो ऑटो ट्रांसफर सेट करें।',
      'बीमा क्यों जरूरी है?': 'बीमा परिवार को अचानक आने वाले बड़े खर्चों से बचाता है। स्वास्थ्य और जीवन बीमा मुश्किल समय में मदद करता है।',
      'धोखाधड़ी से कैसे बचें?': 'OTP, PIN, और पासवर्ड किसी से साझा न करें। लिंक ध्यान से देखें, सिर्फ भरोसेमंद ऐप इस्तेमाल करें, और शक हो तो बैंक को कॉल करें।',
    },
    schemeIntro: 'आपके प्रोफाइल के अनुसार उपयोगी योजनाएं: ',
    schemeSuffix: 'पूरी जानकारी योजना पेज पर देखें।',
    defaultAnswer: 'यह जानकारी अभी उपलब्ध नहीं है।',
    topicCards: [
      { icon: '🏦', title: 'बैंक खाता क्यों?', text: 'पैसा सुरक्षित रखें, ब्याज पाएं, और सरकारी लाभ प्राप्त करें।' },
      { icon: '📲', title: 'UPI क्या है?', text: 'मोबाइल से तुरंत और मुफ्त पैसे भेजने का आसान तरीका।' },
      { icon: '💰', title: 'बचत की आदत', text: 'रोज ₹10 भी सालों में बड़ी राशि बन सकती है।' },
      { icon: '🛡️', title: 'बीमा क्यों?', text: 'आपात स्थिति में परिवार की सुरक्षा के लिए।' },
      { icon: '⚠️', title: 'धोखाधड़ी से बचें', text: 'OTP और PIN कभी साझा न करें। बैंक कभी नहीं मांगता।' },
    ],
  },
}

function ChatPage() {
  const { language } = useLanguage()
  const { user, userProfile } = useAuth()
  const [messages, setMessages] = useState([])
  const [schemes, setSchemes] = useState([])

  const copy = chatCopy[language] ?? chatCopy.en

  const chips = useMemo(() => copy.chips, [copy])

  useEffect(() => {
    const fetchSchemes = async () => {
      const { data } = await supabase
        .from('schemes')
        .select('id, scheme_name, description, eligibility, benefits, application_process, state, category, official_url')
      setSchemes(data ?? [])
    }

    fetchSchemes()
  }, [])

  const addMessage = async (question) => {
    const userMsg = { role: 'user', content: question }

    let answer = copy.fallbackAnswers[question] ?? copy.defaultAnswer

    const isSchemeQuestion = language === 'hi'
      ? question.includes('सरकारी योजना')
      : question.includes('government scheme')

    if (isSchemeQuestion && userProfile && schemes.length) {
      const top = rankSchemesForUser(userProfile, schemes, language).slice(0, 3)
      const names = top.map((item) => item.scheme_name).join(', ')
      answer = `${copy.schemeIntro}${names}. ${copy.schemeSuffix}`
    }

    const botMsg = {
      role: 'assistant',
      content: `${answer}\n\n${copy.note}`
    }

    setMessages((prev) => [...prev, userMsg, botMsg])

    if (user) {
      const { data: sessionData } = await supabase
        .from('chat_sessions')
        .insert({ user_id: user.id, title: 'Quick Chat' })
        .select('id')
        .single()

      if (sessionData?.id) {
        await supabase.from('chat_messages').insert([
          { session_id: sessionData.id, role: 'user', content: userMsg.content },
          { session_id: sessionData.id, role: 'assistant', content: botMsg.content },
        ])
      }
    }
  }

  return (
    <section className="learning-page">
      <div className="hero-panel glass-panel learning-hero">
        <p className="eyebrow">{language === 'hi' ? 'फाइनेंशियल लर्निंग' : 'Financial Learning'}</p>
        <h2>{copy.title}</h2>
        <p className="lead-text">{copy.intro}</p>
      </div>

      <div className="topic-grid">
        {copy.topicCards.map((topic) => (
          <article key={topic.title} className="learning-card glass-panel">
            <div className="learning-icon" aria-hidden="true">{topic.icon}</div>
            <div>
              <h3>{topic.title}</h3>
              <p>{topic.text}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="question-panel glass-panel">
        <div className="section-heading">
          <h3>{copy.questionHeader}</h3>
          <p>{language === 'hi' ? 'बैंकिंग से जुड़े सवाल चुनें।' : 'Pick a banking question to get a simple answer.'}</p>
        </div>

        <div className="chip-wrap">
          {chips.map((chip) => (
            <button key={chip} type="button" className="chip" onClick={() => addMessage(chip)}>
              {chip}
            </button>
          ))}
        </div>

        <div className="chat-box glass-panel">
          {messages.length === 0 ? <p>{copy.empty}</p> : null}
          {messages.map((msg, index) => (
            <div key={`${msg.role}-${index}`} className={`chat-bubble ${msg.role}`}>
              <strong>{msg.role === 'user' ? copy.you : 'Bachat Buddy'}:</strong> {msg.content}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ChatPage
