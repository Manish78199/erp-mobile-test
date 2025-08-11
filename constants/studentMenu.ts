 const menuItems = [
    {
      id: 1,
      title: "Dashboard",
      icon: "analytics-outline" as const,
      gradient: ["#3B82F6", "#2563EB"], // Blue to darker blue
      route: "/student/dashboard",
      description: "Overview & Analytics",
      category: "overview",
    },
    {
      id: 2,
      title: "Health",
      icon: "fitness-outline" as const,
      gradient: ["#10B981", "#059669"], // Green to darker green
      route: "/student/health",
      description: "Health & Wellness",
      category: "personal",
    },
    {
      id: 3,
      title: "Assignments",
      icon: "document-text-outline" as const,
      gradient: ["#8B5CF6", "#7C3AED"], // Purple to darker purple
      route: "/student/homework",
      description: "Tasks & Projects",
      category: "academic",
    },
    {
      id: 4,
      title: "Attendance",
      icon: "checkmark-circle-outline" as const,
      gradient: ["#06B6D4", "#0891B2"], // Cyan to darker cyan
      route: "/student/attendance",
      description: "Presence Tracking",
      category: "academic",
    },
    {
      id: 5,
      title: "Curriculum",
      icon: "library-outline" as const,
      gradient: ["#F59E0B", "#D97706"], // Amber to darker amber
      route: "/student/syllabus",
      description: "Course Content",
      category: "academic",
    },
    {
      id: 6,
      title: "Calendar",
      icon: "calendar-outline" as const,
      gradient: ["#EC4899", "#DB2777"], // Pink to darker pink
      route: "/student/calendar",
      description: "Events & Classes",
      category: "overview",
    },
    {
      id: 7,
      title: "Announcements",
      icon: "megaphone-outline" as const,
      gradient: ["#EF4444", "#DC2626"], // Red to darker red
      route: "/student/notice",
      description: "Important Updates",
      category: "communication",
    },
    {
      id: 8,
      title: "Examinations",
      icon: "school-outline" as const,
      gradient: ["#6366F1", "#4F46E5"], // Indigo to darker indigo
      route: "/student/exam",
      description: "Test Schedule",
      category: "academic",
    },
    {
      id: 9,
      title: "Results",
      icon: "trophy-outline" as const,
      gradient: ["#F97316", "#EA580C"], // Orange to darker orange
      route: "/student/result",
      description: "Grades & Performance",
      category: "academic",
    },
    {
      id: 10,
      title: "Library",
      icon: "book-outline" as const,
      gradient: ["#84CC16", "#65A30D"], // Lime to darker lime
      route: "/student/library/book",
      description: "Digital Resources",
      category: "resources",
    },
    // {
    //   id: 11,
    //   title: "Messages",
    //   icon: "chatbubbles-outline" as const,
    //   gradient: ["#14B8A6", "#0D9488"], // Teal to darker teal
    //   route: "/messages",
    //   description: "Communication Hub",
    //   category: "communication",
    // },
    // {
    //   id: 12,
    //   title: "Profile",
    //   icon: "person-circle-outline" as const,
    //   gradient: ["#6B7280", "#4B5563"], // Gray to darker gray
    //   route: "/profile",
    //   description: "Personal Settings",
    //   category: "personal",
    // },
  ] as const

  export {
  menuItems
}

