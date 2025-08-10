import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { CreateRecordDialog } from './create-record-dialog';
import userEvent from '@testing-library/user-event';

describe('CreateRecordDialog', () => {
  it('should render the dialog', () => {
    render(<CreateRecordDialog open={true} onDialogClose={() => {}} />);
    expect(screen.getByText('Create New Record')).toBeInTheDocument();
  });
    
  it('should close the dialog when Cancel is clicked', async () => {
    const onCloseMock = jest.fn();
    render(<CreateRecordDialog open={true} onDialogClose={onCloseMock} />);
    screen.getByRole('button', { name: /Cancel/i }).click();
    await waitFor(() => {
      expect(onCloseMock).toHaveBeenCalled();
    });
  });
    
  it('should disable Save button when form is invalid', async () => {
    render(<CreateRecordDialog open={true} onDialogClose={() => {}} />);
    expect(screen.getByRole('button', { name: /Save/i })).toBeDisabled();
  });
    
  it('should enable Save button when form is valid', async () => {
    render(<CreateRecordDialog open={true} onDialogClose={() => {}} />);
    userEvent.type(screen.getByTestId('record-name'), 'Valid Record Name');
    await waitFor(() => {
      expect(screen.getByTestId('record-name')).toHaveValue('Valid Record Name');
    });

    // add and fill in record field
    userEvent.click(screen.getByTestId('add-primary-field-button'));
    expect(await screen.findByTestId('field-name')).toBeVisible();
    userEvent.type(screen.getByTestId('field-name'), 'field a');
        
    await waitFor(() => {
      expect(screen.getByTestId('field-name')).toHaveValue('field a');
      expect(screen.getByRole('button', { name: /Save/i })).toBeEnabled();
    });
  });
});