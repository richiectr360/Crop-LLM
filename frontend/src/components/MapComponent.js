import {
  GoogleMap, Marker, LoadScript
} from '@react-google-maps/api';
import { Box } from '@mui/material';

const containerStyle = {
  width: '100%',
  height: '50vh'
};

function MapComponent({marker, setMarker }) {

  const onMapClick = e => {
    setMarker({ lat: e.latLng.lat(), lng: e.latLng.lng() });
  };

  return (
    <div>
      <Box display="flex">
        <LoadScript googleMapsApiKey="AIzaSyBdjnU1QgDY7R_uXuEfjf_NMjWTV2Hd-Hw">
          <Box className="map-container" flex={1}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={{ lat: 56.1304, lng: -106.3468 }}
              zoom={5}
              onClick={onMapClick}
            >
              {marker && <Marker position={marker} />}
            </GoogleMap>
          </Box>
        </LoadScript>
      </Box>
    </div>
  );
}

export default MapComponent;
