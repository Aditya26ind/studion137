const express = require('express');
const app = express();
const sql = require('./database');

// Define a route for the home page
app.get('/', (req, res) => {
    res.send('Hello, World! Welcome to your Node.js app!');
});

app.get('/work', async (req, res) => {
    try {
        const result = await sql`SELECT
        COUNT(CASE WHEN score = 1 THEN 1 END) AS "Employed",
        COUNT(CASE WHEN score = 2 THEN 1 END) AS "SAH_Parent",
        COUNT(CASE WHEN score = 3 THEN 1 END) AS "Retired",
        COUNT(CASE WHEN score = 4 THEN 1 END) AS "Student",
        COUNT(CASE WHEN score = 5 THEN 1 END) AS "Homemaker",
        COUNT(CASE WHEN score = 6 THEN 1 END) AS "Caregiver",
        COUNT(CASE WHEN score = 7 THEN 1 END) AS "Volunteer",
        COUNT(CASE WHEN score = 8 THEN 1 END) AS "Unemployed"
      FROM users_assessments_82_variables
      WHERE variable = 'work'`;  // Example query
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
    } catch (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Server error');
    }
  });
  

  app.get('/endowment', async (req, res) => {
    try {
      // Query to get the count of employment categories for each endowment category
      const result = await sql`
        WITH categorized_users AS (
          SELECT user_assessment_id, score
          FROM users_assessments_82_variables
          WHERE variable = 'endowment'
        )
        SELECT 
          cu.score AS category,
          COUNT(*) AS category_count,  -- Total count for the category
          COUNT(CASE WHEN ua.score = 1 THEN 1 END) AS "Employed",
          COUNT(CASE WHEN ua.score = 2 THEN 1 END) AS "SAH_Parent",
          COUNT(CASE WHEN ua.score = 3 THEN 1 END) AS "Retired",
          COUNT(CASE WHEN ua.score = 4 THEN 1 END) AS "Student",
          COUNT(CASE WHEN ua.score = 5 THEN 1 END) AS "Homemaker",
          COUNT(CASE WHEN ua.score = 6 THEN 1 END) AS "Caregiver",
          COUNT(CASE WHEN ua.score = 7 THEN 1 END) AS "Volunteer",
          COUNT(CASE WHEN ua.score = 8 THEN 1 END) AS "Unemployed"
        FROM categorized_users cu
        JOIN users_assessments_82_variables ua
        ON cu.user_assessment_id = ua.user_assessment_id
        WHERE ua.variable = 'work'
        GROUP BY cu.score;
      `;
  
      const formattedResult = {};

      result.forEach(row => {
        const categoryName = getCategoryName(row.category);  
  
        formattedResult[categoryName] = row.category_count;  
    
        formattedResult[`${categoryName}_breakdown`] = {
          "Employed": row.Employed,
          "SAH_Parent": row.SAH_Parent,
          "Retired": row.Retired,
          "Student": row.Student,
          "Homemaker": row.Homemaker,
          "Caregiver": row.Caregiver,
          "Volunteer": row.Volunteer,
          "Unemployed": row.Unemployed
        };
      });
  
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(formattedResult));
    } catch (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Server error');
    }
  });
  
  function getCategoryName(score) {
    switch (score) {
      case 0: return 'True';
      case 1: return 'Good';
      case 2: return 'Beautiful';
      case 3: return 'Prosperous';
      case 4: return 'Sustainable';
      case 5: return 'Just and well-ordered';
      default: return 'Unknown';
    }
  }

app.get('/location', async (req, res) => {
    try {
        const result = await sql`SELECT
        COUNT(CASE WHEN score = 1 THEN 1 END) AS "Workplace",
        COUNT(CASE WHEN score = 2 THEN 1 END) AS "Hybrid",
        COUNT(CASE WHEN score = 3 THEN 1 END) AS "Remote"
        FROM users_assessments_82_variables
        WHERE variable = 'location'`;  // Example query
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
    } catch (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Server error');
    }
  });
 
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});