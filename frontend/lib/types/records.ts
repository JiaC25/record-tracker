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

export type RecordFieldType = 'Text' | 'Number' | 'Date';

export type RecordField = {
    id: string
    name: string
    fieldType: RecordFieldType
    isRequired: boolean
    order: number
}

export type RecordItem = {
    id: string
    createdAt: string
} & {
    [fieldId: string]: string
}

/** Request */
export type CreateRecordRequest = {
    name: string
    description?: string
    recordFields: CreateRecordFieldRequest[]
}
export type CreateRecordFieldRequest = {
    name: string
    fieldType: RecordFieldType
    isRequired: boolean
    order: number
}

export type RecordItemInput = {
    values: RecordValueInput[]
}
export type RecordValueInput = {
    recordFieldId: string
    value: string
}

/** Response */
export type GetAllRecordsResponse = {
    records: RecordSummary[]
}

/** Frontend type */
export type GroupedRecordSummaries = {
    [letter: string]: RecordSummary[]
}