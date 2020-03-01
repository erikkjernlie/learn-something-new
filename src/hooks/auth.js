import { useState, useEffect } from "react";
import firebase, { firestore } from "../firebase";

export const useRegister = () => {
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState(null);

  const [successfulRegister, setSuccessfulRegister] = useState(false);

  const withEmailAndPassword = async (email, password) => {
    setRegistering(true);
    setError(null);
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      setSuccessfulRegister(true);
      setError(null);
    } catch (error) {
      console.log(error);
      // setError(errorFromErrorCode(error.code));
      setRegistering(false);
    } finally {
      setRegistering(false);
    }
  };

  return {
    registering,
    successfulRegister,
    error,
    withEmailAndPassword
  };
};

export const useSignIn = () => {
  const [signingIn, setSigningIn] = useState(false);
  const [error] = useState(null);

  const withEmailAndPassword = async (email, password) => {
    setSigningIn(true);
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      // navigate
    } catch (error) {
      // setError(errorFromErrorCode(error.code));
      setSigningIn(false);
    }
  };

  return {
    signingIn,
    error,
    withEmailAndPassword
  };
};

//TODO: Use errorFromErrorCode to get norwegian errors
export const useSignOut = () => {
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState(null);

  const signOut = async () => {
    setSigningOut(true);
    try {
      await firebase.auth().signOut();
      // history.push("/");
    } catch (error) {
      setError(error);
      setSigningOut(false);
    } finally {
      setSigningOut(false);
    }
  };

  return {
    signOut,
    signingOut,
    error
  };
};

export const useUser = () => {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const subscribeToAuthState = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    subscribeToAuthState();
  }, []);

  return { user, loading };
};

//TODO: Create independent and generic delete functions.
//TODO: Use errorFromErrorCode to get norwegian errors
export const useAbort = () => {
  const [abortError, setError] = useState(null);
  const [aborting, setAborting] = useState(false);

  const abort = async user => {
    if (user.email) {
      setAborting(true);
      try {
        console.log("DELETING USER PROFILE CONNECTED TO: ", user.email);
        await firestore
          .collection("profiles")
          .doc(user.email)
          .delete();
      } catch (error) {
        console.log(error);
        setError(error.toString());
        throw error;
      } finally {
        try {
          console.log("DELETING USER: ", user.email);
          await user.delete();
          setAborting(false);
          // navigate user
          window.location.reload();
        } catch (error) {
          console.log(error);
          setError(error.toString());
          throw error;
        }
      }
    }
  };

  return { abort, aborting, abortError };
};
