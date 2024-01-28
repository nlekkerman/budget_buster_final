const video = document.getElementById("camera");
let isCameraInitialized = false;

async function initializeCamera() {
    if (!isCameraInitialized) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' } // Use front camera initially
            });

            video.srcObject = stream;

            // Wait for the video to be loaded
            video.addEventListener('loadedmetadata', async () => {
                await video.play();
                isCameraInitialized = true;

                video.style.width = "100%";
                video.style.height = "150px";
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

// Export the 'initializeCamera' function
export { video, initializeCamera };