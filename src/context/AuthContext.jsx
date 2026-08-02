import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../config/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (!mounted) return
      setSession(data.session)
      if (data.session?.user) {
        await fetchProfile(data.session.user.id)
      }
      setLoading(false)
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      setSession(currentSession)
      if (currentSession?.user) {
        await fetchProfile(currentSession.user.id)
      } else {
        setUserProfile(null)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const fetchProfile = async (authId) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authId)
      .single()

    if (error) {
      setUserProfile(null)
      return
    }

    setUserProfile(data)
  }

  const signUpWithProfile = async ({ email, password, profile }) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      throw error
    }

    const authId = data.user?.id
    if (!authId) {
      throw new Error('Unable to create user authentication record.')
    }

    const { error: profileError } = await supabase.from('users').insert({
      auth_id: authId,
      email,
      full_name: profile.full_name,
      age: profile.age,
      gender: profile.gender,
      monthly_income: profile.monthly_income,
      occupation: profile.occupation,
      state: profile.state,
      social_category: profile.social_category,
      preferred_language: profile.preferred_language,
      consent: profile.consent,
    })

    if (profileError) {
      throw profileError
    }

    await fetchProfile(authId)
  }

  const login = async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      throw error
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
  }

  const value = useMemo(() => ({
    session,
    user: session?.user ?? null,
    userProfile,
    loading,
    signUpWithProfile,
    login,
    logout,
    refreshProfile: async () => {
      if (session?.user?.id) {
        await fetchProfile(session.user.id)
      }
    },
  }), [session, userProfile, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
