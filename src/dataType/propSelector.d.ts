export interface TPropSelector {
  name: string;
  label: string;
  urlFetch: string;
  suggestKey: string;
  defaultKey?: {
    value: string;
    id: string;
  };
}
