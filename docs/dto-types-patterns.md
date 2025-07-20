# DTO & Type Pattern Guide

## Overview
This document defines consistent patterns for DTOs and types across our .NET backend and Next.js frontend to ensure maintainable and scalable code.

## Core Principles

### 1. Response Strategy
- **Simple responses** (single objects): Return DTO directly
- **Array responses**: Use lightweight wrappers with clean naming
- **Complex responses**: Include metadata when needed

### 2. Naming Conventions
- **Backend**: Use `PascalCase` and `Dto` suffix (e.g., `UserDto`, `RecordSummaryDto`)
- **Frontend**: Use `camelCase` and drop `Dto` suffix (e.g., `User`, `RecordSummary`)
- **Response wrappers**: Use descriptive, user-friendly property names

## Pattern Examples

### Simple Object Responses
```csharp
// Backend
public record UserDto(Guid UserId, string Email);
return TypedResults.Ok(userDto);
```
```typescript
// Frontend
export type User = {
    userId: string
    email: string
}
```

### Array Responses
```csharp
// Backend
public record GetAllRecordsResponse(List<RecordSummaryDto> Records);

// Return with wrapper
return TypedResults.Ok(new GetAllRecordsResponse(records));
```

```typescript
// Frontend
export type GetAllRecordsResponse = {
    records: RecordSummary[]  // Clean naming, NOT recordSummaryDtos
}
```

### Complex Responses (with metadata)
```csharp
// Backend
public record GetRecordsPagedResponse(
    List<RecordSummaryDto> Records,
    int Total,
    int Page,
    int PageSize
);
```
```typescript
// Frontend
export type GetRecordsPagedResponse = {
    records: RecordSummary[]
    total: number
    page: number
    pageSize: number
}
```

## Maintenance

### When Adding New DTOs
1. Create backend DTO following naming conventions
2. Create corresponding frontend type (drop `Dto` suffix)
3. Follow response pattern based on complexity
4. Update this guide if new patterns emerge

### When Modifying DTOs
1. Update backend DTO first
2. Update corresponding frontend type
3. TypeScript compiler will show all places that need updates
