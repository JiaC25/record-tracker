using AutoMapper;
using RecordTracker.API.Features.RecordTypes;
using RecordTracker.Infrastructure.Entities;

namespace RecordTracker.API.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<RecordType, RecordTypeDto>();
    }
}
