const video = document.getElementById("camera");
let isCameraInitialized = false;

async function initializeCamera() {
    if (!isCameraInitialized) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            await video.play(); // Add this line to ensure the video starts playing
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
        } catch (error) {
            console.error("Error accessing camera:", error);
        }
    }
}

export { video, initializeCamera };
