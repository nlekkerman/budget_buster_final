// Create the "Switch Camera" image element
const switchCameraImage = document.createElement("img");
switchCameraImage.src = "assets/images/switch-camera.png"; // Replace with the actual path to your switch camera image
switchCameraImage.alt = "Switch Camera";
switchCameraImage.style.width = '2em';
switchCameraImage.style.height = '2em';
switchCameraImage.style.cursor = 'pointer';
switchCameraImage.style.position = 'absolute';
switchCameraImage.style.top = '150px';
switchCameraImage.style.right = '10px';
switchCameraImage.style.border = '2px solid white';
switchCameraImage.style.zIndex = '10000000';
switchCameraImage.addEventListener("click", function () {
    // Log a message when the icon is clicked
    console.log("Switch Camera icon clicked");

    // Toggle between front and back cameras
    const video = document.getElementById("camera");

    const constraints = {
        video: { facingMode: (video.srcObject.getVideoTracks()[0].facingMode === 'user') ? 'environment' : 'user' }
    };

    // Reinitialize the camera with updated constraints
    initializeCamera(constraints);
});

// Append the switch camera image to the body
document.body.appendChild(switchCameraImage);
