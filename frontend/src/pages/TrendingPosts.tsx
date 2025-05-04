import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Card,
    CardContent,
    CardHeader,
    Avatar,
    Grid,
    Box,
    CircularProgress,
    Alert,
    Chip,
    Divider,
} from '@mui/material';
import { TrendingUp as TrendingUpIcon, Comment as CommentIcon } from '@mui/icons-material';

interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
    commentsCount: number;
}

const TrendingPosts: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTrendingPosts = async () => {
            try {
                const response = await fetch('http://localhost:5000/posts?type=popular');
                if (!response.ok) {
                    throw new Error('Failed to fetch trending posts');
                }
                const data = await response.json();
                setPosts(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchTrendingPosts();
    }, []);

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="60vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Trending Posts
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Most commented posts
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {posts.map((post) => (
                    <Grid item xs={12} key={post.id}>
                        <Card>
                            <CardHeader
                                avatar={
                                    <Avatar
                                        sx={{
                                            bgcolor: (theme) => theme.palette.primary.main,
                                            width: 40,
                                            height: 40,
                                        }}
                                    >
                                        {post.userId.toString().charAt(0)}
                                    </Avatar>
                                }
                                title={
                                    <Typography variant="h6" component="div">
                                        {post.title}
                                    </Typography>
                                }
                                subheader={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <TrendingUpIcon color="primary" fontSize="small" />
                                        <Typography variant="body2" color="text.secondary">
                                            Trending Post
                                        </Typography>
                                    </Box>
                                }
                            />
                            <Divider />
                            <CardContent>
                                <Typography variant="body1" paragraph>
                                    {post.body}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CommentIcon color="primary" fontSize="small" />
                                    <Typography variant="body2" color="text.secondary">
                                        {post.commentsCount} comments
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default TrendingPosts; 