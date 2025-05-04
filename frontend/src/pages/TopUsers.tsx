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
} from '@mui/material';
import { TrendingUp as TrendingUpIcon } from '@mui/icons-material';

interface User {
    userId: number;
    name: string;
    commentCount: number;
}

const TopUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTopUsers = async () => {
            try {
                const response = await fetch('http://localhost:5000/users');
                if (!response.ok) {
                    throw new Error('Failed to fetch top users');
                }
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchTopUsers();
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
                    Top Users
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Users with the most commented posts
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {users.map((user, index) => (
                    <Grid item xs={12} sm={6} md={4} key={user.userId}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                            }}
                        >
                            <CardHeader
                                avatar={
                                    <Avatar
                                        sx={{
                                            bgcolor: (theme) => theme.palette.primary.main,
                                            width: 56,
                                            height: 56,
                                            fontSize: '1.5rem',
                                        }}
                                    >
                                        {user.name.charAt(0).toUpperCase()}
                                    </Avatar>
                                }
                                title={
                                    <Typography variant="h6" component="div">
                                        {user.name}
                                    </Typography>
                                }
                                subheader={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <TrendingUpIcon color="primary" />
                                        <Typography variant="body2" color="text.secondary">
                                            {user.commentCount} comments
                                        </Typography>
                                    </Box>
                                }
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                    <Chip
                                        label={`Rank #${index + 1}`}
                                        color="primary"
                                        variant="outlined"
                                        sx={{ fontWeight: 600 }}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default TopUsers; 