const Journal = require("../models/Journal");
const fs = require("fs");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const createJournal = async (req, res) => {
  const { description, tagged_students, attachment_type, published_at } = req.body;
  const createdBy = req.user.id;

  try {
    // Check if the user is a teacher
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Forbidden. Only teachers can create journals." });
    }

    // Update tagged_students to have "," at first and last positions
    let formattedTaggedStudents = "," + tagged_students + ",";

    let attachment_data = null;

    if (attachment_type === "URL") {
      attachment_data = req.body.attachment_data;
    } else {
      if (req.file) {
        attachment_data = req.file.path;
      }
    }

    // Implementation for creating a journal
    const newJournalEntry = await Journal.createJournal(
      description,
      formattedTaggedStudents,
      attachment_type,
      attachment_data,
      published_at,
      createdBy
    );

    // Check if the newJournalEntry is not null (i.e., journal entry created successfully)
    if (newJournalEntry) {
      res.status(200).send({
        success: true,
        message: "Journal entry created successfully",
        journal: newJournalEntry,
      });
    } else {
      res
        .status(200)
        .send({ success: false, message: "Failed to create journal entry" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const updateJournal = async (req, res) => {
  const journalId = req.params.id;
  const { description, tagged_students, attachment_type, published_at } =
    req.body;

  try {
    // Check if the user is a teacher
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Forbidden. Only teachers can update journals." });
    }

    // Fetch the original journal record from the database
    const originalJournal = await Journal.findById(journalId);

    if (req.user.id !== originalJournal.created_by) {
      return res.status(403).json({ message: "Unauthorized Teacher" });
    }

    // Check if the journal exists
    if (!originalJournal) {
      return res.status(404).json({ message: "Journal not found." });
    }

    let attachment_data = null;

    if (attachment_type === "URL") {
      attachment_data = req.body.attachment_data;
    } else {
      if (req.file) {
        attachment_data = req.file.path;
      }
    }

    let formattedTaggedStudents = "," + tagged_students + ",";

    // Check and update the fields that have non-null values in the request body
    const updatedFields = {
      description:
        description !== undefined ? description : originalJournal.description,
      tagged_students:
      formattedTaggedStudents !== undefined
          ? formattedTaggedStudents
          : originalJournal.tagged_students,
      attachment_type:
        attachment_type !== undefined
          ? attachment_type
          : originalJournal.attachment_type,
      attachment_data:
        attachment_data !== null
          ? attachment_data
          : originalJournal.attachment_data,
      published_at:
        published_at !== undefined
          ? published_at
          : originalJournal.published_at,
    };

    // Perform the update operation
    const rows = await Journal.updateJournal(journalId, updatedFields);
    if (rows) {
      res
        .status(200)
        .send({ success: true, message: "Journal updated successfully" });
    } else {
      res
        .status(200)
        .send({ success: false, message: "Journal does not exist" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteJournal = async (req, res) => {
  const journalId = req.params.id;

  try {
    // Check if the user is a teacher
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Forbidden. Only teachers can delete journals." });
    }

    const originalJournal = await Journal.findById(journalId);

    if (req.user.id !== originalJournal.created_by) {
      return res.status(403).json({ message: "Unauthorized Teacher" });
    }

    if (!originalJournal) {
      return res.status(404).json({ message: "Journal not found." });
    }

    // Implementation for deleting a journal
    const result = await Journal.deleteJournal(journalId);
    if (result) {
      res
        .status(200)
        .send({ success: true, message: "journal deleted successfully" });
    } else {
      res
        .status(200)
        .send({ success: false, message: "journal does not exist" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const publishJournal = async (req, res) => {
  const journalId = req.params.id;

  try {
    // Check if the user is a teacher
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Forbidden. Only teachers can publish journals." });
    }

    const originalJournal = await Journal.findById(journalId);

    if (req.user.id !== originalJournal.created_by) {
      return res.status(403).json({ message: "Unauthorized Teacher" });
    }

    if (!originalJournal) {
      return res.status(404).json({ message: "Journal not found." });
    }

    // Implementation for publishing a journal
    const rows = await Journal.publishJournal(journalId);

    if (rows)
      res
        .status(200)
        .send({ success: true, message: "published successfully" });
    else res.status(200).send({ success: false, message: "already published" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTeacherFeed = async (req, res) => {
  const createdBy = req.user.id;

  try {
    // Check if the user is a teacher
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Forbidden. Only teachers can access teacher feed." });
    }

    // Implementation for getting teacher's journal feed
    const rows = await Journal.getTeacherFeed(createdBy);
    if (rows) {
      res
        .status(200)
        .send({ success: true, message: "This is teacher's feed", data: rows });
    } else {
      res.status(200).send({ success: false, message: "No feed" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getStudentFeed = async (req, res) => {
  const studentId = req.user.id;

  try {
    // Check if the user is a student
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ message: "Forbidden. Only students can access student feed." });
    }

    // Implementation for getting student's journal feed
    const rows = await Journal.getStudentFeed(studentId);

    // Check if the journal entries exist
    if (rows && rows.length > 0) {
      // Map through the journal entries to add file information, if available
      const journalFeed = rows.map((journal) => {
        const { id, description, tagged_students, published_at } = journal;
        let attachment = null;

        if (journal.attachment_data && journal.attachment_type) {
          attachment = {
            type: journal.attachment_type,
            data: journal.attachment_data,
          };
        }

        return {
          id,
          description,
          tagged_students,
          published_at,
          attachment,
        };
      });

      res.status(200).json({
        success: true,
        message: "This is student's feed",
        data: journalFeed,
      });
    } else {
      res.status(200).json({ success: false, message: "No feed" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// students-list
const getStudentsList = async (req, res) => {
  try {
    // Check if the user is a teacher
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Forbidden. Only teachers can access teacher feed." });
    }

    // Implementation for getting teacher's journal feed
    const rows = await Journal.getStudentsList("student");
    if (rows) {
      res
        .status(200)
        .send({
          success: true,
          message: "This is the list of students",
          data: rows,
        });
    } else {
      res.status(200).send({ success: false, message: "error" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  upload,
  createJournal,
  updateJournal,
  deleteJournal,
  publishJournal,
  getTeacherFeed,
  getStudentFeed,
  getStudentsList,
};
