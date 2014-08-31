module Fenix.Interfaces {

    export interface IDataContext {
        RegisterProperties(propertyNames: string[]);
        SetProperty(propertyName: string, value: any);
        GetProperty(propertyName: string): any;
    }
}