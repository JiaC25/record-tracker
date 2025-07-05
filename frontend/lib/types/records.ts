export type Record = {
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

export type GroupedRecordSummaries = { // Frontend only
    [letter: string]: RecordSummary[]
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

export type CreateRecordItemsRequest = {
    items: {
        values: {
            recordFieldId: string
            value: string
        }[]
    }[]
}