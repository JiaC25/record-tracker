'use client';

import { SidebarLayout } from '@/components/app-layout/sidebar-layout';
import RecordsSidebar from '@/components/records/records-sidebar';
import { useRecordStore } from '@/lib/store/recordStore';
import { CreateRecordItemsRequest } from '@/lib/types/records';
import { useState } from 'react';
import { recordApi } from '../../lib/api/recordApi';

const RecordsPage = () => {
  const selectedRecordSummary = useRecordStore((state) => state.getSelectedRecordSummary());
  const isLoadingRecordSummaries = useRecordStore((state) => state.isLoadingRecordSummaries);
  const isHydrated = useRecordStore((state) => state.isHydrated);
  const selectedRecord = useRecordStore((state) => state.selectedRecord);
  const { setSelectedRecordId } = useRecordStore();

  const [inputValues, setInputValues] = useState<{ [fieldId: string]: string }>({});

  const handleInputChange = (fieldId: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [fieldId]: value }));
  };
  const handleSubmit = async () => {
    if (selectedRecord) {
      const requestBody: CreateRecordItemsRequest = {
        items: [
          {
            values: selectedRecord!.recordFields.filter(f => inputValues[f.id]).map((field) => ({
              recordFieldId: field.id,
              value: inputValues[field.id] ?? '',
            })),
          }
        ]
      };

      try {
        await recordApi.createRecordItems(selectedRecord.id, requestBody);
        const emptyValues = Object.fromEntries(
          selectedRecord.recordFields.map((field) => [field.id, ''])
        );
        setInputValues(emptyValues);
        setSelectedRecordId(selectedRecord.id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getPageTitle = () => {
    if (selectedRecordSummary) {
      return selectedRecordSummary.name;
    }
    return 'Records';
  };

  const isSidebarLoading = !isHydrated || isLoadingRecordSummaries;

  return (
    <SidebarLayout sidebar={<RecordsSidebar />} title={getPageTitle()} isLoading={isSidebarLoading}>
      {/* Content area for selected record (edit/add/view all record items etc) */}
      <div className="p-5 text-sm">
        <div>{selectedRecordSummary?.description || ''}</div>
        <br />
        {selectedRecord &&
                    <table className="table-auto border-collapse border border-gray-400 text-sm">
                      <thead>
                        <tr>
                          {selectedRecord?.recordFields.map((field) => (
                            <th key={field.id} className="border border-gray-300 px-2 py-1 text-left">
                              {field.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRecord?.recordItems.length ? (
                          selectedRecord.recordItems.map((item) => (
                            <tr key={item.id}>
                              {selectedRecord.recordFields.map((field) => (
                                <td key={field.id} className="border border-gray-200 px-2 py-1">
                                  {item[field.id] ?? ''}
                                </td>
                              ))}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={selectedRecord?.recordFields.length || 1}
                              className="border border-gray-200 px-2 py-1 text-center text-gray-500"
                            >
                                        No items available.
                            </td>
                          </tr>
                        )}
                        {/* Input row */}
                        <tr className="h-8">
                          {selectedRecord.recordFields.map((field) => (
                            <td key={field.id} className="border border-gray-200 text-center px-2 py-1">
                              <input
                                type="text"
                                className="border px-1 text-xs"
                                value={inputValues[field.id] ?? ''}
                                onChange={(e) => handleInputChange(field.id, e.target.value)}
                              />
                            </td>
                          ))}
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr className="bg-secondary hover:bg-primary hover:text-primary-foreground">
                          <td colSpan={selectedRecord.recordFields.length}
                            className="text-center border border-gray-200 cursor-pointer h-8"
                            onClick={handleSubmit}>
                                    Add Item
                          </td>
                        </tr>
                      </tfoot>
                    </table>
        }

        {/* <RecordTypeForm/> for adding or editing record */}
        {/* <RecordItemForm/> for adding record item */}
        {/* <RecordView/> for rendering info of a record including record items */}
      </div>
    </SidebarLayout>
  );
};

export default RecordsPage;