import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { CreateRecordButton } from './create-record-button';
import userEvent from '@testing-library/user-event';

describe('AddNewRecordButton', () => {
    
  it('opens the form when clicked', async () => {
    render(<CreateRecordButton />);
    userEvent.click(screen.getByRole('button', { name: /New record/i }));
    expect(await screen.findByText(/Create New Record/i)).toBeVisible();
  });
    
  it('closes the form when closed', async () => {
    render(<CreateRecordButton />);
    userEvent.click(screen.getByRole('button', { name: /New record/i }));
    userEvent.click(await screen.findByRole('button', { name: /Cancel/i }));
    waitFor(() => {
      expect(screen.queryByText(/Create New Record/i)).toBeNull();
    });
  });
});