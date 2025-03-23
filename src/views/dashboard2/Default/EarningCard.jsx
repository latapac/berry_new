import PropTypes from 'prop-types';
import React from 'react';


// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

export default function EarningCard({ isLoading, data }) {

  const [anchorEl, setAnchorEl] = React.useState(null);


  return (
    <>
      {isLoading ? (
        <SkeletonEarningCard />
      ) : (
        <MainCard
          border={false}
          content={false}
          aria-hidden={Boolean(anchorEl)}
          sx={{
            bgcolor: 'secondary.dark',
            color: '#fff',
            overflow: 'hidden',
            position: 'relative',
           
          }}
        >
         
        </MainCard>
      )}
    </>
  );
}

EarningCard.propTypes = { isLoading: PropTypes.bool };
