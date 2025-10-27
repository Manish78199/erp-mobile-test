
// const BASE_URL = "https://erp-backend.vedatron.com"
const BASE_URL = "https://erp-demo-backend.vedatron.com"

// const BASE_URL = "http://127.0.0.1:8000"

console.log("env_______________", { BASE_URL })
const ApiRoute = {
    BaseUrl: `${BASE_URL}`,
    ROLE_AUTH: `${BASE_URL}/authorize`,
    app_check: `${BASE_URL}/public/check-update`,
    classService: {
        create: `${BASE_URL}/management/class`,
        getAllClass: `${BASE_URL}/management/class`
    },
    login: {
        employeeLogin: `${BASE_URL}/management/employee/login`
    },
    syllabus: {
        getAllSylllabus: `${BASE_URL}/management/syllabus`,
        create: `${BASE_URL}/management/syllabus/add`
    },
    subjectService: {
        create: `${BASE_URL}/management/subject`,
        delete: `${BASE_URL}/management/subject`,
        getAllSubject: `${BASE_URL}/management/subject/getAll`,
        getClassSubject: `${BASE_URL}/management/subject/class_subject`,
    },
    studentService: {
        changeStudentProfileimage: `${BASE_URL}/management/student/change_profile_image`,
        getStudentProfile: `${BASE_URL}/management/student/get_student_profile`,
        addmission: `${BASE_URL}/management/student/admission`,
        get_admission_student_details: `${BASE_URL}/management/student/admission`,

        getAllSchoolStudent: `${BASE_URL}/management/student/getAllSchoolStudent`,
        getStudentForAttendance: `${BASE_URL}/management/student/studentAttendanceByClass`,
        getByClass: `${BASE_URL}/management/student/getByClass`,
        student_health: `${BASE_URL}/management/student/health`

    },
    noticeService: {
        newNotice: `${BASE_URL}/management/notice/`,
        getNotice: `${BASE_URL}/management/notice/`
    },
    stuentHomeWork: {
        create: `${BASE_URL}/management/homework`,
        getByClass: `${BASE_URL}/management/homework/class`,
        deleteHomeWork: `${BASE_URL}/management/homework`,
    },
    studentAttendance: {
        mark: `${BASE_URL}/management/student/attendance/mark`
    },
    uploader: {
        image: `${BASE_URL}/management/upload/image`,
        multipleImages: `${BASE_URL}/management/upload/images`

    },
    feeStructure: {
        create: `${BASE_URL}/management/feeStructure`,
        getAll: `${BASE_URL}/management/feeStructure/get_all`,
        getByClassId: `${BASE_URL}/management/feeStructure/get_by_class`,
        update: `${BASE_URL}/management/feeStructure`
    },
    callender: {

        yearly_callender_event: `${BASE_URL}/management/event/callender_event`,
        set_callender_event: `${BASE_URL}/management/event/add_callender_event`,

    },
    event: {
        uploadEventImages: `${BASE_URL}/management/event/upload_event_photo`,
        get_activity_image: `${BASE_URL}/management/event/get_event_photo`,


    },
    section: {
        create: `${BASE_URL}/management/section`,
        get_all: `${BASE_URL}/management/section`,
        get_class_section: `${BASE_URL}/management/section/get_class_section`,

    },
    EXAM: {
        create: `${BASE_URL}/management/exam`,
        get_all: `${BASE_URL}/management/exam`,
        get_class_exam: `${BASE_URL}/management/exam/attendance`,
        get_exam_student_and_subject: `${BASE_URL}/management/exam/student`,
        mark_exam_attendance: `${BASE_URL}/management/exam/mark-attendance`,
        mark_apprear: `${BASE_URL}/management/exam/mark-apprear`
    },
    RESULT: {
        get_exam_student_list: `${BASE_URL}/management/result/student-list`,
        get_student_details: `${BASE_URL}/management/result/student`,
        mark_submit: `${BASE_URL}/management/result/mark/submit`,
        save_result_setting: `${BASE_URL}/management/result/config`,
        declare: `${BASE_URL}/management/result/declare`,
        view_marksheet: `${BASE_URL}/management/result/marksheet`,
        get_class_summary: `${BASE_URL}/management/result/summary`
    },
    TRANSPORT: {
        vehicle: `${BASE_URL}/management/transport/vehicle`,
        searchPickUpPoint: `${BASE_URL}/management/transport/search-pickup-point`,
        route: `${BASE_URL}/management/transport/route`,
        assignToStudent: `${BASE_URL}/management/transport/assign-to-student`,
        getAssignTransport: `${BASE_URL}/management/transport/assigned-transport`,
        releaseTransport: `${BASE_URL}/management/transport/release-transport`,
        // vehicle and routes
        assign_vehicle_route: `${BASE_URL}/management/transport/assign-vehicle-route`,
        get_route_vehicles: `${BASE_URL}/management/transport/get-route-vehicles`,


    },

        DASHBOARD: {
        main: `${BASE_URL}/management/dashboard`,
        fee_analytics: `${BASE_URL}/management/dashboard/fee-analytics`,
        transport_tracking: `${BASE_URL}/management/dashboard/transport-tracking`,
        academic_summary: `${BASE_URL}/management/dashboard/academic-summary`,
        hostel_management: `${BASE_URL}/management/dashboard/hostel-management`,
        employee_attendance: `${BASE_URL}/management/dashboard/employee-attendance`,
        inventory_status: `${BASE_URL}/management/dashboard/inventory-status`,
        health_medical: `${BASE_URL}/management/dashboard/health-medical`,
        examination_analytics: `${BASE_URL}/management/dashboard/examination-analytics`,
        events_activities: `${BASE_URL}/management/dashboard/events-activities`,
        recent_activities: `${BASE_URL}/management/dashboard/recent-activity`,
        quick_stats: `${BASE_URL}/management/dashboard/quick-stats`,
        performance_metrics: `${BASE_URL}/management/dashboard/performance-metrics`,
        export_data: `${BASE_URL}/management/dashboard/export-data`,
        alerts_notifications: `${BASE_URL}/management/dashboard/alerts-notifications`,
    },
    fee: {
        getStudentFeeDetails: `${BASE_URL}/management/fee/student`,
        deposit: `${BASE_URL}/management/fee/deposit`,
        history: `${BASE_URL}/management/fee/history`,


    },
       HOSTEL: {
        add_hostel: `${BASE_URL}/management/hostel/add-hostel`,
        get_hostel_list: `${BASE_URL}/management/hostel/hostel-list`,
        room: `${BASE_URL}/management/hostel/room`,
        room_assign: `${BASE_URL}/management/hostel/assign`,
        asssigned_room: `${BASE_URL}/management/hostel/assigned-room`,

        room_vacant: `${BASE_URL}/management/hostel/vacant`,


    },
    AUTHORIZATION: {
        get_all_auth_user: `${BASE_URL}/management/authorization/user/get_all_auth_user`,
        get_all_permission: `${BASE_URL}/management/authorization/permission/get_all_permission`,
        get_all_roles: `${BASE_URL}/management/authorization/role`,
        create_role: `${BASE_URL}/management/authorization/role`,

        get_my_auth_profile: `${BASE_URL}/management/authorization/get_my_auth_profile`,
        get_user_permission_and_role: `${BASE_URL}/management/authorization/user/get_user_and_permission`,
        assign_role_and_permission: `${BASE_URL}/management/authorization/user/assign_role_and_permission`,
    },
    // by management 
    employeeRoutes: {
        create: `${BASE_URL}/management/employee/create`,
        update_password: `${BASE_URL}/management/employee/update_password`,
        getAll: `${BASE_URL}/management/employee/getAll`,
        getStaffDetails: `${BASE_URL}/management/employee/get`,

        attendance: {
            getAllEmployeeForAttendance: `${BASE_URL}/management/employee/employee_attendance`,
            markAttendance: `${BASE_URL}/management/employee/attendance/mark`

        }
    },

    CLASS_PERIOD_SCHEDULE: {
        timetable: `${BASE_URL}/management/timetable`
    },
    LIBRARY: {
        book_crud: `${BASE_URL}/management/library/book`,
        search_book: `${BASE_URL}/management/library/search`,
        assignBook: `${BASE_URL}/management/library/assign`,
        returnBook: `${BASE_URL}/management/library/return`,
        getBorrowedBook: `${BASE_URL}/management/library/borrowed`,
        dueBooks: `${BASE_URL}/management/library/due`,
        feeDue: `${BASE_URL}/management/library/fee-due`,
    },
    STUDENT: {
        login: `${BASE_URL}/student/login`,
        profile: `${BASE_URL}/student/profile`,
        attendance: {
            summary: `${BASE_URL}/student/attendance/summary`,
            details: `${BASE_URL}/student/attendance/details`
        },
        homework: {
            getAllHomework: `${BASE_URL}/student/homework`,
        },
        event: {
            yearly_callender_event: `${BASE_URL}/student/callender_event`,
            activity_photos: `${BASE_URL}/student/event_activity`,
            all_activity_photos: `${BASE_URL}/student/all_event_activity`,
        },
        syllabus: `${BASE_URL}/student/syllabus`,
        save_fcm_token: `${BASE_URL}/student/save_fcm_token`,
        getAllnotice: `${BASE_URL}/student/notice`,
        exam: {
            get_all: `${BASE_URL}/student/exam`,
            schedule: `${BASE_URL}/student/exam/schedule`,
            result: `${BASE_URL}/student/result`
        },
        health: `${BASE_URL}/student/health`,
        library: {
            get_borrowed_book: `${BASE_URL}/student/library/borrowed-books`
        },
        RESULT: {
            get_sessional_exams: `${BASE_URL}/student/result/session-exams`,
            get_exam_result: `${BASE_URL}/student/result`,

        },
        TRANSPORT: {
            transport_details: `${BASE_URL}/student/transport`
        }

    }
}

export { ApiRoute };

