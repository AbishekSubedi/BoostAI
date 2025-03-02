import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserByFirebaseUid, getBusiness } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasBusiness, setHasBusiness] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Get user data from backend
          try {
            const userData = await getUserByFirebaseUid(firebaseUser.uid);
            if (userData && userData.user) {
              setCurrentUser(userData.user);
              
              // Store token if available
              if (userData.token) {
                localStorage.setItem('token', userData.token);
              }
            } else {
              // If no user data from backend, use Firebase user
              setCurrentUser({
                firebaseUid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName
              });
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            // Fallback to Firebase user
            setCurrentUser({
              firebaseUid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName
            });
          }

          // Check if user has a business profile
          try {
            const business = await getBusiness();
            setHasBusiness(!!business);
          } catch (error) {
            console.error('Error checking business profile:', error);
            setHasBusiness(false);
          }
        } else {
          setCurrentUser(null);
          localStorage.removeItem('token');
          setHasBusiness(false);
        }
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    setCurrentUser,
    loading,
    hasBusiness,
    setHasBusiness
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 