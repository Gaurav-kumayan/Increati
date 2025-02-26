export type Option = {
  value: string;
  label: string;
};
export type Options = {
    ungrouped: Option[];
    groups: OptionGroup[];
};
export interface OptionGroup {
    label: string;
    options: Option[];
}
export interface RankedOption extends Option {
    rank: number;
    matchPositions: number[];
}