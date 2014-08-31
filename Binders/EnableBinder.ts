// Sets or removes the "disabled" attribute on the bound element based on a value in the viewmodel.
module Fenix.Binders {

    export class EnableBinder extends Fenix.Base.BinderBase {

        static AttributeName(): string {
            return "enable";
        }


        OnPropertyChange(value: any) {
            if (value)
                this.Element.removeAttr("disabled");
            else
                this.Element.attr("disabled", "disabled");
        }
    }
}