const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Constants
const BASE_URL = 'http://20.244.56.144/evaluation-service';

// Cache for storing user and post data
let userCache = new Map();
let postCache = new Map();
let commentCache = new Map();

// Helper function to fetch users
async function fetchUsers() {
    try {
        const response = await axios.get(`${BASE_URL}/users`);
        return response.data.users;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

// Helper function to fetch posts for a user
async function fetchUserPosts(userId) {
    try {
        const response = await axios.get(`${BASE_URL}/users/${userId}/posts`);
        return response.data.posts;
    } catch (error) {
        console.error(`Error fetching posts for user ${userId}:`, error);
        throw error;
    }
}

// Helper function to fetch comments for a post
async function fetchPostComments(postId) {
    try {
        const response = await axios.get(`${BASE_URL}/posts/${postId}/comments`);
        return response.data.comments;
    } catch (error) {
        console.error(`Error fetching comments for post ${postId}:`, error);
        throw error;
    }
}

// API Endpoint: Get top users with most commented posts
app.get('/users', async (req, res) => {
    try {
        const users = await fetchUsers();
        const userCommentCounts = new Map();

        // Fetch posts and comments for each user
        for (const [userId, userName] of Object.entries(users)) {
            const posts = await fetchUserPosts(userId);
            let totalComments = 0;

            for (const post of posts) {
                const comments = await fetchPostComments(post.id);
                totalComments += comments.length;
            }

            userCommentCounts.set(userId, {
                name: userName,
                commentCount: totalComments
            });
        }

        // Sort users by comment count and get top 5
        const topUsers = Array.from(userCommentCounts.entries())
            .sort((a, b) => b[1].commentCount - a[1].commentCount)
            .slice(0, 5)
            .map(([userId, data]) => ({
                userId,
                name: data.name,
                commentCount: data.commentCount
            }));

        res.json(topUsers);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API Endpoint: Get top/latest posts
app.get('/posts', async (req, res) => {
    try {
        const { type } = req.query;
        const users = await fetchUsers();
        let allPosts = [];

        // Fetch all posts from all users
        for (const userId of Object.keys(users)) {
            const posts = await fetchUserPosts(userId);
            allPosts = allPosts.concat(posts);
        }

        if (type === 'popular') {
            // Get comment counts for all posts
            const postCommentCounts = new Map();
            for (const post of allPosts) {
                const comments = await fetchPostComments(post.id);
                postCommentCounts.set(post.id, {
                    ...post,
                    commentCount: comments.length
                });
            }

            // Find posts with maximum comments
            const maxComments = Math.max(...Array.from(postCommentCounts.values()).map(p => p.commentCount));
            const popularPosts = Array.from(postCommentCounts.values())
                .filter(post => post.commentCount === maxComments);

            res.json(popularPosts);
        } else if (type === 'latest') {
            // Sort posts by ID (assuming higher IDs are newer)
            const latestPosts = allPosts
                .sort((a, b) => b.id - a.id)
                .slice(0, 5);

            res.json(latestPosts);
        } else {
            res.status(400).json({ error: 'Invalid type parameter' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 