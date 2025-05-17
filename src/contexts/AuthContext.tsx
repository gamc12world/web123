import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';
import { createUserProfile, getUserProfile } from '../lib/db';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, name: string, password: string) => Promise<User>;
  logout: () => void;
  googleSignIn: () => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session
    const session = supabase.auth.getSession();
    if (session) {
      checkUser();
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        checkUser();
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      try {
        const profile = await getUserProfile(session.user.id);
        if (profile) {
          setUser({
            id: profile.id,
            email: profile.email,
            name: profile.name,
            isAdmin: profile.is_admin
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }
  };

  const login = async (email: string, password: string): Promise<User> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const profile = await getUserProfile(data.user.id);
    const user: User = {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      isAdmin: profile.is_admin
    };

    setUser(user);
    return user;
  };

  const register = async (email: string, name: string, password: string): Promise<User> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    const newUser: User = {
      id: data.user!.id,
      email,
      name,
      isAdmin: false
    };

    await createUserProfile(newUser);
    setUser(newUser);
    return newUser;
  };

  const logout = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const googleSignIn = async (): Promise<User> => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) throw error;

    // This is a placeholder since we need to handle the OAuth callback
    // and create/fetch the user profile after successful authentication
    return {} as User;
  };

  const value = {
    user,
    login,
    register,
    logout,
    googleSignIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};