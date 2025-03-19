import { useState, useEffect } from "react";
import { Container, Alert } from "react-bootstrap";
import axios from "axios";
import Transcription from "./model/Transcription";
import config from "./config";
import 'bootstrap/dist/css/bootstrap.min.css';
import TranscriptionsSearch from "./components/TranscriptionsSearch";
import TranscriptionList from "./components/TranscriptionsList";
import TranscriptionsUpload from "./components/TranscriptionsUpload";

export default function AudioTranscriptionApp() {
    const [textToSearch, setTextToSearch] = useState("");
    const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
    const [serverError, setServerError] = useState<string | null>(null);

    // If server is working, get the transcriptions from the backend, else show an error
    useEffect(() => {
        const checkServerHealth = async () => {
            try {
                const response = await axios.get(`${config.apiBasePath}/health`);
                if (response.status !== 200) {
                    setServerError("Caution: Server is not working as expected. This app might not function properly.");
                }
            } catch (error) {
                setServerError("Caution: Server is not working as expected. This app might not function properly.");
            }
        };
        checkServerHealth();
        fetchTranscriptions();
    }, []);

    const fetchTranscriptions = async () => {
        try {
            const response = await axios.get(`${config.apiBasePath}/transcriptions`);
            setTranscriptions(response.data);
        } catch (error) {
            console.error("Error fetching transcriptions", error);
        }
    };

    return (
        <Container className="p-4">
            {serverError && (
                <Alert variant="danger" className="mt-3">
                    {serverError}
                </Alert>
            )}
            <TranscriptionsUpload transcriptions={transcriptions} setTranscriptions={setTranscriptions} />
            <TranscriptionsSearch setTextToSearch={setTextToSearch} textToSearch={textToSearch} />
            <TranscriptionList transcriptions={transcriptions} header="All Transcriptions" useBorder={true} />
        </Container>
    );
}