export interface AptosModule {
    abi: ABI;
}

export interface ABI {
    address:           string;
    name:              string;
    friends:           string[];
    exposed_functions: ExposedFunction[];
    structs:           Struct[];
}

export interface ExposedFunction {
    name:                string;
    visibility:          Visibility;
    is_entry:            boolean;
    is_view:             boolean;
    generic_type_params: GenericTypeParam[];
    params:              string[];
    return:              string[];
}

export interface GenericTypeParam {
    constraints: Ability[];
}

export enum Ability {
    Copy = "copy",
    Drop = "drop",
    Key = "key",
    Store = "store",
}

export enum Visibility {
    Friend = "friend",
    Public = "public",
}

export interface Struct {
    name:                string;
    is_native:           boolean;
    is_event:            boolean;
    abilities:           Ability[];
    generic_type_params: any[];
    fields:              Field[];
}

export interface Field {
    name: string;
    type: string;
}