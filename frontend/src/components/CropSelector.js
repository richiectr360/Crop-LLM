import React from 'react';
import { Box, Select, MenuItem, Typography } from '@mui/material';

function CropSelector({ crop, handleCropChange, disabled }) {
    return (
      <Box className="controls-container">
        <Typography variant="p" className="crop-type-text">Crop Type:</Typography>
        <Select
          fullWidth
          value={crop}
          onChange={handleCropChange}
          variant="outlined"
          className="crop-select"
          disabled={disabled} // use the prop here
        >
          <MenuItem value="barley">Barley</MenuItem>
          <MenuItem value="corn">Corn</MenuItem>
          <MenuItem value="canola">Canola</MenuItem>
          <MenuItem value="durum_wheat">Durum Wheat</MenuItem>
          <MenuItem value="fall_rye">Fall Rye</MenuItem>
          <MenuItem value="flaxseed">Flaxseed</MenuItem>
          <MenuItem value="lentils">Lentils</MenuItem>
          <MenuItem value="mustard">Mustard</MenuItem>
          <MenuItem value="oats">Oats</MenuItem>
          <MenuItem value="peas">Peas</MenuItem>
          <MenuItem value="soybeans">Soybeans</MenuItem>
          <MenuItem value="spring_wheat">Spring Wheat</MenuItem>
          <MenuItem value="winter_wheat">Winter Wheat</MenuItem>
        </Select>
      </Box>
    );
}

export default CropSelector;
