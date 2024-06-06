import { Alert } from "react-native";
import { useEffect, useState } from "react";

const useAppwrite = (fn: () => void, id?: string | null) => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fn();
      setData(res);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const refetch = () => fetchData();

  return { data, loading, refetch };
};

export default useAppwrite;
