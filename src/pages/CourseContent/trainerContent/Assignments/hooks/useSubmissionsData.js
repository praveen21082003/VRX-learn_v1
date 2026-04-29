import { useState, useEffect, useRef, useCallback } from "react";
import { getAssignmentSubmission } from "@/services/AssignmentContent.service";

export const useSubmissionsData = (assignmentId, params) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isFetchingRef = useRef(false);

  const fetchSubmissions = useCallback(async () => {
    if (!assignmentId || isFetchingRef.current) return;

    try {
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);

      const response = await getAssignmentSubmission(assignmentId, params);
      console.log(response)

      const data = response?.data || [];
      const list = Array.isArray(data) ? data : [];

      setSubmissions(list);
    } catch (err) {
      console.log(err)
      let message = "Failed to load submissions";

      if (err.response?.status === 404) message = "No submissions found";
      if (err.response?.status === 403) message = "No permission";
      if (err.response?.status >= 500) message = "Server error";

      setError(message);
      setSubmissions([]);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [assignmentId, params]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  return {
    submissions,
    loading,
    error,
    refreshSubmissions: fetchSubmissions,
  };
};