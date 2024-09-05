const imageInput = document.getElementById('imageInput');
const fileElement = document.querySelector('.custom-file-input');
const processButton = document.getElementById('processButton');
const previewBox = document.getElementById('previewBox');
const errorImage = document.getElementById('error-image');
const downloadButton = document.getElementById('downloadButton');

imageInput.addEventListener('change', () => {
  const file = imageInput.files[0];
  if (file) {
    fileElement.textContent = `${file.name}`; // Set the file name
  } else {
    fileElement.textContent = 'Choose Image'; // Reset the label text if no file is selected
  }
  errorImage.textContent = ''; // Clear any previous error messages
});

processButton.addEventListener('click', () => {
  const file = imageInput.files[0];

  if (!file) {
    errorImage.textContent = 'Please choose an image';
    return;
  } else {
    errorImage.textContent = ''; // Clear any previous error messages
    previewBox.style.display = 'block'; // Show the preview box
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Set the canvas size to match the template size
      canvas.width = 1080;
      canvas.height = 1080;

      // Draw the template image first
      const templateImg = new Image();
      templateImg.onload = function () {
        // Draw the template image first
        ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);

        // Dynamically calculate the scaling factor for the user image
        const imgAspectRatio = img.width / img.height;
        const targetWidth = 590;
        const targetHeight = 490;

        // Scale the image to fit within the specified area (targetWidth x targetHeight)
        let drawWidth, drawHeight;
        if (imgAspectRatio > 1) {
          // Image is wider than tall (landscape)
          drawWidth = targetWidth;
          drawHeight = targetWidth / imgAspectRatio;
        } else {
          // Image is taller than wide (portrait)
          drawHeight = targetHeight;
          drawWidth = targetHeight * imgAspectRatio;
        }

        const xPosition = -87 + (targetWidth - drawWidth) / 2; // Center the image horizontally
        const yPosition = 410 + (targetHeight - drawHeight) / 2; // Center the image vertically

        // Draw the user image on top of the template (scaled)
        ctx.drawImage(img, xPosition, yPosition, drawWidth, drawHeight);

        // Convert the canvas content to an image URL
        const imageURL = canvas.toDataURL('image/png');

        // Update the preview with the modified canvas
        const previewImage = document.createElement('img');
        previewImage.src = imageURL;
        previewImage.classList.add('preview-image');
        document.getElementById('imageContainer').innerHTML = '';
        document.getElementById('imageContainer').appendChild(previewImage);

        // Show the download button
        downloadButton.style.display = 'inline';
        downloadButton.onclick = function () {
          const link = document.createElement('a');
          link.href = imageURL;
          link.download = 'template.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };
      };

      templateImg.src = 'image/temp.jpg'; // Path to your template image
    };

    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
});