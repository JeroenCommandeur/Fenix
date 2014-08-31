module Fenix.Interfaces {

    export interface IBinder {
        ExecutionContext: any;
        DataContext: IDataContext;
        Element: JQuery;

        Bind(element: JQuery, dataContext: any, executionContext: any, attribute: string);
        Unbind();

        OnInitialize();
        OnDataContextChange(property: string, value: any);
        OnPropertyChange(value: any);
        ExecuteMethod(methodName: string, params: any[]);
    }
}