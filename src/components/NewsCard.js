import React from 'react'; 
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


const NewsCard = ({article}) => {
    if(!article.title) return null;
  return (
    <Box className='news-card' sx={{width:'75%', pl: 3, pb:2}} >
        <Card variant='outlined'>
        <React.Fragment>
      <CardContent>
        <Typography  variant="h6" color="text.primary" gutterBottom>
        {article.title}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" href={article.url}>Read More</Button>
      </CardActions>
     </React.Fragment>
        </Card>
    </Box>
  );
};

export default NewsCard;