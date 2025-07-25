import { Test } from '@nestjs/testing';
import { LvlFuncionalitiesUcimpl } from './lvl-funcionalities.resource.uc.impl';
import { IPoComplemento } from '../../../entity/address-complement/po-complementos.entity';
import { ILevelMap } from '../../../entity/address-complement/level-map.entity';

let lvlFuncionalitiesUcimpl: Pick<LvlFuncionalitiesUcimpl, 'validateData' | 'mapFilling' | 'segmentationByType' | 'calculateCant' | 'mapAlternateGeographicAddress' | 'mapComplements' | 'mapComplemetByLevel'>;

describe('homepass-retry-UC', () => {
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [LvlFuncionalitiesUcimpl],
    }).compile();
    lvlFuncionalitiesUcimpl = module.get<LvlFuncionalitiesUcimpl>(LvlFuncionalitiesUcimpl);
  });

  it('validate data method', async () => {
    const data = { nivel1Type: 's',nivel2Type: 's',nivel3Type: 's', nivel4Type: 's', nivel5Type: 's', nivel6Type: 's' };

    const result = lvlFuncionalitiesUcimpl.validateData(data);
    expect(result).toBe(false);
  });
  it('validate data method', async () => {
    const data = { nivel2Type: 's',nivel3Type: 's', nivel4Type: 's', nivel5Type: 's', nivel6Type: 's' };

    const result = lvlFuncionalitiesUcimpl.validateData(data);
    expect(result).toBe(false);
  });
  it('validate data method', async () => {
    const data = {nivel3Type: 's', nivel4Type: 's', nivel5Type: 's', nivel6Type: 's' };

    const result = lvlFuncionalitiesUcimpl.validateData(data);
    expect(result).toBe(false);
  });

  it('map filling', async () => {
    const obj = { key: 'value', anotherKey: 'anotherValue' };

    const result = lvlFuncionalitiesUcimpl.mapFilling(obj, true);
    expect(Array.isArray(result)).toBe(true);
  });

  it('map filling: no flag', async () => {
    const obj = { key: 'value', anotherKey: 'anotherValue' };

    const result = lvlFuncionalitiesUcimpl.mapFilling(obj, false);
    expect(Array.isArray(result)).toBe(true);
  });

  it('segmentationByType', async () => {
    const infoToMap = ['uno', 'dos', 'tres'];

    const result = lvlFuncionalitiesUcimpl.segmentationByType(infoToMap, 'AlternateGeographicAddress');
    expect(result).toBeDefined();
  });

  it('segmentationByType Complement', async () => {
    const infoToMap = ['uno', 'dos', 'tres'];

    const result = lvlFuncionalitiesUcimpl.segmentationByType(infoToMap, 'Complement');
    expect(result).toBeDefined();
  });

  it('calculateCant', async () => {
    const infoToMap = ['uno', 'dos', 'tres'];

    const result = lvlFuncionalitiesUcimpl.calculateCant(infoToMap);
    expect(result).toBeDefined();
  });

  it('mapAlternateGeographicAddress', async () => {
    const poComp: IPoComplemento = {}
    const poComplements = [poComp]

    const result = lvlFuncionalitiesUcimpl.mapAlternateGeographicAddress(poComplements);
    expect(result).toBeDefined();
  });

  it('mapComplements', async () => {
    const poComp: IPoComplemento = {}
    const poComplements = [poComp]

    const result = lvlFuncionalitiesUcimpl.mapComplements(poComplements);
    expect(result).toBeDefined();
  });

  it('mapComplemetByLevel', async () => {
    const poComp: IPoComplemento = {}
    const poComplements = [poComp]
    const ilvlmap: ILevelMap = {values: [""], level: 1}
    const arrIlvlmap = [ilvlmap]

    const result = lvlFuncionalitiesUcimpl.mapComplemetByLevel(poComplements,arrIlvlmap);
    expect(result).toBeDefined();
  });

});
