import React, { SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { FieldRow } from './field-row';
import { Guid } from 'guid-ts';
import { FieldTypeEnum, RecordField } from '@/lib/types/records';
import { PlusCircleIcon } from 'lucide-react';

type FieldSectionProps = {
  primaryFields: RecordField[];
  secondaryFields: RecordField[];
  setPrimaryFields: React.Dispatch<SetStateAction<RecordField[]>>;
  setSecondaryFields: React.Dispatch<SetStateAction<RecordField[]>>;
}
export const FieldSection: React.FC<FieldSectionProps> = (props) => {
  const MAX_PRIMARY_FIELDS = 4;

  const addField = (section: 'primary' | 'secondary', index: number) => {
    const newField: RecordField = {
      id: `field-${Guid.newGuid().toString()}`,
      name: '',
      fieldType: FieldTypeEnum.Text,
      isRequired: false,
      isPrimary: section === 'primary',
      order: index,
    };
    if (section === 'primary') {
      props.setPrimaryFields((prev) => [...prev, newField]);
    } else {
      props.setSecondaryFields((prev) => [...prev, newField]);
    }
  };

  const updateField = (section: 'primary' | 'secondary', id: string, updatedField: RecordField) => {
    if (section === 'primary') {
      props.setPrimaryFields((prev) =>
        prev.map((field) => (field.id === id ? updatedField : field))
      );
    } else {
      props.setSecondaryFields((prev) =>
        prev.map((field) => (field.id === id ? updatedField : field))
      );
    }
  };

  const deleteField = (section: 'primary' | 'secondary', id: string) => {
    if (section === 'primary') {
      props.setPrimaryFields((prev) => prev.filter((field) => field.id !== id));
    } else {
      props.setSecondaryFields((prev) => prev.filter((field) => field.id !== id));
    }
  };

  const renderAddFieldButton = (fieldSection: 'primary' | 'secondary') => (
    <Button data-testid={`add-${fieldSection}-field-button`} variant={'secondary'} 
      className="w-full my-4"
      onClick={(e) => {
        addField(fieldSection, props.primaryFields.length);
        e.preventDefault();
      }}>
      <PlusCircleIcon />
      Add Custom Field
    </Button>
  );

  return (<>
    <section>
      <h5>Primary Fields</h5>
      <div className="mt-3">
        {props.primaryFields.map((field, index) => (
          <FieldRow
            disabledDelete={props.primaryFields.length === 1}
            key={field.id}
            field={field}
            onUpdate={(id, updated) => updateField('primary', id, updated)}
            onDelete={(id) => deleteField('primary', id)}
            index={index}
          />
        ))}
      </div>

      {props.primaryFields.length < MAX_PRIMARY_FIELDS && renderAddFieldButton('primary')}
    </section>

    {/* Secondary Fields Section */}
    <section>
      <h5>Secondary Fields</h5>
      <div className="mt-3">
        {props.secondaryFields.map((field, index) => (
          <FieldRow
            key={field.id}
            field={field}
            onUpdate={(id, updated) => updateField('secondary', id, updated)}
            onDelete={(id) => deleteField('secondary', id)}
            index={index}
          />
        ))}
      </div>
      {renderAddFieldButton('secondary')}
    </section>
  </>
  );
};
