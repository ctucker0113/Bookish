import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../client'; // Import the initialized Firebase app
import { checkUser } from '../auth';

// Initialize Firebase Authentication
const auth = getAuth(app);

const AuthContext = createContext();
AuthContext.displayName = 'AuthContext';

const AuthProvider = (props) => {
  const [user, setUser] = useState(null);
  const [oAuthUser, setOAuthUser] = useState(null);

  const updateUser = useMemo(
    () => (uid) => checkUser(uid).then((gamerInfo) => {
      setUser({ fbUser: oAuthUser, ...gamerInfo });
    }),
    [oAuthUser],
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setOAuthUser(fbUser);
        checkUser(fbUser.uid).then((gamerInfo) => {
          let userObj = {};
          if ('null' in gamerInfo) {
            userObj = gamerInfo;
          } else {
            userObj = { fbUser, uid: fbUser.uid, ...gamerInfo };
          }
          setUser(userObj);
        });
      } else {
        setOAuthUser(false);
        setUser(false);
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const value = useMemo(() => ({
    user,
    updateUser,
    userLoading: user === null || oAuthUser === null,
  }), [user, oAuthUser, updateUser]);

  return <AuthContext.Provider value={value} {...props} />;
};

const AuthConsumer = AuthContext.Consumer;

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth, AuthConsumer };