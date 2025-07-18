export type EventColumn = {
    name: string;
    type: string;
    displayType: string;
    // kind: string;
}
export interface EventData {
    name: string;
    module: string;
    columns: EventColumn[];
}