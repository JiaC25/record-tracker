export type RecordEntity = {
    id: string
    createdAt: string
    name: string
    description: string
    recordFields: RecordField[]
    recordItems: RecordItem[]
}

export type RecordSummary = {
    id: string
    createdAt: string
    name: string
    description: string
    recordFields: RecordField[]
}

export enum FieldTypeEnum {
    Text = 'Text',
    Number = 'Number',
    Date = 'Date',
    TextArea = 'TextArea'
}

export type RecordField = {
    id: string;
    name: string;
    fieldType: FieldTypeEnum;
    isRequired: boolean;
    order: number;
    isPrimary: boolean;
}

export type RecordItem = {
    id: string
    createdAt: string
} & {
    [fieldId: string]: string
}

/** Request */
export type CreateRecordItemsRequest = {
    items: {
        values: {
            recordFieldId: string
            value: string
        }[]
    }[]
}

/** Response */
export type GetAllRecordsResponse = {
    records: RecordSummary[]
}

/** Frontend type */
export type GroupedRecordSummaries = {
    [letter: string]: RecordSummary[]
}