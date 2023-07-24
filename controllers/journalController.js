const Journal = require("../models/Journal");

exports.createJournal = async (req, res) => {
  const { description, tagged_students, attachment_type, attachment_data,published_at } =
    req.body;
  const createdBy = req.user.id;

  try {
    // Check if the user is a teacher
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Forbidden. Only teachers can create journals." });
    }

    // Implementation for creating a journal
    const newJournalEntry = await Journal.createJournal(
      description,
      tagged_students,
      attachment_type,
      attachment_data,
      published_at,
      createdBy
    );

    // Check if the newJournalEntry is not null (i.e., journal entry created successfully)
    if (newJournalEntry) {
      res.status(201).json({
        message: "Journal entry created successfully",
        journal: newJournalEntry,
      });
    } else {
      res.status(500).json({ message: "Failed to create journal entry" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateJournal = async (req, res) => {
  const journalId = req.params.id;
  const {
    description,
    tagged_students,
    attachment_type,
    attachment_data,
    publishedAt,
  } = req.body;
  const createdBy = req.user.id;

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

    // Check and update the fields that have non-null values in the request body
    const updatedFields = {
      description:
        description !== undefined ? description : originalJournal.description,
      tagged_students:
        tagged_students !== undefined
          ? tagged_students
          : originalJournal.tagged_students,
      attachment_type:
        attachment_type !== undefined
          ? attachment_type
          : originalJournal.attachment_type,
      attachment_data:
        attachment_data !== undefined
          ? attachment_data
          : originalJournal.attachment_data,
      publishedAt:
        publishedAt !== undefined ? publishedAt : originalJournal.publishedAt,
      createdBy:
        createdBy !== undefined ? createdBy : originalJournal.createdBy,
    };

    // Perform the update operation
    const rows = await Journal.updateJournal(journalId, updatedFields);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteJournal = async (req, res) => {
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
    console.log(result);
    if (result) {
      res.status(200).send({ message: "journal deleted successfully" });
    } else {
      res.status(200).send({ message: "journal does not exist" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.publishJournal = async (req, res) => {
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
    if (rows) res.status(200).json({ message: "published successfully" });
    else res.status(200).json({ message: "already published" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getTeacherFeed = async (req, res) => {
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
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStudentFeed = async (req, res) => {
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
    res.json(rows);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
