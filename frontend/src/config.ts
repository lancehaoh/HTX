const config = {
  apiBasePath: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000",
  allowedFileTypes: ['.mp3', '.wav'],
  maxNumberOfUploadFiles: 3,
  maxFilenameLength: 100,
  maxAudioDuration: 30,
};

export default config;