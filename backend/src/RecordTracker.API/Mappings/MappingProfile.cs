using AutoMapper;
using RecordTracker.API.Features.RecordFields.Dtos;
using RecordTracker.API.Features.RecordTypes.Dtos;
using RecordTracker.Infrastructure.Entities;

namespace RecordTracker.API.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        #region RecordType
        // Ef to Dto
        CreateMap<RecordType, RecordTypeDto>();
        CreateMap<RecordType, RecordTypeSummaryDto>();
        #endregion

        #region RecordField
        // Ef to Dto
        CreateMap<RecordField, RecordFieldDto>();
        
        // Dto to Ef
        CreateMap<CreateRecordFieldDto, RecordField>()
            .ForMember(dest => dest.RecordTypeId, opt => opt.Ignore());
        #endregion
    }
}
