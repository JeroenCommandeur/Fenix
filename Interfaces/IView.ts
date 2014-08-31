module Fenix.Interfaces {

    export interface IView {
        HtmlFullName: string;
        HTML: string;

        OnViewLoaded();
    }
}