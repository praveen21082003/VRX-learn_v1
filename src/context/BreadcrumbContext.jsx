import React, { createContext, useContext, useState, useEffect } from "react";

const BreadcrumbContext = createContext();

export const BreadcrumbProvider = ({ children }) => {
  // Initialize from sessionStorage or default to Dashboard
  const [breadcrumbs, setBreadcrumbs] = useState(() => {
    const stored = sessionStorage.getItem("learning-breadcrumbs");
    return stored ? JSON.parse(stored) : [{ label: "Dashboard", to: "/dashboard" }];
  });

  const resetBreadcrumbs = () => {
    setBreadcrumbs([{ label: "Dashboard", to: "/dashboard" }]);
  };

  // Sync with sessionStorage whenever state changes
  useEffect(() => {
    sessionStorage.setItem("learning-breadcrumbs", JSON.stringify(breadcrumbs));
  }, [breadcrumbs]);

  const setCourseBreadcrumb = (courseLabel, to = "") => {
    setBreadcrumbs((prev) => {
      const base = prev.slice(0, 1); // Keep only Dashboard
      return [...base, { label: courseLabel, to }];
    });
  };

  const setSectionBreadcrumb = (sectionLabel) => {
    setBreadcrumbs((prev) => {
      const base = prev.slice(0, 2); // Keep Dashboard and Course
      return [...base, { label: sectionLabel }];
    });
  };

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbs, setCourseBreadcrumb, setSectionBreadcrumb, resetBreadcrumbs }}>
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