const express = require('express');
const axios = require('axios');

const app = express();
const port = 8000;

// Replace this with your actual token
const AUTH_TOKEN = 'Bearer <your_token_here>';

// Test server base URL
const BASE_URL = 'http://20.244.56.144/test';

// Axios instance with headers
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: AUTH_TOKEN,
  },
});

// Fetch companies
const getCompanies = async () => {
  const response = await api.get('/companies');
  return response.data;
};

// Fetch users for a company
const getUsersByCompany = async (companyId) => {
  const response = await api.get(`/companies/${companyId}/users`);
  return response.data;
};

// Fetch posts by user
const getPostsByUser = async (userId) => {
  const response = await api.get(`/users/${userId}/posts`);
  return response.data;
};

// Fetch comments by post
const getCommentsByPost = async (postId) => {
  const response = await api.get(`/posts/${postId}/comments`);
  return response.data;
};

// Main route
app.get('/top-companies', async (req, res) => {
  try {
    const companies = await getCompanies();
    const companyStats = [];

    for (const company of companies) {
      const users = await getUsersByCompany(company.id);
      let totalComments = 0;
      let totalPosts = 0;

      // Fetch posts & comments for each user
      await Promise.all(users.map(async (user) => {
        const posts = await getPostsByUser(user.id);
        totalPosts += posts.length;

        const commentsCounts = await Promise.all(
          posts.map(async (post) => {
            const comments = await getCommentsByPost(post.id);
            return comments.length;
          })
        );

        totalComments += commentsCounts.reduce((acc, val) => acc + val, 0);
      }));

      const avgComments = totalPosts ? totalComments / totalPosts : 0;

      companyStats.push({
        companyId: company.id,
        companyName: company.name,
        avgCommentsPerPost: Number(avgComments.toFixed(2)),
      });
    }

    // Sort by average descending
    companyStats.sort((a, b) => b.avgCommentsPerPost - a.avgCommentsPerPost);

    res.json(companyStats);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
