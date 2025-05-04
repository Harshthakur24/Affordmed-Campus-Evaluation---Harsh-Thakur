require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Constants
const BEARER_TOKEN = process.env.BEARER_TOKEN || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ2MzQxNDM4LCJpYXQiOjE3NDYzNDExMzgsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjBiNzhjNzkzLTZjZmEtNGZjMi04YWNiLWRkY2RkYjNiYzcyZiIsInN1YiI6ImdhcmdtdWRpdDY2MkBnbWFpbC5jb20ifSwiZW1haWwiOiJnYXJnbXVkaXQ2NjJAZ21haWwuY29tIiwibmFtZSI6Im11ZGl0IGdhcmciLCJyb2xsTm8iOiIyazIyY3N1bjAxMTc5IiwiYWNjZXNzQ29kZSI6ImhGaEpobSIsImNsaWVudElEIjoiMGI3OGM3OTMtNmNmYS00ZmMyLThhY2ItZGRjZGRiM2JjNzJmIiwiY2xpZW50U2VjcmV0IjoiWERNdEdXQ0ZObW5jUHlXaiJ9.K8bxjS9ZmjBOpP72Br3jYRhFzZPVipCt-16yv47K4WI";
const API_URL = process.env.API_URL || 'http://20.244.56.144/evaluation-service';

// Middleware to verify Bearer token
const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (token && token.startsWith('Bearer ')) {
    if (token === `Bearer ${BEARER_TOKEN}`) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
  } else {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
};

// Cache for storing data
const cache = {
    users: new Map(),
    posts: new Map(),
    comments: new Map(),
    lastUpdated: new Map()
};

// Helper function to make API requests with retry logic
async function makeRequest(url, maxRetries = 3, retryDelay = 1000) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${BEARER_TOKEN}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'accessCode': 'hFhJhm'
                },
                timeout: 5000
            });
            return response.data;
        } catch (error) {
            lastError = error;
            console.error(`Attempt ${attempt} failed for ${url}:`, error.message);
            
            if (error.response) {
                if (error.response.status === 503) {
                    if (attempt < maxRetries) {
                        console.log(`Waiting ${retryDelay}ms before retry...`);
                        await new Promise(resolve => setTimeout(resolve, retryDelay));
                        continue;
                    }
                }
                throw error;
            }
            
            if (attempt < maxRetries) {
                console.log(`Waiting ${retryDelay}ms before retry...`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                continue;
            }
        }
    }
    
    throw lastError;
}

// Fetch all users from the social media API
const getUsers = async () => {
    try {
        const data = await makeRequest(`${API_URL}/users`);
        return data.users;
    } catch (error) {
        console.error('Error fetching users:', error.message);
        return {};
    }
};

// Fetch posts of a user from the social media API
const getPosts = async (userId) => {
    try {
        const data = await makeRequest(`${API_URL}/users/${userId}/posts`);
        return data.posts;
    } catch (error) {
        console.error(`Error fetching posts for user ${userId}:`, error.message);
        return [];
    }
};

// Fetch comments for a post
const getComments = async (postId) => {
    try {
        const data = await makeRequest(`${API_URL}/posts/${postId}/comments`);
        return data.comments;
    } catch (error) {
        console.error(`Error fetching comments for post ${postId}:`, error.message);
        return [];
    }
};

// Top Users Endpoint
app.get('/users', authenticate, async (req, res) => {
    try {
        const users = await getUsers();
        const userCommentCounts = {};

        // Count the comments for each user
        for (const userId in users) {
            try {
                const posts = await getPosts(userId);
                let totalComments = 0;

                for (const post of posts) {
                    try {
                        const comments = await getComments(post.id);
                        totalComments += comments.length;
                    } catch (error) {
                        console.error(`Error fetching comments for post ${post.id}:`, error.message);
                        continue;
                    }
                }

                userCommentCounts[userId] = {
                    name: users[userId],
                    commentCount: totalComments
                };
            } catch (error) {
                console.error(`Error processing user ${userId}:`, error.message);
                continue;
            }
        }

        // Sort users by comment count and get the top 5
        const topUsers = Object.entries(userCommentCounts)
            .sort(([, a], [, b]) => b.commentCount - a.commentCount)
            .slice(0, 5)
            .map(([userId, data]) => ({
                userId,
                name: data.name,
                commentCount: data.commentCount
            }));

        res.json(topUsers);
    } catch (error) {
        console.error('Error in /users endpoint:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.response ? error.response.data : error.message 
        });
    }
});

// Top/Latest Posts Endpoint
app.get('/posts', authenticate, async (req, res) => {
    const { type } = req.query;

    if (!['latest', 'popular'].includes(type)) {
        return res.status(400).json({ message: 'Invalid query parameter type. Use "latest" or "popular".' });
    }

    try {
        const postsData = [];
        const users = await getUsers();

        // Fetch all posts for each user
        for (const userId in users) {
            try {
                const posts = await getPosts(userId);
                for (const post of posts) {
                    try {
                        const comments = await getComments(post.id);
                        postsData.push({ ...post, commentsCount: comments.length });
                    } catch (error) {
                        console.error(`Error fetching comments for post ${post.id}:`, error.message);
                        continue;
                    }
                }
            } catch (error) {
                console.error(`Error fetching posts for user ${userId}:`, error.message);
                continue;
            }
        }

        if (type === 'popular') {
            // Get the post(s) with the maximum comments count
            const maxComments = Math.max(...postsData.map(p => p.commentsCount));
            const popularPosts = postsData.filter(p => p.commentsCount === maxComments);
            res.json(popularPosts);
        } else if (type === 'latest') {
            // Get the latest 5 posts (sorted by post ID)
            const latestPosts = postsData.sort((a, b) => b.id - a.id).slice(0, 5);
            res.json(latestPosts);
        }
    } catch (error) {
        console.error('Error in /posts endpoint:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.response ? error.response.data : error.message 
        });
    }
});

// Test endpoint to check API connection
app.get('/test', async (req, res) => {
    try {
        console.log('Testing API connection...');
        const response = await axios.get(`${API_URL}/users`, {
            headers: {
                'Authorization': `Bearer ${BEARER_TOKEN}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        console.log('Test API Response:', response.data);
        res.json({
            status: 'success',
            data: response.data
        });
    } catch (error) {
        console.error('Test API Error:', error.response ? error.response.data : error.message);
        res.status(500).json({
            status: 'error',
            error: error.response ? error.response.data : error.message
        });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 