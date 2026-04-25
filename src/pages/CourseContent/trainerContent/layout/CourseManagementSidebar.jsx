import React from 'react'
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";


import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useClickOutside } from '@/hooks/useClickOutside'


// config
import { COURSE_EDIT_SECTIONS } from "@/config/courseContentOption";
import { CREATE_BUTTON_OPTIONS } from "@/config/dropdownButtons"

import { BackButton, Button, Icon, Dropdown } from '@/components/ui';

function CourseManagementSidebar({ courseContent }) {

  const navigate = useNavigate();
  const { courseId } = useParams();
  const [isDropdownOpen, dropdownRef, setIsDropdownOpen, toggle] = useClickOutside(false);
  const [open, setOpen] = React.useState(null);
  // console.log(modules, assignments)
  // console.log(courseId);

  const sections = COURSE_EDIT_SECTIONS(courseId);


  // create dropdown options
  const createButtons = CREATE_BUTTON_OPTIONS({
    navigate,
    courseId
  });


  // 
  const sectionChildrenMap = {
    modules: courseContent?.modules,
    assignments: courseContent?.assignments,
    // lab: [],
    // quiz: [],
    // feedback: [],
  };


  const toggleSection = (key) => {
    setOpen((prev) => (prev === key ? null : key));
  };

  return (
    <>
      <div className="p-2 w-full">
        <BackButton to={`/course/${courseId}/overview`} iconName="material-symbols:arrow-back-rounded" label="Back to Overview" />
      </div>
      <div className="flex justify-center border-y-2 border-default p-4">
        <div className="relative" ref={dropdownRef}>
          <Button
            buttonName="Create"
            frontIconName="ic:baseline-plus"
            backIconName="teenyicons:down-solid"
            backIconHeight="16px"
            backIconWidth="16px"
            frontIconHeight="26px"
            frontIconWidth="26px"
            className="py-3 px-15 rounded-lg"
            onClick={toggle}
          />
          {isDropdownOpen && (
            <Dropdown
              buttons={createButtons}
              closeDropdown={() => setIsDropdownOpen((prev) => !prev)}
            />
          )}
        </div>
      </div>


      <div className="">
        {sections.map((section) => {

          const isSectionOpen = open === section.key;
          const children = sectionChildrenMap[section.key];
          const hasChildren = children && children.length > 0;

          return (

            <div key={section.key}>
              <NavLink
                to={section.path}
                onClick={() => toggleSection(section.key)}
              >
                {({ isActive }) => (
                  <div
                    className={clsx(
                      "group flex h-13 w-full items-center text-h45 border-primary dark:border-background",
                      isActive
                        ? "bg-primary/16 dark:bg-primary text-primary dark:text-background border-l-8 px-1"
                        : "hover:bg-primary/16 dark:hover:bg-surface-primary-dark text-muted px-1"
                    )}
                  >
                    <Icon
                      name="iconamoon:arrow-right-2"
                      height="26px"
                      width="26px"
                      className={clsx(
                        "transition-transform duration-500",
                        isActive
                          ? "text-primary dark:text-background"
                          : "text-white dark:text-background-dark group-hover:text-primary group-hover:dark:text-background",
                        hasChildren && isSectionOpen && "rotate-90"
                      )}
                    />
                    <div className="flex justify-between w-full">
                      {section.label}
                    </div>

                    {hasChildren && (
                      <span
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          navigate(`/course/${courseId}/content/${section.key}/create`);
                        }}
                      >
                        <Icon
                          name="ic:baseline-plus"
                          height="26px"
                          width="26px"
                          className={clsx(
                            "transition-colors",
                            isActive
                              ? "text-primary dark:text-background"
                              : "text-white dark:text-background-dark group-hover:text-primary group-hover:dark:text-background"
                          )}
                        />

                      </span>
                    )}

                  </div>
                )}
              </NavLink>

              {hasChildren && isSectionOpen && (
                <ul
                  className='space-y-1 overflow-hidden'
                >
                  {children.map((child) => (
                    <li key={child.id}>
                      <NavLink
                        to={`/course/${courseId}/content/${section.key}/${child.id}`}
                        className={({ isActive }) =>
                          clsx(
                            "group flex items-center justify-between pl-10 px-2 py-3 text-h5",
                            isActive
                              ? "bg-primary/16 dark:bg-primary text-primary dark:text-background"
                              : "text-muted hover:bg-primary/16 dark:hover:bg-surface-primary-dark"
                          )
                        }
                      >
                        <span className="truncate flex-1">
                          {child.title}
                        </span>
                        {section.key === "modules" &&
                          <span
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              navigate(`/course/${courseId}/content/${section.key}/create`);
                            }}
                          >
                            <Icon
                              name="ic:baseline-plus"
                              height="26"
                              width="26"
                              className="text-muted-foreground"
                            />
                          </span>
                        }
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>

    </>
  )
}

export default CourseManagementSidebar
