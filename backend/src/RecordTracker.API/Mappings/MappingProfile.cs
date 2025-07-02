using AutoMapper;
using RecordTracker.API.Features.RecordFields.Dtos;
using RecordTracker.API.Features.Records.Dtos;
using RecordTracker.Infrastructure.Entities;

namespace RecordTracker.API.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        #region Record
        // Ef to Dto
        CreateMap<Record, RecordDto>();
        CreateMap<Record, RecordSummaryDto>();
        #endregion

        #region RecordField
        // Ef to Dto
        CreateMap<RecordField, RecordFieldDto>();
        
        // Dto to Ef
        CreateMap<CreateRecordFieldDto, RecordField>()
            .ForMember(dest => dest.RecordId, opt => opt.Ignore());
        #endregion
    }
}
