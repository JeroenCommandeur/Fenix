import MessageTypeEnum = Fenix.Enums.MessageTypeEnum;

module Client.ViewModels {

    export class AppViewModel extends Fenix.Base.ViewModelBase {

        constructor() {
            super(false);
            this.RegisterProperties(["MyText", "IsVisible", "Child"]);
        }
        
        public MyText: string;
        public IsVisible: boolean;
        public Child: IViewModel;

        public OnViewLoaded() {
            this.Child = new ChildViewModel();
        }

        public ClickMe() {
            this.IsVisible = !this.IsVisible;
        }
    }
} 