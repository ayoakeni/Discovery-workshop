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
  // Error message
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
      canvas.width = 480; // Set the canvas size to match the template size
      canvas.height = 620;

      // Draw the template image
      const templateImg = new Image();
      templateImg.onload = function () {
        // Draw the user image on behind of the template
        ctx.drawImage(img, 106, 158, 305, 306); // Adjust position and size as needed
        ctx.drawImage(templateImg, 0, 0, 480, 620);

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
      templateImg.src = 'image/sampart.png'; // Path to your template image
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
});