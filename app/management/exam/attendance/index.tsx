"use client";

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ✅ Import your API service functions from web version
import {
  get_clas_exam_for_attendance,
  get_exam_student_attendance_by_subject,
  mark_exam_attendance,
} from "@/service/management/exam";
import { getAllClass } from "@/service/management/class/classBasic";

// 🧩 Dropdown component (reusable)
function Dropdown({ label, selected, options, onSelect }) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ marginVertical: 8 }}>
      <Text style={{ fontSize: 14, color: "#666" }}>{label}</Text>

      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={{
          marginTop: 6,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 12,
          backgroundColor: "#f9f9f9",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#000" }}>
          {selected ? selected.title : `Select ${label}`}
        </Text>
        <MaterialIcons name="arrow-drop-down" size={22} color="#555" />
      </TouchableOpacity>

      {/* Modal List */}
      <Modal visible={visible} transparent animationType="slide">
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)" }}
          onPress={() => setVisible(false)}
        >
          <View
            style={{
              backgroundColor: "#fff",
              marginTop: "auto",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              padding: 16,
              maxHeight: "60%",
            }}
          >
            <Text style={{ fontWeight: "600", fontSize: 16, marginBottom: 10 }}>
              Select {label}
            </Text>
            <ScrollView>
              {options.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    onSelect(item);
                    setVisible(false);
                  }}
                  style={{
                    paddingVertical: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: "#eee",
                  }}
                >
                  <Text style={{ color: "#222" }}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

// 🧠 Main Component
export default function ExamAttendanceScreen() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);

  // 🧩 Fetch classes on mount
  useEffect(() => {
    (async () => {
      const res = await getAllClass();
      setClasses(res.map((c) => ({ title: c.name, value: c._id })));
    })();
  }, []);

  // 📚 Fetch exams after class selection
  const fetchExams = async (classId) => {
    try {
      setLoading(true);
      const res = await get_clas_exam_for_attendance(classId);
      setExams(res.map((e) => ({ title: `${e.name} (${e.session})`, value: e._id, subjects: e.subjects })));
    } catch (err) {
      console.error("Error fetching exams:", err);
      Alert.alert("Error", "Failed to load exams.");
    } finally {
      setLoading(false);
    }
  };

  // 🧾 Fetch subjects after exam selection
  const handleExamSelect = (exam) => {
    setSelectedExam(exam);
    setSelectedSubject(null);
    if (exam?.subjects) {
      const subj = exam.subjects.map((s) => ({
        title: `${s.name} (${s.code})`,
        value: s.exam_subject_id,
      }));
      setSubjects(subj);
    }
  };

  // 👩‍🎓 Fetch students attendance for subject
  const fetchStudents = async (subjectId) => {
    try {
      setLoading(true);
      const res = await get_exam_student_attendance_by_subject(subjectId);
      setStudents(res.data.data?.students || []);
    } catch (err) {
      console.error("Error fetching students:", err);
      Alert.alert("Error", "Failed to load student attendance.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Mark attendance locally
  const toggleAttendance = (studentId, status) => {
    setAttendance((prev) => {
      const exists = prev.find((a) => a.student_id === studentId);
      if (exists) {
        return prev.map((a) =>
          a.student_id === studentId ? { ...a, status } : a
        );
      } else {
        return [...prev, { student_id: studentId, status }];
      }
    });
  };

  // 💾 Submit attendance
  const submitAttendance = async (lock = false) => {
    if (!selectedExam || !selectedSubject) {
      Alert.alert("Error", "Select class, exam and subject first.");
      return;
    }
    try {
      setSubmitting(true);
      await mark_exam_attendance({
        exam_id: selectedExam.value,
        exam_subject_id: selectedSubject.value,
        attendances: attendance,
        locked: lock,
      });
      Alert.alert("Success", "Attendance submitted successfully!");
    } catch (err) {
      console.error("Submit error:", err);
      Alert.alert("Error", "Failed to submit attendance.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top + 12,
        paddingHorizontal: 16,
        backgroundColor: "#fff",
      }}
    >
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 8 }}>
        Exam Attendance
      </Text>
      <Text style={{ color: "#777", marginBottom: 20 }}>
        Mark attendance for exam subjects
      </Text>

      {/* Dropdowns */}
      <Dropdown
        label="Class"
        selected={selectedClass}
        options={classes}
        onSelect={(cls) => {
          setSelectedClass(cls);
          setSelectedExam(null);
          setSelectedSubject(null);
          setStudents([]);
          fetchExams(cls.value);
        }}
      />

      <Dropdown
        label="Exam"
        selected={selectedExam}
        options={exams}
        onSelect={(exam) => handleExamSelect(exam)}
      />

      <Dropdown
        label="Subject"
        selected={selectedSubject}
        options={subjects}
        onSelect={(subj) => {
          setSelectedSubject(subj);
          fetchStudents(subj.value);
        }}
      />

      {/* Loader */}
      {loading && (
        <View style={{ marginTop: 40, alignItems: "center" }}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={{ marginTop: 10, color: "#666" }}>Loading...</Text>
        </View>
      )}

      {/* Student list */}
      {!loading && students.length > 0 && (
        <FlatList
          data={students}
          keyExtractor={(item) => item._id}
          style={{ marginTop: 20 }}
          renderItem={({ item }) => {
            const currentStatus =
              attendance.find((a) => a.student_id === item._id)?.status || "";
            return (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: "#eee",
                }}
              >
                <View>
                  <Text style={{ fontSize: 16, fontWeight: "500" }}>
                    {item.first_name} {item.last_name}
                  </Text>
                  <Text style={{ color: "#666", fontSize: 13 }}>
                    Roll: {item.roll_no}
                  </Text>
                </View>

                <View style={{ flexDirection: "row", gap: 10 }}>
                  <TouchableOpacity
                    onPress={() => toggleAttendance(item._id, "PRESENT")}
                    style={{
                      backgroundColor:
                        currentStatus === "PRESENT" ? "#4CAF50" : "#eee",
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      borderRadius: 6,
                    }}
                  >
                    <Text
                      style={{
                        color:
                          currentStatus === "PRESENT" ? "#fff" : "#333",
                        fontWeight: "500",
                      }}
                    >
                      Present
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => toggleAttendance(item._id, "ABSENT")}
                    style={{
                      backgroundColor:
                        currentStatus === "ABSENT" ? "#F44336" : "#eee",
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      borderRadius: 6,
                    }}
                  >
                    <Text
                      style={{
                        color: currentStatus === "ABSENT" ? "#fff" : "#333",
                        fontWeight: "500",
                      }}
                    >
                      Absent
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}

      {/* Submit Buttons */}
      {students.length > 0 && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            disabled={submitting}
            onPress={() => submitAttendance(false)}
            style={{
              flex: 1,
              marginRight: 8,
              backgroundColor: "#007bff",
              paddingVertical: 12,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                color: "#fff",
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              {submitting ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={submitting}
            onPress={() => submitAttendance(true)}
            style={{
              flex: 1,
              marginLeft: 8,
              backgroundColor: "#ff9800",
              paddingVertical: 12,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                color: "#fff",
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              {submitting ? "Saving..." : "Save & Lock"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
