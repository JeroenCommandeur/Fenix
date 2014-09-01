module Client.ViewModels {

    export class ChildViewModel extends Fenix.Base.ViewModelBase {

        constructor() {
            super(false);
            this.RegisterProperties(["SomeText"]);
        }

        public SomeText: string;

        public OnViewLoaded() {
            this.SomeText = "This text was set in the viewmodel and the view was updated automatically.";    // setting the text programmatically also triggers the binding code.
        }
    }
} 