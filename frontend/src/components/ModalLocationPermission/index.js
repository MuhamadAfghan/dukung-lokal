import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ModalLocationPermission = () => {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      setLocation("Geolocation is not supported by this browser.");
    }
  };

  const showPosition = (position) => {
    setLocation(
      `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`
    );
    handleClose();
  };

  const showError = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setLocation("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        setLocation("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        setLocation("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        setLocation("An unknown error occurred.");
        break;
      default:
        setLocation("An unknown error occurred.");
    }
    handleClose();
  };

  return (
    <div>
      <button onClick={handleOpen}>Try It</button>
      <p id="demo">{location}</p>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Location Permission</DialogTitle>
        <DialogContent>
          <p>We need your permission to access your location.</p>
        </DialogContent>
        <div>
          <Button onClick={getLocation}>Allow</Button>
          <Button onClick={handleClose}>Deny</Button>
        </div>
      </Dialog>
    </div>
  );
};

export default ModalLocationPermission;
