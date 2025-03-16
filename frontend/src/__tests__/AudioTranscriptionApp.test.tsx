import React, {act} from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AudioTranscriptionApp from '../AudioTranscriptionApp';
import axios from 'axios';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { afterEach } from 'vitest';

// Mock axios for testing API calls
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('AudioTranscriptionApp', () => {
  beforeEach(() => {
    mockedAxios.get.mockReset();
    mockedAxios.post.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should display server error message if server is not healthy', async () => {
    mockedAxios.get.mockResolvedValueOnce({ status: 500 }); // Simulate a network error

    render(<AudioTranscriptionApp />);

    await waitFor(() => {
      expect(screen.getByText(/Caution: Server is not working as expected/i)).toBeDefined();
    });
  });

  it('should fetch and display transcriptions', async () => {
    // Mock the /health endpoint to return 200 OK
    mockedAxios.get.mockResolvedValueOnce({ status: 200 });

    const mockTranscriptions = [
      { filename: 'test1.mp3', transcription: 'Test transcription 1' },
      { filename: 'test2.mp3', transcription: 'Test transcription 2' },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockTranscriptions });

    render(<AudioTranscriptionApp />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/test1.mp3/i)).toBeDefined();
      expect(screen.getByText(/Test transcription 1/i)).toBeDefined();
      expect(screen.getByText(/test2.mp3/i)).toBeDefined();
      expect(screen.getByText(/Test transcription 2/i)).toBeDefined();
    });
  });

  it('should upload files and display new transcriptions', async () => {
    // Mock the /health endpoint to return 200 OK
    mockedAxios.get.mockResolvedValueOnce({ status: 200 });

    // Mock the response to the first call to get transcriptions
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    // Arrange
    const mockResponse = {
      transcriptions: [{ filename: 'uploaded_file.mp3', transcription: 'New transcription' }],
      errors: [],
    };

    const mockGetTranscriptionsResponse = [{ filename: 'uploaded_file.mp3', transcription: 'New transcription' }];

    // mock the post request
    mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

    // mock the get transcription response after the upload
    mockedAxios.get.mockResolvedValueOnce({ data: mockGetTranscriptionsResponse });
    const mockFile = new File(['dummy content'], 'uploaded_file.mp3', { type: 'audio/mp3' });

    // Act
    render(<AudioTranscriptionApp />);
    const fileInput = screen.getByLabelText(/Upload audio files/i) as HTMLInputElement;
    const uploadButton = screen.getByRole('button', { name: /Upload/i });

    // Use userEvent.upload() instead of fireEvent.change()
    await act(async() => {
      await userEvent.upload(fileInput, mockFile);
      await userEvent.click(uploadButton); // Simulate clicking the "Upload" button
    });

    // Assert
    await waitFor(() => {
      const transcriptionTable = screen.getAllByRole('table').pop();
      expect(transcriptionTable?.textContent).toContain('uploaded_file.mp3');
      expect(transcriptionTable?.textContent).toContain('New transcription');
      expect(mockedAxios.post).toHaveBeenCalled();
      expect(mockedAxios.post).toHaveBeenCalled();
    });
  });
});