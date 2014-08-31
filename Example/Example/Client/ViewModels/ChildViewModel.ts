module Client.ViewModels {

    export class ChildViewModel extends Fenix.Base.ViewModelBase {

        constructor() {
            super(false);
            this.RegisterProperties(["SomeText"]);
        }

        public SomeText: string;

        public OnViewLoaded() {
            this.SomeText = "this is a nested view";    // setting the text programmatically also triggers the binding code.
        }
    }
} 