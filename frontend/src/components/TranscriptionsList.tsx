import {Col, Pagination, Row, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import Transcription from "../model/Transcription";
import classNames from "classnames";

interface TranscriptionListProps {
    transcriptions: Transcription[];
    header: string;
    subheader?: string;
    useBorder: boolean;
}

export default function TranscriptionList({transcriptions, header, useBorder, subheader=""}: TranscriptionListProps) {
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const [itemsPerPage] = useState(10);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTranscriptions = transcriptions.slice(
        indexOfFirstItem,
        indexOfLastItem
    );
    const totalPages = Math.ceil(transcriptions.length / itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [transcriptions]);

    return (<div className={classNames({ "border": useBorder }, { "border-secondary": useBorder }, "p-3", "mb-4" )}>
        <Row className="mt-2">
            <h2 className="mt-4">{header}</h2>
            <h4 className="mt-4">{subheader}</h4>
            <Table striped bordered hover responsive variant="light">
                <thead className="table-primary"> {/* Added table-primary */}
                <tr>
                    <th>Filename</th>
                    <th>Transcription</th>
                </tr>
                </thead>
                <tbody>
                {currentTranscriptions.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? "table-light" : "table-secondary"}>
                        <td>{item.filename}</td>
                        <td>{item.transcription}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Row>
        <Row className="mt-3">
            <Col>
                <Pagination className="justify-content-center">
                    {currentPage > 1 && (
                        <Pagination.Prev
                            onClick={() => handlePageChange(currentPage - 1)}
                        />
                    )}
                    {[...Array(totalPages)].map((_, i) => (
                        <Pagination.Item
                            key={i + 1}
                            active={i + 1 === currentPage}
                            onClick={() => handlePageChange(i + 1)}
                        >
                            {i + 1}
                        </Pagination.Item>
                    ))}
                    {currentPage < totalPages && (
                        <Pagination.Next
                            onClick={() => handlePageChange(currentPage + 1)}
                        />
                    )}
                </Pagination>
            </Col>
        </Row>
    </div>)
}