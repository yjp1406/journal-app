const queries = {
    createJournal: "INSERT INTO journals (description, tagged_students, attachment_type, attachment_data,published_at, created_by) VALUES (?, ?, ?, ?, ?, ?)",
    findById: "SELECT * FROM journals WHERE id = ?",
    updateJournal: "UPDATE journals SET description = ?, tagged_students = ?, attachment_type = ?, attachment_data = ?, published_at = ?, created_by = ? WHERE id = ?",
    deleteJournal: "DELETE FROM journals WHERE id = ?",
    publishJournal: "UPDATE journals SET published_at = ? WHERE id = ?",
    teacherFeed: "SELECT * FROM journals WHERE created_by = ? ORDER BY published_at DESC",
    studentFeed: "SELECT * FROM journals WHERE FIND_IN_SET(?, tagged_students) > 0 AND published_at <= ? ORDER BY published_at DESC",
    findByUsername: "SELECT * FROM users WHERE username = ?",
    createUser: "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
    getStudentsList: "SELECT id,username FROM users  WHERE role = ?"
};

module.exports = queries;