import React, { useRef, useState, useEffect } from "react";
import CourseCard from "./CourseCard";
import { Icon, Button } from "@/components/ui";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import CourseCardLoading from "../loading/CourseCardLoading";

function Viewer({
  loading,
  title,
  courses = [],
  maxCourses,
  getButtonName,
  vertical = false,
  gridSize = 3,
  emptyTitle = "No data found",
  emptyDescription = "There are no items to display at this moment.",
  emptyIcon = "uil:book-open",
  myCourses = false,
}) {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const isEmpty = !loading && (!courses || courses.length === 0);
  const visibleCourses = maxCourses ? courses.slice(0, maxCourses) : courses;

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollButtons();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [courses]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = 264; //One Card = 264
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleNavigate = () => {
    if (myCourses) {
      navigate("/learning");
    } else {
      navigate("/courses");
    }
  };

  return (
    <section className="flex flex-col py-2 gap-2">
      <div className="flex justify-between items-center">
        <h4 className="text-h4 text-main font-medium">{title}</h4>
        {maxCourses && courses?.length >= maxCourses && (
          <button
            className="text-sm text-brand font-semibold underline cursor-pointer hover:opacity-80 transition-all"
            onClick={handleNavigate}
          >
            View all
          </button>
        )}
      </div>

      {isEmpty ? (
        <div className="flex justify-center my-16 w-full">
          <div className="flex flex-col gap-4 justify-center items-center max-w-sm text-center">
            <div className="flex justify-center items-center bg-table-Header-bg text-main h-20 w-20 rounded-xl">
              <Icon
                name={emptyIcon}
                height="32"
                width="32"
                className="text-primary-main"
              />
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-h4 font-bold text-main">{emptyTitle}</h4>
              <p className="text-body text-muted">{emptyDescription}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative group">
          {canScrollLeft && (
            <Button
              onClick={() => scroll("left")}
              className="absolute left-2 bottom-21 -translate-y-1/2 z-10 
                        flex items-center justify-center 
                        h-9 w-9 rounded-full bg-white/90 dark:bg-primary shadow-md 
                        hover:bg-gray-50 dark:hover:bg-primary transition-all
                        -translate-x-1/2 cursor-pointer text-primary"
              frontIconName="mdi:chevron-left"
              frontIconWidth="35"
              frontIconHeight="35"
            ></Button>
          )}

          <div
            ref={scrollRef}
            className="w-full overflow-x-scroll scrollbar-hide scroll-smooth"
          >
            <div className="flex gap-2 w-max">
              {loading
                ? [...Array(maxCourses || gridSize)].map((_, i) => (
                    <CourseCardLoading key={i} />
                  ))
                : visibleCourses.map((course) => (
                    <CourseCard
                      key={course.courseId || course.id}
                      course={course}
                      image={course.thumbnail}
                    />
                  ))}
            </div>
          </div>

          {canScrollRight && (
            <Button
              onClick={() => scroll("right")}
              className="absolute right-2 bottom-21 -translate-y-1/2 z-10 
                        flex items-center justify-center 
                        h-9 w-9 rounded-full bg-white/90 dark:bg-primary shadow-md 
                        hover:bg-gray-50 dark:hover:bg-primary transition-all
                        translate-x-1/2 cursor-pointer text-primary"
              frontIconName="weui:arrow-filled"
              frontIconWidth="35"
              frontIconHeight="35"
            ></Button>
          )}
        </div>
      )}
    </section>
  );
}

export default Viewer;