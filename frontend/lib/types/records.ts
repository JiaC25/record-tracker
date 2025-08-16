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

export type RecordField = {
    id: string
    name: string
    fieldType: 'Text' | 'Number' | 'Date'
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
export type RecordValueInput = {
    recordFieldId: string
    value: string
}
export type RecordItemInput = {
    values: RecordValueInput[]
}
export type CreateRecordItemsRequest = {
    items: RecordItemInput[]
}

/** Response */
export type GetAllRecordsResponse = {
    records: RecordSummary[]
}

/** Frontend type */
export type GroupedRecordSummaries = {
    [letter: string]: RecordSummary[]
}