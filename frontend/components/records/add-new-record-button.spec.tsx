import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { AddNewRecordButton } from './add-new-record-button';
import userEvent from '@testing-library/user-event';

describe('AddNewRecordButton', () => {
    
  it('opens the form when clicked', async () => {
    render(<AddNewRecordButton />);
    userEvent.click(screen.getByRole('button', { name: /new record/i }));
    expect(await screen.findByText(/Add New Record/i)).toBeVisible();
  });
    
  it('closes the form when closed', async () => {
    render(<AddNewRecordButton />);
    userEvent.click(screen.getByRole('button', { name: /new record/i }));
    userEvent.click(await screen.findByRole('button', { name: /Cancel/i }));
    waitFor(() => {
      expect(screen.queryByText(/Add New Record/i)).toBeNull();
    });
  });
});