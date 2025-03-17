import {Alert, Button, Form, Row, Spinner, Table} from "react-bootstrap";
import config from "../config";
import { useState } from "react";
import axios from "axios";
import Transcription from "../model/Transcription";

interface FileStatus {
    file: File;
    status: 'pending' | 'success' | 'failed';
}

interface TranscriptionsUploadProps {
    transcriptions: Transcription[];
    setTranscriptions: (transcriptions: Transcription[]) => void
}

export default function TranscriptionsUpload({ transcriptions, setTranscriptions }: TranscriptionsUploadProps) {
    const [error, setError] = useState("");
    const [fileStatuses, setFileStatuses] = useState<FileStatus[]>([]);
    const [isUploading, setIsUploading] = useState(false); // State to track upload status
    const [files, setFiles] = useState<File[]>([]);

    const fetchTranscriptions = async () => {
        try {
            const response = await axios.get(`${config.apiBasePath}/transcriptions`);
            setTranscriptions(response.data);
        } catch (error) {
            console.error("Error fetching transcriptions", error);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        setError("");

        if(selectedFiles.length > config.maxNumberOfUploadFiles) {
            setError(`Only ${config.maxNumberOfUploadFiles} files are allowed.`);
            return;
        }

        const validFiles = selectedFiles.filter((file) => validateFile(file));
        setFiles(validFiles);
        setFileStatuses(prevStatuses => {
            return validFiles.map(file => ({ file, status: 'pending' }))
        });
    };

    const validateFile = (file: File) => {
        if (!config.allowedFileTypes.some((type) => file.name.endsWith(type))) {
            setError(
                `Only ${config.allowedFileTypes.join(", ")} files are allowed.`
            );
            return false;
        }
        if (file.name.length > 100) {
            setError("Filename cannot exceed 100 characters.");
            return false;
        }
        if (transcriptions.map(transcription => transcription.filename).includes(file.name)) {
            setError(`At least one file has already been processed before.`);
            return false;
        }
        return true;
    };

    const handleUpload = async () => {
        setError("");
        if (files.length === 0) {
            setError("No valid files selected.");
            return;
        }
        setIsUploading(true); // Start uploading
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));

        setFileStatuses(prevStatuses => prevStatuses.map(status => ({ ...status, status: 'pending' })));

        try {
            await axios.post(`${config.apiBasePath}/transcribe`,
                formData,
                {
                    headers: {"Content-Type": `multipart/form-data`},
                }).then(response => {
                    const successfullyProcessedFilenames = response.data["transcriptions"].map((item: Transcription) => item.filename);
                    setFileStatuses(prevStatuses => prevStatuses
                        .map(status => ({ ...status, status: successfullyProcessedFilenames.includes(status.file.name) ? 'success' : 'failed' })));
                    fetchTranscriptions();
                    setFiles([]);
            });
        } catch (error) {
            console.error("Error uploading files", error);
            setError("Error uploading files");
            setFileStatuses(prevStatuses => prevStatuses.map(status => ({ ...status, status: 'failed' })));
        } finally {
            setIsUploading(false); // Stop uploading
        }
    };

    const renderFileStatus = (status: 'pending' | 'success' | 'failed') => {
        switch (status) {
            case 'pending':
                return isUploading ? <Spinner animation="border" size="sm" role="status" /> : "Click upload to begin"
            case 'success':
                return <span style={{ color: 'green' }}>&#10004;</span>;
            case 'failed':
                return <span style={{ color: 'red' }}>&#10006;</span>;
            default:
                return null;
        }
    };

    return (<div className="border border-secondary p-3 mb-4"> {/* Changed border-light to border-secondary */}
        <Row>
            <h1 className="mb-4">Audio Transcription</h1>
            <Form.Group controlId="fileUpload">
                <Form.Label>Upload Audio Files (Max number of files: {config.maxNumberOfUploadFiles})</Form.Label><br/>
                <Form.Label>Allowed file types: {config.allowedFileTypes.join(", ")}</Form.Label><br/>
                <Form.Label>Max length of file name: {config.maxFilenameLength} characters</Form.Label><br/>
                <Form.Label>If a file with the same name has been processed before, it will be rejected.</Form.Label>
                <Form.Control
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    accept={config.allowedFileTypes.join(", ")}
                />
            </Form.Group>
            {error && (
                <Alert variant="danger" className="mt-2">
                    {error}
                </Alert>
            )}
            <div className="mt-2">
                <Button variant="primary" onClick={handleUpload} disabled={isUploading}>
                    Upload
                    {isUploading && <Spinner animation="border" size="sm" className="ms-2"/>} {/*Add a spinner when is uploading */}
                </Button>
            </div>
            <h6 className="mt-3">Upload Queue</h6> {/* Added label for the table */}
            <Table striped bordered hover responsive className="mt-3" data-testid="fileUploadQueue">
                <thead>
                <tr>
                    <th>File Name</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {fileStatuses.map((fileStatus, index) => (
                    <tr key={index}>
                        <td>{fileStatus.file.name}</td>
                        <td>{renderFileStatus(fileStatus.status)}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Row>
    </div>);
}