import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class ValueObjectDTO{

    @ApiProperty({ type: 'string', required: true, description: "type is required" })
    @IsNotEmpty()
    @IsString()
    "@type": string;


    @ApiProperty({ type: 'string', required: true, description: "AntiquityCode is required" })
    @IsNotEmpty()
    @IsString()
    antiquityCode:string;


    @ApiProperty({ type: 'string', required: true, description: "ClauseId is required" })
    @IsNotEmpty()
    @IsString()
    clauseId:string;

    @ApiProperty({ type: 'string', required: true, description: "clientGroups is required" })
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    clientGroups:string[];

    @ApiProperty({ type: 'string', required: true, description: "clientNumber is required" })
    @IsNotEmpty()
    @IsString()
    clientNumber:string;

    @ApiProperty({ type: 'string', required: true, description: "DistributionChannel is required" })
    @IsNotEmpty()
    @IsString()
    distributionChannel:string;

    @ApiProperty({ type: 'string', required: true, description: "offersReceiver is required" })
    @IsNotEmpty()
    @IsString()
    offersReceiver:string;

    @ApiProperty({ type: 'string', required: true, description: "paymentType is required" })
    @IsNotEmpty()
    @IsString()
    paymentType:string;

    @ApiProperty({ type: 'string', required: true, description: "priceDate is required" })
    @IsNotEmpty()
    @IsString()
    priceDate:string;

    @ApiProperty({ type: 'string', required: true, description: "salesOrganization is required" })
    @IsNotEmpty()
    @IsString()
    salesOrganization:string;

    @ApiProperty({ type: 'string', required: true, description: "salesProcess is required" })
    @IsNotEmpty()
    @IsString()
    salesProcess:string;

    @ApiProperty({ type: 'string', required: true, description: "sectorId is required" })
    @IsNotEmpty()
    @IsString()
    sectorId:string;

    @ApiProperty({ type: 'string', required: true, description: "simType is required" })
    @IsNotEmpty()
    @IsString()
    simType:string;

    @ApiProperty({ type: 'string', required: true, description: "spcodeId is required" })
    @IsNotEmpty()
    @IsString()
    spcodeId:string;

    
    @ApiProperty({ type: 'string', required: true, description: "tmcodeId is required" })
    @IsNotEmpty()
    @IsString()
    tmcodeId:string;






}