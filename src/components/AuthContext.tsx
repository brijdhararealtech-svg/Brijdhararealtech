import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult, 
  signOut,
  db 
} from '../lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
}

const ADMIN_EMAIL = 'brijdhararealtech@gmail.com';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle redirect result (for mobile)
    getRedirectResult(auth).catch((error) => {
      console.error("Redirect sign-in error", error);
      if (error.code === 'auth/unauthorized-domain') {
        alert("This domain is not authorized in Firebase. Please add this Netlify URL to your Firebase Authorized Domains.");
      }
    });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAdmin(user.email === ADMIN_EMAIL);
        // Ensure user profile exists in Firestore
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
          await setDoc(userRef, {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: serverTimestamp(),
          });
        }
        setUser(user);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async () => {
    try {
      // Logic to detect mobile
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Redirect is much better for mobile browser constraints
        await signInWithRedirect(auth, googleProvider);
      } else {
        // Popups work fine on desktop
        await signInWithPopup(auth, googleProvider);
      }
    } catch (error: any) {
      console.error("Sign in failed", error);
      
      // Specifically handle common mobile/deployment errors
      if (error.code === 'auth/popup-blocked') {
        // Suggest redirect if popup was blocked
        if (confirm("Sign-in popup was blocked. Would you like to use redirect instead?")) {
          await signInWithRedirect(auth, googleProvider);
        }
      } else if (error.code === 'auth/unauthorized-domain') {
        alert("This domain is not authorized in Firebase. Please add this Netlify URL to your Firebase Authorized Domains.");
      } else if (error.code === 'auth/popup-closed-by-user') {
        // User closed the popup, no need to alert
      } else {
        alert(`Sign-in error: ${error.message}`);
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
