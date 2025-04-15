export type ShipModel = {
    id?: number;
    shipId?: number;
    name:string;
    registrationNo:string;
    ais:number;
    propulsionType: string;    // SELF PROPELLED; WITHOUT PROPULSION
    lockType:string;
    length:number;
    width: number;
    maxDraft: number;    
    aerialGauge:number;
    maxCapacity:number;
    shipType:string;
    pavilion: string;
    enginePower: string;    
    shipowner:string;
}

export interface ShipTable {
    items: ShipModel[];
    noFiltered: number;
    noTotal: number;
}
