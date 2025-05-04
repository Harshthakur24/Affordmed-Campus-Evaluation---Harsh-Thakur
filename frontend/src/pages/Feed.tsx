import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Card,
    CardContent,
    CardHeader,
    Avatar,
    Box,
    CircularProgress,
} from '@mui/material';
import axios from 'axios';

interface Post {
    id: number;
    userid: string;
    content: string;
}

const Feed: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLatestPosts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/posts?type=latest');
                setPosts(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch latest posts');
                setLoading(false);
            }
        };

        fetchLatestPosts();

        // Set up polling for new posts every 30 seconds
        const interval = setInterval(fetchLatestPosts, 30000);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container>
                <Typography color="error" variant="h6">
                    {error}
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Latest Posts
            </Typography>
            {posts.map((post) => (
                <Card key={post.id} sx={{ mb: 3 }}>
                    <CardHeader
                        avatar={
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                                {post.userid.charAt(0)}
                            </Avatar>
                        }
                        title={`User ${post.userid}`}
                    />
                    <CardContent>
                        <Typography variant="body1">{post.content}</Typography>
                    </CardContent>
                </Card>
            ))}
        </Container>
    );
};

export default Feed; 