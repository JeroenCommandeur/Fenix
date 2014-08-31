module Fenix.Binders {

    // Assumes it receives a boolean which indicates whether or not to clear the element.
    // TRUE means the element won't be cleared. FALSE means the element will be cleared.
    // Can be used for security issues.
    export class CleanBinder extends Fenix.Base.BinderBase {

        static AttributeName(): string {
            return "clean";
        }


        public OnPropertyChange(value: any) {
            if (value != undefined && !value)
                this.Unbind();
        }
    }
}