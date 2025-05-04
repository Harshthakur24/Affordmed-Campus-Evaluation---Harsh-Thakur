import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FeedIcon from '@mui/icons-material/Feed';

const Navigation: React.FC = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Social Media Analytics
                </Typography>
                <Box>
                    <Button
                        color="inherit"
                        component={RouterLink}
                        to="/"
                        startIcon={<PeopleIcon />}
                    >
                        Top Users
                    </Button>
                    <Button
                        color="inherit"
                        component={RouterLink}
                        to="/trending"
                        startIcon={<TrendingUpIcon />}
                    >
                        Trending Posts
                    </Button>
                    <Button
                        color="inherit"
                        component={RouterLink}
                        to="/feed"
                        startIcon={<FeedIcon />}
                    >
                        Feed
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navigation; 