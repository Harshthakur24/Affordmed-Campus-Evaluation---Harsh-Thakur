import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import TopUsers from './pages/TopUsers';
import TrendingPosts from './pages/TrendingPosts';
import Feed from './pages/Feed';
import Navigation from './components/Navigation';

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

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Navigation />
                <Routes>
                    <Route path="/" element={<TopUsers />} />
                    <Route path="/trending" element={<TrendingPosts />} />
                    <Route path="/feed" element={<Feed />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App; 