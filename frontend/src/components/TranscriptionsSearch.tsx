import { Button, Form, Row, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import config from "../config";
import { useState } from "react";
import Transcription from "../model/Transcription";
import TranscriptionList from "./TranscriptionsList";

interface SearchTranscriptionsProps {
    setTextToSearch: (text: string) => void;
    textToSearch: string;
}

export default function TranscriptionsSearch({
                                                 setTextToSearch,
                                                 textToSearch,
                                             }: SearchTranscriptionsProps) {
    const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    const searchTranscriptions = async () => {
        setIsSearching(true);
        setSearchError(null); // Reset error state on new search
        try {
            const response = await axios.get(
                `${config.apiBasePath}/search?query=${textToSearch.trim()}`
            );
            if(response.data.length === 0){
                setSearchError("No transcriptions found.");
            }
            setTranscriptions(response.data);
        } catch (error) {
            console.error("Error fetching transcriptions", error);
            setSearchError("Error fetching transcriptions.");
            setTranscriptions([]); // Clear previous results
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="border border-secondary p-3 mb-4">
            <Row>
                <h2 className="mt-4">Search Transcriptions</h2>
                <Form.Control
                    type="text"
                    placeholder="Search by transcription text"
                    value={textToSearch}
                        onChange={(e) => setTextToSearch(e.target.value)}
                />
                <Button
                    variant="primary"
                    className="mt-2"
                    onClick={searchTranscriptions}
                    disabled={isSearching || !textToSearch.trim()}
                >
                    Search
                    {isSearching && (
                        <Spinner animation="border" size="sm" className="ms-2" />
                    )}
                </Button>
                {searchError && (
                    <Alert variant="danger" className="mt-3">
                        {searchError}
                    </Alert>
                )}
            </Row>
            <TranscriptionList
                transcriptions={transcriptions}
                header=""
                subheader="Search Results"
                useBorder={false}
            />
        </div>
    );
}