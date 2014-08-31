declare module Fenix.Interfaces {
    interface IDataContext {
        SetProperty(propertyName: string, value: any): any;
        GetProperty(propertyName: string): any;
    }
}
