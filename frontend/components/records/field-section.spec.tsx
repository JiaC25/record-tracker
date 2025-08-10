import React from 'react';
import '@testing-library/jest-dom';
import { FieldSection } from './field-section';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecordField } from '@/lib/types/records';

describe('FieldSection', () => {

  let mockState: any[] = [];
  const mockStateImpl = (fields: any) => {
    if (typeof fields === 'function') {
      mockState = fields(mockState);
    }
  };

  let mockSetPrimaryFields: any;
  let mockSetSecondaryFields: any;
  beforeEach(() => {
    mockState = [];
    mockSetPrimaryFields = jest.fn(mockStateImpl);
    mockSetSecondaryFields = jest.fn(mockStateImpl);
  });

  it('should add primary field when add field button is clicked', async () => {
    render(
      <FieldSection 
        primaryFields={[]}
        secondaryFields={[]}
        setPrimaryFields={mockSetPrimaryFields}
        setSecondaryFields={mockSetSecondaryFields}
      />
    );

    const expectedPrimaryNewField = {
      id: expect.any(String),
      name: '',
      isRequired: false,
      fieldType: 'Text',
      isPrimary: true,
      order: 0,
    } as RecordField;

    userEvent.click(screen.getByTestId('add-primary-field-button'));
    await waitFor(() => {
      expect(mockState).toHaveLength(1);
      expect(mockSetPrimaryFields).toHaveBeenCalledTimes(1);
      expect(mockState[0]).toEqual(expectedPrimaryNewField);
    });
  });

  it('should add secondary field when add field button is clicked', async () => {
    render(
      <FieldSection 
        primaryFields={[]}
        secondaryFields={[]}
        setPrimaryFields={mockSetPrimaryFields}
        setSecondaryFields={mockSetSecondaryFields}
      />
    );

    const expectedSecondaryNewField = {
      id: expect.any(String),
      name: '',
      isRequired: false,
      fieldType: 'Text',
      isPrimary: false,
      order: 0,
    } as RecordField;

    userEvent.click(screen.getByTestId('add-secondary-field-button'));
    await waitFor(() => {
      expect(mockState).toHaveLength(1);
      expect(mockState[0]).toEqual(expectedSecondaryNewField);
      expect(mockSetSecondaryFields).toHaveBeenCalledTimes(1);
    });
  });

  it('should update field when input changes', async () => {
    const initialField = {
      id: '123',
      name: '',
      fieldType: 'Text',
      isRequired: false,
      isPrimary: true,
      order: 1,
    } as RecordField;

    // mock existing state
    mockState = [initialField];

    render(
      <FieldSection 
        primaryFields={[initialField]}
        secondaryFields={[]}
        setPrimaryFields={mockSetPrimaryFields}
        setSecondaryFields={mockSetSecondaryFields}
      />
    );

    const nameInput = screen.getByTestId('field-name');
    await userEvent.type(nameInput, 'N');

    const expected = {
      ...initialField,
      name: 'N',
    };

    await waitFor(() => {
      expect(mockSetPrimaryFields).toHaveBeenCalled();
      expect(mockState[0]).toEqual(expected);
    });
  });

  it('should delete field when delete button is clicked', async () => {
    const initialField = {
      id: '123',
      name: '',
      fieldType: 'Text',
      isRequired: false,
      isPrimary: true,
      order: 1,
    } as RecordField;

    mockState = [initialField];

    render(
      <FieldSection 
        primaryFields={[]}
        secondaryFields={[initialField]}
        setPrimaryFields={mockSetPrimaryFields}
        setSecondaryFields={mockSetSecondaryFields}
      />
    );

    userEvent.click(screen.getByTestId('delete-field-123-button'));

    await waitFor(() => {
      expect(mockSetSecondaryFields).toHaveBeenCalled();
      expect(mockState).toHaveLength(0);
    });
  });
});