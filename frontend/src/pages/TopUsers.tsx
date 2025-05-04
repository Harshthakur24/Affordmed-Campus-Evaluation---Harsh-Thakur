import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    Avatar,
    Box,
    CircularProgress,
} from '@mui/material';
import axios from 'axios';

interface User {
    userId: string;
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
                const response = await axios.get('http://localhost:5000/users');
                setUsers(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch top users');
                setLoading(false);
            }
        };

        fetchTopUsers();
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
                Top Users
            </Typography>
            <Grid container spacing={3}>
                {users.map((user) => (
                    <Grid key={user.userId} xs={12} sm={6} md={4}>
                        <Card>
                            <CardContent>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <Avatar
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            bgcolor: 'primary.main',
                                            mr: 2,
                                        }}
                                    >
                                        {user.name.charAt(0)}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6">{user.name}</Typography>
                                        <Typography color="textSecondary">
                                            Comments: {user.commentCount}
                                        </Typography>
                                    </Box>
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