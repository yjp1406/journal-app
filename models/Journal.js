const db = require("../config/db");
const queries = require("../config/queries");
const {getCurrentIST} = require("../utils/setTime")

class Journal {
  static async createJournal(
    description,
    tagged_students,
    attachment_type,
    attachment_data,
    published_at,
    createdBy
  ) {
    try {
      const [result] = await db.query(queries.createJournal, [
        description,
        JSON.stringify(tagged_students),
        attachment_type,
        attachment_data,
        published_at,
        createdBy,
      ]);
      // Fetch the inserted journal record using the ID from the last insert operation
      const [journalRecord] = await db.query(
        "SELECT * FROM journals WHERE id = ?",
        [result.insertId]
      );
      return journalRecord[0] || null;
    } catch (error) {
      throw new Error("Error creating journal entry: " + error.message);
    }
  }

  static async findById(journalId) {
    try {
      const [rows] = await db.query('SELECT * FROM journals WHERE id = ?', [journalId]);

      if (rows.length === 0) {
        return null;
      }

      const journal = rows[0];

      return journal;
    } catch (error) {
      throw new Error('Error fetching journal by ID: ' + error.message);
    }
  }

  static async updateJournal(journalId, updatedFields) {
    const {
      description,
      tagged_students,
      attachment_type,
      attachment_data,
      publishedAt,
      createdBy,
    } = updatedFields;

    try {
      // Update the journal record in the database
      const result = await db.query(
        queries.updateJournal,
        [description, JSON.stringify(tagged_students), attachment_type, attachment_data, publishedAt, createdBy, journalId]
      );

      // Check if the update was successful
      if (result.affectedRows === 0) {
        throw new Error('Journal update failed. Journal not found or no changes made.');
      }

      // Fetch the updated journal record
      const [updatedJournal] = await db.query('SELECT * FROM journals WHERE id = ?', [journalId]);
      return updatedJournal[0] || null;
    } catch (error) {
      throw new Error('Error updating journal entry: ' + error.message);
    }
  }

  static async deleteJournal(journalId) {
    try {
      const [result] = await db.query(queries.deleteJournal, [
        journalId,
      ]);
      console.log(result);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error("Error deleting journal entry: " + error.message);
    }
  }

  static async publishJournal(journalId) {
    try {
      const currentIST = getCurrentIST();
      console.log(currentIST);  
      // Update the journal's published_at field
      await db.query(queries.publishJournal, [currentIST,journalId]);
  
      // Fetch and return the updated journal record
      const [rows] = await db.query(queries.findById, [journalId]);
      console.log(rows);
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw new Error('Error publishing journal: ' + error.message);
    }
  }
  

  static async getTeacherFeed(createdBy) {
    try {
      const [result] = await db.query(queries.teacherFeed, [createdBy]);
      return result;
    } catch (error) {
      throw new Error("Error fetching teacher feed: " + error.message);
    }
  }

  static async getStudentFeed(studentId) {
    try {
      const currentIST = getCurrentIST();
      const [result] = await db.query(queries.studentFeed, [studentId,currentIST]);
      return result;
    } catch (error) {
      throw new Error("Error fetching student feed: " + error.message);
    }
  }
}

module.exports = Journal;
