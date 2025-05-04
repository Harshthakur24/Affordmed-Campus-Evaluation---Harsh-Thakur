import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import Feed from './pages/Feed';
import TrendingPosts from './pages/TrendingPosts';
import TopUsers from './pages/TopUsers';

// Create a modern theme
const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 500,
        },
        h2: {
            fontWeight: 500,
        },
        h3: {
            fontWeight: 500,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 500,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                    },
                },
            },
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Box sx={{ flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                    <AppBar position="static" elevation={1}>
                        <Container maxWidth="lg">
                            <Toolbar disableGutters>
                                <Typography
                                    variant="h6"
                                    component={Link}
                                    to="/"
                                    sx={{
                                        flexGrow: 1,
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        fontWeight: 600,
                                    }}
                                >
                                    Social Analytics
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Button
                                        component={Link}
                                        to="/"
                                        color="inherit"
                                        sx={{ fontWeight: 500 }}
                                    >
                                        Feed
                                    </Button>
                                    <Button
                                        component={Link}
                                        to="/trending"
                                        color="inherit"
                                        sx={{ fontWeight: 500 }}
                                    >
                                        Trending
                                    </Button>
                                    <Button
                                        component={Link}
                                        to="/top-users"
                                        color="inherit"
                                        sx={{ fontWeight: 500 }}
                                    >
                                        Top Users
                                    </Button>
                                </Box>
                            </Toolbar>
                        </Container>
                    </AppBar>

                    <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
                        <Routes>
                            <Route path="/" element={<Feed />} />
                            <Route path="/trending" element={<TrendingPosts />} />
                            <Route path="/top-users" element={<TopUsers />} />
                        </Routes>
                    </Container>

                    <Box
                        component="footer"
                        sx={{
                            py: 3,
                            px: 2,
                            mt: 'auto',
                            backgroundColor: (theme) => theme.palette.grey[100],
                        }}
                    >
                        <Container maxWidth="lg">
                            <Typography variant="body2" color="text.secondary" align="center">
                                © {new Date().getFullYear()} Social Analytics Dashboard
                            </Typography>
                        </Container>
                    </Box>
                </Box>
            </Router>
        </ThemeProvider>
    );
}

export default App; 