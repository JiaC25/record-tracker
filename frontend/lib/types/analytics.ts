export type AnalyticType = 'LineChart' | 'BarChart' | 'AggregateValue';

export type Analytic = {
    id: string
    createdAt: string
    name: string
    type: AnalyticType
    configuration: string // JSON string
    order: number
    recordId: string
}

/** Request */
export type CreateAnalyticRequest = {
    recordId: string
    name: string
    type: AnalyticType
    configuration: string // JSON string
    order: number
}

export type UpdateAnalyticRequest = {
    analyticId: string
    recordId: string
    name: string
    configuration: string // JSON string
    order: number
}

export type UpdateAnalyticsOrderRequest = {
    recordId: string
    analytics: AnalyticOrderItem[]
}

export type AnalyticOrderItem = {
    analyticId: string
    order: number
}

/** Configuration Types */
export type LineChartConfig = {
    configVersion: number
    xAxisFieldId: string
    yAxisFieldId: string
}

export type BarChartConfig = {
    configVersion: number
    xAxisFieldId: string
    xAxisGroupByPeriod?: GroupByPeriod | null // Only if X-axis is Date
    yAxisAggregation: AggregationType
    yAxisFieldId?: string // Required if aggregation is not 'count'
    chartOrientation?: 'vertical' | 'horizontal' // Chart variant
}

export type AggregateFunction = 'average' | 'max' | 'min' | 'sum';
export type AggregationType = AggregateFunction | 'count';

export type GroupByPeriod = 'day' | 'week' | 'month' | 'year';

export type AggregateValueConfig = {
    configVersion: number
    aggregationFunction: AggregateFunction
    valueFieldId: string
    groupByFieldId?: string // optional Date field
    groupByPeriod?: GroupByPeriod | null
}

export type AnalyticConfig = LineChartConfig | BarChartConfig | AggregateValueConfig;

