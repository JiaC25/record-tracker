import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { CreateOrEditRecordForm } from './create-or-edit-record-form';
import userEvent from '@testing-library/user-event';

describe('CreateOrEditRecordForm', () => {

  it('should render the form', () => {
    render(<CreateOrEditRecordForm open={true} onClose={() => {}} />);
    expect(screen.getByText('Create New Record')).toBeInTheDocument();
  });

  it('should close the form when onClose is called', async () => {
    const onCloseMock = jest.fn();
    render(<CreateOrEditRecordForm open={true} onClose={onCloseMock} />);
    userEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    await waitFor(() => {
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  it('should disable the submit button when form is invalid', async () => {
    render(<CreateOrEditRecordForm open={true} onClose={() => {}} />);
    expect(screen.getByRole('button', { name: /Save/i })).toBeDisabled();
    userEvent.type(screen.getByTestId('record-name'), 'Test Record');
    await waitFor(() => {
      expect(screen.getByTestId('record-name')).toHaveValue('Test Record');
      expect(screen.getByRole('button', { name: /Save/i })).toBeEnabled();
    });
  });

  it('should show validation errors when submitting empty form', async () => {
    render(<CreateOrEditRecordForm open={true} onClose={() => {}} />);
    userEvent.type(screen.getByTestId('record-name'), 'A');
    await waitFor(() => {
      expect(screen.getByTestId('record-name')).toHaveValue('A');
    });
    userEvent.type(screen.getByTestId('record-name'), '{backspace}');
    
    expect(await screen.findByText('Name is required.')).toBeVisible();
    expect(screen.getByRole('button', { name: /Save/i })).toBeDisabled();
  });

  it('should show validation error for name exceeding max length', async () => {
    render(<CreateOrEditRecordForm open={true} onClose={() => {}} />);
    const nameInput = screen.getByTestId('record-name');
    userEvent.type(nameInput, 'a'.repeat(51));
    
    expect(await screen.findByText('Name cannot exceed 50 characters.')).toBeVisible();
    expect(screen.getByRole('button', { name: /Save/i })).toBeDisabled();
  });

  it('should show validation error for description exceeding max length', async () => {
    render(<CreateOrEditRecordForm open={true} onClose={() => {}} />);
    const descriptionInput = screen.getByTestId('record-description');
    userEvent.type(descriptionInput, 'a'.repeat(201));
    
    expect(await screen.findByText('Description cannot exceed 200 characters.')).toBeVisible();
  });   
});