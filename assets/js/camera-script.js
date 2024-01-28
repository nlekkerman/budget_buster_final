const video = document.getElementById("camera");
let isCameraInitialized = false;

async function initializeCamera() {
    if (!isCameraInitialized) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;

            // Wait for the video to be loaded
            video.addEventListener('loadedmetadata', async () => {
                await video.play();
                isCameraInitialized = true;

                video.style.width = "100%";
                video.style.height = "100%";
                video.style.display = "block";
                video.style.border = "2px solid #ccc";
                video.style.borderRadius = "5px";
                video.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
                video.style.color = "white";
                video.style.margin = "0";
                video.style.padding = "0";
                video.style.marginTop = "50px";
            });
        } catch (error) {
            console.error("Error accessing camera:", error);
        }
    }
}


// Check for camera support and request permission
if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
    navigator.permissions.query({ name: 'camera' })
        .then(permissionStatus => {
            if (permissionStatus.state === 'granted') {
                // Permission already granted, initialize the camera
                initializeCamera();
            } else {
                // Request permission from the user
                permissionStatus.addEventListener('change', () => {
                    if (permissionStatus.state === 'granted') {
                        initializeCamera();
                    }
                });
                navigator.mediaDevices.getUserMedia({ video: true });
            }
        })
        .catch(error => {
            console.error("Error checking camera permission:", error);
        });
} else {
    console.error("Camera not supported on this device.");
}

export { video, initializeCamera };
