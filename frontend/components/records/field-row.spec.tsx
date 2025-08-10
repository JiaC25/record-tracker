import React from 'react';
import { render, screen, waitFor,act } from '@testing-library/react';
import '@testing-library/jest-dom';
import {FieldRow} from './field-row';    
import { RecordField } from '@/lib/types/records';
import userEvent from '@testing-library/user-event';
import { Guid } from 'guid-ts';
import '@/components/ui/form';

// mock default useFormHook to display the html element only
jest.mock('@/components/ui/form', () => ({
  FormMessage: (props: any) => (
    <p id="mocked-error-message">
      {props.children}
    </p>
  )
}));
  
describe('FieldRow', () => {
  const onUpdate = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(Guid, 'newGuid').mockReturnValue({ toString: () => 'guid-1' } as any);
  });

  it('should fill in the field', async () => {
    const field = { id: '1', name: 'Test Field', fieldType: 'Text', isRequired: true } as RecordField;
    render(<FieldRow field={field} onUpdate={onUpdate} onDelete={() => {}} disabledDelete={false} index={0} />);

    expect(screen.getByTestId('field-name')).toHaveValue('Test Field');
    expect(screen.getByTestId('is-required')).toBeChecked();
    expect(screen.getByTestId('field-type')).toHaveTextContent('Text');
  });

  it('should update the field name', async () => {
    const field = undefined;
    render(<FieldRow field={field} onUpdate={onUpdate} onDelete={() => {}} disabledDelete={false} index={0} />);

    const expectedParams = { id: 'guid-1', name: 'a', fieldType: null, isRequired: false, order: 0 };

    userEvent.type(screen.getByTestId('field-name'), 'a');
    await waitFor(() => {
      expect(onUpdate).toHaveBeenLastCalledWith(expectedParams.id, expectedParams);
    });
  });

  it('should update the field type', async () => {
    const field = undefined;
    render(<FieldRow field={field} onUpdate={onUpdate} onDelete={() => {}} disabledDelete={false} index={0} />);

    await act(async () => {
      userEvent.click(screen.getByTestId('field-type'));
      userEvent.click(await screen.findByRole('option', { name: 'Text' }));
    });

    const expectedParams = { id: 'guid-1', name: '', fieldType: 'Text', isRequired: false, order: 0 };

    await waitFor(() => {
      expect(onUpdate).toHaveBeenLastCalledWith('guid-1', expect.objectContaining(expectedParams));
    });
  });

  it('should update the field isRequired', async () => {
    const field = undefined;
    render(<FieldRow field={field} onUpdate={onUpdate} onDelete={() => {}} disabledDelete={false} index={0} />);

    act(() => {
      userEvent.click(screen.getByTestId('is-required'));
    });

    const expectedParams = { id: 'guid-1', name: '', fieldType: null, isRequired: true, order: 0 };

    await waitFor(() => {
      expect(onUpdate).toHaveBeenLastCalledWith('guid-1', expect.objectContaining(expectedParams));
    });
  });

  it('disabled delete button when there is only one field', () => {
    const field = { id: '1', name: 'Test Field', fieldType: 'Text', isRequired: true } as RecordField;
    render(<FieldRow field={field} onUpdate={onUpdate} onDelete={() => {}} disabledDelete={true} index={0} />);

    expect(screen.getByTestId('delete-field-1-button')).toBeDisabled();
  });

  it('should delete the field', async () => {
    const onDelete = jest.fn();
    const field = { id: '1', name: 'Test Field', fieldType: 'Text', isRequired: true } as RecordField;
    render(<FieldRow field={field} onUpdate={onUpdate} onDelete={onDelete} index={0}  />);

    userEvent.click(screen.getByTestId('delete-field-1-button'));
    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledWith('1');
    });
  });

  it('should display error message when name is empty', async () => {
    const field = { id: '1', name: 'A', fieldType: 'Text', isRequired: true } as RecordField;
    render(<FieldRow field={field} onUpdate={onUpdate} onDelete={() => {}} disabledDelete={false} index={0} />);
    // error message is hidden until it's dirty
    expect(screen.queryByText('Field name is required.')).not.toBeInTheDocument();

    const input = screen.getByTestId('field-name');
    await userEvent.clear(input);

    await waitFor(() => {
      expect(screen.getByText('Field name is required.')).toBeInTheDocument();
    });
  });
});