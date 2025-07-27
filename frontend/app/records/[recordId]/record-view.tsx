'use client';

import { recordApi } from '@/lib/api/recordApi';
import { useRecordStore } from '@/lib/store/recordStore';
import { CreateRecordItemsRequest, RecordEntity } from '@/lib/types/records';
import { useState } from 'react';

type RecordViewProps = {
  record: RecordEntity;
}

export const RecordView = ({ record }: RecordViewProps) => {
  const [inputValues, setInputValues] = useState<{ [fieldId: string]: string }>(
    () => Object.fromEntries(record.recordFields.map((f) => [f.id, '']))
  );

  const handleInputChange = (fieldId: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async () => {
    const requestBody: CreateRecordItemsRequest = {
      items: [
        {
          values: record.recordFields
            .filter((f) => inputValues[f.id])
            .map((field) => ({
              recordFieldId: field.id,
              value: inputValues[field.id] ?? '',
            })),
        },
      ],
    };

    try {
      await recordApi.createRecordItems(record.id, requestBody);

      // reset inputs after successful submit
      const emptyValues = Object.fromEntries(
        record.recordFields.map((field) => [field.id, ''])
      );
      setInputValues(emptyValues);

      // Refresh the record to show new items
      await useRecordStore.getState().fetchRecord(record.id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-5 text-sm">
      {/* Record name & description */}
      <h2 className="text-lg font-semibold">{record.name}</h2>
      {record.description && (
        <p className="text-muted-foreground text-sm mb-4">{record.description}</p>
      )}

      {/* Table with items */}
      <table className="table-auto border-collapse border border-gray-400 text-sm w-1/2">
        <thead>
          <tr>
            {record.recordFields.map((field) => (
              <th
                key={field.id}
                className="border border-gray-300 px-2 py-1 text-left"
              >
                {field.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {record.recordItems.length ? (
            record.recordItems.map((item) => (
              <tr key={item.id}>
                {record.recordFields.map((field) => (
                  <td
                    key={field.id}
                    className="border border-gray-200 px-2 py-1"
                  >
                    {item[field.id] ?? ''}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={record.recordFields.length || 1}
                className="border border-gray-200 px-2 py-1 text-center text-gray-500"
              >
                No items available.
              </td>
            </tr>
          )}

          {/* Inline input row */}
          <tr className="h-8">
            {record.recordFields.map((field) => (
              <td
                key={field.id}
                className="border border-gray-200 text-center px-2 py-1"
              >
                <input
                  type="text"
                  className="border px-1 text-xs w-full"
                  value={inputValues[field.id] ?? ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                />
              </td>
            ))}
          </tr>
        </tbody>

        {/* Submit footer */}
        <tfoot>
          <tr className="bg-secondary hover:bg-primary hover:text-primary-foreground">
            <td
              colSpan={record.recordFields.length}
              className="text-center border border-gray-200 cursor-pointer h-8"
              onClick={handleSubmit}
            >
              Add Item
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
