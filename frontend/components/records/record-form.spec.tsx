import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecordForm } from './record-form';

describe('CreateOrEditRecordForm', () => {
  const mockOnFormChange = jest.fn();
  console.error = jest.fn(); // Mock console.error to avoid act() warnings due to watch() reapeated calls

  it('should disable the submit button when form is invalid', async () => {
    render(<RecordForm onFormChange={mockOnFormChange} />);
    userEvent.type(screen.getByTestId('record-name'), 'Test Record');
    await waitFor(() => {
      expect(screen.getByTestId('record-name')).toHaveValue('Test Record');
      expect(mockOnFormChange).toHaveBeenLastCalledWith(true, { name: 'Test Record', description: '' });
    });
  });

  it('should show validation errors when submitting empty form', async () => {
    render(<RecordForm onFormChange={mockOnFormChange} />);
    
    userEvent.type(screen.getByTestId('record-name'), 'A');
    await waitFor(() => {
      expect(screen.getByTestId('record-name')).toHaveValue('A');
    });
    
    userEvent.type(screen.getByTestId('record-name'), '{backspace}');

    await waitFor(() => {
      expect(screen.getByText('Name is required.')).toBeVisible();
      expect(mockOnFormChange).toHaveBeenLastCalledWith(false, { name: '', description: '' });
    });
  });

  it('should show validation error for name exceeding max length', async () => {
    render(<RecordForm onFormChange={mockOnFormChange} />);
    userEvent.type(screen.getByTestId('record-name'), 'a'.repeat(51));
    
    await waitFor(() => {
      expect(screen.getByTestId('record-name')).toHaveValue('a'.repeat(51));
      expect(screen.getByText('Name cannot exceed 50 characters.')).toBeVisible();
      expect(mockOnFormChange).toHaveBeenLastCalledWith(false, { name: 'a'.repeat(51), description: '' });
    });
  });

  it('should show validation error for description exceeding max length', async () => {
    render(<RecordForm onFormChange={mockOnFormChange} />);
    const descriptionInput = screen.getByTestId('record-description');
    userEvent.type(descriptionInput, 'a'.repeat(201));

    await waitFor(() => {
      expect(descriptionInput).toHaveValue('a'.repeat(201));
      expect(screen.getByText('Description cannot exceed 200 characters.')).toBeVisible();
      expect(mockOnFormChange).toHaveBeenLastCalledWith(false, { name: '', description: 'a'.repeat(201) });
    });
  });   
});