import express, { query } from "express";
const router = express.Router();
import { sql } from "../db.js";

router.get("/", function (req, res) {
  res.render("index", { locals: { title: "Welcome!" } });
});

router.get("/years", async (req, res) => {
  try {
    const years = await sql`SELECT DISTINCT(year) FROM recap ORDER BY Year;`;
    console.log(years);
    res.status(200).json(years);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/semesters", async (req, res) => {
  try {
    const semesters =
      await sql`SELECT DISTINCT(Semester) FROM recap ORDER BY Semester;`;
    console.log(semesters);
    res.status(200).json(semesters);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get(`/batch/:year/:semester`, async (req, res) => {
  try {
    const { year, semester } = req.params;
    let batches =
      await sql`SELECT DISTINCT(Class) FROM recap WHERE Year = ${year} AND Semester = ${semester} ORDER BY Class;`;
    batches = batches.sort((a, b) => a.class.length - b.class.length);
    console.log(batches);
    res.status(200).json(batches);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get(`/batch/:year/:semester/:batch`, async (req, res) => {
  try {
    const { year, semester, batch } = req.params;
    const recaps =
      await sql`SELECT r.*, c.title FROM recap r, course c WHERE r.cid = c.cid AND Year = ${year} AND Semester = ${semester} AND Class = ${batch};`;
    console.log(recaps);
    res.status(200).json(recaps);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/recap/:rid", async (req, res) => {
  try {
    const { rid } = req.params;

    const query = await sql`
        WITH student_totals AS (
          SELECT
            s.regno,
            s.name,
            r.cid,
            SUM(m.marks) AS total_marks
          FROM student s
          JOIN marks m ON s.regno = m.regno
          JOIN recap r ON m.rid = r.rid
          WHERE r.rid = ${rid}
          GROUP BY s.regno, s.name, r.cid
        ),
        student_grades AS (
          SELECT
            st.regno,
            st.name,
            st.cid,
            st.total_marks,
            g.grade,
            g.gpa
          FROM student_totals st
          JOIN grade g ON st.total_marks BETWEEN g.start AND g."end"
        ),
        stats AS (
          SELECT
            COUNT(*) AS total_students,
            COUNT(*) FILTER (WHERE gpa = 0) AS failed_students
          FROM student_grades
        ),
        final_result AS (
          SELECT
            sg.*,
            stats.total_students,
            stats.failed_students,
            ROUND(100.0 * stats.failed_students::decimal / stats.total_students, 2) AS failure_percentage
          FROM student_grades sg, stats
        )
        SELECT * FROM final_result
        ORDER BY gpa ASC, regno;
      `;

    res.status(200).json(query);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router;
