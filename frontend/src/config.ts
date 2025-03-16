const config = {
  apiBasePath: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000",
  allowedFileTypes: ['.mp3', '.wav'],
  maxNumberOfUploadFiles: 2,
  maxFilenameLength: 100
};

export default config;