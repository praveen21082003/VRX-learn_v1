import React, { createContext, useContext, useState, useEffect } from "react";

import { usePermission } from "@/hooks/usePermission"

const BreadcrumbContext = createContext();

export const BreadcrumbProvider = ({ children }) => {
  const { can } = usePermission();

  // ✅ derive root from can — stable function
  const getRootBreadcrumb = useCallback(() => {
    if (can("BREADCRUMBS_DASHBOARD")) {
      return { label: "Dashboard", to: "/dashboard" };
    }
    return { label: "Courses", to: "/courses" };
  }, [can]);

  // ✅ start with empty, set after can is ready
  const [breadcrumbs, setBreadcrumbs] = useState(() => {
    const stored = sessionStorage.getItem("learning-breadcrumbs");
    if (stored) return JSON.parse(stored);
    return [{ label: "Dashboard", to: "/dashboard" }]; // safe default
  });

  // ✅ update root once can is ready
  useEffect(() => {
    setBreadcrumbs(prev => {
      if (prev.length === 0) return [getRootBreadcrumb()];
      return [getRootBreadcrumb(), ...prev.slice(1)];
    });
  }, [getRootBreadcrumb]);

  const resetBreadcrumbs = useCallback(() => {
    setBreadcrumbs([getRootBreadcrumb()]);
  }, [getRootBreadcrumb]);

  const setCourseBreadcrumb = useCallback((courseLabel, to = "") => {
    setBreadcrumbs([
      getRootBreadcrumb(),
      { label: courseLabel, to }
    ]);
  }, [getRootBreadcrumb]);

  const setSectionBreadcrumb = useCallback((sectionLabel, to = "") => {
    setBreadcrumbs(prev => {
      const root = prev[0];
      const course = prev[1];
      return [root, course, { label: sectionLabel, to }];
    });
  }, []);

  // sync to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("learning-breadcrumbs", JSON.stringify(breadcrumbs));
  }, [breadcrumbs]);

  return (
    <BreadcrumbContext.Provider value={{
      breadcrumbs,
      setCourseBreadcrumb,
      setSectionBreadcrumb,
      resetBreadcrumbs
    }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

// Custom hook for easy access
export const useBreadcrumbs = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error("useBreadcrumbs must be used within a BreadcrumbProvider");
  }
  return context;
};