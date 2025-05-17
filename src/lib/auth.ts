import { supabase } from './supabase';
import { User } from '../types';

export async function registerUser(email: string, password: string, name: string): Promise<User> {
  try {
    // Sign up the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('User registration failed');

    // Create the user profile in the users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          email: authData.user.email,
          name,
          is_admin: false,
        },
      ])
      .select()
      .single();

    if (userError) throw userError;
    if (!userData) throw new Error('Failed to create user profile');

    return {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      isAdmin: userData.is_admin,
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

export async function loginUser(email: string, password: string): Promise<User> {
  try {
    // Sign in the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Login failed');

    // Fetch the user profile from the users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError) throw userError;
    if (!userData) throw new Error('User profile not found');

    return {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      isAdmin: userData.is_admin,
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError) throw authError;
    if (!session?.user) return null;

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (userError) throw userError;
    if (!userData) return null;

    return {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      isAdmin: userData.is_admin,
    };
  } catch (error) {
    console.error('Get current user error:', error);
    ret