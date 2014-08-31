module Fenix.Interfaces {

    export interface IViewModel {
        View: IView;
        OverruleViewCreation: boolean;
        WrapView: boolean;
        IsViewLoaded: boolean;
        IsBusy: boolean;
        Message: Fenix.Types.Message;

        OnViewLoaded();
        OnActivated();
    }
}