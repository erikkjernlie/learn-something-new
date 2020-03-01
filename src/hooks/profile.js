import { useState, useEffect } from "react";
import { firestore } from "../../firebase";
import { useHistory } from "react-router-dom";
import { Profile } from "src/types/index";
import { User } from "src/types/index";
//import { errorFromErrorCode } from '@/services/ErrorService';

//TODO: Use errorFromErrorCode to get norwegian errors
export const useSubscribeProfile = email => {
  const [profile, setProfile] = useState({});
  const [error, setError] = useState(null);

  let unsub;
  const subscribe = async (email: string) => {
    try {
      unsub = await firestore
        .collection("profiles")
        .doc(email)
        .onSnapshot(doc => {
          console.log("old-profile", profile);
          const data = doc.data();
          setProfile(data);
        });
    } catch (error) {
      console.log(error);
      setError(error.toString());
    }
  };

  useEffect(() => {
    if (email) subscribe(email);
    return () => {
      if (unsub) unsub();
      setProfile({});
    };
  }, [email]);

  return { profile, error };
};

//TODO: Use errorFromErrorCode to get norwegian errors
export const useGetProfile = user => {
  const [profile, setProfile] = useState({});
  const [getting, setGetting] = useState(false);
  const [error, setError] = useState(null);

  const get = async () => {
    setGetting(true);
    try {
      // might need to take this outside if to get loading etc.
      if (user && user.email) {
        let profile = await firestore
          .collection("profiles")
          .doc(user.email)
          .get();
        const p = profile.data();
        setProfile(p);
      }
    } catch (error) {
      console.log(error);
      setError(error.toString());
    } finally {
      setGetting(false);
    }
  };

  useEffect(() => {
    get();
  }, []);

  return { getting, profile, error };
};

//TODO: Use errorFromErrorCode to get norwegian errors
export const useCreateProfile = () => {
  const [createProfileError, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const history = useHistory();

  const create = async profile => {
    setCreating(true);
    const { email, ...profileInfo } = profile;

    try {
      await firestore
        .collection("profiles")
        .doc(email)
        .set(profileInfo);
      setCreating(false);
      history.push("/");
    } catch (error) {
      console.log(error);
      setError(error.toString());
      setCreating(false);
    }
  };

  return {
    create,
    creating,
    createProfileError
  };
};

//TODO: Use errorFromErrorCode to get norwegian errors
export const useUpdateProfile = () => {
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  const update = async profile => {
    setUpdating(true);
    const { email, ...profileInfo } = profile;
    try {
      await firestore
        .collection("profiles")
        .doc(email)
        .update(profileInfo);
    } catch (error) {
      console.log(error);
      setError(error.toString());
    } finally {
      setUpdating(false);
    }
  };

  return { update, updating, error };
};
