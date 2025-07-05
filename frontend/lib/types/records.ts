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

export type RecordField = {
    id: string
    name: string
    fieldType: 'Text' | 'Number' | 'Date'
    isRequired: boolean
    order: number
}

export type RecordItem = {
    id: string
    // Todo
}

export type GroupedRecordSummaries = {
    [letter: string]: RecordSummary[]
}