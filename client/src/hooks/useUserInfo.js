import { useState, useEffect } from 'react';

export const useUserInfo = (userId) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setUserInfo(null);
      return;
    }

    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/user/${userId}`);
        const data = await res.json();
        setUserInfo(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [userId]);

  return { userInfo, loading, error };
};
