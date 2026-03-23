const db = require('../db');

class Comment {

  // 1️⃣ Add a Comment
  static async create({ user_id, resource_id, text }) {

    const sql = `
      INSERT INTO comments (user_id, resource_id, text)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const { rows } = await db.query(sql, [
      user_id,
      resource_id,
      text
    ]);

    return rows[0];
  }


  // 2️⃣ Get Comments for a specific Resource
  static async findByResourceId(resource_id) {

    const sql = `
      SELECT
        comments.id,
        comments.text,
        comments.created_at,
        users.name AS user_name
      FROM comments
      JOIN users
        ON comments.user_id = users.id
      WHERE comments.resource_id = $1
      ORDER BY comments.created_at DESC;
    `;

    const { rows } = await db.query(sql, [resource_id]);

    return rows;
  }

  // Add this inside class Comment

  // 3️⃣ Get All Recent Comments (For the Live Feed)
  static async findRecent() {
    const sql = `
      SELECT 
        comments.id, 
        comments.text, 
        comments.created_at, 
        comments.resource_id,
        users.name AS user_name,
        resources.name AS resource_name
      FROM comments
      JOIN users ON comments.user_id = users.id
      JOIN resources ON comments.resource_id = resources.id
      ORDER BY comments.created_at DESC
      LIMIT 50;
    `;
    const { rows } = await db.query(sql);
    return rows;
  }

}

module.exports = Comment;