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
    commentCount: number;
}

const TrendingPosts: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTrendingPosts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/posts?type=popular');
                setPosts(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch trending posts');
                setLoading(false);
            }
        };

        fetchTrendingPosts();
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
                Trending Posts
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
                        subheader={`${post.commentCount} comments`}
                    />
                    <CardContent>
                        <Typography variant="body1">{post.content}</Typography>
                    </CardContent>
                </Card>
            ))}
        </Container>
    );
};

export default TrendingPosts; 