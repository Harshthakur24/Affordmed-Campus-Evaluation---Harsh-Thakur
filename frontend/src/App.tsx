import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Navigation from './components/Navigation';
import TopUsers from './pages/TopUsers';
import TrendingPosts from './pages/TrendingPosts';
import Feed from './pages/Feed';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Navigation />
                <Container maxWidth="lg" sx={{ mt: 4 }}>
                    <Routes>
                        <Route path="/" element={<TopUsers />} />
                        <Route path="/trending" element={<TrendingPosts />} />
                        <Route path="/feed" element={<Feed />} />
                    </Routes>
                </Container>
            </Router>
        </ThemeProvider>
    );
};

export default App; 