interface IBinder {
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
interface IDataContext {
    RegisterProperties(propertyNames: string[]);
    SetProperty(propertyName: string, value: any);
    GetProperty(propertyName: string): any;
}
interface IPlaceholderViewModel {
    Item: IViewModel;
}
interface IView {
    HtmlFullName: string;
    HTML: string;

    OnViewLoaded();
}
interface IViewModel {
    View: IView;
    OverruleViewCreation: boolean;
    WrapView: boolean;
    IsViewLoaded: boolean;
    IsBusy: boolean;
    Message: Fenix.Types.Message;
    OnViewLoaded();
    OnActivated();
}


declare module Fenix {
    export class Framework {
        static Initialize(namespaces: string[], callback: () => void);
    }
}


declare module Fenix.Types {
    export class Utilities {
        static CreateViewModel(viewmodelName: string, params: any): IViewModel;
    }

    export class Navigator {
        static Root: IViewModel;
        static Goto(hash: string, walkRoute: boolean);
        static GotoLast(searchElement: string, walkRoute: boolean);
    }

    export class Message extends Fenix.Base.DataContextBase {
        HasMessage: boolean;
        Caption: string;
        Color: string;
        SetMessage(type: Fenix.Enums.MessageTypeEnum, message: string);
        Clear();
    }
}

declare module Fenix.Base {

    export class BinderBase implements IBinder {
        ExecutionContext: any;
        DataContext: IDataContext;
        Element: JQuery;

        Bind(element: JQuery, dataContext: any, executionContext: any, attribute: string);
        Unbind();
        GetValueByKey(key: string): string;

        OnInitialize();
        OnDataContextChange(property: string, value: any);
        OnPropertyChange(value: any);
        ExecuteMethod(methodName: string, params: any[]);
    }


    export class DataContextBase implements IDataContext {
        RegisterProperties(propertyNames: string[]);
        static Create(source): Object;
        static Extract(source): Object;
        SetProperty(propertyName: string, value: any);
        GetProperty(propertyName: string): any;
    }

    export class ViewModelBase extends DataContextBase implements IViewModel {
        View: IView;
        OverruleViewCreation: boolean;
        WrapView: boolean;
        IsViewLoaded: boolean;
        IsBusy: boolean;
        Message: Fenix.Types.Message;
        constructor(wrapView: boolean);
        OnViewLoaded();
        OnActivated();
    }

    export class PlaceholderViewModelBase extends ViewModelBase implements IPlaceholderViewModel {
        Item: IViewModel;
    }

    export class ViewBase implements IView {
        HtmlFullName: string;
        HTML: string;

        constructor(namespace: string, htmlFullName: string, wrapView: boolean);
        OnViewLoaded();
    }
}

declare module Fenix.Binders {
    export class ViewModelBinder extends Fenix.Base.BinderBase {
    }
}

declare module Fenix.Enums {
    export enum MessageTypeEnum { Error, Warning, Information }
}
