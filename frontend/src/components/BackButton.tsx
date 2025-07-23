import { useNavigate } from 'react-router-dom';
import { IconButton, styled } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(2),
  marginBottom: theme.spacing(2),
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '50%',
  boxShadow: theme.shadows[1],
  transition: 'all 0.3s ease',
  zIndex: theme.zIndex.appBar - 1, 
  
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    boxShadow: theme.shadows[3],
    transform: 'scale(1.1)',
  },
  
  [theme.breakpoints.down('lg')]: { 
    position: 'relative',
    top: 'auto',
    left: 'auto',
    display: 'inline-flex',
    margin: theme.spacing(1, 1, 2, 0),
    alignSelf: 'flex-start',
  }
}));

const BackButton = () => {
  const navigate = useNavigate();
  
  return (
    <StyledIconButton 
      onClick={() => navigate(-1)}
      color="inherit"
      aria-label="go back"
      sx={{
        '& svg': {
          color: theme => theme.palette.text.primary,
        }
      }}
    >
      <ArrowBackIcon />
    </StyledIconButton>
  );
};

export default BackButton;