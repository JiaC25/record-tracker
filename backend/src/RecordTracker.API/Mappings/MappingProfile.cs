﻿using AutoMapper;
using RecordTracker.API.Features.Records.Dtos;
using RecordTracker.API.Features.Records.Requests;
using RecordTracker.Infrastructure.Entities;

namespace RecordTracker.API.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        #region EF to DTO
        CreateMap<Record, RecordDto>()
            .ForMember(dest => dest.RecordFields, opt => opt.MapFrom(src => src.RecordFields.OrderBy(rf => rf.Order)))
            .ForMember(dest => dest.RecordItems, opt => opt.Ignore());
        CreateMap<Record, RecordSummaryDto>()
            .ForMember(dest => dest.RecordFields, opt => opt.MapFrom(src => src.RecordFields.OrderBy(rf => rf.Order)));

        CreateMap<RecordField, RecordFieldDto>();        
        #endregion

        #region DTO to EF
        CreateMap<CreateRecordFieldRequest, RecordField>()
            .ForMember(dest => dest.RecordId, opt => opt.Ignore());
        #endregion
    }
}
